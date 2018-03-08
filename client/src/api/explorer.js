import { jsonRequest } from './request'

const readDir = (params) => jsonRequest('explorer/read_dir', params)
const createDir = (params) => jsonRequest('explorer/create_dir', params)
const removeDir = (params) => jsonRequest('explorer/remove_dir', params)

export default {
    readDir,
    createDir,
    removeDir
}