/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(($, Drupal) => {
  Drupal.behaviors.MediaLibrarySelectAll = {
    attach(context) {
      const $view = $(once('media-library-select-all', '.js-media-library-view[data-view-display-id="page"]', context));

      if ($view.length && $view.find('.js-media-library-item').length) {
        const $checkbox = $(Drupal.theme('checkbox')).on('click', ({
          currentTarget
        }) => {
          const $checkboxes = $(currentTarget).closest('.js-media-library-view').find('.js-media-library-item input[type="checkbox"]');
          $checkboxes.prop('checked', $(currentTarget).prop('checked')).trigger('change');
          const announcement = $(currentTarget).prop('checked') ? Drupal.t('All @count items selected', {
            '@count': $checkboxes.length
          }) : Drupal.t('Zero items selected');
          Drupal.announce(announcement);
        });
        const $label = $('<label class="media-library-select-all"></label>');
        $label[0].textContent = Drupal.t('Select all media');
        $label.prepend($checkbox);
        $view.find('.js-media-library-item').first().before($label);
      }
    }

  };
})(jQuery, Drupal);