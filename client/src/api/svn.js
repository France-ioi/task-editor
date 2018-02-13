import { jsonRequest } from './request'

const update = (params) => jsonRequest('svn/update', params)
const add = (params) => jsonRequest('svn/add', params)
const commit = (params) => jsonRequest('svn/commit', params)

export default {
    update,
    add,
    commit
}