
function getToken() {
    return window.localStorage.getItem('id_token');
}

var users;
var numOfArticleUser;


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

let authorUrl;
let currentPage = window.location.href;
let params = new URLSearchParams(currentPage);
let authorParam;
for (authorParam of params) {
     console.log(authorParam[1]);
     authorUrl = authorParam[1];
 }

//   ########################  getProfile  ##########################

var profile;
var listArticleInfo;

async function getProfilePage() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Token " + getToken());


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch("http://realworld.test/api/profiles/"+authorUrl+"", requestOptions)
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



//   ##########################  List Articles  ############################

async function listArticle() {
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

        return fetch("http://realworld.test/api/articles?offset=0&limit=20&tag=&favorited=&author="+authorUrl+"", requestOptions)

    }
}


async function setting() {
    try {
        let response = await listArticle();
        let result = await response.json();
        listArticleInfo = result;
        console.log(listArticleInfo)
        return listArticleInfo
    } catch (error) {
        console.log('error' + error)
    }
}
//  ------------------------  End List Articles   --------------------------




//   ##########################   ArticleFavorites   &   Unfavorite Article  ########################
let newCount;
function favoritePost(slug , btnI) {
    var favorBtn = document.querySelectorAll('.favoriteBtn')[btnI];


    //   ####################   ArticleFavorites PostButton  ##################
    if (favorBtn.classList.contains("btn-outline-primary")){

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Token " + getToken());
        myHeaders.append("Accept", "application/json");



        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://realworld.test/api/articles/"+slug+"/favorite", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);

                favorBtn.classList.remove("btn-outline-primary");
                favorBtn.classList.add("btn-primary");
                let firstCount = favorBtn.lastElementChild;
                newCount = Number(favorBtn.lastElementChild.textContent) + 1 ;
                firstCount.textContent =" " + newCount + " ";

                console.log(favorBtn)

            })
            .catch(error => console.log('error', error));


        //   ------------------  End ArticleFavorites PostButton   -------------------

    }else if (favorBtn.classList.contains("btn-primary")) {

        //   ####################   Unfavorite Article deleteButton  ##################

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Token " + getToken());
        myHeaders.append("Accept", "application/json");

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("http://realworld.test/api/articles/"+slug+"/favorite", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                favorBtn.classList.remove("btn-primary");
                favorBtn.classList.add("btn-outline-primary");
                let firstCount = favorBtn.lastElementChild;
                newCount = Number(favorBtn.lastElementChild.textContent) - 1 ;
                firstCount.textContent =" " + newCount + " ";
            })
            .catch(error => console.log('error', error));


    }
    //   ------------------  Unfavorite Article deleteButton   -------------------

}

//   ----------------------------    ArticleFavorites   &   Unfavorite Article     -----------------------------





// ********************************************************************************************************************************



//  ##############################   General Profile   #############################
let i , b;
var favoriteBtnColorUser;
let followUser = document.querySelector(".FollowUser");

