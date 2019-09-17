import Sprite from './sprite';

var max_grid_size = 11;

module.exports = function (params) {

    var cell_size = params.field_size + 1;

    var container = $('<div class="te-grid-display"></div>');
    $(params.parent).append(container);

    container.resizable({
        grid: [cell_size, cell_size],
        maxHeight: max_grid_size * cell_size,
        maxWidth: max_grid_size * cell_size,
        resize: function(event, ui) {
            params.onResize(Math.floor(ui.size.width / cell_size) || 1, Math.floor(ui.size.height / cell_size) || 1);
        }
    });


    var backgrounds = [];
    var init_items = [];
    var width = 1;
    var cells = [];

    function resize(w, h) {
        container.width(w * cell_size).height(h * cell_size);
        width = w;
        var size = w * h;
        if (size > cells.length) {
            var num = cells.length;
            do {
                var cell = $('<div class="grid-cell"></div>');
                cell.click((function () {
                    var num = cells.length;
                    return function () {
                        params.onCellClick(num % width, ~~(num / width));
                    }
                })());
                cells.push(cell);
                container.append(cell);
            } while (size > cells.length);
        } else if (size < cells.length) {
            do {
                var cell = cells.pop();
                cell.remove();
            } while (size < cells.length);
        }
    }

    function renderBackground(tiles) {
        resize(tiles[0].length, tiles.length);
        var n = 0, b;
        for (var i = 0; i < tiles.length; i++) {
            for (var j = 0; j < tiles[i].length; j++) {
                cells[n].empty();
                if (b = backgrounds[tiles[i][j]]) {
                    cells[n].append(b.clone());
                }
                n++;
            }
        }
    }

    function renderInitItems(items) {
        var n, s;
        for (var i = 0; i < items.length; i++) {
            if (init_items[items[i].type] && (s = init_items[items[i].type][items[i].dir])) {
                n = width * items[i].row + items[i].col;
                cells[n].append(s.clone());
            }
        }
    }


    return {
        setItemTypes: function(types) {
            backgrounds = [];
            backgrounds[1] = Sprite.create({
                color: '#FFF'
            });
            init_items = {};
            for (var type in types) {
                var data = types[type];
                if (data.num === undefined) {
                    init_items[type] = [];
                    for (var state = 0; state <= Math.max(data.nbStates / 2 - 1, 0); state++) {
                        init_items[type][state] = Sprite.create({
                            img: data.img,
                            offset: -1 * params.field_size * 2 * state
                        });
                    }
                } else if (data.color) {
                    backgrounds[data.num] = Sprite.create({
                        color: data.color
                    });
                } else if (data.img) {
                    backgrounds[data.num] = Sprite.create({
                        img: data.img
                    });
                }
            }
        },

        render: function (data) {
            if (!data) return;
            renderBackground(data.tiles);
            renderInitItems(data.initItems);
        },

        destroy: function() {
            container.remove();
        }
    };
}