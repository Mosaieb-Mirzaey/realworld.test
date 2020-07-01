function getToken() {
    return window.localStorage.getItem('id_token');
}

var users;

async function getUsername() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Token " + getToken());
  return   fetch("http://realworld.test/api/user", {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    });
}

async function getCurrentUser() {
    try {
        let response = await getUsername();
        let result = await response.json();
        users = result;
        return users
    } catch (error) {
        console.log('error' + error)
    }
}
export {getCurrentUser}


