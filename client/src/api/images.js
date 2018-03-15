import { formRequest, jsonRequest } from './request'

const upload = (params) => formRequest('images/upload', params)
const search = (params) => jsonRequest('images/search', params)

export default {
    upload,
    search
}