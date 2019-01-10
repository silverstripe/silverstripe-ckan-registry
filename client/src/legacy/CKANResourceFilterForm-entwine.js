import jQuery from 'jquery';

jQuery.entwine('ss', ($) => {
  $('select.ckan-columns__filter-fields').entwine({
    onmatch() {
      if (this.val().length) {
        const presentedOptions = this.closest('form').find('.ckan-presented-options__container');
        presentedOptions.setFields(this.val());
      }
    },
    onchange() {
      const presentedOptions = this.closest('form').find('.ckan-presented-options__container');
      presentedOptions.setFields(this.val() || []);
    }
  });
});
