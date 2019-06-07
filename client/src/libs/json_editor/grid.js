var blockly_images_path = '/assets/algorea-training/'

JSONEditor.defaults.editors.grid = JSONEditor.AbstractEditor.extend({

    sanitize: function (value) {
        value = value + "";
        return value.replace(/[^0-9\-]/g, '');
    },

    preBuild: function () {
        this._super();

        // window.console.log("inside prebuild:");
        // window.console.log(this.value);
        this.field_size = 40;
        this.default_value = 1;
    },

    postBuild: function () {
        this._super();
        var self = this;
        $(document).ready(function () {
            $("#" + self.id + "-resizable").resizable({
                grid: self.field_size,
                resize: function (event, ui) {
                    self.input_row.value = ui.size.height / self.field_size;
                    self.input_column.value = ui.size.width / self.field_size;
                    self.input_column.dispatchEvent(new Event('change'));
                    self.input_row.dispatchEvent(new Event('change'));
                }
            });
            if (self.contextBackground != null) {
                $("#" + self.id + "-resizable").css({
                    background: self.contextBackground || '#FFF'
                });
            }
        });
        // this.refreshValue();
        // window.console.log("inside postbuild:");
        // window.console.log(this.value);
        this.setValue({'tiles': [[this.default_value]], 'initItems': [], 'images': []}, true);
    },

    setupWatchListeners: function () {
        this._super();
    },
    onWatchedFieldChange: function () {
        this._super();
        // load itemtypes according to context, getContextParams is available from BLOCKLY_API_URL
        if (typeof getContextParams !== "function" || getContextParams()[this.watched_values.sceneContext] === undefined) return;

        // window.console.log(getContextParams()[this.watched_values.sceneContext].itemTypes);
        this.itemTypes = getContextParams()[this.watched_values.sceneContext].itemTypes;
        this.updateItemTypes(this.itemTypes);

        var el = $('#' + this.id + '-resizable');
        this.resizeGrid({ width: el.width(), height: el.height() });

        this.contextBackground = getContextParams()[this.watched_values.sceneContext].backgroundColor;
        $('#' + this.id + '-resizable').css({
            background: this.contextBackground || 'transparent'
        });
        this.configureItemTypesListeners();

        this.onChange(true);
    },

    updateItemTypes: function (itemTypes) {
        var self = this;
        // window.console.log("updateItemTypes called");
        // window.console.log(itemTypes);
        var itemTypesContainer = '#' + self.id + '-item-types-container';
        $(itemTypesContainer).empty();
        if (itemTypes != null && self.value != null) {
            self.value.images = [{'src': blockly_images_path + "icon.png"}];
        }
        for (var itemType in itemTypes) {
            if (itemTypes[itemType].img != null && self.value != null) {
                // self.value.images.push(itemTypes[itemType].img);
                self.value.images.push({'src': blockly_images_path + itemTypes[itemType].img});
            }
            // window.console.log(itemTypes[itemType]);
            // window.console.log("num:");
            // window.console.log(itemTypes[itemType].num);
            var itemTypeId = itemTypes[itemType].num;
            if (itemTypeId == undefined) {
                for (var state = 0; state <= Math.max(itemTypes[itemType].nbStates / 2 - 1, 0); state++) {
                    var offset = -1 * this.field_size * 2 * state;
                    var $newItemType = $('<div>', {
                        class: 'init-item item-type ' + self.id + '-item-type',
                        css: {
                            'background-image': 'url(' + blockly_images_path + itemTypes[itemType].img + ')',
                            'background-position': offset + 'px 0',
                            'background-size': 'auto 100%'
                        },
                        type: itemType,
                        dir: state
                    });
                    $(itemTypesContainer).append($newItemType);
                }
            } else {
                if (itemTypes[itemType].color) {
                    var css = {
                        'background-color': itemTypes[itemType].color
                    };
                } else {
                    var css = {
                        'background-image': 'url(' + blockly_images_path + itemTypes[itemType].img + ')',
                        'background-size': '100% 100%'
                    };
                }
                var $newItemType = $('<div>', {
                    id: 'itemType' + self.id + '-' + itemTypeId,
                    'item-type-id': itemTypeId,
                    class: 'item-type ' + self.id + '-item-type',
                    css: css
                });
                $(itemTypesContainer).append($newItemType);
            }
        }
        var $newItemType = $('<div>', {
            class: 'item-type del ' + self.id + '-item-type',
            css: {
                'background-image': 'url(' + blockly_images_path + 'delete-64.png)',
                'background-size': '100% 100%'
            }
        });
        $(itemTypesContainer).append($newItemType);
    },


    build: function () {
        this.id = this.path.replace(/\./g, "-");
        var self = this;
        this.header = document.createElement('span');
        this.header.textContent = this.getTitle();
        this.title = this.theme.getHeader(this.header);
        this.container.appendChild(this.title);


        this.input_type = 'text';
        this.input_row = this.theme.getFormInputField(this.input_type);
        this.input_row.value = '1';
        this.input_column = this.theme.getFormInputField(this.input_type);
        this.input_column.value = '1';

        // window.console.log("inside build:");
        // window.console.log(self.value);
        this.input_column.addEventListener('change', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var val = this.value;
            // sanitize value
            var sanitized = self.sanitize(val);
            if (val !== sanitized) {
                this.value = sanitized;
            }

            self.is_dirty = true;
            self.refreshValue();
        });
        this.input_row.addEventListener('change', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var val = this.value;
            // // sanitize value
            var sanitized = self.sanitize(this.value);
            if (val !== sanitized) {
                this.value = sanitized;
            }


            self.is_dirty = true;

            self.refreshValue();
        });


        this.container.appendChild(this.input_row);
        this.container.appendChild(this.input_column);

        // item types html
        var itemTypesContainer = document.createElement('div');
        itemTypesContainer.id = self.id + '-item-types-container';
        itemTypesContainer.classList.add('te-grid-item-types');
        this.container.appendChild(itemTypesContainer);

        // scene editor html
        var wrapper = document.createElement('div');
        wrapper.id = this.id + '-resizable';
        wrapper.classList.add('te-grid-wrapper', 'ui-widget-content');
        var dotsContainer = document.createElement('div');
        dotsContainer.id = this.id + '-dots-container';
        dotsContainer.classList.add('dots-container');
        var list = document.createElement('ul');
        list.classList.add(this.id + '-row1');
        var listItem = document.createElement('li');
        listItem.classList.add('dot');
        list.appendChild(listItem);
        dotsContainer.appendChild(list);
        wrapper.appendChild(dotsContainer);
        this.container.appendChild(wrapper);

    },

    setValue: function (value) {
        // window.console.log("setValue called value:");
        // window.console.log(value);
        // window.console.log("setValue called this.value:");
        // window.console.log(this.value);
        if (value != null) {
            this.value = value;
            this.input_row.value = this.value.tiles.length;
            this.input_column.value = this.value.tiles[0].length;
        }
        this.refreshValue();
        if (this.value != null) {
            for (var row = 0; row < this.value.tiles.length; row++) {
                for (var column = 0; column < this.value.tiles[0].length; column++) {
                    if (this.value.tiles[row][column] == this.default_value) {
                        continue
                    }
                    var itemTypeSelector = '#itemType' + this.id + '-' + this.value.tiles[row][column];
                    var el = $(itemTypeSelector);
                    var src = el.css('background-image');
                    var color = el.css('background-color');
                    var dotsContainerId = this.id + '-dots-container';
                    var itemSelector = '#' + dotsContainerId + ' > ul[data-column=' + column + '] > li[data-row=' + row + ']'
                    $(itemSelector).css({
                        background: src && src !== 'none' ? src : color,
                        borderRadius: '0px'
                    });
                }
            }
            for (var i = 0; i < this.value.initItems.length; i++) {
                var currentItem = {'dir': '', 'src': '', 'type': ''}
                currentItem.type = this.value.initItems[i].type;
                currentItem.src = 'url(' + blockly_images_path + this.itemTypes[currentItem.type].img + ')';
                currentItem.dir = this.value.initItems[i].dir;
                var dotsContainerId = this.id + '-dots-container';
                var column = this.value.initItems[i].col;
                var row = this.value.initItems[i].row;
                var itemSelector = '#' + dotsContainerId + ' > ul[data-column=' + column + '] > li[data-row=' + row + ']';
                this.setUpInitItemImage(currentItem, $(itemSelector));
            }
        }
    },

    refreshValue: function () {
        this._super();
        // window.console.log("refreshvalue called this.value:");
        // window.console.log(this.value);

        if (this.value == null) {
            return;
        }
        var rowNumber = this.value.tiles.length;
        var columnNumber = this.value.tiles[0].length;
        if (rowNumber != this.input_row.value) {
            // add rows until we have as many as needed
            while (this.value.tiles.push(new Array(columnNumber).fill(this.default_value)) < this.input_row.value) {
            }
            // remove rows until we have as many as needed
            while (this.value.tiles.length > this.input_row.value) {
                this.value.tiles.pop();
            }
        }
        if (columnNumber != this.input_column.value) {
            while (this.value.tiles[0].length < this.input_column.value) {
                for (var row = 0; row < this.value.tiles.length; row++) {
                    this.value.tiles[row].push(this.default_value);
                }
            }
            while (this.value.tiles[0].length > this.input_column.value) {
                for (var row = 0; row < this.value.tiles.length; row++) {
                    this.value.tiles[row].pop();
                }
            }
        }

        var self = this;
        var resizableId = '#' + this.id + '-resizable';
        window.jQuery(resizableId).height(self.value.tiles.length * self.field_size + 'px');
        window.jQuery(resizableId).width(self.value.tiles[0].length * self.field_size + 'px');
        self.resizeGrid({width: window.jQuery(resizableId).width(), height: window.jQuery(resizableId).height()});
        self.onChange(true);
    },

    resizeGrid: function (size) {

        var dotClass = this.id + '-dot';

        this.current_item = undefined;
        $("img.item-type.active").toggleClass("active");
        // var dot = ;
        var dots = '';
        for (var i = 0; i < size.height / this.field_size; i++) {
            dots += '<li class="dot empty ' + dotClass + '" data-row="' + i + '"></li>';
        }
        $(this).find('.' + this.id + '-row1').html(dots);
        var grid = '<ul class="' + this.id + '-row1" data-column="0">' + dots + "</ul>";
        for (var i = 1; i < size.width / this.field_size; i++) {
            grid += '<ul data-column="' + i + '">' + dots + "</ul>";
        }
        $('#' + this.id + '-dots-container').html(grid);
        this.addClickListeners();
    },

    configureItemTypesListeners: function () {
        var self = this;
        var itemTypeClass = '.' + self.id + '-item-type';
        $(itemTypeClass).click(function () {
            if ($(this).hasClass('del')) {
                self.current_item = 'del';
            } else {
                self.current_item = { src: '', color: '', num: '', type: null, dir: null };

                //self.current_item.src = $(this).attr("src");
                self.current_item.src = $(this).css('background-image');
                self.current_item.color = $(this).css('background-color');
                self.current_item.num = $(this).attr('item-type-id');
                if ($(this).hasClass('init-item')) {
                    self.current_item.type = $(this).attr('type');
                    self.current_item.dir = parseInt($(this).attr('dir'), 10);
                } else {
                    self.current_item.type = null;
                    self.current_item.dir = null;
                }
            }
            $(itemTypeClass + '.active').toggleClass('active');
            $(this).toggleClass("active");
        });
    },

    setUpInitItemImage: function (currentItem, $dot) {
        var self = this;
        var offset = (currentItem.dir) * 2 * (self.field_size - 10) * -1 + 'px';
        var $characterImage = $('<div>', {
            class: self.id + "-dot-image dot-image",
            type: currentItem.type
        });
        $characterImage.css({
            background: currentItem.src,
            'background-position-x': offset
        })
        $dot.css({
            background: 'inherit'
        })
        $dot.empty();
        $('.' + self.id + '-dot-image[type=' + currentItem.type + ']').each(function () {
            $(this).parent().css({
                background: '',
                borderRadius: ''
            });
            $(this).remove();
        });
        $dot.append($characterImage);
    },

    addClickListeners: function () {
        var self = this;

        $("." + self.id + '-dot').on("click", function (e) {
            if (!self.current_item) return;

            var rowIndex = $(this).attr('data-row');
            var columnIndex = $(this).parent().attr('data-column');

            if (self.current_item === 'del') {
                $(this).css({
                    background: ''
                });
                self.value.tiles[rowIndex][columnIndex] = 0;
            } else if (self.current_item.type != null) {
                self.setUpInitItemImage(self.current_item, $(this));
                for (var i = self.value.initItems.length - 1; i >= 0; --i) {
                    if (self.value.initItems[i].type == self.current_item.type) {
                        self.value.initItems.splice(i, 1);
                    }
                }
                self.value.initItems.push({
                    row: parseInt(rowIndex, 10),
                    col: parseInt(columnIndex, 10),
                    dir: parseInt(self.current_item.dir, 10),
                    type: self.current_item.type
                });
            } else if (self.current_item.num == self.default_value) {
                $(this).css({
                    background: '',
                    borderRadius: ''
                });
                for (var i = self.value.initItems.length - 1; i >= 0; --i) {
                    if (self.value.initItems[i].row == rowIndex && self.value.initItems[i].col == columnIndex) {
                        self.value.initItems.splice(i, 1);
                    }
                }
                self.value.tiles[rowIndex][columnIndex] = self.default_value;
            } else {
                var background = self.current_item.src && self.current_item.src != 'none' ? self.current_item.src : self.current_item.color;
                $(this).css({
                    background: background,
                    borderRadius: '0px'
                });
                self.value.tiles[rowIndex][columnIndex] = parseInt(self.current_item.num, 10);
            }
            self.onChange(true);
        });
    }

});
