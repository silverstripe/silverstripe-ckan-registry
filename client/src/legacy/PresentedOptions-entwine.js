import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { loadComponent } from 'lib/Injector';

jQuery.entwine('ss', ($) => {
  $('.js-injector-boot .ckan-presented-options__container').entwine({
    onmatch() {
      const context = {};
      const PresentedOptionsComponent = loadComponent('PresentedOptions', context);
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

      ReactDOM.render(
        <PresentedOptionsComponent {...props} />,
        this[0]
      );
    },

    onunmatch() {
      ReactDOM.unmountComponentAtNode(this[0]);
    },
  });
});
