
function getToken() {
    return window.localStorage.getItem('id_token');
}

var users;

async function getUsername() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Token " + getToken());
    return   fetch("https://conduit.productionready.io/api/user", {
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

var infoSetting;
var inputImage = document.querySelector(".inputImage");
var inputUsername = document.querySelector(".inputUsername");
var inputBio = document.querySelector(".inputBio");
var inputEmail = document.querySelector(".inputEmail");
var updateBtn = document.querySelector(".updateBtn");
var logOutBtn = document.querySelector(".logOutBtn");


(async function getUserPage() {
    let users = await getCurrentUser();

    if (users.user.username !== ""){
        document.querySelector("#setting > nav > div > ul > li:nth-child(2)").innerHTML = "<a class='nav-link' href='https://mosaieb-mirzaey.github.io/realworld.test/html/newArticle.html?author="+users.user.username+"'><i class='ion-compose'></i>&nbsp;New Article</a>";
        document.querySelector("#setting > nav > div > ul > li:nth-child(4)").innerHTML = "<a class='nav-link router-link-exact-active' href='https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html?author="+users.user.username+"'>"+users.user.username+" </a>";
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
    let users = await getCurrentUser();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Token " + getToken());

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
    return  fetch("https://conduit.productionready.io/api/user", requestOptions)

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
    window.location.replace("https://mosaieb-mirzaey.github.io/realworld.test?page=1");
});
