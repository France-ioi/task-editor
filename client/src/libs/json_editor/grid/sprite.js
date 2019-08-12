function url(file) {
    return window.__CONFIG__.blockly.images_url + file;
}


// data: { img: , color: , offset: }
module.exports = function (data) {
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