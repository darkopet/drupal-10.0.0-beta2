/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(Drupal => {
  Drupal.Message = class {
    constructor(messageWrapper = null) {
      if (!messageWrapper) {
        this.messageWrapper = Drupal.Message.defaultWrapper();
      } else {
        this.messageWrapper = messageWrapper;
      }
    }

    static defaultWrapper() {
      let wrapper = document.querySelector('[data-drupal-messages]');

      if (!wrapper) {
        wrapper = document.querySelector('[data-drupal-messages-fallback]');
        wrapper.removeAttribute('data-drupal-messages-fallback');
        wrapper.setAttribute('data-drupal-messages', '');
        wrapper.classList.remove('hidden');
      }

      return wrapper.innerHTML === '' ? Drupal.Message.messageInternalWrapper(wrapper) : wrapper.firstElementChild;
    }

    static getMessageTypeLabels() {
      return {
        status: Drupal.t('Status message'),
        error: Drupal.t('Error message'),
        warning: Drupal.t('Warning message')
      };
    }

    add(message, options = {}) {
      if (!options.hasOwnProperty('type')) {
        options.type = 'status';
      }

      if (typeof message !== 'string') {
        throw new Error('Message must be a string.');
      }

      Drupal.Message.announce(message, options);
      options.id = options.id ? String(options.id) : `${options.type}-${Math.random().toFixed(15).replace('0.', '')}`;

      if (!Drupal.Message.getMessageTypeLabels().hasOwnProperty(options.type)) {
        const {
          type
        } = options;
        throw new Error(`The message type, ${type}, is not present in Drupal.Message.getMessageTypeLabels().`);
      }

      this.messageWrapper.appendChild(Drupal.theme('message', {
        text: message
      }, options));
      return options.id;
    }

    select(id) {
      return this.messageWrapper.querySelector(`[data-drupal-message-id^="${id}"]`);
    }

    remove(id) {
      return this.messageWrapper.removeChild(this.select(id));
    }

    clear() {
      Array.prototype.forEach.call(this.messageWrapper.querySelectorAll('[data-drupal-message-id]'), message => {
        this.messageWrapper.removeChild(message);
      });
    }

    static announce(message, options) {
      if (!options.priority && (options.type === 'warning' || options.type === 'error')) {
        options.priority = 'assertive';
      }

      if (options.announce !== '') {
        Drupal.announce(options.announce || message, options.priority);
      }
    }

    static messageInternalWrapper(messageWrapper) {
      const innerWrapper = document.createElement('div');
      innerWrapper.setAttribute('class', 'messages__wrapper');
      messageWrapper.insertAdjacentElement('afterbegin', innerWrapper);
      return innerWrapper;
    }

  };

  Drupal.theme.message = ({
    text
  }, {
    type,
    id
  }) => {
    const messagesTypes = Drupal.Message.getMessageTypeLabels();
    const messageWrapper = document.createElement('div');
    messageWrapper.setAttribute('class', `messages messages--${type}`);
    messageWrapper.setAttribute('role', type === 'error' || type === 'warning' ? 'alert' : 'status');
    messageWrapper.setAttribute('data-drupal-message-id', id);
    messageWrapper.setAttribute('data-drupal-message-type', type);
    messageWrapper.setAttribute('aria-label', messagesTypes[type]);
    messageWrapper.innerHTML = `${text}`;
    return messageWrapper;
  };
})(Drupal);