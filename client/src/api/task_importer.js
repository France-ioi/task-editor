import { jsonRequest } from './request'

const getUrl = (params) => jsonRequest('task/importer', params)

export default {
    getUrl
}
