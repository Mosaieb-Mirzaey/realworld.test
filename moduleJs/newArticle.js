
function getToken() {
    return window.localStorage.getItem('id_token');
}


let authorUrl;
let currentPage = window.location.href;
let params = new URLSearchParams(currentPage);
let authorParam;
for (authorParam of params) {
    authorUrl = authorParam[1];
}



//   ########################  getProfile  ##########################

var profile;

async function getProfilePage() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Token " + getToken());


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch("http://realworld.test/api/profiles/"+authorUrl, requestOptions)
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






//#########################################################    Publish  Article    #############################################################
let articleInfoPublish;
async function postPublish() {
    console.log(authorParam[1])



    console.log(JSON.stringify(tagText))
    let artTitle = document.querySelector('.artTitle');
    let artDescription = document.querySelector('.artDescription');
    let artBody = document.querySelector('.artBody');
    if (profile.profile.username !== "") {



        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Token " + getToken());
        myHeaders.append("Accept", "application/json");



        var raw = JSON.stringify({"article":{"title":artTitle.value,"description":artDescription.value,"body":artBody.value,"tagList":tagText}});

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };

        return fetch("http://realworld.test/api/articles", requestOptions)

    }
}

async function publishArticle() {
    try {
        let response = await postPublish();
        let result = await response.json();
        articleInfoPublish = result;

        window.location.replace("http://mosaieb.test/html/profile.html?author="+articleInfoPublish.article.author.username+"");
        return articleInfoPublish
    } catch (error) {
        console.log('error' + error)
    }
}
//--------------------------------------------------------------    Publish  Article    -----------------------------------------------------------




//#########################################################    Tag Insert & Remove    #############################################################
function enterTag(event , i){
    let tagLists = document.querySelector(".tag-list");
    if (event.key === "Enter"){
        console.log(i.value)
        event.preventDefault();
        tagLists.innerHTML += `<span class="tag-default tag-pill tagProp"><i onclick="removeTag(event , this)" class="ion-close-round"></i>${i.value}</span>`;
        tagText.push(i.value);
        i.value = "";
    }
}

function removeTag(event , i){
    i.parentElement.remove();
}
//#########################################################    Tag Insert & Remove   #############################################################


//##################  ***************  #######################    General    #######################  ***************  ####################

let tagText = [];

(async function () {
    await getProfile();
    let formEdit = document.querySelector(".formEdit");
    if (profile.profile.username !== '') {
        document.querySelector(".loading").style.display="initial";
        document.querySelector(".profileName1").innerHTML = "<a class='nav-link router-link-exact-active' href='../html/profile.html?author="+profile.profile.username+"'>"+profile.profile.username+" </a>";
        document.querySelector(".newArticle").setAttribute("href","newArticle.html?author="+profile.profile.username+"");

        formEdit.innerHTML = `
                        <fieldset>
                            <fieldset class="form-group">
                                <input type="text" class="form-control form-control-lg artTitle" placeholder="Article Title" value="">
                            </fieldset>
                            <fieldset class="form-group">
                                <input type="text" class="form-control artDescription" placeholder="What's this article about?" value="">
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea class="form-control artBody" rows="8" placeholder="Write your article (in markdown)" value=""></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input onkeypress="enterTag(event, this)" type="text" class="form-control" placeholder="Enter tags" value="">
                                <div class="tag-list" value="">
                                </div>
                            </fieldset>
                            <button onclick="publishArticle()" class="btn btn-lg pull-xs-right btn-primary" type="button">
                                Publish Article
                            </button>
                        </fieldset>
        `;

        document.querySelector(".loading").style.display="none";
    }


})()

//--------------------------------------------------------------    General    -------------------------------------------------------------------

