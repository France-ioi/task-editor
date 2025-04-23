import { jsonRequest } from './request'

const load = (params) => jsonRequest('task/load', params)
const save = (params) => jsonRequest('task/save', params)
const saveRecursivelyDir = (params) => jsonRequest('task/save_recursively_dir', params)
const create = (params) => jsonRequest('task/create', params)
const clone = (params) => jsonRequest('task/clone', params)

export default {
    load,
    save,
    saveRecursivelyDir,
    create,
    clone
}