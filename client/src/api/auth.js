import { jsonRequest } from './request'

const login = (params) => jsonRequest('auth/login', params)

export default {
    login
}