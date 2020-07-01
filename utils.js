function getToken() {
    return window.localStorage.getItem('id_token');
}

function saveToken (token) {
    window.localStorage.setItem('id_token', token);
}

function destroyToken() {
    window.localStorage.removeItem('id_token');
}

export {
    getToken,
    saveToken,
    destroyToken
}
