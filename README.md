# Modal box
> A simple utility to display modal box

## Installation

npm --save modal-box

Include the downloaded script in your page.

## Initialization
See example.html for some examples

    // Content can be any HTMLElement, like an iframe for example.
    var content = document.createElement('iframe');
    content.src = [....];
    content.style.width = '1000px';
    content.style.height = '800px';
    
    // Open the modal box with the given content
    Coveo.ModalBox.open(content);
    
    // Close all open modal box
    Coveo.ModalBox.close();

## ModalBox options
    
    // When you create a modal box, you can pass additional options
    var content = createSomeContent();
  
    var modalBox = Coveo.ModalBox.open(content, {
        title : 'This is a title',
        overlayClose : true
    });
  
### fullScreen
Type : `Boolean`
Specify if you wish to open the modal box full screen. Default is `false`. If false, the modal box will fit the size of the content.
    
### titleClose
Type : `Boolean`
Specify that you wish the modal box to close when the user click on the title. Default is `false`.

### overlayClose
Type : `Boolean`
Specify if you wish to close the modal box when the overlay (black background) is clicked. Default is `false`.
 
### className
Type : `string`
Specify that you wish to add a prefix to the class name of the modal box container, to not clash with existing css in the page
    
### button
Type : `number`
Specify the button you wish to create for the modal box.

Possible buttons :

* Coveo.ModalBox.BUTTON.OK 
* Coveo.ModalBox.BUTTON.APPLY 
* Coveo.ModalBox.BUTTON.YES 
* Coveo.ModalBox.BUTTON.NO 
* Coveo.ModalBox.BUTTON.CANCEL

Can use multiple button like so :

    var modalBox = Coveo.ModalBox.open(content, {
        buttons: Coveo.ModalBox.BUTTON.OK | Coveo.ModalBox.BUTTON.APPLY | Coveo.ModalBox.BUTTON.CANCEL
    });

## ModalBox object

When you create a modal box, you receive a modal box object

    var content = createSomeContent();
    
    var modalBox = Coveo.ModalBox.open(content);

### modalBox
Type : `HTMLElement`

The whole modal box HTMLElement (the top most container);

### overlay
Type : `HTMLElement`

The clickable overlay, which can close the modal box if needed.

### wrapper
Type : `HTMLElement`

The wrapper around the the content given to create the modal box

### buttons
Type : `HTMLElement`

The wrapper that contains all the given button to create the modal box

### content
Type : `HTMLElement`

The content that was given to create the modal box

### close
Type : `Function`

The function that you can call to close this instance of the modal box

## Styling
Feel free to override the css with your own stuff, or modify the `src/modalBox.css` file

## Build the project
    
    npm install
    // Gulp globally if you don;t already have it
    npm install -g gulp
    gulp

Generated css + js under `bin/`
