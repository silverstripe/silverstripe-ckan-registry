/* global window */
import React from 'react';
import ReactDOM from 'react-dom';
import CKANRegistryDisplay from '../components/CKANRegistryDisplay';

window.document.addEventListener('DOMContentLoaded', () => {
  const registries = document.querySelectorAll('.ckan-registry');
  [...registries].forEach(element => {
    const configuration = JSON.parse(element.dataset.configuration);
    ReactDOM.render(<CKANRegistryDisplay {...configuration} />, element);
  });
});
