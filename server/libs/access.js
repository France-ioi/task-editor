var data = {}

module.exports = {

    getFolders: function(username) {
        return data[username] || []
    },


    setFolders: function(username, list) {
        data[username] = list
    },


    filter: function(username, list) {
        //TODO
    }

}