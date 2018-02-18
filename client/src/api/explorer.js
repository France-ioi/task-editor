import { jsonRequest } from './request'

function addDefaults(params) {
    return Object.assign({
        files: false,
        folders: true
    }, params)
}

const readDir = (params) => jsonRequest('explorer/read_dir', addDefaults(params))
const createDir = (params) => jsonRequest('explorer/create_dir', addDefaults(params))
const removeDir = (params) => jsonRequest('explorer/remove_dir', addDefaults(params))

export default {
    readDir,
    createDir,
    removeDir
}