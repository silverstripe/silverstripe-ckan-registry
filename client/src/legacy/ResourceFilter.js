import jQuery from 'jquery';

/**
 * This file controls whether the "Column source(s)" select field is hidden or shown
 * when the "All columns" checkbox is first loaded, and subsequently changed. This is
 * shown in the GridFieldDetailForm for the ResourceFilter model.
 *
 * When the form is React driven, this file should be replaced with conditional render
 * logic in a React HOC for the CompositeField (or something similar).
 */
jQuery.entwine('ss', ($) => {
  $('.field.ckan-columns__filter-fields').entwine({
    /**
     * Hide or show the field depending on whether the corresponding checkbox is checked
     */
    onmatch() {
      const checkbox = this.prev('.ckan-columns__all-columns');
      if (checkbox.length) {
        checkbox.toggleSourcesField();
      }
    }
  });

  $('.form-check-input.ckan-columns__all-columns').entwine({
    onmatch() {
      this.toggleSourcesField();
    },

    onchange() {
      this.toggleSourcesField();
    },

    /**
     * Either hides or shows the filter fields input depending on whether the
     * checkbox is checked or not
     */
    toggleSourcesField() {
      const sources = this.closest('.field').next('.ckan-columns__filter-fields');
      if (!sources.length) {
        return;
      }

      if (this.is(':checked')) {
        sources.hide();
      } else {
        sources.show();
      }
    }
  });
});
