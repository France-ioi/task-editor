function url(path) {
    if(path.indexOf('http') === 0) {
        return path;
    }
    return '/api/' + path;
}

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
    return fetch(
        url(path),
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, text/html',
                'Content-Type': 'application/json; charset=utf-8'
            },
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify(params)
        }
    )
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

    return fetch(
        url(path),
        {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Accept': 'application/json, text/plain, text/html'
            },
            body
        }
    )
    .then(handleResponse);
}