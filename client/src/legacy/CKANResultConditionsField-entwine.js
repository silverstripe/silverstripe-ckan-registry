import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.js-injector-boot .ckan-result-conditions__container').entwine({
    ReactRoot: null,

    onmatch() {
      const context = {};
      const CKANResultConditionsField = loadComponent('CKANResultConditionsField', context);

      const temporaryInput = this.children('input:first');

      if (!temporaryInput.length) {
        // Work around for a bug where onmatch is called on the existing field
        return;
      }

      const value = temporaryInput.val();
      const props = {
        name: this.attr('name'),
        value: value ? JSON.parse(value) : undefined,
        ...this.data('schema'),
      };

      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
        this.setReactRoot(root);
      }
      root.render(<CKANResultConditionsField {...props} />);
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
