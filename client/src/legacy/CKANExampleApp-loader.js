/* global window */
import React from 'react';
import ReactDOM from 'react-dom';
import CKANExampleApp from 'components/CKANExampleApp';

window.document.addEventListener('DOMContentLoaded', () => {
  const registries = document.querySelectorAll('.ckan-registry-holder');

  [...registries].forEach(element => {
    // Prevents processing the same container more than once
    if (element.classList.contains('loaded')) {
      return;
    }
    element.classList.add('loaded');

    const configuration = JSON.parse(element.dataset.configuration);
    ReactDOM.render(<CKANExampleApp {...configuration} />, element);
  });
});
