/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import Griddle from 'griddle-react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

const getGriddleProperties = (props) => ({
  data: [],
  pageSize: 30,
  currentPage: 1,
  recordCount: 0,
  ...props,
});

const CKANRegistryDisplay = (props) => (
  <div>
    <Griddle {...getGriddleProperties(props)} />
    <div className={classnames('ckan-registry__export', props.className)}>
      {props.downloadLink && (
        <a
          className="ckan-registry__button--export"
          href={props.downloadLink}
        >
          {window.i18n._t('CKANRegistryDisplay.DOWNLOAD', 'Export results to CSV')}
        </a>
      )}
    </div>

    { /* example for adding a link using react-router */ }
    <Link to={`${props.basePath}/123`}>Go to item 123</Link>
  </div>
);

CKANRegistryDisplay.propTypes = {
  basePath: PropTypes.string,
  className: PropTypes.string,
  downloadLink: PropTypes.string,
};

CKANRegistryDisplay.defaultProps = {
  basePath: '/',
  className: '',
  downloadLink: '',
};

export default CKANRegistryDisplay;
