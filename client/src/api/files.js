import { formRequest } from './request'

const upload = (params) => formRequest('files/upload', params)

export default {
    upload
}