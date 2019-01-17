import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CKANRegistryDetailView = ({ basePath, match }) => (
  <div className="ckan-registry__detail">
    <h3>Details of { match.params.item } </h3>
    <p>Watch this space!</p>
    <Link to={basePath}>&lt; Back</Link>
  </div>
);

CKANRegistryDetailView.propTypes = {
  basePath: PropTypes.string,
};

CKANRegistryDetailView.defaultProps = {
  basePath: '/',
};

export default CKANRegistryDetailView;
