var params = new URLSearchParams(window.location.search)
var token = params.get('token')
var session = params.get('session')
var create = params.get('create') || false



function validate() {
    var res = {
        valid: true,
        message: 'Ok'
    }

    var missed = [];
    if(token === null) {
        missed.push('token')
    }
    if(session === null) {
        missed.push('session')
    }    
    if(missed.length) {
        res.valid = false;
        res.message = 'Error. Params missed: ' + missed.join(', ') + '. Pass required params in URL query string.';
    }
    return res;
}


module.exports = {
    token,
    session,
    create,
    validate
}