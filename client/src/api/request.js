export function jsonRequest(path, params) {
    return fetch('/api/' + path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
        credentials: 'same-origin',
        body: JSON.stringify(params)
    })
    .then(response => {
        if(response.status == 200) {
            return response.json();
        } else if(response.status == 400) {
            throw new Error(response.body);
        } else {
            throw new Error("Bad response from server");
        }
    });
}


export function formRequest(path, params) {
    var body = new FormData();
    for(var k in params) {
        if(params.hasOwnProperty(k)) {
            body.append(k, params[k]);
        }
    }

    return fetch('/api/' + path, {
        method: 'POST',
        credentials: 'same-origin',
        body
    })
    .then(response => {
        if(response.status == 200) {
            return response.json();
        } else if(response.status == 400) {
            throw new Error(response.body || 'Server error');
        } else {
            throw new Error("Bad response from server");
        }
    });
}