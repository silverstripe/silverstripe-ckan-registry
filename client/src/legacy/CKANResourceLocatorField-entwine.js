import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.js-injector-boot .ckan-resource-locator__container').entwine({
    onmatch() {
      const context = {};
      const CKANResourceLocatorField = loadComponent('CKANResourceLocatorField', context);
      const schemaData = this.data('schema');

      const value = this.children('input:first').val();
      const description = schemaData.description && schemaData.description.html;
      const props = {
        name: this.attr('name'),
        ...schemaData,
        defaultEndpoint: schemaData.defaultEndpoint || null,
        description: description || '',
        value: value ? JSON.parse(value) : undefined,
      };

      ReactDOM.render(
        <CKANResourceLocatorField {...props} />,
        this[0]
      );
    },

    onunmatch() {
      ReactDOM.unmountComponentAtNode(this[0]);
    },
  });
});
