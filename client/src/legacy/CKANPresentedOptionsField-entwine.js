import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.ckan-presented-options__container').entwine({
    FieldIDs: [],
    Mounted: false,

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

      ReactDOM.render(
        <PresentedOptionsComponent {...props} />,
        this[0]
      );

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
      ReactDOM.unmountComponentAtNode(this[0]);
      this.setMounted(false);
    }
  });
});
