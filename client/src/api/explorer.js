import { jsonRequest } from './request'

const readDir = (params) => jsonRequest('explorer/dir', params)

export default {
    readDir
}