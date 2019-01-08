import jQuery from 'jquery';

jQuery.entwine('ss', ($) => {
  $('.js-injector-boot select.ckan-columns__filter-fields').entwine({
    onchange() {
      const presentedOptions = this.closest('form').find('.ckan-presented-options__container');
      presentedOptions.renderComponent(this.val());
    }
  });
});
