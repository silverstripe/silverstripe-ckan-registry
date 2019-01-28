import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CKANApi from 'lib/CKANApi';

/**
 * Responsible for rendering a full set of detail view data for the selected item.
 *
 * This data comes from the CKAN API, using the matched "item" (_id field) value
 * as the unique ID.
 */
class CKANRegistryDetailView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
    };
  }
  /**
   * When the component has mounted, load the detail view data from the CKAN API
   */
  componentDidMount() {
    this.loadData();
  }

  /**
   * Reload the detail view data from the CKAN API whenever the item ID changes
   *
   * @param {object} prevProps
   */
  componentDidUpdate(prevProps) {
    if (prevProps.match && prevProps.match.item !== this.props.match.item) {
      this.loadData();
    }
  }

  /**
   * Load the current "item" (_id) resource dataset from the CKAN API
   */
  loadData() {
    const { spec: { endpoint, identifier }, fields, match: { params } } = this.props;

    const recordMapper = record => {
      const newRecord = {};
      Object.entries(record).forEach(([key, value]) => {
        const readableLabel = fields
          .find(field => field.OriginalLabel === key)
          .ReadableLabel;
        newRecord[readableLabel] = value;
      });
      return newRecord;
    };

    this.setState({ loading: true });
    CKANApi
      .loadDatastore(endpoint, identifier)
      .search(
        fields
          .filter(field => field.ShowInDetailView)
          .map(field => field.OriginalLabel), // fields (select)
        { // search terms (where)
          _id: params.item
        },
        false, // distinct
        1, // limit
        0, // offset
      )
      .then(result => {
        this.setState({
          data: result.records ? result.records.map(recordMapper) : [],
          recordCount: result.total,
          loading: false,
        });
      });
  }

  /**
   * Renders a list of the resource's field names and values
   *
   * @returns {HTMLElement}
   */
  renderFields() {
    const { data, loading } = this.state;

    if (loading) {
      return (
        <p>
          {window.i18n._t(
            'CKANRegistryDetailView.LOADING',
            'Loading...'
          )}
        </p>
      );
    }

    if (!data.length) {
      return (
        <p>
          {window.i18n._t(
            'CKANRegistryDetailView.NO_RESULTS',
            'No results found!'
          )}
        </p>
      );
    }

    return (
      <dl className="ckan-registry__detail-list row">
        {
          Object.entries(data[0]).reduce((acc, value) => acc.concat([
            <dt key={`${value[0]}-dt`} className="col-sm-3">{value[0]}</dt>,
            <dd key={`${value[0]}-dd`} className="col-sm-9">{value[1]}</dd>
          ]), [])
        }
      </dl>
    );
  }

  render() {
    const { basePath } = this.props;

    return (
      <div className="ckan-registry__detail">
        { this.renderFields() }
        <p>
          <Link to={basePath} className="ckan-registry__back-link">
            &lt; {window.i18n._t('CKANRegistryDetailView.BACK', 'Back')}
          </Link>
        </p>
      </div>
    );
  }
}

CKANRegistryDetailView.propTypes = {
  basePath: PropTypes.string,
};

CKANRegistryDetailView.defaultProps = {
  basePath: '/',
};

export default CKANRegistryDetailView;
