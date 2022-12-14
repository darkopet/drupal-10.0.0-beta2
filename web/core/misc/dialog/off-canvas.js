/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(($, Drupal, debounce, displace) => {
  Drupal.offCanvas = {
    position: null,
    minimumHeight: 30,
    minDisplaceWidth: 768,
    $mainCanvasWrapper: $('[data-off-canvas-main-canvas]'),

    isOffCanvas($element) {
      return $element.is('#drupal-off-canvas');
    },

    removeOffCanvasEvents($element) {
      $element.off('.off-canvas');
      $(document).off('.off-canvas');
      $(window).off('.off-canvas');
    },

    beforeCreate({
      settings,
      $element
    }) {
      Drupal.offCanvas.removeOffCanvasEvents($element);
      $('body').addClass('js-off-canvas-dialog-open');
      settings.position = {
        my: 'left top',
        at: `${Drupal.offCanvas.getEdge()} top`,
        of: window
      };
      const position = settings.drupalOffCanvasPosition;
      const height = position === 'side' ? $(window).height() : settings.height;
      const width = position === 'side' ? settings.width : '100%';
      settings.height = height;
      settings.width = width;
    },

    beforeClose({
      $element
    }) {
      $('body').removeClass('js-off-canvas-dialog-open');
      Drupal.offCanvas.removeOffCanvasEvents($element);
      Drupal.offCanvas.resetPadding();
    },

    afterCreate({
      $element,
      settings
    }) {
      const eventData = {
        settings,
        $element,
        offCanvasDialog: this
      };
      $element.on('dialogContentResize.off-canvas', eventData, Drupal.offCanvas.handleDialogResize).on('dialogContentResize.off-canvas', eventData, Drupal.offCanvas.bodyPadding);
      Drupal.offCanvas.getContainer($element).attr(`data-offset-${Drupal.offCanvas.getEdge()}`, '');
      $(window).on('resize.off-canvas', eventData, debounce(Drupal.offCanvas.resetSize, 100)).trigger('resize.off-canvas');
    },

    render({
      settings
    }) {
      $('.ui-dialog-off-canvas, .ui-dialog-off-canvas .ui-dialog-titlebar').toggleClass('ui-dialog-empty-title', !settings.title);
    },

    handleDialogResize(event) {
      const $element = event.data.$element;
      const $container = Drupal.offCanvas.getContainer($element);
      const $offsets = $container.find('> :not(#drupal-off-canvas, .ui-resizable-handle)');
      let offset = 0;
      $element.css({
        height: 'auto'
      });
      const modalHeight = $container.height();
      $offsets.each((i, e) => {
        offset += $(e).outerHeight();
      });
      const scrollOffset = $element.outerHeight() - $element.height();
      $element.height(modalHeight - offset - scrollOffset);
    },

    resetSize(event) {
      const $element = event.data.$element;
      const container = Drupal.offCanvas.getContainer($element);
      const position = event.data.settings.drupalOffCanvasPosition;

      if (Drupal.offCanvas.position && Drupal.offCanvas.position !== position) {
        container.removeAttr(`data-offset-${Drupal.offCanvas.position}`);
      }

      if (position === 'top') {
        $element.css('min-height', `${Drupal.offCanvas.minimumHeight}px`);
      }

      displace();
      const offsets = displace.offsets;
      const topPosition = position === 'side' && offsets.top !== 0 ? `+${offsets.top}` : '';
      const adjustedOptions = {
        position: {
          my: `${Drupal.offCanvas.getEdge()} top`,
          at: `${Drupal.offCanvas.getEdge()} top${topPosition}`,
          of: window
        }
      };
      const height = position === 'side' ? `${$(window).height() - (offsets.top + offsets.bottom)}px` : event.data.settings.height;
      container.css({
        position: 'fixed',
        height
      });
      $element.dialog('option', adjustedOptions).trigger('dialogContentResize.off-canvas');
      Drupal.offCanvas.position = position;
    },

    bodyPadding(event) {
      const position = event.data.settings.drupalOffCanvasPosition;

      if (position === 'side' && $('body').outerWidth() < Drupal.offCanvas.minDisplaceWidth) {
        return;
      }

      Drupal.offCanvas.resetPadding();
      const $element = event.data.$element;
      const $container = Drupal.offCanvas.getContainer($element);
      const $mainCanvasWrapper = Drupal.offCanvas.$mainCanvasWrapper;
      const width = $container.outerWidth();
      const mainCanvasPadding = $mainCanvasWrapper.css(`padding-${Drupal.offCanvas.getEdge()}`);

      if (position === 'side' && width !== mainCanvasPadding) {
        $mainCanvasWrapper.css(`padding-${Drupal.offCanvas.getEdge()}`, `${width}px`);
        $container.attr(`data-offset-${Drupal.offCanvas.getEdge()}`, width);
        displace();
      }

      const height = $container.outerHeight();

      if (position === 'top') {
        $mainCanvasWrapper.css('padding-top', `${height}px`);
        $container.attr('data-offset-top', height);
        displace();
      }
    },

    getContainer($element) {
      return $element.dialog('widget');
    },

    getEdge() {
      return document.documentElement.dir === 'rtl' ? 'left' : 'right';
    },

    resetPadding() {
      Drupal.offCanvas.$mainCanvasWrapper.css(`padding-${Drupal.offCanvas.getEdge()}`, 0);
      Drupal.offCanvas.$mainCanvasWrapper.css('padding-top', 0);
      displace();
    }

  };
  Drupal.behaviors.offCanvasEvents = {
    attach: () => {
      if (!once('off-canvas', 'html').length) {
        return;
      }

      $(window).on({
        'dialog:beforecreate': (event, dialog, $element, settings) => {
          if (Drupal.offCanvas.isOffCanvas($element)) {
            Drupal.offCanvas.beforeCreate({
              dialog,
              $element,
              settings
            });
          }
        },
        'dialog:aftercreate': (event, dialog, $element, settings) => {
          if (Drupal.offCanvas.isOffCanvas($element)) {
            Drupal.offCanvas.render({
              dialog,
              $element,
              settings
            });
            Drupal.offCanvas.afterCreate({
              $element,
              settings
            });
          }
        },
        'dialog:beforeclose': (event, dialog, $element) => {
          if (Drupal.offCanvas.isOffCanvas($element)) {
            Drupal.offCanvas.beforeClose({
              dialog,
              $element
            });
          }
        }
      });
    }
  };
})(jQuery, Drupal, Drupal.debounce, Drupal.displace);