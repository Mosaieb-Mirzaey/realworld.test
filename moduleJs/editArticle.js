
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


//   ########################  getProfile  ##########################

var profile;
var articleInfo;

async function getProfilePage() {
    let users = await getCurrentUser();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Token " + getToken());


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch("https://conduit.productionready.io/api/profiles/"+users.user.username, requestOptions)
}

async function getProfile() {
    try{
        let response = await getProfilePage();
        let result = await response.json();
        profile = result;
        console.log(profile);
        return profile
    } catch (error){
        console.log('error' + error)
    }
}
//   --------------------------  getProfile --------------------------

let slugUrl;
let currentPage = window.location.href;
let params = new URLSearchParams(currentPage);
let slugParam;
for (slugParam of params) {
    slugUrl = slugParam[1];
}




//#########################################################  Get Article Target  #############################################################

async function getArticleTarget() {
    let users = await getCurrentUser();
    if (users.user.username !== "") {


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Token " + getToken());
        myHeaders.append("Accept", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return fetch("https://conduit.productionready.io/api/articles/"+slugUrl+"", requestOptions)

    }
}

async function getArticle() {
    try {
        let response = await getArticleTarget();
        let result = await response.json();
        articleInfo = result;
        console.log(articleInfo)
        return articleInfo
    } catch (error) {
        console.log('error' + error)
    }
}
//--------------------------------------------------------------  End Get Article Target -------------------------------------------------------------------




//#########################################################    Update  Article    #############################################################
let articleInfoUpdate;
async function putUpdate() {
    console.log(slugParam[1])



    console.log(JSON.stringify(tagText))
    let artTitle = document.querySelector('.artTitle');
    let artDescription = document.querySelector('.artDescription');
    let artBody = document.querySelector('.artBody');
    let users = await getCurrentUser();
    if (users.user.username !== "") {



        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Token " + getToken());
        myHeaders.append("Accept", "application/json");

        var raw = JSON.stringify({"article":{"title":artTitle.value,"description":artDescription.value,"body":artBody.value}});

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
        };


        return fetch("https://conduit.productionready.io/api/articles/"+slugParam[1]+"", requestOptions)

    }
}

async function updateArticle() {
    try {
        let response = await putUpdate();
        let result = await response.json();
        articleInfoUpdate = result;

        window.location.replace("https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html?author="+articleInfoUpdate.article.author.username+"");
        return articleInfoUpdate
    } catch (error) {
        console.log('error' + error)
    }
}
//--------------------------------------------------------------    Update  Article    -----------------------------------------------------------


//#########################################################    Tag Insert    #############################################################
function enterTag(event , i){
    if (event.key === "Enter"){

        event.preventDefault();
        tagLists.innerHTML += `<span class="tag-default tag-pill tagProp"><i class="ion-close-round"></i>${i.value}</span>`;
        tagText.push(i.value);
        i.value = "";
    }
}


//#########################################################    Tag Insert    #############################################################


//##################  ***************  #######################    General    #######################  ***************  ####################
let tagLists;
let tagHtml , tagProp;
let tagText = [];

(async function () {
    await getProfile();
    await getArticle();
    let formEdit = document.querySelector(".formEdit");
    if (profile.profile.username !== '') {
        document.querySelector(".loading").style.display="initial";
        document.querySelector(".profileName1").innerHTML = "<a class='nav-link router-link-exact-active' href='https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html?author="+profile.profile.username+"'>"+profile.profile.username+" </a>";


        formEdit.innerHTML = `
                        <fieldset>
                            <fieldset class="form-group">
                                <input type="text" class="form-control form-control-lg artTitle" placeholder="Article Title" value="${articleInfo.article.title}">
                            </fieldset>
                            <fieldset class="form-group">
                                <input type="text" class="form-control artDescription" placeholder="What's this article about?" value="${articleInfo.article.description}">
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea class="form-control artBody" rows="8" placeholder="Write your article (in markdown)" value="">${articleInfo.article.body}</textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input onkeypress="enterTag(event, this)" type="text" class="form-control" placeholder="Enter tags" value="">
                                <div class="tag-list" value="">

                                </div>
                            </fieldset>
                            <button onclick="updateArticle()" class="btn btn-lg pull-xs-right btn-primary" type="button">
                                Update Article
                            </button>
                        </fieldset>
        `;


        //  ############   Article Tags    ##############
        tagLists = document.querySelector(".tag-list");
        let tag = Object.entries(articleInfo.article.tagList);
        for (let iTag = 0 ; iTag < tag.length ; iTag++){
            tagHtml = `<span class="tag-default tag-pill tagProp"><i class="ion-close-round"></i>${articleInfo.article.tagList[iTag]}</span>`;
            tagLists.innerHTML += tagHtml;
        }
        // -------------   End Article Tags  -------------

        tagProp = document.querySelectorAll(".tagProp");
        tagProp.forEach(function(item){
            tagText.push(item.textContent);
        })
        console.log(tagText);


        document.querySelector(".loading").style.display="none";
    }


})()

//--------------------------------------------------------------    General    -------------------------------------------------------------------

