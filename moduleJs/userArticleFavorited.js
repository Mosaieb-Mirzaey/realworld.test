
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
    let users = await getCurrentUser();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Token " + getToken());


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch("https://conduit.productionready.io/api/profiles/"+authorUrl+"", requestOptions)
}

async function getProfile() {
    try{
        let response = await getProfilePage();
        let result = await response.json();
        profile = result;
        return profile
    } catch (error){
        console.log('error' + error)
    }
}
//   --------------------------  getProfile --------------------------



//#########################################################  Favorited Articles list #############################################################

async function favoriteArticle() {
    await getProfilePage()
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

        return fetch("https://conduit.productionready.io/api/articles?offset=0&limit=20&tag=&favorited="+profile.profile.username+"", requestOptions)

    }
}

async function favoriteList() {
    try {
        let response = await favoriteArticle();
        let result = await response.json();
        listFavorite = result;
        return listFavorite
    } catch (error) {
        console.log('error' + error)
    }
}

//--------------------------------------------------------------  End Favorited Articles list -------------------------------------------------------------------



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

        fetch("https://conduit.productionready.io/api/articles/"+slug+"/favorite", requestOptions)
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

        fetch("https://conduit.productionready.io/api/articles/"+slug+"/favorite", requestOptions)
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
         //   ------------------ End Unfavorite Article deleteButton   -------------------

}

//   ----------------------------    End ArticleFavorites   &   Unfavorite Article     -----------------------------





// ********************************************************************************************************************************



//  ##############################   General Profile   #############################
let c , d;
var numOfFavorArtUser;
var favoriteBtnColorAll;
var listFavorite;
(async function () {
    await getCurrentUser()
    await getProfile();
    if (users.user.username !== ''){
        document.querySelector(".loading").style.display="initial";
        document.querySelector(".profileName1").innerHTML = "<a class='nav-link router-link-exact-active active' href='https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html?author="+users.user.username+"'>"+users.user.username+" </a>";
        let avatar =document.querySelector(".user-img");
        avatar.outerHTML = `<img src="${profile.profile.image}" class="user-img" style="width: 100px; height: 100px">`;
        document.querySelector(".profileName2").textContent = authorUrl;
        document.querySelector(".userInfoP").textContent = profile.profile.bio;
        document.querySelector(".FollowUser").outerHTML = `<a href="https://mosaieb-mirzaey.github.io/realworld.test/html/setting.html" class="btn btn-sm btn-outline-secondary action-btn"><i class="ion-gear-a"></i> Edit Profile Settings</a>`;


        let myArticlesTab =document.querySelector('.myArticlesTab');
        myArticlesTab.innerHTML = `
            <a class="nav-link" href='https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html?author=${profile.profile.username}'>
            My Articles
            </a>`;



        let articlesToggle =document.querySelector('.articles-toggle').nextElementSibling;


//#########################################################  Favorited Articles  #############################################################
        await favoriteList();

            numOfFavorArtUser = Object.entries(listFavorite.articles);
            console.log(listFavorite.articles);
            var favArticleUserNum = numOfFavorArtUser.length;


            //########################  ساختار تکرار برای لیست مقاله های مورد علاقه یوزر  #####################

            for (c = 0 ; c < favArticleUserNum ; c++) {

                //   #################    timeArticleCreated   ###############
                let timeCreated = listFavorite.articles[c].createdAt;
                let format = "yyyy-MM-dd'T'HH:mm:ss+SS:ZZ";
                let time = Date.parse(timeCreated, format);
                let myDate = new Date(time);
                let timeArticle = myDate.toDateString();
                //*************    End timeArticleCreated     *************


                //  ############   favoriteBtnColor    ##############

                favoriteBtnColorAll = listFavorite.articles[c].favorited ? 'btn-primary' : 'btn-outline-primary';

                //  -------------   End favoriteBtnColor  --------------



                articlesToggle.innerHTML += `
                   <div class="article-preview">
                        <div class="article-meta">
                            <a href="https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html" class="router-link-exact-active router-link-active">
                                <img src="${listFavorite.articles[c].author.image}"></a>
                            <div class="info">
                            <a href="https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html?author=${listFavorite.articles[c].author.username}">
                                ${listFavorite.articles[c].author.username}
                            </a>
                            <span class="date">${timeArticle}</span>
                            </div>
                            <button onclick="favoritePost('${listFavorite.articles[c].slug}' , '${c}')" class="btn ${favoriteBtnColorAll} btn-sm pull-xs-right favoriteBtn" ">
                                <i class="ion-heart"></i><span class="counter"> ${listFavorite.articles[c].favoritesCount} </span>
                            </button>
                        </div>
                        <a href="https://mosaieb-mirzaey.github.io/realworld.test/html/articles.html?slug=${listFavorite.articles[c].slug}" class="preview-link">
                            <h1>${listFavorite.articles[c].title}</h1>
                            <p>${listFavorite.articles[c].description}</p>
                            <span>Read more...</span>
                            <ul class="tag-list">
                            </ul>
                        </a>
                   </div> 

        `;


                //  ############   Article Tags    ##############
                let tag = Object.entries(listFavorite.articles[c].tagList);
                let tagList = document.querySelectorAll(".tag-list")[c];
                var listFavoriteINum = c;
                for (d = 0 ; d < tag.length ; d++){
                    var tagHtml = `<li class="tag-default tag-pill tag-outline"><span>${listFavorite.articles[listFavoriteINum].tagList[d]}</span></li>`
                    tagList.innerHTML += tagHtml;
                }
                // -------------   End Article Tags  -------------


            }
            //-------------------------  پایان ساختار تکرار برای لیست مقاله های مورد علاقه یوزر  ----------------------


//--------------------------------------------------------------  End Favorited Articles  -------------------------------------------------------------------


        document.querySelector(".loading").style.display="none";
    }
})();

//   ---------------------------    General Profile    --------------------------------
