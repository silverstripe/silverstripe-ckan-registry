import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.js-injector-boot .ckan-resource-locator__container').entwine({
    ReactRoot: null,

    onmatch() {
      const context = {};
      const CKANResourceLocatorField = loadComponent('CKANResourceLocatorField', context);
      const schemaData = this.data('schema');

      const value = this.children('input:first').val();
      const props = {
        name: this.attr('name'),
        ...schemaData,
        defaultEndpoint: schemaData.defaultEndpoint || null,
        description: (schemaData.description && schemaData.description.html) || '',
        value: value ? JSON.parse(value) : undefined,
      };

      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
        this.setReactRoot(root);
      }
      root.render(<CKANResourceLocatorField {...props} />);
    },

    onunmatch() {
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },
  });
});
