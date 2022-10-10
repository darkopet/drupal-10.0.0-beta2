/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

((Drupal, once, Modernizr) => {
  Drupal.behaviors.ckEditor5warn = {
    attach: function attach() {
      const isIE11 = Modernizr.mq('(-ms-high-contrast: active), (-ms-high-contrast: none)');
      const editorSelect = once('editor-select', document.querySelector('#filter-format-edit-form #edit-editor-editor, #filter-format-add-form #edit-editor-editor'));

      if (typeof editorSelect[0] !== 'undefined') {
        const select = editorSelect[0];
        const selectMessageContainer = document.createElement('div');
        select.parentNode.insertBefore(selectMessageContainer, select);
        const selectMessages = new Drupal.Message(selectMessageContainer);
        const editorSettings = document.querySelector('#editor-settings-wrapper');

        const ck5Warning = () => {
          selectMessages.add(Drupal.t('CKEditor 5 is not compatible with Internet Explorer 11. Text fields using CKEditor 5 will still be editable but without the benefits of CKEditor.'), {
            type: 'warning'
          });

          if (isIE11) {
            selectMessages.add(Drupal.t('Text editor toolbar settings are not available. They will be available in any <a href="@supported-browsers">supported browser</a> other than Internet Explorer', {
              '@supported-browsers': 'https://www.drupal.org/docs/system-requirements/browser-requirements'
            }), {
              type: 'error'
            });
            editorSettings.hidden = true;
          }
        };

        const updateWarningStatus = () => {
          if (select.value === 'ckeditor5' && !select.classList.contains('error')) {
            ck5Warning();
          } else {
            editorSettings.hidden = false;
            selectMessages.clear();
          }
        };

        const selectChangeHandler = () => {
          let editorSelectObserver = null;

          function whenSelectAttributeChanges(mutations) {
            for (let i = 0; i < mutations.length; i++) {
              if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'disabled' && !select.disabled) {
                updateWarningStatus();
                editorSelectObserver.disconnect();
              }
            }
          }

          editorSelectObserver = new MutationObserver(whenSelectAttributeChanges);
          editorSelectObserver.observe(select, {
            attributes: true,
            attributeOldValue: true
          });
        };

        updateWarningStatus();
        select.addEventListener('change', selectChangeHandler);
      }
    }
  };
})(Drupal, once, Modernizr);