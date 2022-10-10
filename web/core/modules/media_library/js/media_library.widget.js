/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(($, Drupal, Sortable) => {
  Drupal.behaviors.MediaLibraryWidgetSortable = {
    attach(context) {
      const selection = context.querySelectorAll('.js-media-library-selection');
      selection.forEach(widget => {
        Sortable.create(widget, {
          draggable: '.js-media-library-item',
          handle: '.js-media-library-item-preview',
          onEnd: () => {
            $(widget).children().each((index, child) => {
              $(child).find('.js-media-library-item-weight')[0].value = index;
            });
          }
        });
      });
    }

  };
  Drupal.behaviors.MediaLibraryWidgetToggleWeight = {
    attach(context) {
      const strings = {
        show: Drupal.t('Show media item weights'),
        hide: Drupal.t('Hide media item weights')
      };
      const mediaLibraryToggle = once('media-library-toggle', '.js-media-library-widget-toggle-weight', context);
      $(mediaLibraryToggle).on('click', e => {
        e.preventDefault();
        const $target = $(e.currentTarget);
        e.currentTarget.textContent = $target.hasClass('active') ? strings.show : strings.hide;
        $target.toggleClass('active').closest('.js-media-library-widget').find('.js-media-library-item-weight').parent().toggle();
      });
      mediaLibraryToggle.forEach(item => {
        item.textContent = strings.show;
      });
      $(once('media-library-toggle', '.js-media-library-item-weight', context)).parent().hide();
    }

  };
  Drupal.behaviors.MediaLibraryWidgetDisableButton = {
    attach(context) {
      once('media-library-disable', '.js-media-library-open-button[data-disabled-focus="true"]', context).forEach(button => {
        $(button).focus();
        setTimeout(() => {
          $(button).attr('disabled', 'disabled');
        }, 50);
      });
    }

  };
})(jQuery, Drupal, Sortable);