import { formRequest } from './request'

const defaults = {
    action:	'checkoutSvn',
    localeEn: 'gb',
    noimport: 'false',
    recursive: 'false',
    theme: 'none',
    //svnUrl:
    //token:
}


const checkoutSvn = (params) => {
    const importer_params = Object.assign({}, defaults, {
        svnUrl: params.path,
        token: params.token
    });
    const url = window.__CONFIG__.task_importer.url + 'savesvn.php';
    return formRequest(url, importer_params)
}

export default {
    checkoutSvn
}