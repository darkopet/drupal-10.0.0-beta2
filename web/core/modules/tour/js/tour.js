/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(($, Backbone, Drupal, settings, document, Shepherd) => {
  const queryString = decodeURI(window.location.search);
  Drupal.behaviors.tour = {
    attach(context) {
      once('tour', 'body').forEach(() => {
        const model = new Drupal.tour.models.StateModel();
        new Drupal.tour.views.ToggleTourView({
          el: $(context).find('#toolbar-tab-tour'),
          model
        });
        model.on('change:isActive', (tourModel, isActive) => {
          $(document).trigger(isActive ? 'drupalTourStarted' : 'drupalTourStopped');
        });

        if (settings._tour_internal) {
          model.set('tour', settings._tour_internal);
        }

        if (/tour=?/i.test(queryString)) {
          model.set('isActive', true);
        }
      });
    }

  };
  Drupal.tour = Drupal.tour || {
    models: {},
    views: {}
  };
  Drupal.tour.models.StateModel = Backbone.Model.extend({
    defaults: {
      tour: [],
      isActive: false,
      activeTour: []
    }
  });
  Drupal.tour.views.ToggleTourView = Backbone.View.extend({
    events: {
      click: 'onClick'
    },

    initialize() {
      this.listenTo(this.model, 'change:tour change:isActive', this.render);
      this.listenTo(this.model, 'change:isActive', this.toggleTour);
    },

    render() {
      this.$el.toggleClass('hidden', this._getTour().length === 0);
      const isActive = this.model.get('isActive');
      this.$el.find('button').toggleClass('is-active', isActive).attr('aria-pressed', isActive);
      return this;
    },

    toggleTour() {
      if (this.model.get('isActive')) {
        this._removeIrrelevantTourItems(this._getTour());

        const tourItems = this.model.get('tour');
        const that = this;

        if (tourItems.length) {
          settings.tourShepherdConfig.defaultStepOptions.popperOptions.modifiers.push({
            name: 'moveArrowJoyridePosition',
            enabled: true,
            phase: 'write',

            fn({
              state
            }) {
              const {
                arrow
              } = state.elements;
              const {
                placement
              } = state;

              if (arrow && /^top|bottom/.test(placement) && /-start|-end$/.test(placement)) {
                const horizontalPosition = placement.split('-')[1];
                const offset = horizontalPosition === 'start' ? 28 : state.elements.popper.clientWidth - 56;
                arrow.style.transform = `translate3d(${offset}px, 0px, 0px)`;
              }
            }

          });
          const shepherdTour = new Shepherd.Tour(settings.tourShepherdConfig);
          shepherdTour.on('cancel', () => {
            that.model.set('isActive', false);
          });
          shepherdTour.on('complete', () => {
            that.model.set('isActive', false);
          });
          tourItems.forEach((tourStepConfig, index) => {
            const tourItemOptions = {
              title: tourStepConfig.title ? Drupal.checkPlain(tourStepConfig.title) : null,
              text: () => Drupal.theme('tourItemContent', tourStepConfig),
              attachTo: tourStepConfig.attachTo,
              buttons: [Drupal.tour.nextButton(shepherdTour, tourStepConfig)],
              classes: tourStepConfig.classes,
              index
            };
            tourItemOptions.when = {
              show() {
                const nextButton = shepherdTour.currentStep.el.querySelector('footer button');
                nextButton.focus();

                if (Drupal.tour.hasOwnProperty('convertToJoyrideMarkup')) {
                  Drupal.tour.convertToJoyrideMarkup(shepherdTour);
                }
              }

            };
            shepherdTour.addStep(tourItemOptions);
          });
          shepherdTour.start();
          this.model.set({
            isActive: true,
            activeTour: shepherdTour
          });
        }
      } else {
        this.model.get('activeTour').cancel();
        this.model.set({
          isActive: false,
          activeTour: []
        });
      }
    },

    onClick(event) {
      this.model.set('isActive', !this.model.get('isActive'));
      event.preventDefault();
      event.stopPropagation();
    },

    _getTour() {
      return this.model.get('tour');
    },

    _removeIrrelevantTourItems(tourItems) {
      const tips = /tips=([^&]+)/.exec(queryString);
      const filteredTour = tourItems.filter(tourItem => {
        if (tips && tourItem.hasOwnProperty('classes') && tourItem.classes.indexOf(tips[1]) === -1) {
          return false;
        }

        return !(tourItem.selector && !document.querySelector(tourItem.selector));
      });

      if (tourItems.length !== filteredTour.length) {
        filteredTour.forEach((filteredTourItem, filteredTourItemId) => {
          filteredTour[filteredTourItemId].counter = Drupal.t('!tour_item of !total', {
            '!tour_item': filteredTourItemId + 1,
            '!total': filteredTour.length
          });

          if (filteredTourItemId === filteredTour.length - 1) {
            filteredTour[filteredTourItemId].cancelText = Drupal.t('End tour');
          }
        });
        this.model.set('tour', filteredTour);
      }
    }

  });

  Drupal.tour.nextButton = (shepherdTour, tourStepConfig) => {
    return {
      classes: 'button button--primary',
      text: tourStepConfig.cancelText ? tourStepConfig.cancelText : Drupal.t('Next'),
      action: tourStepConfig.cancelText ? shepherdTour.cancel : shepherdTour.next
    };
  };

  Drupal.theme.tourItemContent = tourStepConfig => `${tourStepConfig.body}<div class="tour-progress">${tourStepConfig.counter}</div>`;
})(jQuery, Backbone, Drupal, drupalSettings, document, window.Shepherd);