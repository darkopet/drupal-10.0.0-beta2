/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

((Drupal, once, tabbable) => {
  function isNavOpen(navWrapper) {
    return navWrapper.classList.contains('is-active');
  }

  function toggleNav(props, state) {
    const value = !!state;
    props.navButton.setAttribute('aria-expanded', value);

    if (value) {
      props.body.classList.add('is-overlay-active');
      props.body.classList.add('is-fixed');
      props.navWrapper.classList.add('is-active');
    } else {
      props.body.classList.remove('is-overlay-active');
      props.body.classList.remove('is-fixed');
      props.navWrapper.classList.remove('is-active');
    }
  }

  function init(props) {
    props.navButton.setAttribute('aria-controls', props.navWrapperId);
    props.navButton.setAttribute('aria-expanded', 'false');
    props.navButton.addEventListener('click', () => {
      toggleNav(props, !isNavOpen(props.navWrapper));
    });
    document.addEventListener('keyup', e => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (props.olivero.areAnySubNavsOpen()) {
          props.olivero.closeAllSubNav();
        } else {
          toggleNav(props, false);
        }
      }
    });
    props.overlay.addEventListener('click', () => {
      toggleNav(props, false);
    });
    props.overlay.addEventListener('touchstart', () => {
      toggleNav(props, false);
    });
    props.header.addEventListener('keydown', e => {
      if (e.key === 'Tab' && isNavOpen(props.navWrapper)) {
        const tabbableNavElements = tabbable.tabbable(props.navWrapper);
        tabbableNavElements.unshift(props.navButton);
        const firstTabbableEl = tabbableNavElements[0];
        const lastTabbableEl = tabbableNavElements[tabbableNavElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstTabbableEl && !props.olivero.isDesktopNav()) {
            lastTabbableEl.focus();
            e.preventDefault();
          }
        } else if (document.activeElement === lastTabbableEl && !props.olivero.isDesktopNav()) {
          firstTabbableEl.focus();
          e.preventDefault();
        }
      }
    });
    window.addEventListener('resize', () => {
      if (props.olivero.isDesktopNav()) {
        toggleNav(props, false);
        props.body.classList.remove('is-overlay-active');
        props.body.classList.remove('is-fixed');
      }

      Drupal.olivero.closeAllSubNav();
    });
    props.navWrapper.addEventListener('click', e => {
      if (e.target.matches(`[href*="${window.location.pathname}#"], [href*="${window.location.pathname}#"] *, [href^="#"], [href^="#"] *`)) {
        toggleNav(props, false);
      }
    });
  }

  Drupal.behaviors.oliveroNavigation = {
    attach(context) {
      const headerId = 'header';
      const header = once('navigation', `#${headerId}`, context).shift();
      const navWrapperId = 'header-nav';

      if (header) {
        const navWrapper = header.querySelector(`#${navWrapperId}`);
        const {
          olivero
        } = Drupal;
        const navButton = context.querySelector('[data-drupal-selector="mobile-nav-button"]');
        const body = context.querySelector('body');
        const overlay = context.querySelector('[data-drupal-selector="header-nav-overlay"]');
        init({
          olivero,
          header,
          navWrapperId,
          navWrapper,
          navButton,
          body,
          overlay
        });
      }
    }

  };
})(Drupal, once, tabbable);