import { jsonRequest } from './request'

const load = (params) => jsonRequest('task/load', params)
const save = (params) => jsonRequest('task/save', params)

export default {
    load,
    save
}