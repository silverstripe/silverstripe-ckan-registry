/* global window */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Griddle, { ColumnDefinition, RowDefinition, selectors, connect } from 'griddle-react';
import { withHandlers } from 'recompose';
import { compose } from 'redux';
import classnames from 'classnames';
import CKANApi from 'lib/CKANApi';
import { Row, Col } from 'reactstrap';
import CKANRegistryFilterContainer from 'components/CKANRegistryFilterContainer';
import Query from 'lib/CKANApi/DataStore/Query';
import { Redirect } from 'react-router-dom';
import 'url-search-params-polyfill';

class CKANRegistryDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      recordCount: 0,
      selectedRow: null,
      filterValues: {},
      ...this.getStateFromLocation()
    };

    this.handleGetPage = this.handleGetPage.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  componentDidMount() {
    this.loadData();

    // Bind to the user hitting the "back" button in the web browser
    if (window) {
      window.onpopstate = () => {
        this.setState(state => ({ ...state, ...this.getStateFromLocation() }));
      };
    }
  }

  /**
   * Determines whether to re-load data from the CKAN API when parts of the props or
   * state change
   *
   * @param {object} prevProps
   * @param {object} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    const pageChanged = prevState.currentPage !== this.state.currentPage;

    if (
      pageChanged
      || JSON.stringify(prevState.sort) !== JSON.stringify(this.state.sort)
      || JSON.stringify(prevState.filterValues) !== JSON.stringify(this.state.filterValues)
    ) {
      this.loadData();
    }
  }

  /**
   * Return the props that will be passed to the base Griddle component
   *
   * @return {Object}
   */
  getGriddleProps() {
    const { pageSize, fields } = this.props;
    const { data, currentPage, recordCount, sort } = this.state;

    const EnhanceWithRowData = connect((state, props) => ({
      rowData: selectors.rowDataSelector(state, props)
    }));

    return {
      data,
      pageProperties: {
        currentPage,
        recordCount,
        pageSize,
      },
      styleConfig: {
        classNames: {
          Table: 'griddle-table table table-hover',
          Pagination: 'ckan-registry__pagination form-inline',
          PageDropdown: 'ckan-registry__pagination-dropdown form-control',
          PreviousButton: 'ckan-registry__pagination-previous btn btn-default',
          NextButton: 'ckan-registry__pagination-next btn btn-default',
        },
      },
      events: {
        onGetPage: this.handleGetPage,
        onNext: () => { this.handleGetPage(this.state.currentPage + 1); },
        onPrevious: () => { this.handleGetPage(this.state.currentPage - 1); },
        onSort: newSort => { this.handleSort(newSort); },
      },
      components: {
        Layout: this.getGriddleLayoutHOC(),
        RowEnhancer: compose(
          EnhanceWithRowData,
          withHandlers({
            onClick: props => () => {
              this.setState({ selectedRow: props.rowData.Id });
            },
          })
        )
      },
      sortProperties: sort && [{
        id: fields.find(field => field.OriginalLabel === sort.sortField).ReadableLabel,
        sortAscending: sort.sortAscending,
      }]
    };
  }

  /**
   * Get an HOC that is used to render the layout of the Griddle components
   *
   * @return {function({Table: *, Pagination: *, Filter: *}): *}
   */
  getGriddleLayoutHOC() {
    const { filterValues } = this.state;
    return ({ Table, Pagination }) => (
      <Row>
        <Col md={3} lg={2} className="ckan-registry__filters">
          <CKANRegistryFilterContainer
            {...this.props}
            onFilter={this.handleFilter}
            allColumns={this.getVisibleFields()}
            defaultValues={filterValues}
          />
        </Col>
        <Col md={9} lg={10} className="ckan-registry__table">
          <Table />
          <Pagination />
        </Col>
      </Row>
    );
  }

  /**
   * Get some default state values that require a bit of pre-processing
   *
   * @return {Object}
   */
  getStateFromLocation() {
    const { spec: { dataset }, urlKeys, location: { search } } = this.props;

    // Check search query for some state overrides
    const params = new URLSearchParams(search || '');

    let currentPage = 1;
    if (params.has(urlKeys.page)) {
      currentPage = parseInt(params.get(urlKeys.page), 10);
    }

    let sort = null;
    if (params.has(urlKeys.sort)) {
      sort = {
        sortField: params.get(urlKeys.sort),
        sortAscending: params.get(urlKeys.sortDirection) === 'ASC',
      };
    }

    const filterValues = {};

    // Loop the params and find those that are pertinent to filters
    params.forEach((value, key) => {
      const match = key.match(`^${urlKeys.filter}\\[(\\d+)]$`);

      if (!match) {
        return; // continue
      }

      filterValues[`${dataset}_${match[1]}`] = params.get(key);
    });

    return {
      currentPage,
      sort,
      filterValues,
    };
  }

  /**
   * Get the fields that are shown in the results view (and should be searched upon)
   *
   * @return {*}
   */
  getVisibleFields() {
    return this.props.fields
      .filter(field => field.ShowInResultsView)
      .map(field => field.OriginalLabel);
  }

  /**
   * Get the "Type" for each visible field
   *
   * @returns {object[]}
   */
  getVisibleFieldTypes() {
    return this.props.fields
      .filter(field => field.ShowInResultsView)
      .map(field => ({
        label: field.OriginalLabel,
        type: field.Type,
      }));
  }

  /**
   * Finds all visible fields that have configured "ResultConditions", e.g. fields
   * that should only show data in them that match certain conditions. When found,
   * these will be applied as query filters before the data is loaded.
   *
   * @param {Query} query
   */
  applyResultConditionsFilters(query) {
    const { fields } = this.props;

    fields
      .filter(field => {
        if (!field.DisplayConditions) {
          return false;
        }

        // Don't filter on columns that aren't in the displayed dataset or don't have
        // any configured display conditions defined
        return field.ShowInDetailView && field.DisplayConditions.filter(condition =>
          // Ensure conditions have valid configuration
          condition.hasOwnProperty('match-text') && condition['match-text'].length
        ).length;
      })
      .forEach((field) => {
        field.DisplayConditions.forEach((displayCondition) => {
          // Add our filter statement
          query.filter(
            field.OriginalLabel, // column
            displayCondition['match-text'], // term
            false, // strict
            // NB: input format is a numeric string e.g. "0" or "1"
            //    0: must not match
            //    1: must match
            Boolean(parseInt(displayCondition['match-select'], 10)) // match
          );
        });
      });
  }

  /**
   * Given a list of filter values (values that are set for each filter), apply those filters to the
   * given query object
   *
   * @param {Query} query
   * @param {Object} filterValues
   */
  applyFilterValues(query, filterValues) {
    const { filters, spec: { dataset } } = this.props;

    // Parse visible fields now for usage within the loop
    const visibleFields = this.getVisibleFields();

    // Skip if we have invalid filters
    if (!Array.isArray(filters)) {
      return;
    }

    // Loop through the filters and apply any values that may be in the given "filter values"
    filters.forEach(filter => {
      const stateKey = `${dataset}_${filter.id}`;

      if (!filterValues.hasOwnProperty(stateKey)) {
        return; // continue;
      }

      const value = filterValues[stateKey];

      if (typeof value !== 'string' || !value.length) {
        return; // continue;
      }

      // For all columns we'll just search those that are "shown in results"
      if (filter.allColumns) {
        query.filter(
          // We only apply the search term to fields that are visible on the table
          visibleFields,
          value
        );
        return; // continue;
      }

      // Add our filter statement
      query.filter(filter.columns.map(({ target }) => target), value);
    });
  }

  /**
   * Takes the given Query object and resets the filters to a default state
   *
   * @param {Query} query
   * @return {Query}
   */
  resetQueryFilters(query) {
    query.clearFilters();

    // Attach default filters ("display conditions")
    this.applyResultConditionsFilters(query);

    // Add a default sort
    query.order('_id');

    return query;
  }

  /**
   * Handle a request to change to a specific page
   *
   * @param pageNumber
   */
  handleGetPage(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
  }

  /**
   * Handle an update to the filter values this component will filter by. This accepts only a
   * replacement of the filter values and will not combine with existing values.
   *
   * @param {Object} filterValues
   */
  handleFilter(filterValues) {
    this.setState({
      filterValues,
      // Always return to the first page on filter
      currentPage: 1,
    });
  }

  /**
   * Handle a request to change the sort direction/column
   * @param newSort
   */
  handleSort(newSort) {
    const { fields } = this.props;
    const { id, sortAscending } = newSort;
    const sortField = fields.find(field => field.ReadableLabel === id).OriginalLabel;

    this.setState({
      sort: { sortField, sortAscending },
      currentPage: 1,
    });
  }

  /**
   * Load the data from CKAN for displaying in Griddle. Note this is usually trigger by lifecycle
   * event (ie. componentDidUpdate)
   */
  loadData() {
    const {
      spec: { endpoint, dataset, identifier },
      fields,
      pageSize,
      location: { pathname, search },
      history,
      urlKeys,
    } = this.props;
    const { currentPage, filterValues, sort } = this.state;

    // Define a closure that will convert rows in a response from CKAN into rows that are consumable
    // by Griddle
    const recordMapper = record => {
      // Create a new object and loop the existing. We do this to re-key the object
      const newRecord = {};
      Object.entries(record).forEach(([key, value]) => {
        const currentField = fields.find(field => field.OriginalLabel === key);

        // We always need to allow _id to exist, even if it's disabled via configuration
        if (!currentField && key === '_id') {
          newRecord.Id = value;
          return; // continue
        }

        const readableLabel = currentField.ReadableLabel;
        newRecord[readableLabel] = value;
      });
      return newRecord;
    };

    // Mark as loading
    this.setState({ loading: true });

    // Calculate the offset
    const offset = (currentPage - 1) * pageSize;

    // Extract the handler for usage in the response promise
    const handleResult = result => {
      this.setState({
        data: result.records ? result.records.map(recordMapper) : [],
        loading: false,
      });
    };

    const dataStore = CKANApi.loadDatastore(endpoint, identifier);

    const visibleFields = this.getVisibleFields();
    const visibleFieldTypes = this.getVisibleFieldTypes();
    if (!visibleFields.includes('_id')) {
      // We always need "_id", even if it's hidden by configuration
      visibleFields.push('_id');
      visibleFieldTypes.push({ label: '_id', type: 'text' });
    }

    // Build up "distinct on"
    const distinctFields = fields
      .filter(field => field.RemoveDuplicates)
      .map(field => field.OriginalLabel);

    // Create the query
    const query = new Query(visibleFields, visibleFieldTypes, pageSize, offset);

    // Clear any existing filter
    this.resetQueryFilters(query);

    // Apply the filters to the query
    this.applyFilterValues(query, filterValues);

    // Check if we have a query (and it has filters set)
    if (distinctFields.length || (query && query.hasFilter())) {
      query.clearDistinct();

      if (distinctFields.length) {
        distinctFields.forEach(field => { query.distinctOn(field); });
      }

      if (sort) {
        const { sortField, sortAscending } = sort;
        query.clearOrder().order(sortField, sortAscending ? 'ASC' : 'DESC');
      }

      // Search using the SQL endpoint
      dataStore.countSql(query).then(count => {
        if (!count) {
          handleResult({
            records: false,
          });
        } else {
          this.setState({
            recordCount: count,
          });
          dataStore.searchSql(query).then(handleResult);
        }
      });
    } else {
      // In this case we can use the simple "datastore_search" endpoint
      dataStore.search(
        visibleFields,
        null, // No filtering
        false,
        pageSize,
        offset,
        sort
      ).then(result => {
        this.setState({
          recordCount: result.total,
        });
        handleResult(result);
      });
    }

    // Update the URL params for sort and current page. Filters at this point include default
    // filters applied through "ResultConditions". The URL is updated with filters in handleFilter
    const urlParams = new URLSearchParams(search);

    if (sort) {
      const { sortField, sortAscending } = sort;
      urlParams.set(urlKeys.sort, sortField);
      urlParams.set(urlKeys.sortDirection, sortAscending ? 'ASC' : 'DESC');
    }

    if (currentPage > 1) {
      urlParams.set(urlKeys.page, currentPage);
    } else {
      urlParams.delete(urlKeys.page);
    }

    // Clear existing filters
    Array.from(urlParams.keys()).forEach(key => {
      if (key.match(`^${urlKeys.filter}\\[\\d+]`)) {
        urlParams.delete(key);
      }
    });

    // Add new ones
    const fieldPrefixLength = `${dataset}_`.length;
    Object.entries(filterValues).forEach(([index, value]) => {
      urlParams.set(`${urlKeys.filter}[${index.substring(fieldPrefixLength)}]`, value);
    });

    // Compile search and push to history if applicable
    const newSearch = `?${urlParams.toString()}`;
    if (history && newSearch !== search) {
      history.push(pathname + newSearch);
    }
  }

  /**
   * Renders a loading message if "loading" is true in the state
   *
   * @returns {HTMLElement|null}
   */
  renderLoading() {
    const { loading } = this.state;
    if (!loading) {
      return null;
    }

    return (
      <p className="ckan-registry__loading">
        { window.i18n._t('CKANRegistryDisplay.LOADING', 'Loading...') }
      </p>
    );
  }

  /**
   * Renders a download/export to CSV link
   *
   * @returns {HTMLElement|null}
   */
  renderDownloadLink() {
    const { spec: { endpoint, identifier } } = this.props;

    return (
      <div className="ckan-registry__export">
        <a
          className="ckan-registry__button ckan-registry__button--export"
          href={`${endpoint}/datastore/dump/${identifier}`}
        >
          { window.i18n._t('CKANRegistryDisplay.DOWNLOAD', 'Export results to CSV') }
        </a>
      </div>
    );
  }

  /**
   * Renders a link to the resource on a CKAN site
   *
   * @returns {HTMLElement|null}
   */
  renderDatasetLink() {
    const { spec: { endpoint, dataset } } = this.props;

    if (!endpoint || !dataset) {
      return null;
    }

    // Strip any trailing slash if it exists
    return (
      <a
        href={`${endpoint.replace(/\/$/, '')}/dataset/${dataset}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {window.i18n.inject(
          window.i18n._t(
            'CKANRegistryDisplay.CKAN_LINK',
            'View on {siteName}'
          ), {
            siteName: endpoint
          }
        )}
      </a>
    );
  }

  renderDataGrid() {
    const { fields } = this.props;
    return (
      <Griddle {...this.getGriddleProps()}>
        <RowDefinition>
          {
            this.getVisibleFields()
              .map(field => {
                const id = fields.find(
                  candidate => candidate.OriginalLabel === field
                ).ReadableLabel;
                return <ColumnDefinition key={id} id={id} />;
              })
          }
        </RowDefinition>
      </Griddle>
    );
  }

  render() {
    const { spec: { identifier }, basePath, className, fields } = this.props;
    const { selectedRow } = this.state;

    // If no resource is configured then show nothing
    if (!identifier) {
      return null;
    }

    // Send the user off to the right detail view if they've clicked on a row
    if (selectedRow !== null) {
      return <Redirect to={`${basePath}/view/${selectedRow}`} />;
    }

    const invalidConfig = !fields || !fields.length;
    const classes = classnames(
      'ckan-registry',
      { 'ckan-registry__error': invalidConfig },
      className
    );

    if (invalidConfig) {
      const errorMessage = window.i18n._t(
        'CKANRegistryDisplay.NO_FIELDS',
        'There are no columns to show in this table.'
      );

      return (
        <div className={classes}>
          <p>{errorMessage}</p>
          <div className="ckan-registry__other-actions ckan-registry__other-actions--error">
            { this.renderDatasetLink() }
            { this.renderDownloadLink() }
          </div>
        </div>
      );
    }

    return (
      <div className={classes}>
        { this.renderLoading() }
        { this.renderDataGrid() }
        <div className="ckan-registry__other-actions">
          { this.renderDatasetLink() }
          { this.renderDownloadLink() }
        </div>
      </div>
    );
  }
}

CKANRegistryDisplay.propTypes = {
  spec: PropTypes.shape({
    endpoint: PropTypes.string,
    dataset: PropTypes.string,
    identifier: PropTypes.string,
  }),
  fields: PropTypes.arrayOf(PropTypes.shape({
    OriginalLabel: PropTypes.string,
    ReadableLabel: PropTypes.string,
    ShowInResultsView: PropTypes.bool,
    ShowInDetailView: PropTypes.bool,
    DisplayConditions: PropTypes.any,
    RemoveDuplicates: PropTypes.bool,
  })),
  filters: PropTypes.arrayOf(PropTypes.shape({
    allColumns: PropTypes.bool,
    columns: PropTypes.oneOfType([
      PropTypes.oneOf([null]),
      PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        target: PropTypes.string,
      }))
    ]),
    id: PropTypes.number,
    label: PropTypes.string,
    type: PropTypes.string,
  })),
  className: PropTypes.string,
  pageSize: PropTypes.number,
  urlKeys: PropTypes.shape({
    filter: PropTypes.string,
    sort: PropTypes.string,
    page: PropTypes.string,
    sortDirection: PropTypes.string,
  }),
};

CKANRegistryDisplay.defaultProps = {
  className: '',
  pageSize: 30,
  spec: {},
  fields: [],
  urlKeys: {
    filter: 'filter',
    sort: 'sort',
    page: 'page',
    sortDirection: 'sortdirection'
  },
  location: {
    search: null,
  },
};

export default CKANRegistryDisplay;
