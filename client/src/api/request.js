function handleResponse(response) {
    if(response.status == 200) {
        return response.json();
    } else if(response.status == 400) {
        return response.text().then(function(text) {
            throw new Error(text);
        });
    } else {
        throw new Error('Bad response from server');
    }
}

export function jsonRequest(path, params) {
    return fetch('/api/' + path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, text/html',
            'Content-Type': 'application/json; charset=utf-8'
        },
        credentials: 'same-origin',
        body: JSON.stringify(params)
    })
    .then(handleResponse)
}


export function formRequest(path, params) {
    if(params instanceof FormData) {
       var body = params;
    } else {
        var body = new FormData();
        for(var k in params) {
            if(params.hasOwnProperty(k)) {
                body.append(k, params[k]);
            }
        }
    }

    return fetch('/api/' + path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json, text/plain, text/html'
        },
        body
    })
    .then(handleResponse);
}