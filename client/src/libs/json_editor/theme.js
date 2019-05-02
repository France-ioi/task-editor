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
    var input = this.getFormInputField('external_preview');
    var exitButton = document.createElement('span');
    exitButton.innerHTML = 'EXIT';
		topContainer.appendChild(input);
    topContainer.appendChild(exitButton);
    topContainer.className = 'external-preview-bar';
    input.setAttribute('readonly', true);
    var el = document.createElement('textarea');
    el.className = 'form-control';
    input.addEventListener('click', function(e) {
      var wholeContainer = container.parentNode.parentNode.parentNode.parentNode.parentNode;
      if (wholeContainer.className.indexOf('array-row-holder') !== -1) {
        for (var child = 0; child < wholeContainer.children.length; child++) {
          var el = wholeContainer.children[child].children[1].children[0].children[1].children[0];
          if (el !== container) {
            el.className = 'external-control';
            var arrayItem = el.parentNode.parentNode.parentNode.parentNode;
            arrayItem.className = arrayItem.className.replace(/\s*not-round/g, '');
          }
        }
        var arrayItem = container.parentNode.parentNode.parentNode.parentNode;
        arrayItem.className += ' not-round';
      }
      container.className = 'external-control active-editor';
    });
    exitButton.addEventListener('click', function(e) {
      container.className = 'external-control';
      var wholeContainer = container.parentNode.parentNode.parentNode.parentNode.parentNode;
      if (wholeContainer.className.indexOf('array-row-holder') !== -1) {
        var arrayItem = container.parentNode.parentNode.parentNode.parentNode;
        arrayItem.className = arrayItem.className.replace(/\s*not-round/g, '');
      }
    });
    container.appendChild(topContainer);
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
  getFormInputField: function(type) {
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
    labelContainer.appendChild(label);
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
    var container = document.createElement('span');
    var el = document.createElement('span');
    el.className = 'array-delete-item glyphicon glyphicon-trash';
    el.setAttribute('aria-hidden', 'true');
    var confirm = document.createElement('span');
    confirm.className = 'array-delete-confirm';
    var okButton = document.createElement('span');
    okButton.className = 'glyphicon glyphicon-ok';
    okButton.setAttribute('aria-hidden', 'true');
    var cancelButton = document.createElement('span');
    cancelButton.className = 'glyphicon glyphicon-remove';
    cancelButton.setAttribute('aria-hidden', 'true');
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
    return container;
  },
  getArrayMoveButton: function() {
    var el = document.createElement('span');
    el.className = 'array-move-item glyphicon glyphicon-option-vertical';
    el.setAttribute('aria-hidden', 'true');
    return el;
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
      var el = document.createElement('span');
      el.className = 'collapse-button glyphicon glyphicon-chevron-up';
      el.setAttribute('aria-hidden', 'true');
      return el;
    }
    var el = this._super(text, icon, title);
    if (text.startsWith('Add ')) {
      var icon = document.createElement('span');
      icon.className = 'add-button glyphicon glyphicon-plus';
      icon.setAttribute('aria-hidden', 'true');
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
  getProgressBar: function() {
    var min = 0, max = 100, start = 0;

    var container = document.createElement('div');
    container.className = 'progress';

    var bar = document.createElement('div');
    bar.className = 'progress-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuenow', start);
    bar.setAttribute('aria-valuemin', min);
    bar.setAttribute('aria-valuenax', max);
    bar.innerHTML = start + "%";
    container.appendChild(bar);

    return container;
  },
  updateProgressBar: function(progressBar, progress) {
    if (!progressBar) return;

    var bar = progressBar.firstChild;
    var percentage = progress + "%";
    bar.setAttribute('aria-valuenow', progress);
    bar.style.width = percentage;
    bar.innerHTML = percentage;
  },
  updateProgressBarUnknown: function(progressBar) {
    if (!progressBar) return;

    var bar = progressBar.firstChild;
    progressBar.className = 'progress progress-striped active';
    bar.removeAttribute('aria-valuenow');
    bar.style.width = '100%';
    bar.innerHTML = '';
  }
});
