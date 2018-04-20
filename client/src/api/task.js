import { jsonRequest } from './request'

const load = (params) => jsonRequest('task/load', params)
const save = (params) => jsonRequest('task/save', params)
const create = (params) => jsonRequest('task/create', params)
const clone = (params) => jsonRequest('task/clone', params)

export default {
    load,
    save,
    create,
    clone
}