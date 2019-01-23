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

class CKANRegistryDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      query: this.resetQueryFilters(new Query(), props),
      currentPage: 1,
      recordCount: 0,
      selectedRow: null,
    };

    this.handleGetPage = this.handleGetPage.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      this.loadData();
    }
  }

  /**
   * Return the props that will be passed to the base Griddle component
   *
   * @return {Object}
   */
  getGriddleProps() {
    const { pageSize } = this.props;
    const { data, currentPage, recordCount } = this.state;

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
      events: {
        onGetPage: this.handleGetPage,
        onNext: () => { this.handleGetPage(this.state.currentPage + 1); },
        onPrevious: () => { this.handleGetPage(this.state.currentPage - 1); },
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
    };
  }

  /**
   * Get an HOC that is used to render the layout of the Griddle components
   *
   * @return {function({Table: *, Pagination: *, Filter: *}): *}
   */
  getGriddleLayoutHOC() {
    return ({ Table, Pagination }) => (
      <Row>
        <Col md={2} className="ckan-registry__filters">
          <CKANRegistryFilterContainer
            {...this.props}
            onFilter={this.handleFilter}
            allColumns={this.getVisibleFields()}
          />
        </Col>
        <Col md={10} className="ckan-registry__table">
          <Table />
          <Pagination />
        </Col>
      </Row>
    );
  }

  /**
   * Get the fields that are shown in the results view (and should be searched upon)
   *
   * @return {*}
   */
  getVisibleFields() {
    return this.props.fields
      .filter(field => parseInt(field.ShowInResultsView, 10) === 1)
      .map(field => field.OriginalLabel);
  }

  /**
   * Takes the given Query object and resets the filters to a default state
   *
   * @param {Query} query
   * @param {Object} props Optionally provided to be used in place of `this.props`
   * @return {Query}
   */
  resetQueryFilters(query, props) {
    // eslint-disable-next-line no-unused-vars
    const { filter } = props || this.props;

    query.clearFilters();

    // TODO implement the default filter functionality here... (and remove eslint exception above)

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
   * Handle a filter field update
   *
   * @param {Object} filterValues
   */
  handleFilter(filterValues) {
    const { fields, filters, spec: { dataset } } = this.props;
    const { query } = this.state;

    // Clear any existing filter
    this.resetQueryFilters(query);

    // Loop through the filters and apply any values that may be in the given "filter values"
    filters.forEach(filter => {
      const stateKey = `${dataset}_${filter.label}`;

      if (!filterValues.hasOwnProperty(stateKey)) {
        return; // continue;
      }

      const value = filterValues[stateKey];

      if (typeof value !== 'string' || !value.length) {
        return; // continue;
      }

      // Check if the filter configuration implies that this should be a search on "all columns"
      const isAllColumns = filter.allColumns.toString() === '1';

      // For all columns we'll just search those that are "shown in results"
      if (isAllColumns) {
        query.filter(
          fields
            // We only apply the search term to fields that are visible on the table
            .filter(({ OriginalLabel }) => this.getVisibleFields().includes(OriginalLabel))
            // And we need to pull out the "original label" - the label it goes by on CKAN
            .map(({ OriginalLabel }) => OriginalLabel),
          value
        );
        return; // continue;
      }

      // Add our filter statement
      query.filter(filter.columns.map(({ target }) => target), value);
    });

    this.loadData();
  }

  /**
   * Load the data from CKAN for displaying in Griddle. Note this is usually trigger by lifecycle
   * event (ie. componentDidUpdate)
   */
  loadData() {
    const { spec: { endpoint, identifier }, fields, pageSize } = this.props;
    const { currentPage, query } = this.state;

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
    const distinct = true;

    // Extract the handler for usage in the response promise
    const handleResult = result => {
      this.setState({
        data: result.records ? result.records.map(recordMapper) : [],
        recordCount: result.total,
        loading: false,
      });
    };

    const dataStore = CKANApi.loadDatastore(endpoint, identifier);

    const visibleFields = [
      ...this.getVisibleFields(),
    ];
    if (!visibleFields.find(value => value === '_id')) {
      // We always need "_id", even if it's hidden by configuration
      visibleFields.push('_id');
    }

    // Check if we have a query (and it has filters set)
    if (query && query.hasFilter()) {
      query.fields = visibleFields;
      query.limit = pageSize;
      query.offset = offset;
      query.distinct = distinct;

      // Search using the SQL endpoint
      dataStore.searchSql(query).then(handleResult);
    } else {
      // In this case we can use the simple "datastore_search" endpoint
      dataStore.search(
        visibleFields,
        null, // No filtering
        distinct,
        pageSize,
        offset
      ).then(handleResult);
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
  renderResourceLink() {
    const { spec: { endpoint, dataset, identifier } } = this.props;
    return (
      <a href={`${endpoint}/dataset/${dataset}/resource/${identifier}`}>
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
    const { basePath, className, fields } = this.props;
    const { selectedRow } = this.state;

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
            { this.renderResourceLink() }
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
          { this.renderResourceLink() }
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
    ShowInResultsView: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    ShowInDetailView: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    DisplayConditions: PropTypes.any,
    RemoveDuplicates: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  })),
  className: PropTypes.string,
  pageSize: PropTypes.number,
};

CKANRegistryDisplay.defaultProps = {
  className: '',
  pageSize: 30,
};

export default CKANRegistryDisplay;
