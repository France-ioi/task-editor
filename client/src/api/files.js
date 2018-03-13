import { formRequest, jsonRequest } from './request'

const upload = (params) => formRequest('files/upload', params)
const getContent = (params) => jsonRequest('files/get_content', params)
const setContent = (params) => jsonRequest('files/set_content', params)


export default {
    upload,
    getContent,
    setContent
}