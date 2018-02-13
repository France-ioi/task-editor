export function jsonRequest(path, params) {
    return fetch('/api/' + path, {
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        },
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


export function formRequest(path, form) {
    return fetch('/api/' + path, {
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'Accept': 'application/json',
        },
        body: form
    })
    .then(response => {
        if(response.status >= 400) {
            throw new Error("Bad response from server");
        }
        response.json();
    });
}