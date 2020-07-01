

// ************     Registration      ************

let er1;
let errorMessages = document.querySelector(".error-messages");
const signUpBtn = document.querySelector('.signUpBtn');
var nameReg = document.querySelector('.nameReg');
var emailReg = document.querySelector('.emailReg');
var passReg = document.querySelector('.passReg');


signUpBtn.addEventListener("click" , signUpEr);

function signUp() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    var raw = JSON.stringify({"user":{"username":nameReg.value,"email":emailReg.value,"password":passReg.value}});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("http://realworld.test/api/users", requestOptions)

}

async function signUpEr(event) {
    try{
        event.preventDefault()
        let response = await signUp();
        let result = await response.json();
        console.log(result);
        if (result.user == result.user){
            alert(result.user.username);
            alert("account is created successful!");
            window.location.replace("http://mosaieb.test/html/Authentication.html");
        }else {
            console.log(result.errors);
            er1 = result;
            errorMessages.style.display = "initial";
            if (Object.values(er1)[0].email == "has already been taken." && Object.values(er1)[0].username == "has already been taken."){
                errorMessages.innerHTML = `<li>Email has already been taken.</li><li>Username has already been taken.</li>`
            } else if (Object.values(er1)[0].email == "has already been taken."){
                errorMessages.innerHTML = `<li>Email has already been taken.</li>`
            }else if (Object.values(er1)[0].username == "has already been taken.") {
                errorMessages.innerHTML = `<li>Username has already been taken.</li>`
            }

        }

    } catch (error){
        console.log('error', error);
    }
}

