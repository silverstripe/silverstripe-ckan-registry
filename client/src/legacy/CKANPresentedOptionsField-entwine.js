import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.ckan-presented-options__container').entwine({
    FieldIDs: [],
    Mounted: false,
    ReactRoot: null,

    renderComponent(value = null) {
      const context = {};
      const PresentedOptionsComponent = loadComponent('CKANPresentedOptionsField', context);
      const schema = this.data('schema');
      const { data: { fieldMap } } = schema;
      const fields = this.getFieldIDs().map(id => fieldMap[id] || null);
      const { extraClass, ...forwardedProps } = schema;
      const props = {
        name: this.attr('name'),
        value: value ? JSON.parse(value) : undefined,
        selectedFields: fields,
        ...forwardedProps,
      };

      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
        this.setReactRoot(root);
      }
      root.render(<PresentedOptionsComponent {...props} />);

      this.setMounted(true);
    },

    setFields(fields) {
      if (!Array.isArray(fields)) {
        return;
      }
      this.setFieldIDs(fields);
      if (this.getMounted()) {
        this.renderComponent();
      }
    }
  });

  $('.js-injector-boot .ckan-presented-options__container').entwine({
    onmatch() {
      const temporaryInput = this.children('input:first');

      if (!temporaryInput.length) {
        // Work around for a bug where onmatch is called on the existing field
        return;
      }

      this.renderComponent(temporaryInput.val());
    },

    onunmatch() {
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
      this.setMounted(false);
    }
  });
});
