var data = {}

module.exports = {

    getFolders: function(username) {
        return data[username] || []
    },


    setFolders: function(username, list) {
        data[username] = list
    },


    granted: function(username, dir) {
        var first = dir.split('/')[0];
        return this.getFolders(username).find(user_dir => {
            return user_dir == first;
        }) !== undefined;
    }

}