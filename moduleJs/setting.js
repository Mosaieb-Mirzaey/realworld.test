import * as utils from "../utils.js";
import * as getUsername from "./getUsername.js";


var infoSetting;
var inputImage = document.querySelector(".inputImage");
var inputUsername = document.querySelector(".inputUsername");
var inputBio = document.querySelector(".inputBio");
var inputEmail = document.querySelector(".inputEmail");
var updateBtn = document.querySelector(".updateBtn");
var logOutBtn = document.querySelector(".logOutBtn");


(async function getUserPage() {
    let users = await getUsername.getCurrentUser();

    if (users.user.username !== ""){
        document.querySelector("#setting > nav > div > ul > li:nth-child(2) > a").innerHTML = `<i class="ion-compose"></i>&nbsp;New Article`;
        document.querySelector("#setting > nav > div > ul > li:nth-child(4)").innerHTML = "<a class='nav-link router-link-exact-active' href='../html/profile.html'>"+users.user.username+" </a>";
        document.querySelector("#profile > div > div.user-info > div > div > div > button");
        inputImage.value = users.user.image;
        inputUsername.value = users.user.username;
        inputBio.value = users.user.bio;
        inputEmail.value = users.user.email;
        document.querySelector("#setting > div > div > div:nth-child(1)").style.display="none";
        logOutBtn.style.display = "initial";
    }

})();


updateBtn.addEventListener('click' , setting);
async function updateSettingPage() {
    let users = await getUsername.getCurrentUser();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Token " + utils.getToken());

    var raw = JSON.stringify({"user":{
                                         "email":inputEmail.value,
                                         "bio":inputBio.value,
                                         "image":inputImage.value
                                     }});

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    alert("Update Success!");
    return  fetch("http://realworld.test/api/user", requestOptions)

}


async function setting() {
    try{
        let response = await updateSettingPage();
        let result = await response.json();
        infoSetting = result;
        // console.log(infoSetting);
        return infoSetting
    } catch (error){
        console.log('error' + error)
    }
}


// ************     logOutBtn      ************
logOutBtn.addEventListener('click' , function () {
    window.localStorage.clear();
    window.location.replace("http://mosaieb.test/index.html");
});
