import Sprite from './sprite';

var max_grid_size = 32;
var cell_sizes = [20, 40];


module.exports = function (params) {

    var used_images = {};
    var backgrounds = [];
    var init_items = {};
    var cells = [];


    // init container
    var container = $('<div></div>');
    $(params.parent).append(container);


    // cell size
    var cell_size;

    function setCellSize(level) {
        cell_size = cell_sizes[level] + 1;
        container.attr('class', 'te-grid-display te-grid-display-size-' + level);
        try {
            container.resizable('destroy');
        } catch(e) {}
        container.resizable({
            grid: [cell_size, cell_size],
            maxHeight: max_grid_size * cell_size,
            maxWidth: max_grid_size * cell_size,
            resize: function(event, ui) {
                params.onResize(Math.floor(ui.size.width / cell_size) || 1, Math.floor(ui.size.height / cell_size) || 1);
            }
        });
        refreshConteinerSize();
    }
    setCellSize(1);



    // mouse events
    var mouse_pressed = false;

    container.mouseleave(function() {
        mouse_pressed = false;
    });

    function createCellClickHandler(num) {
        return function() {
            params.onCellClick(num % width, ~~(num / width));
        }
    }

    function createCellEnterHandler(num) {
        return function() {
            if(mouse_pressed) {
                params.onCellClick(num % width, ~~(num / width));
            }
        }
    }

    function initCellEvents(cell, num) {
        cell.click(createCellClickHandler(num));
        cell.mousedown(function() {
            mouse_pressed = true;
        });
        cell.mouseup(function() {
            mouse_pressed = false;
        });
        cell.mouseenter(createCellEnterHandler(num));
    }




    var width = null;
    var height = null;
    function refreshConteinerSize(new_width, new_height) {
        if(new_width && new_height) {
            width = new_width;
            height = new_height;
        }
        if(width !== null) {
            container.width(width * cell_size).height(height * cell_size);
        }
    }

    function resize(w, h) {
        refreshConteinerSize(w, h)
        var size = w * h;
        if (size > cells.length) {
            var num = cells.length;
            do {
                var cell = $('<div class="grid-cell"></div>');
                initCellEvents(cell, cells.length);
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



    // render
    function renderBackground(tiles) {
        resize(tiles[0].length, tiles.length);
        var n = 0, b;
        for (var i = 0; i < tiles.length; i++) {
            for (var j = 0; j < tiles[i].length; j++) {
                cells[n].empty();
                if (b = backgrounds[tiles[i][j]]) {
                    if(b.grid_img) {
                        used_images[b.grid_img] = true;
                    }
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
                if(s.grid_img) {
                    used_images[s.grid_img] = true;
                }
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
                    init_items[type] = {};
                    for (var state = 0; state <= Math.max(data.nbStates / 2 - 1, 0); state++) {
                        init_items[type][data.nbStates > 1 ? state : undefined] = Sprite.create({
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
            used_images = {};
            renderBackground(data.tiles);
            renderInitItems(data.initItems);
        },

        destroy: function() {
            container.remove();
        },

        getUsedImages: function() {
            return Object.keys(used_images);
        },

        setZoom: function(level) {
            setCellSize(level);
        }
    };
}