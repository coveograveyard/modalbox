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
     * Specify if you wish to open the modal box full screen. Default is `false`. If false, the modal box will fit the size of the content.
     */
    fullscreen?: boolean;
    /**
     * Specify that you wish the modal box to close when the user click on the title. Default is `false`.
     */
    titleClose?: boolean;
    /**
     * Specify if you wish to close the modal box when the overlay (black background) is clicked. Default is `false`.
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
    /**
     * The size for the modal box
     */
    sizeMod: 'small' | 'normal' | 'big'
  }

  var closeFunctions: { (button?: BUTTON, forceClose?: boolean): boolean }[] = [];

  /**
   * Open a modal box with the given content
   * @param content The content to display, as an HTMLElement
   * @param options The {@link Options} to use for this modal box
   * @returns {{modalBox: (HTMLDivElement|HTMLElement), overlay: (HTMLDivElement|HTMLElement), wrapper: (HTMLDivElement|HTMLElement), buttons: HTMLElement, content: HTMLElement, close: (function(BUTTON=, boolean=): (boolean|boolean))}}
   */
  export function open(content: HTMLElement, options: Options = <Options>{}): ModalBox {
    var body = options.body || document.body;

    if(body.className) {
      if (body.className.indexOf('coveo-modal-opened') == -1) {
        body.className += ' coveo-modal-opened';
      }
    } else {
      body.className = 'coveo-modal-opened';
    }

    var modalBox = document.createElement('div');
    modalBox.className = 'coveo-modal-container coveo-opened ';
    if (options.sizeMod == 'small') {
      modalBox.className += ' coveo-mod-small';
    }

    if (options.sizeMod == 'big') {
      modalBox.className += ' coveo-mod-big';
    }
    setTimeout(()=> {
      modalBox.className += ' coveo-mod-fade-in-scale';
    }, 0)
    body.appendChild(modalBox);
    if (options.fullscreen === true) {
      modalBox.className += ' coveo-fullscreen';
    }

    var overlay = document.createElement('div');
    overlay.className = 'coveo-modal-backdrop coveo-modal-transparent';
    body.appendChild(overlay);
    setTimeout(()=> {
      removeClassName(overlay, 'coveo-modal-transparent');
    }, 0);


    var modalBoxContent = document.createElement('div');
    modalBoxContent.className = 'coveo-modal-content';
    modalBox.appendChild(modalBoxContent);

    var close = (button: BUTTON = 0, forceClose: boolean = false) => {
      var valid = options.validation == null || options.validation(button);
      if (valid !== false || forceClose) {
        modalBox.parentElement && modalBox.parentElement.removeChild(modalBox);
        var index = closeFunctions.indexOf(close)
        if (index >= 0) {
          closeFunctions.splice(index, 1);
        }
        if (body.querySelector('.coveo-modal-container') == null) {
          removeClassName(body, 'coveo-modal-opened');
        }
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
        return true;
      }
      return false;
    };

    var {header, closeIcon} = buildHeader(options, close);
    modalBoxContent.appendChild(header);

    modalBoxContent.appendChild(buildBody(options, content));


    closeIcon.addEventListener('click', ()=> {
      close()
    });

    overlay.addEventListener('click', ()=> {
      close();
    });

    let closeOnEscape = (e)=> {
      if (e.keyCode == 27 && body.className.indexOf('coveo-modal-opened') != -1) {
        close();
        document.removeEventListener('keyup', closeOnEscape);
      }
    };

    document.addEventListener('keyup', closeOnEscape);


    var buttonsContainer: HTMLElement;
    var buildButton = (text: string, type: BUTTON) => {
      var btn = document.createElement('button');
      btn.className = 'coveo-btn';
      btn.textContent = text;
      btn.addEventListener('click', ()=> close(type));
      buttonsContainer.appendChild(btn);
    }
    if (options.buttons != null) {
      buttonsContainer = document.createElement('footer');
      buttonsContainer.className = 'coveo-modal-footer';
      modalBoxContent.appendChild(buttonsContainer);

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

    if (options.className != null) {
      modalBox.className += ' ' + options.className;
    }

    return {
      modalBox: modalBox,
      wrapper: modalBoxContent,
      buttons: buttonsContainer,
      content: modalBoxContent,
      overlay: overlay,
      close: close
    }
  }

  /**
   * Close all open modal box instance
   * @param forceClose Will skip validation
   */
  export function close(forceClose: boolean = false) {
    var i = 0;
    while (closeFunctions.length > i) {
      var closed = closeFunctions[i](0, forceClose);
      if (!closed) {
        i++;
      }
    }
  }

  function buildHeader(options: Options, close: Function) {
    var header = document.createElement('header');
    header.className = 'coveo-modal-header';

    if (options.title != null) {
      var title = document.createElement('h1');
      header.appendChild(title);
      title.innerHTML = options.title;
      if (options.titleClose === true) {
        title.addEventListener('click', ()=> close());
      }
    }

    var closeIcon = document.createElement('span');
    closeIcon.className = 'coveo-small-close';
    header.appendChild(closeIcon);

    var svgCloseIcon = `<svg viewBox="0 0 22 22" class="coveo-icon coveo-fill-pure-white">
                    <g transform="matrix(.7071-.7071.7071.7071-3.142 11)">
                        <path d="m9-3.4h2v26.9h-2z"></path>
                        <path d="m-3.4 9h26.9v2h-26.9z"></path>
                    </g>
                </svg>`;

    closeIcon.innerHTML = svgCloseIcon;

    return {
      header: header,
      closeIcon: closeIcon
    }

  }

  function buildBody(options: Options, content: HTMLElement) {
    var modalBoxBody = document.createElement('div');
    modalBoxBody.className = 'coveo-modal-body coveo-mod-header-paddding coveo-mod-form-top-bottom-padding';
    modalBoxBody.appendChild(content);
    return modalBoxBody;
  }

  function removeClassName(el: HTMLElement, className: string) {
    el.className = el.className.replace(new RegExp(`(^|\\s)${className}(\\s|\\b)`, 'g'), '$1');
  }
}
