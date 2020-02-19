import Toolbar from './grid/toolbar';
import Display from './grid/display';
import Sprite from './grid/sprite';

var field_size = 40;

JSONEditor.defaults.editors.grid = JSONEditor.AbstractEditor.extend({

    sanitize: function (value) {
        value = value + "";
        return value.replace(/[^0-9\-]/g, '');
    },

    preBuild: function () {
        this._super();
        this.itemTypes = {};
    },


    postBuild: function () {
        this._super();
        this.setValue({'tiles': [[0,0,0,0],[0,0,0,0],[0,0,0,0]], 'initItems': [], 'images': []}, true);
    },


    setupWatchListeners: function () {
        this._super();
    },

    onWatchedFieldChange: function () {
        this._super();
        Sprite.setContext(this.watched_values.sceneContext);
        // load itemtypes according to context, quickAlgoRobotGetGridOptions is available from _common/modules/pemFioi/blocklyRobot_lib-dev.js
        if (typeof quickAlgoRobotGetGridOptions !== "function") return;
        var itemTypes = quickAlgoRobotGetGridOptions(this.watched_values.sceneContext, 'itemTypes');
        if(!itemTypes) return;
        this.itemTypes = itemTypes || {};
        this.toolbar.setItemTypes(this.itemTypes);
        this.display.setItemTypes(this.itemTypes);
        this.display.render(this.value);

        //TODO: clear scene?
        /*
        this.contextBackground = getContextParams()[this.watched_values.sceneContext].backgroundColor;
        $('#' + this.id + '-resizable').css({
            background: this.contextBackground || 'transparent'
        });
        */
        //this.onChange(true);
    },



    build: function () {
        this.id = this.path.replace(/\./g, "-");
        var self = this;
        var wrapper = document.createElement('div');
        if(this.schema.description) {
            this.description = this.theme.getFormInputDescription(this.schema.description);
        }
        this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
        this.container.appendChild(
            this.theme.getFormControl(
                this.header,
                wrapper,
                this.description
            )
        );

        // item types toolbar
        this.toolbar = new Toolbar({
            parent: wrapper,
            field_size: field_size
        });

        // display
        this.display = new Display({
            parent: wrapper,
            field_size: field_size,
            onCellClick: this.onCellClick.bind(this),
            onResize: this.onResize.bind(this)
        });
    },


    onResize: function (w, h) {
        if (this.value.tiles.length == h && this.value.tiles[0].length == w) return;
        // filter initItems by position
        this.value.initItems = this.value.initItems.filter(function(item) {
            return item.col < w && item.row < h;
        });
        // expand height
        while (this.value.tiles.length < h) {
            this.value.tiles.push(new Array(w).fill(0));
        }
        // reduce height
        if (this.value.tiles.length > h) {
            this.value.tiles = this.value.tiles.slice(0, h);
        }
        for (var i = 0; i < this.value.tiles.length; i++) {
            if (this.value.tiles[i].length < w) {
                // expand width
                this.value.tiles[i] = this.value.tiles[i].concat(new Array(w - this.value.tiles[i].length).fill(0));
            } else if (this.value.tiles[i].length > w) {
                // reduce width
                this.value.tiles[i] = this.value.tiles[i].slice(0, w);
            }
        }
        this.display.render(this.value);
        this.onChange(true);
    },


    onCellClick: function (col, row) {
        var item = this.toolbar.activeItem();
        if (item == 'clear') {
            var initItems = this.value.initItems.filter(function(item) {
                return item.col !== col || item.row !== row;
            });
            if (initItems.length !== this.value.initItems.length) {
                // clear initItems first
                this.value.initItems = initItems;
            } else {
                // clear bg next
                this.value.tiles[row][col] = 0;
            }
        } else if (item.type) {
            this.value.initItems = this.value.initItems.filter(function(item2) {
                return item2.type != item.type;
            });
            this.value.initItems.push({
                col: col,
                row: row,
                type: item.type,
                dir: item.dir
            });
        } else if (item.num) {
            this.value.tiles[row][col] = item.num;
        }
        this.display.render(this.value);
        this.value.images = this.display.getUsedImages();
        this.onChange(true);
    },


    setValue: function (value) {
        if (value != null) {
            this.value = value;
        }
        if (this.value != null) {
            this.display.render(this.value);
        }
    }

});