
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

    return fetch("http://realworld.test/api/profiles/"+users.user.username, requestOptions)
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



// //   ##########################  List Articles  ############################
//
// async function listArticle() {
//     let users = await getCurrentUser();
//     if (users.user.username !== "") {
//
//         var myHeaders = new Headers();
//         myHeaders.append("Content-Type", "application/json");
//         myHeaders.append("Authorization", "Token " + getToken());
//         myHeaders.append("Accept", "application/json");
//
//         var requestOptions = {
//             method: 'GET',
//             headers: myHeaders,
//         };
//
//         return fetch("http://realworld.test/api/articles?offset=0&limit=20&tag=&favorited=&author="+users.user.username+"", requestOptions)
//
//     }
// }
//
// async function setting() {
//     try {
//         let response = await listArticle();
//         let result = await response.json();
//         listArticleInfo = result;
//         console.log(listArticleInfo)
//         return listArticleInfo
//     } catch (error) {
//         console.log('error' + error)
//     }
// }
//
// setting();
// //  ------------------------  End List Articles   --------------------------




//#########################################################  Get Article Target  #############################################################
let slugParam;
async function getArticleTarget() {
    let users = await getCurrentUser();
    if (users.user.username !== "") {

        let currentPage = window.location.href;
        let params = new URLSearchParams(currentPage);
        for (slugParam of params) {
            console.log(slugParam)
        }


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Token " + getToken());
        myHeaders.append("Accept", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return fetch("http://realworld.test//api/articles/"+slugParam[1]+"", requestOptions)

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



(async function () {
    await getProfile();
    await getArticle();
    if (profile.profile.username !== '') {
        document.querySelector(".loading").style.display="initial";
        document.querySelector(".profileName1").innerHTML = "<a class='nav-link router-link-exact-active active' href='../html/profile.html'>"+profile.profile.username+" </a>";

        <!--    *************       articles-detail user    **************-->

        let articleDetailUser = document.querySelector("#articleDetailUser");
        if (articleInfo.article.author.username == profile.profile.username){
            articleDetailUser.innerHTML = `
                    <div class="banner">
            <div class="container">
                <h1>${articleInfo.article.title}</h1>
                <div class="article-meta">
                    <a href="../html/profile.html" class="">
                        <img src="${articleInfo.article.author.image}">
                    </a>
                    <div class="info">
                        <a href="" class="author">tectonic</a>
                        <span class="date">June 22, 2020</span>
                    </div>
                    <span>
                        <a href="#/editor/front-1" class="btn btn-sm btn-outline-secondary">
                            <i class="ion-edit"></i>
                            <span>&nbsp;Edit Article</span>
                        </a>
                        <span>&nbsp;&nbsp;</span>
                        <button class="btn btn-outline-danger btn-sm">
                            <i class="ion-trash-a"></i>
                            <span>&nbsp;Delete Article</span>
                        </button>
                    </span>
                </div>
            </div>
        </div>
        <div class="container page">
            <div class="row article-content">
                <div class="col-xs-12">
                    <div>
                        <p>Web design encompasses many different skills and disciplines in the production
                            and maintenance of websites. The different areas of web design include web graphic
                            design; interface design; authoring, including standardised code and proprietary software;
                            user experience design; and search engine optimization.
                        </p>
                    </div>
                    <ul class="tag-list"></ul>
                </div>
            </div>

            <hr>

            <div class="article-actions">
                <div class="article-meta">
                    <a href="#/@tectonic/" class="">
                        <img src="https://i.stack.imgur.com/xHWG8.jpg">
                    </a>
                    <div class="info">
                        <a href="#/@tectonic/" class="author">tectonic</a>
                        <span class="date">June 22, 2020</span>
                    </div>
                    <span>
                        <a href="#/editor/front-1" class="btn btn-sm btn-outline-secondary">
                            <i class="ion-edit"></i>
                            <span>&nbsp;Edit Article</span>
                        </a>
                        <span>&nbsp;&nbsp;</span>
                        <button class="btn btn-outline-danger btn-sm">
                            <i class="ion-trash-a"></i>
                            <span>&nbsp;Delete Article</span>
                        </button>
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12 col-md-8 offset-md-2">
                    <div>
                        <ul class="error-messages"></ul>
                        <form class="card comment-form">
                            <div class="card-block">
                                <textarea placeholder="Write a comment..." rows="3" class="form-control"></textarea>
                            </div>
                            <div class="card-footer">
                                <img src="https://i.stack.imgur.com/xHWG8.jpg" class="comment-author-img">
                                <button class="btn btn-sm btn-primary">Post Comment</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
            `
        }

        <!--    -----------------------   End articles-detail user  -------------------------   -->




        document.querySelector(".loading").style.display="none";
    }
})()