(async function () {
    await getCurrentUser();
    await getProfile();
    await setting();

    if (users.user.username !== ''){


        if (users.user.username == profile.profile.username){

            document.querySelector(".loading").style.display="initial";
            document.querySelector(".profileName1").innerHTML = "<a class='nav-link router-link-exact-active active' href='../html/profile.html?author="+users.user.username+"'>"+users.user.username+" </a>";
            document.querySelector(".newArticle").setAttribute("href","newArticle.html?author="+users.user.username+"");
            let avatar =document.querySelector(".user-img");
            avatar.outerHTML = `<img src="${profile.profile.image}" class="user-img" style="width: 100px; height: 100px">`;
            document.querySelector(".profileName2").textContent = profile.profile.username;
            document.querySelector(".userInfoP").textContent = profile.profile.bio;
            document.querySelector(".FollowUser").outerHTML = `<a href="../html/setting.html" class="btn btn-sm btn-outline-secondary action-btn"><i class="ion-gear-a"></i> Edit Profile Settings</a>`;

        }else {
            document.querySelector(".loading").style.display="initial";
            document.querySelector(".profileName1").innerHTML = "<a class='nav-link router-link-exact-active' href='../html/profile.html?author="+users.user.username+"'>"+users.user.username+" </a>";


            let avatar =document.querySelector(".user-img");
            avatar.outerHTML = `<img src="${profile.profile.image}" class="user-img" style="width: 100px; height: 100px">`;
            document.querySelector(".profileName2").textContent = profile.profile.username;
            document.querySelector(".userInfoP").textContent = profile.profile.bio;
            followUser.outerHTML = `
                    <a href="../html/setting.html" class="btn btn-sm btn-outline-secondary action-btn FollowUser">
                    <i class="ion-plus-round"></i>
                    &nbsp;Follow Eric Simons
                    </a>`;
        }

        let favoriteArticlesTab =document.querySelector('.favoriteArticlesTab');
        favoriteArticlesTab.innerHTML = `
        <a class="nav-link favoriteArticles" href="../html/userArticleFavorited.html?author=${authorUrl}">
        Favorited Articles
        </a>`;



        let articlesToggle =document.querySelector('.articles-toggle').nextElementSibling;


        numOfArticleUser = Object.entries(listArticleInfo.articles);

        console.log(numOfArticleUser);

        var articleCount = numOfArticleUser.length;



        //########################  ساختار تکرار برای My Articles  #####################

        for (i = 0 ; i < articleCount ; i++) {

            //   #################    timeArticleCreated   ###############
            let timeCreated = listArticleInfo.articles[i].createdAt;
            let format = "yyyy-MM-dd'T'HH:mm:ss+SS:ZZ";
            let time = Date.parse(timeCreated, format);
            let myDate = new Date(time);
            let timeArticle = myDate.toDateString();
            //*************    End timeArticleCreated     *************


            //  ############   favoriteBtnColor    ##############

            favoriteBtnColorUser = listArticleInfo.articles[i].favorited ? 'btn-primary' : 'btn-outline-primary';

            //  -------------   End favoriteBtnColor  --------------



            articlesToggle.innerHTML += `
                   <div class="article-preview">
                        <div class="article-meta">
                            <a href="http://mosaieb.test/html/profile.html?author=${listArticleInfo.articles[i].author.username}" class="router-link-exact-active router-link-active">
                                <img src="${listArticleInfo.articles[i].author.image}"></a>
                            <div class="info">
                            <a href="http://mosaieb.test/html/profile.html?author=${listArticleInfo.articles[i].author.username}">
                                ${listArticleInfo.articles[i].author.username}
                            </a>
                            <span class="date">${timeArticle}</span>
                            </div>
                            <button onclick="favoritePost('${listArticleInfo.articles[i].slug}' , '${i}')" class="btn ${favoriteBtnColorUser} btn-sm pull-xs-right favoriteBtn" ">
                                <i class="ion-heart"></i><span class="counter"> ${listArticleInfo.articles[i].favoritesCount} </span>
                            </button>
                        </div>
                        <a href="../html/articles.html?slug=${listArticleInfo.articles[i].slug}" class="preview-link">
                            <h1>${listArticleInfo.articles[i].title}</h1>
                            <p>${listArticleInfo.articles[i].description}</p>
                            <span>Read more...</span>
                            <ul class="tag-list">
                            </ul>
                        </a>
                        
                   </div> 

        `;


            //  ############   Article Tags    ##############
            let tag = Object.entries(listArticleInfo.articles[i].tagList);
            let tagList = document.querySelectorAll(".tag-list")[i];
            var articleINum = i;
            for (b = 0 ; b < tag.length ; b++){
                var tagHtml = `<li class="tag-default tag-pill tag-outline"><span>${listArticleInfo.articles[articleINum].tagList[b]}</span></li>`
                tagList.innerHTML += tagHtml;
            }
            // -------------   End Article Tags  -------------


        }
        //-------------------------  پایان ساختار تکرار برای My Articles  ----------------------


        document.querySelector(".loading").style.display="none";

    }

})();

//   ---------------------------    General Profile    --------------------------------
