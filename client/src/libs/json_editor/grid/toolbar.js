import Sprite from './sprite';

module.exports = function (params) {

    var container = $('<div class="te-grid-toolbar"></div>');
    $(params.parent).append(container);


    var active_item = null;
    function unselect() {
        container.find('.item-type').removeClass('active');
        active_item = null;
    }




    function renderColorItem(data) {
        var btn = $('<div class="item-type"></div>');
        btn.click(function() {
            unselect();
            $(this).addClass('active');
            active_item = {
                img: null,
                offset: 0,
                color: data.color,
                num: data.num,
                type: null,
                dir: null
            };
        });
        btn.append(
            Sprite.create({
                color: data.color
            })
        );
        container.append(btn);
    }


    function renderImageItem(data) {
        var btn = $('<div class="item-type"></div>');
        btn.click(function() {
            unselect();
            $(this).addClass('active');
            active_item = {
                img: data.img,
                offset: 0,
                color: null,
                num: data.num,
                type: null,
                dir: null
            };
        });
        btn.append(
            Sprite.create({
                img: data.img
            })
        );
        container.append(btn);
    }



    function renderInitItem(data, type) {
        for (var state = 0; state <= Math.max(data.nbStates / 2 - 1, 0); state++) {
            var offset = -1 * params.field_size * 2 * state;
            var btn = $('<div class="item-type"></div>');
            btn.click(
                (function(btn, offset, state) {
                    return function() {
                        unselect();
                        $(btn).addClass('active');
                        active_item = {
                            img: data.img,
                            offset: offset,
                            color: null,
                            num: null,
                            type: type,
                            dir: data.nbStates > 1 ? state : undefined
                        };
                    };
                })(btn, offset, state)
            );
            btn.append(
                Sprite.create({
                    img: data.img,
                    offset: offset
                })
            );
            container.append(btn);
        }
    }


    function renderCommandItem(cmd, img) {
        var btn = $('<div class="item-type"></div>');
        btn.click(function() {
            unselect();
            $(this).addClass('active');
            active_item = cmd;
        });
        btn.append(
            Sprite.create({
                img: img
            })
        );
        container.append(btn);
    }


    return {

        setItemTypes: function (itemTypes) {
            container.empty();
            for (var itemType in itemTypes) {
                if (itemTypes[itemType].num === undefined) {
                    renderInitItem(itemTypes[itemType], itemType);
                } else if (itemTypes[itemType].color) {
                    renderColorItem(itemTypes[itemType]);
                } else if (itemTypes[itemType].img) {
                    renderImageItem(itemTypes[itemType]);
                }
            }
            renderColorItem({
                color: '#FFF',
                num: 1
            });
            renderCommandItem('clear', 'delete-64.png');
        },


        reset: function() {
            unselect();
        },


        activeItem: function() {
            return active_item;
        },


        destroy: function() {
            container.remove();
        }
    };
}