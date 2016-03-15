module Coveo.ModalBox {

  /**
   * The button to use when creating a ModalBox
   */
  export enum BUTTON {
    OK = 1,
    APPLY = 2,
    YES = 4,
    NO = 8,
    CANCEL = 16,
  }

  /**
   * Content of a ModalBox
   */
  export interface ModalBox {
    /**
     * The modalBox container itself
     */
    modalBox: HTMLElement;
    /**
     * The overlay added on the body, which can be clicked to close the modalbox
     */
    overlay: HTMLElement;
    /**
     * The wrapper of the content
     */
    wrapper: HTMLElement;
    /**
     * The availables buttons (Ok, Apply, Cancel, etc.)
     */
    buttons: HTMLElement;
    /**
     * The content itself
     */
    content: HTMLElement;
    /**
     * The function that can be called to close the modal box. Note that this is also called by validation button such as APPLY, YES, etc.<br/>
     * Force close will close all open modalbox and skip the validation (if one was provided)
     * @param button
     * @param forceClose
     */
    close: (button?: BUTTON, forceClose?: boolean) => boolean;
  }

  /**
   * Possible options when creating a ModalBox
   */
  export interface Options {
    /**
     * Specify if you wish to open the modal full width and full height
     */
    fullscreen?: boolean;
    /**
     * The string that you want to display over the close button
     */
    titleClose?: boolean;
    /**
     * Specify if you wish to close the modal box when the overlay (black background) is clicked
     */
    overlayClose?: boolean;
    /**
     * Specify that you wish to add a prefix to the class name of the modal box container, to not clash with existing css in the page
     */
    className?: string;
    /**
     * The button you wish to create (Using {@link BUTTON} enum
     */
    buttons?: number;
    /**
     * Specify a validation function, which receives the button that was pressed.<br/>
     * If the validation function return true, the modal box closes, otherwise it stays open
     * @param button
     */
    validation?: (button: BUTTON) => boolean;
    /**
     * Specify the title of the modal box
     */
    title?: string;
    /**
     * Specify the content that you wish to put inside the modal box
     */
    body?:HTMLElement;
  }

  var closeFunctions: { (button?: BUTTON, forceClose?: boolean): boolean }[] = [];

  export function open(content: HTMLElement, options: Options = <Options>{}): ModalBox {
    var body = options.body || document.body;
    body.className = 'coveo-modalBox-opened';

    var modalBox = document.createElement('div');
    modalBox.className = 'coveo-modalBox';
    body.appendChild(modalBox);

    if (options.fullscreen === true) {
      modalBox.className += ' coveo-fullscreen';
    }

    var overlay = document.createElement('div');
    overlay.className = 'coveo-overlay';
    modalBox.appendChild(overlay);

    var wrapper = document.createElement('div');
    wrapper.className = 'coveo-wrapper';
    modalBox.appendChild(wrapper);


    if (options.title != null) {
      var title = document.createElement('div');
      title.className = 'coveo-title';
      wrapper.appendChild(title);
      title.innerHTML = options.title;
      if (options.titleClose === true) {
        title.addEventListener('click', ()=> close());
      }
    }

    content.className += ' coveo-body';
    wrapper.appendChild(content);

    var close = (button: BUTTON = 0, forceClose: boolean = false) => {
      var valid = options.validation == null || options.validation(button);
      if (valid !== false || forceClose) {
        modalBox.parentElement && modalBox.parentElement.removeChild(modalBox);
        var index = closeFunctions.indexOf(close)
        if (index >= 0) {
          closeFunctions.splice(index, 1);
        }
        if (body.querySelector('.coveo-modalBox') != undefined) {
          removeClassName(body, 'coveo-modalBox-opened');
        }
        return true;
      }
      return false;
    };


    var buttonsContainer: HTMLElement;
    var buildButton = (text: string, type: BUTTON) => {
      var btn = document.createElement('div');
      btn.className = 'coveo-button';
      btn.textContent = text;
      btn.addEventListener('click', ()=> buttonClick(type));
      buttonsContainer.appendChild(btn);
    }
    if (options.buttons != null) {
      var buttonClick = (button: BUTTON) => () => close(button);
      buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'coveo-button';
      wrapper.appendChild(buttonsContainer);

      if (options.buttons & BUTTON.OK) {
        buildButton('Ok', BUTTON.OK);
      }
      if (options.buttons & BUTTON.APPLY) {
        buildButton('Apply', BUTTON.APPLY);
      }
      if (options.buttons & BUTTON.YES) {
        buildButton('Yes', BUTTON.YES);
      }
      if (options.buttons & BUTTON.NO) {
        buildButton('No', BUTTON.NO);
      }
      if (options.buttons & BUTTON.CANCEL) {
        buildButton('Cancel', BUTTON.CANCEL);
      }
    }
    closeFunctions.push(close);

    if (options.overlayClose === true) {
      overlay.click(() => close())
    }
    if (options.className != null) {
      modalBox.addClass(options.className)
    }

    return {
      modalBox: modalBox,
      overlay: overlay,
      wrapper: wrapper,
      buttons: buttonsContainer,
      content: content,
      close: close
    }
  }

  export function close(forceClose: boolean = false) {
    var i = 0;
    while (closeFunctions.length > i) {
      var closed = closeFunctions[i](0, forceClose);
      if (!closed) {
        i++;
      }
    }
  }

  function removeClassName(el: HTMLElement, className: string) {
    el.className = el.className.replace(new RegExp(`(^|\\s)${className}(\\s|\\b)`, 'g'), '$1');
  }


}