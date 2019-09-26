module.exports = function(data) {
    var res = [];

    for (var i = 0; i < data.difficulties.length; i++) {
        for (var j = 0; j < data.difficulties[i].scene.images.length; j++) {
            res.push(data.difficulties[i].scene.images[j].src);
        }
    }

    return res.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    });

};