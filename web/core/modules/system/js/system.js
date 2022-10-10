/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, drupalSettings) {
  const ids = [];
  Drupal.behaviors.copyFieldValue = {
    attach(context) {
      Object.keys(drupalSettings.copyFieldValue || {}).forEach(element => {
        ids.push(element);
      });

      if (ids.length) {
        $(once('copy-field-values', 'body')).on('value:copy', this.valueTargetCopyHandler);
        $(once('copy-field-values', `#${ids.join(', #')}`)).on('blur', this.valueSourceBlurHandler);
      }
    },

    detach(context, settings, trigger) {
      if (trigger === 'unload' && ids.length) {
        $(once.remove('copy-field-values', 'body')).off('value:copy');
        $(once.remove('copy-field-values', `#${ids.join(', #')}`)).off('blur');
      }
    },

    valueTargetCopyHandler(e, value) {
      const {
        target
      } = e;

      if (target.value === '') {
        target.value = value;
      }
    },

    valueSourceBlurHandler(e) {
      const {
        value
      } = e.target;
      const targetIds = drupalSettings.copyFieldValue[e.target.id];
      $(`#${targetIds.join(', #')}`).trigger('value:copy', value);
    }

  };
})(jQuery, Drupal, drupalSettings);