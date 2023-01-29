
import React from 'react';
import { Row, Col } from 'reactstrap';
import CKANRegistryFilterContainer from 'components/CKANRegistryFilterContainer';

export default function getGriddleLayoutHOC(containerProps, handleFilter, filterValues) {
  return ({ Table, Pagination }) => (
    <Row>
      <Col md={3} lg={2} className="ckan-registry__filters">
        <CKANRegistryFilterContainer
          {...containerProps}
          onFilter={handleFilter}
          defaultValues={filterValues}
        />
      </Col>
      <Col md={9} lg={10} className="ckan-registry__loading-container">
        <div className="ckan-registry__loading">
          { window.i18n._t('CKANRegistryDisplay.LOADING', 'Loading...') }
        </div>
      </Col>
      <Col md={9} lg={10} className="ckan-registry__table">
        { <Table /> }
        { <Pagination /> }
      </Col>
    </Row>
  );
}
