JSONEditor.defaults.themes.taskeditor = JSONEditor.AbstractTheme.extend({
  getSelectInput: function(options) {
    var el = this._super(options);
    el.className += 'form-control';
    //el.style.width = 'auto';
    return el;
  },
  setGridColumnSize: function(el,size) {
    el.className = 'col-md-'+size;
  },
  afterInputReady: function(input) {
    if(input.controlgroup) return;
    input.controlgroup = this.closest(input,'.form-group');
    if(this.closest(input,'.compact')) {
      input.controlgroup.style.marginBottom = 0;
    }

    // TODO: use bootstrap slider
  },
  getTextareaInput: function() {
    var el = document.createElement('textarea');
    el.className = 'form-control';
    return el;
  },
  getExternalInput: function() {
	  var container = document.createElement('div');
    container.className = 'external-control';
    var topContainer = document.createElement('div');
    var wysiwygTitle = document.createElement('div');
    wysiwygTitle.className = 'wysiwyg-title';
    wysiwygTitle.innerHTML = 'WYSIWYG Editor';
    var exitButton = document.createElement('span');
    exitButton.innerHTML = 'EXIT';
		topContainer.appendChild(wysiwygTitle);
    topContainer.appendChild(exitButton);
    topContainer.className = 'external-preview-bar';
    var el = this.getTextareaInput();
    container.appendChild(topContainer);
    var preview = document.createElement('div');
    preview.className = 'wysiwyg-preview';
    container.appendChild(preview);
		container.appendChild(el);
    return el;
  },
  getBoolean: function(names) {
    var container = this.getButtonHolder();
    container.className += ' boolean-group';
    var noButton = this.getButton(names[0]);
    var yesButton = this.getButton(names[1]);
    noButton.className += ' round-btn';
    yesButton.className += ' round-btn';
    container.appendChild(noButton);
    container.appendChild(yesButton);
    return container;
  },
  getRangeInput: function(min, max, step) {
    // TODO: use better slider
    return this._super(min, max, step);
  },
  getIcon: function(name) {
    var el = document.createElement('span');
    el.className = 'glyphicon glyphicon-'+ name;
    el.setAttribute('aria-hidden', 'true');
    return el;
  },
  getFileView: function() {
    var container = document.createElement('div');
    container.className = 'file-container';
    var nameContainer = document.createElement('div');
    nameContainer.className = 'file-name-container';
    var fileBar = document.createElement('div');
    fileBar.className = 'file-bar';
    fileBar.appendChild(nameContainer);
    var thumbnail = document.createElement('img');
    thumbnail.className = 'file-thumbnail';
    fileBar.appendChild(thumbnail);
    var exitButton = document.createElement('span');
    exitButton.innerHTML = 'EXIT';
    fileBar.appendChild(exitButton);
    container.appendChild(fileBar);

    var preview = document.createElement('div');
    preview.className = 'file-preview';
    container.appendChild(preview);
    var filename = this.getFormInputField('text').parentNode;
    var openIcon = this.getIcon('folder-open');
    openIcon.className += ' open-new-file';
    filename.appendChild(openIcon);
    preview.appendChild(filename);
    var filesize = document.createElement('div');
    filesize.className = 'file-size';
    var filesizeTitle = document.createElement('span');
    filesizeTitle.innerHTML = 'File size';
    var filesizeValue = document.createElement('span');
    filesizeValue.innerHTML = 'Unknown';
    filesize.appendChild(filesizeTitle);
    filesize.appendChild(filesizeValue);
    preview.appendChild(filesize);
    var fileEditor = this.getTextareaInput();
    fileEditor.className += ' file-editor';
    preview.appendChild(fileEditor);
    var imagePreview = document.createElement('div');
    imagePreview.className = 'image-preview';
    var image = document.createElement('img');
    imagePreview.appendChild(image);
    preview.appendChild(imagePreview);

    container.appendChild(this.getFileUploader());

    return container;
  },
  getFileUploader: function() {
    var uploader = document.createElement('div');
    uploader.className = 'file-uploader';

    var dropHere = document.createElement('div');

    var dropHereIcon = this.getIcon('open');
    var dropHereText = document.createElement('span');
    dropHereText.innerHTML = 'DROP YOUR FILES HERE';
    dropHere.appendChild(dropHereIcon);
    dropHere.appendChild(dropHereText);
    uploader.appendChild(dropHere);

    var selectFile = this.getButton('OR SELECT FILES');
    selectFile.className += ' round-btn';
    var selectIcon = this.getIcon('folder-open');
    selectFile.insertBefore(selectIcon, selectFile.firstChild);
    var byEditor = this.getButton('OR BY EDITOR');
    byEditor.className += ' round-btn';
    var addIcon = this.getIcon('plus');
    byEditor.insertBefore(addIcon, byEditor.firstChild);

    uploader.appendChild(selectFile);
    uploader.appendChild(byEditor);

    var dragEvents = ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'];
    for (var i = 0; i < dragEvents.length; i++) {
      uploader.addEventListener(dragEvents[i], (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }

    var dragInEvents = ['dragover', 'dragenter'];
    for (var i = 0; i < dragInEvents.length; i++) {
      uploader.addEventListener(dragInEvents[i], (e) => {
        uploader.className += ' is-dragging';
      });
    }

    var dragOutEvents = ['dragleave', 'dragend', 'drop'];
    for (var i = 0; i < dragOutEvents.length; i++) {
      uploader.addEventListener(dragOutEvents[i], (e) => {
        uploader.className = uploader.className.replace(/\s*is-dragging/g,'');
      });
    }

    return uploader;
  },
  getFieldSectionControl: function(section) {
    var container = document.createElement('div');
    container.className = 'section-control ' + section;
    var iconContainer = document.createElement('div');
    iconContainer.className = 'icon';
    var icon = this.getIcon('eye-open');
    iconContainer.appendChild(icon);
    container.appendChild(iconContainer);
    var text = document.createElement('span');
    text.innerHTML = 'HIDE ' + section.toUpperCase() + ' PARAMETERS';
    container.appendChild(text);
    return container;
  },
  getMultiField: function(label, sw) {
    var container = document.createElement('div');
    label.className += ' control-label';
    container.className = 'multi-type-container';
    container.appendChild(label);
    container.appendChild(sw);
    return container;
  },
  getFormInputField: function(type, icon) {
    var el = this._super(type);
    if(type !== 'checkbox') {
      el.className += 'form-control';
    }
    if (type !== 'text') return el;
    var container = document.createElement('div');
    container.className = 'input-field-container';
    var labelContainer = document.createElement('div');
    labelContainer.className = 'input-label-container';
    var label = document.createElement('span');
    label.innerHTML = 'Aa';
    if (icon === 'integer') {
      label.innerHTML = '123';
      label.style.left = '6px';
    }
    labelContainer.appendChild(label);
    labelContainer.addEventListener('click', function() {
      el.focus();
    });
    container.appendChild(labelContainer);
    container.appendChild(el);
    return el;
  },
  getFormControl: function(label, input, description) {
    var group = document.createElement('div');
    group.className = 'field-container';

    if(label && input.type === 'checkbox') {
      group.className += ' checkbox';
      label.appendChild(input);
      label.style.fontSize = '14px';
      group.style.marginTop = '0';
      group.appendChild(label);
      input.style.position = 'relative';
      input.style.cssFloat = 'left';
      if(description) group.appendChild(description);
    }
    else {
      group.className += ' form-group';
      var leftGroup = document.createElement('div');
      leftGroup.className = 'form-left-group';
      var rightGroup = document.createElement('div');
      rightGroup.className = 'form-right-group';
      if(label) {
        label.className += ' control-label';
        leftGroup.appendChild(label);
      }
      if(description) leftGroup.appendChild(description);
      if (input.parentNode) {
        rightGroup.appendChild(input.parentNode);
      } else {
        rightGroup.appendChild(input);
      }
      group.appendChild(leftGroup);
      group.appendChild(rightGroup);
    }

    return group;
  },
  getArrayItemContainer: function() {
    var el = document.createElement('div');
    return el;
  },
  getArrayDeleteButton: function() {
    var iconContainer = document.createElement('span');
    iconContainer.className = 'array-icon delete';
    var container = document.createElement('span');
    container.className = 'array-delete-container';
    var el = this.getIcon('trash');
    el.className += ' array-delete-item';
    var confirm = document.createElement('span');
    confirm.className = 'array-delete-confirm';
    var okButton = this.getIcon('ok');
    var cancelButton = this.getIcon('remove');
    el.addEventListener('click', function() {
      confirm.style.display = 'inline';
    });
    cancelButton.addEventListener('click', function() {
      confirm.style.display = 'none';
    });
    confirm.appendChild(okButton);
    confirm.appendChild(cancelButton);
    container.appendChild(el);
    container.appendChild(confirm);
    iconContainer.appendChild(container);
    return iconContainer;
  },
  getArrayMoveButton: function() {
    var iconContainer = document.createElement('span');
    iconContainer.className = 'array-icon move';
    var el = this.getIcon('option-vertical');
    el.className += ' array-move-item';
    iconContainer.appendChild(el);
    return iconContainer;
  },
  getIndentedPanel: function() {
    var el = document.createElement('div');
    el.className = 'indented-panel well well-sm';
    return el;
  },
  getFormInputDescription: function(text) {
    var el = document.createElement('p');
    el.className = 'help-block';
    el.innerHTML = text;
    return el;
  },
  getHeader: function(text) {
    var container = document.createElement('div');
    container.className = 'header-container';
    var el = document.createElement('h3');
    if(typeof text === "string") {
      el.textContent = text;
    }
    else {
      el.appendChild(text);
    }
    el.style.margin = '0';
    el.style.display = 'inline-block';
    container.appendChild(el)

    return container;
  },
  getDescription: function(text) {
    var container = document.createElement('div');
    container.className = 'description-container';
    var el = document.createElement('p');
    el.innerHTML = text;
    container.appendChild(el)
    return container;
  },
  getGridContainer: function() {
    var el = document.createElement('div');
    return el;
  },
  getGridRow: function() {
    var el = document.createElement('div');
    el.className = 'row';
    return el;
  },
  getGridColumn: function() {
    var el = document.createElement('div');
    return el;
  },
  getHeaderButtonHolder: function() {
    var el = this.getButtonHolder();
    el.style.float = 'right';
    return el;
  },
  getButtonHolder: function() {
    var el = document.createElement('div');
    el.className = 'btn-group';
    return el;
  },
  getButton: function(text, icon, title) {
    if (text == 'Collapse') {
      var el = this.getIcon('chevron-up');
      el.className += ' collapse-button';
      return el;
    }
    var el = this._super(text, icon, title);
    if (text.startsWith('Add ')) {
      var icon = this.getIcon('plus');
      icon.className += ' add-button';
      el.insertBefore(icon, el.firstChild);
    }
    el.className += 'btn btn-default';
    return el;
  },
  setButtonText: function(button, text, icon, title) {
    if (button.nodeName == 'SPAN') {
      var updown = (text == 'Collapse') ? 'up' : 'down'
      button.className = 'collapse-button glyphicon glyphicon-chevron-' + updown;
      return;
    }
    while (button.firstChild) {
      button.removeChild(button.firstChild);
    }
    if(icon) {
      button.appendChild(icon);
      text = ' ' + text;
    }
    var spanEl = document.createElement('span');
    spanEl.appendChild(document.createTextNode(text));
    button.appendChild(spanEl);
    if(title) button.setAttribute('title',title);
  },
  getTable: function() {
    var el = document.createElement('table');
    el.className = 'table table-bordered';
    el.style.width = 'auto';
    el.style.maxWidth = 'none';
    return el;
  },
  addInputError: function(input, text) {
    if(!input.controlgroup) return;
    input.controlgroup.className += ' has-error';
    if(!input.errmsg) {
      input.errmsg = document.createElement('p');
      input.errmsg.className = 'help-block errormsg';
      input.controlgroup.lastChild.appendChild(input.errmsg);
    }
    else {
      input.errmsg.style.display = '';
    }

    input.errmsg.textContent = text;
  },
  removeInputError: function(input) {
    if(!input.errmsg) return;
    input.errmsg.style.display = 'none';
    input.controlgroup.className = input.controlgroup.className.replace(/\s?has-error/g,'');
  },
  getTabHolder: function() {
    var el = document.createElement('div');
    el.innerHTML = "<div class='tabs list-group col-md-2'></div><div class='col-md-10'></div>";
    el.className = 'rows tab-holder';
    return el;
  },
  getTab: function(text) {
    var el = document.createElement('a');
    el.className = 'list-group-item';
    el.setAttribute('href','#');
    el.appendChild(text);
    return el;
  },
  markTabActive: function(tab) {
    tab.className += ' active';
  },
  markTabInactive: function(tab) {
    tab.className = tab.className.replace(/\s?active/g,'');
  },
  getProgressBar: function(title) {
    var min = 0, max = 100, start = 0;

    var container = document.createElement('div');
    container.className = 'progress';

    var bar = document.createElement('div');
    bar.className = 'progress-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuenow', start);
    bar.setAttribute('aria-valuemin', min);
    bar.setAttribute('aria-valuenax', max);
    container.appendChild(bar);

    var titleContainer = document.createElement('div');
    titleContainer.innerHTML = title || '';
    titleContainer.className = 'progress-title';
    container.appendChild(titleContainer);

    var percentage = document.createElement('div');
    percentage.className = 'percentage';
    percentage.innerHTML = start + '%';
    container.appendChild(percentage);

    return container;
  },
  updateProgressBar: function(progressBar, progress) {
    if (!progressBar) return;

    var bar = progressBar.firstChild;
    var percentage = progress + "%";
    bar.setAttribute('aria-valuenow', progress);
    bar.style.width = percentage;
    progressBar.lastChild.innerHTML = percentage;
  },
  updateProgressBarUnknown: function(progressBar) {
    if (!progressBar) return;

    var bar = progressBar.firstChild;
    progressBar.className = 'progress progress-striped active';
    bar.removeAttribute('aria-valuenow');
    bar.style.width = '100%';
    progressBar.lastChild.innerHTML = '';
  }
});
