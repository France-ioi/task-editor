import { jsonRequest } from './request'

const readDir = (params) => jsonRequest('explorer/read_dir', params)
const createDir = (params) => jsonRequest('explorer/create_dir', params)
const remove = (params) => jsonRequest('explorer/remove', params)

export default {
    readDir,
    createDir,
    remove
}