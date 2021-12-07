var context = '';

function setContext(ctx) {
    context = ctx;
}

function url(file) {
    return window.__CONFIG__.url_prefix + '/v01/_common/modules/pemFioi/robot/images/' + file;
}


function create(data) {
    var opts = {
        class: 'te-grid-sprite'
    };
    var grid_img = false;
    if ('color' in data) {
        opts.css = {
            'background-color': data.color
        }
    } else if ('img' in data) {
        grid_img = context + '/' + data.img;
        if ('offset' in data) {
            opts.css = {
                'background': 'transparent url(' + url(grid_img) + ')',
                'background-position': data.offset + 'px 0',
                'background-size': 'auto 100%'
            };
        } else {
            opts.css = {
                'background': 'transparent url(' + url(grid_img) + ')',
                'background-size': '100% 100%'
            };
        }
    } else if('img_url' in data) {
        opts.css = {
            'background': 'transparent url(' + data.img_url + ')',
            'background-size': '100% 100%'
        };
    }
    var el = $('<div>', opts);
    el.grid_img = grid_img;
    return el;
}


// data: { img: , color: , offset: }
module.exports = {
    setContext,
    create
}