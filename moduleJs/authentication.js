

// ************     Authentication      ************

function saveToken (token) {
    window.localStorage.setItem('id_token', token);
}

function destroyToken() {
    window.localStorage.removeItem('id_token');
}


var er1;
var a;
let errorMessages = document.querySelector(".error-messages");


document.querySelector(".loginBtn").addEventListener("click" , login);
async function login(event){
    event.preventDefault();
    console.log("ok");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept" , "application/json");

    let emailLogin = document.querySelector(".emailLogin");
    var passLogin = document.querySelector(".passLogin");

    a = passLogin.value;

    var raw = JSON.stringify({"user":{"email": emailLogin.value,"password":passLogin.value}});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://conduit.productionready.io/api/users/login", requestOptions)

        .then(response => {
            return response.json()
        })
        .then(result => {
            er1 = result;
            if (result.user){
                errorMessages.style.display = "none";
                destroyToken();
                saveToken(result.user.token);
                alert('success');
                window.location.replace("http://mosaieb.test/index.html");
            }else {
                errorMessages.innerHTML = `<li>Email or password is invalid!</li>`
            }
        })
        .catch(error => console.log('error', error));
        errorMessages.style.display = "initial";
}



