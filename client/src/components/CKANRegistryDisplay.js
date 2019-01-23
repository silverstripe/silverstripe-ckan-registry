/* global window */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Griddle, { ColumnDefinition, RowDefinition } from 'griddle-react';
import classnames from 'classnames';
import CKANApi from 'lib/CKANApi';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import CKANRegistryFilterContainer from 'components/CKANRegistryFilterContainer';
import Query from 'lib/CKANApi/DataStore/Query';

class CKANRegistryDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      query: this.resetQueryFilters(new Query(), props),
      currentPage: 1,
      recordCount: 0,
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
        const readableLabel = fields
          .find(field => field.OriginalLabel === key)
          .ReadableLabel;
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

    // Check if we have a query (and it has filters set)
    if (query && query.hasFilter()) {
      query.fields = this.getVisibleFields();
      query.limit = pageSize;
      query.offset = offset;
      query.distinct = distinct;

      // Search using the SQL endpoint
      dataStore.searchSql(query).then(handleResult);
    } else {
      // In this case we can use the simple "datastore_search" endpoint
      dataStore.search(
        this.getVisibleFields(),
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
    const { downloadLink } = this.props;
    if (!downloadLink) {
      return null;
    }

    return (
      <div className="ckan-registry__export">
        <a
          className="ckan-registry__button ckan-registry__button--export"
          href={downloadLink}
        >
          { window.i18n._t('CKANRegistryDisplay.DOWNLOAD', 'Export results to CSV') }
        </a>
      </div>
    );
  }

  render() {
    const { className, fields } = this.props;

    const invalidConfig = !fields || !fields.length;
    const classes = classnames(
      'ckan-registry',
      { 'ckan-registry__error': invalidConfig },
      className
    );

    if (!fields || !fields.length) {
      const errorMessage = window.i18n._t(
        'CKANRegistryDisplay.NO_FIELDS',
        'There are no columns to show in this table.'
      );

      return (
        <div className={classes}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    return (
      <div className={classes}>
        { this.renderLoading() }
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
        { this.renderDownloadLink() }

        { /* example for adding a link using react-router */ }
        <Link to={`${this.props.basePath}/view/123`}>Go to item 123</Link>
      </div>
    );
  }
}

CKANRegistryDisplay.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  downloadLink: PropTypes.string,
  pageSize: PropTypes.number,
};

CKANRegistryDisplay.defaultProps = {
  basePath: '/',
  className: '',
  downloadLink: '',
  pageSize: 30,
};

export default CKANRegistryDisplay;
