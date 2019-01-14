/* global window */
import React from 'react';
import Griddle from 'griddle-react';
import classnames from 'classnames';

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
  </div>
);

export default CKANRegistryDisplay;
