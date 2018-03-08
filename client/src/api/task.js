import { jsonRequest } from './request'

const load = (params) => jsonRequest('task/load', params)
const save = (params) => jsonRequest('task/save', params)
const create = (params) => jsonRequest('task/create', params)

export default {
    load,
    save,
    create
}