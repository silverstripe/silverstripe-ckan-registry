import jQuery from 'jquery';

/**
 * This file defines a click handler to toggle visibility of the ResourceLocatorField's
 * container when a user clicks on the "Edit resource" (edit pencil) icon/link in the
 * title (GridFieldResourceTitle) of a CKANRegistryPage. The field is initially hidden
 * using the "hide" Bootstrap class.
 */
jQuery.entwine('ss', ($) => {
  $('.ckan-columns__edit-resource').entwine({
    onclick(e) {
      e.preventDefault();
      $('.ckan-resource-locator__container').toggleClass('hide');
    }
  });
});
