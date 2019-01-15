/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import Griddle from 'griddle-react';
import classnames from 'classnames';
import CKANApi from 'lib/CKANApi';
import { Link } from 'react-router-dom';

class CKANRegistryDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      currentPage: 1,
      recordCount: 0,
    };

    this.handleGetPage = this.handleGetPage.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentPage !== this.state.currentPage) {
      this.loadData();
    }
  }

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
    };
  }

  handleGetPage(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
  }

  loadData() {
    const { endpoint, resource, fields, pageSize } = this.props;
    const { currentPage } = this.state;

    CKANApi
      .loadDatastore(endpoint, resource)
      .search(
        fields.map(field => field.OriginalLabel),
        null,
        false,
        pageSize,
        (currentPage - 1) * pageSize
      )
      .then(result => {
        this.setState({
          data: result.records.map(record => {
            const newRecord = {};
            Object.entries(record).forEach(([key, value]) => {
              const readableLabel = fields
                .find(field => field.OriginalLabel === key)
                .ReadableLabel;
              newRecord[readableLabel] = value;
            });
            return newRecord;
          }),
          recordCount: result.total,
        });
      });
  }

  render() {
    const { className, downloadLink } = this.props;

    return (
      <div>
        <Griddle {...this.getGriddleProps()} />
        <div className={classnames('ckan-registry__export', className)}>
          {downloadLink && (
            <a
              className="ckan-registry__button--export"
              href={downloadLink}
            >
              {window.i18n._t('CKANRegistryDisplay.DOWNLOAD', 'Export results to CSV')}
            </a>
          )}
        </div>

        { /* example for adding a link using react-router */ }
        <Link to={`${props.basePath}/view/123`}>Go to item 123</Link>
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
