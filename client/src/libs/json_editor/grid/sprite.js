var used_images = {}


function url(file) {
    var img = '/_common/modules/img/robot/' + file;
    used_images[img] = true;
    return window.__CONFIG__.url_prefix + img;
}


function create(data) {
    var opts = {
        class: 'te-grid-sprite'
    };
    if ('color' in data) {
        opts.css = {
            'background-color': data.color
        }
    } else if ('img' in data) {
        if ('offset' in data) {
            opts.css = {
                'background': 'transparent url(' + url(data.img) + ')',
                'background-position': data.offset + 'px 0',
                'background-size': 'auto 100%'
            };
        } else {
            opts.css = {
                'background': 'transparent url(' + url(data.img) + ')',
                'background-size': '100% 100%'
            };
        }
    }
    return $('<div>', opts);
}


function images() {
    return Object.keys(used_images);
}


function reset() {
    used_images = {}
}


// data: { img: , color: , offset: }
module.exports = {
    create,
    images,
    reset
}