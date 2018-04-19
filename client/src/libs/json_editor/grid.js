JSONEditor.defaults.editors.grid = JSONEditor.AbstractEditor.extend({

    sanitize: function (value) {
        value = value + "";
        return value.replace(/[^0-9\-]/g, '');
    },

    preBuild: function () {
        this.field_size = 40;
    },

    postBuild: function () {
        this._super();
        var self = this;
        $(document).ready(function () {
            $("#resizable").resizable({
                grid: 40,
                resize: function (event, ui) {
                    self.input_row.value = ui.size.height / self.field_size;
                    self.input_column.value = ui.size.width / self.field_size;
                    self.input_column.dispatchEvent(new Event('change'));
                    self.input_row.dispatchEvent(new Event('change'));
                }
            });
        });

    },

    setupWatchListeners: function () {
        this._super();
    },
    onWatchedFieldChange: function () {
        this._super();

        // load itemtypes according to context, getContextParams is available from BLOCKLY_API_URL
        if (typeof getContextParams === "function") {
            if (getContextParams()[this.watched_values.sceneContext] != undefined) {
                window.console.log(getContextParams()[this.watched_values.sceneContext].itemTypes);
                this.updateItemTypes(getContextParams()[this.watched_values.sceneContext].itemTypes);
                this.configureItemTypesListeners();
            }
        }
    },

    updateItemTypes: function (itemTypes) {
        window.console.log("updateItemTypes called");
        window.console.log(itemTypes);
        $("#itemTypesContainer").empty();
        for (var itemType in itemTypes) {
            window.console.log(itemTypes[itemType]);
            window.console.log("num:");
            window.console.log(itemTypes[itemType].num);
            var itemTypeId = itemTypes[itemType].num;
            if (itemTypeId == undefined) {
                itemTypeId = 0;
            }
            var $newItemType = $("<img>", {
                id: "itemType" + itemTypeId,
                src: window.__CONFIG__.blockly.images_url + itemTypes[itemType].img,
                alt: itemTypes[itemType].img,
                "item-type-id": itemTypeId,
                class: "item-type"
            });
            if (itemTypes[itemType].color != undefined) {
                $newItemType.css.color = itemTypes[itemType].color;
                window.console.log($newItemType.css);
            }
            $("#itemTypesContainer").append($newItemType);
        }
    },

    build: function () {

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
        this.value = [[0]];

        window.console.log(self);
        this.input_column.addEventListener('change', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // don't allow changing if this field is a template
            // if (self.schema.template) {
            //     this.value = self.value[0].length;
            //     return;
            // }

            var val = this.value;

            // sanitize value
            var sanitized = self.sanitize(val);
            if (val !== sanitized) {
                this.value = sanitized;
            }

            self.is_dirty = true;

            window.console.log("column number changed")

            self.refreshValue();
        });
        this.input_row.addEventListener('change', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // don't allow changing if this field is a template
            // if (self.schema.template) {
            //     this.value = self.value[0].length;
            //     return;
            // }

            // // sanitize value
            // var sanitized = self.sanitize(val);
            // if (val !== sanitized) {
            //     this.value = sanitized;
            // }


            self.is_dirty = true;

            self.refreshValue();
        });


        this.container.appendChild(this.input_row);
        this.container.appendChild(this.input_column);

        // item types html
        var itemTypesContainer = document.createElement('div');
        itemTypesContainer.id = 'itemTypesContainer';
        this.container.appendChild(itemTypesContainer);

        // scene editor html
        var wrapper = document.createElement('div');
        wrapper.id = 'resizable';
        wrapper.classList.add('wrapper', 'ui-widget-content');
        var dotsContainer = document.createElement('div');
        dotsContainer.id = 'dots-container';
        var list = document.createElement('ul');
        list.classList.add('row1');
        var listItem = document.createElement('li');
        listItem.classList.add('dot');
        list.appendChild(listItem);
        dotsContainer.appendChild(list);
        wrapper.appendChild(dotsContainer);
        this.container.appendChild(wrapper);

    },

    refreshValue: function () {
        this._super();

        this.value = [[0]];
        var rowNumber = this.value.length;
        var columnNumber = this.value[0].length;
        window.console.log(rowNumber)
        window.console.log(this.input_row.value)
        if (rowNumber != this.input_row.value) {
            // add rows until we have as many as needed
            while (this.value.push(new Array(columnNumber).fill(0)) < this.input_row.value) {
            }
            // remove rows until we have as many as needed
            while (this.value.length > this.input_row.value) {
                this.value.pop();
            }
        }
        if (columnNumber != this.input_column.value) {
            while (this.value[0].length < this.input_column.value) {
                for (var row = 0; row < this.value.length; row++) {
                    this.value[row].push(0);
                }
            }
            while (this.value[0].length > this.input_column.value) {
                for (var row = 0; row < this.value.length; row++) {
                    this.value[row].pop();
                }
            }
        }

        window.jQuery('#resizable').height(this.value.length * this.field_size + 'px');
        window.jQuery('#resizable').width(this.value[0].length * this.field_size + 'px');
        this.resizeGrid({width: window.jQuery('#resizable').width(), height: window.jQuery('#resizable').height()});
        this.onChange(true);
    },

    resizeGrid: function (size) {

        this.current_item = undefined;
        $("img.item-type.active").toggleClass("active");
        // var dot = ;
        var dots = '';
        for (var i = 0; i < size.height / this.field_size; i++) {
            dots += '<li class="dot empty" data-row="' + i + '"></li>';
        }
        $(this).find('.row1').html(dots);
        var grid = '<ul class="row1" data-column="0">' + dots + "</ul>";
        for (var i = 1; i < size.width / this.field_size; i++) {
            grid += '<ul data-column="' + i + '">' + dots + "</ul>";
        }
        $('#dots-container').html(grid);
        this.addClickListeners();
    },

    configureItemTypesListeners: function () {
        var self = this;

        $('img.item-type').click(function () {
            if (self.current_item == undefined) {
                self.current_item = {src: "", num: ""};
            }
            window.console.log("item type")
            window.console.log(this.className);
            window.console.log(this);
            window.console.log(this.src);
            window.console.log($(this).attr("src"));
            window.console.log($(this).attr("item-type-id"));
            self.current_item.src = $(this).attr("src");
            self.current_item.num = $(this).attr("item-type-id");
            $('img.item-type.active').toggleClass("active");
            $(this).toggleClass("active");
        });
    },

    addClickListeners: function () {
        var self = this;

        $(".dot").on("mousedown mouseover", function (e) {
            if (e.buttons == 1 && self.current_item != undefined) {
                var rowIndex = $(this).attr('data-row');
                var columnIndex = $(this).parent().attr('data-column');

                $(this).css({
                    background: 'url(' + self.current_item.src + ")",
                    borderRadius: '0px'
                });
                self.value[rowIndex][columnIndex] = parseInt(self.current_item.num);
                self.onChange(true);
            }
        });
    }

});
