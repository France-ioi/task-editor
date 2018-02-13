import { jsonRequest } from './request'

export function readDir(path) {
    return jsonRequest('files/read', { path })
}