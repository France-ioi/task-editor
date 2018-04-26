import { jsonRequest } from './request'

const login = (params) => jsonRequest('auth/login', params)
const logout = (params) => jsonRequest('auth/logout', params)

export default {
    login,
    logout
}