/* global window */
import React from 'react';
import { createRoot } from 'react-dom/client';
import CKANExampleApp from 'components/CKANExampleApp';

window.document.addEventListener('DOMContentLoaded', () => {
  const registries = document.querySelectorAll('.ckan-registry-holder');

  [...registries].forEach(element => {
    // Prevents processing the same container more than once
    if (element.classList.contains('loaded')) {
      return;
    }
    element.classList.add('loaded');

    createRoot(element).render(<CKANExampleApp />);
  });
});
