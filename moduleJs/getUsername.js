import * as utils from '../utils.js';

var users;



    async function getUsername() {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Token " + utils.getToken());
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

