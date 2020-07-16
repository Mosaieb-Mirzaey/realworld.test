
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



//#########################################################  Get Article Target  #############################################################
let slugUrl;

async function getArticleTarget() {
    let users = await getCurrentUser();
    if (users.user.username !== "") {

        let currentPage = window.location.href;
        let params = new URLSearchParams(currentPage);
        let slugParam;
        for (slugParam of params) {
            slugUrl = slugParam[1];
        }


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Token " + getToken());
        myHeaders.append("Accept", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        return fetch("https://conduit.productionready.io/api/articles/"+slugParam[1]+"", requestOptions)

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



//#########################################################   Get Comments   #############################################################
let artComment;
async function getComments() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Token " + getToken());
    myHeaders.append("Accept", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch("https://conduit.productionready.io/api/articles/" + slugUrl + "/comments", requestOptions);
}
async function articleComments() {
    try {
        let response = await getComments();
        let result = await response.json();
        artComment = result;
        console.log(artComment);
        return artComment;
    }catch (error) {
        console.log('error', error)
    }
}

//--------------------------------------------------------------  End Get Comments  ---------------------------------------------------------




//#########################################################   add Comments   #############################################################
let commentText , postComment , addCommentWrited, errorMessages;
async function creatComments() {

    if (profile.profile.username !== '') {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Token " + getToken());
        myHeaders.append("Accept", "application/json");

        var raw = JSON.stringify({"comment": {"body": commentText.value}});

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        return fetch("https://conduit.productionready.io/api/articles/" + slugUrl + "/comments", requestOptions)
    }
}
    async function addComments() {
        try{
            let response = await creatComments();
            let result = await response.json();
            postComment = result;
            console.log(postComment);
            errorMessages.innerHTML = ``;
            commentText.value = ``;
            addCommentWrited.innerHTML += `
                        <div class="card">
                            <div class="card-block">
                                <p class="card-text">${postComment.comment.body}</p>
                            </div>
                            <div class="card-footer">
                                <a href="https://conduit.productionready.io/html/profile.html?author=${postComment.comment.author.username}" class="comment-author">
                                <img src="${postComment.comment.author.image}" class="comment-author-img" />
                                </a>
                                &nbsp;
                                <a href="https://conduit.productionready.io/html/profile.html?author=${postComment.comment.author.username}" class="comment-author">${postComment.comment.author.username}</a>
                                <span class="date-posted"></span>
                            </div>
                        </div>
            `;

            return postComment;
        }catch (error) {
            console.log('error', error)
            errorMessages.innerHTML = `<li><span>body</span><span>field is required.</span></li>`;
        }
    }

//--------------------------------------------------------------  End add Comments  ---------------------------------------------------------



//#########################################################   Delete Comments   #############################################################
let delCommentResult, delComment;
    function deleteComment(i) {

    if (profile.profile.username !== '') {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Token " + getToken());
        myHeaders.append("Accept", "application/json");

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://conduit.productionready.io/api/articles/" + slugUrl + "/comments/" + i + "", requestOptions)

            .then(response => response.text())
            .then(result => {
                delCommentResult = result;
                delComment = document.querySelectorAll('.delComment'+i+'');
                delComment[0].remove();
                console.log(delCommentResult);
            })
            .catch(error => {
                console.log('error', error)
            });

    }
}

//--------------------------------------------------------------  End Delete Comments  ---------------------------------------------------------




//   #######  Favorites  ##############   ArticleFavorites   &   Unfavorite Article  ########################
let newCount;
function favoritePost(slug , btnI) {
    var favorBtn = document.querySelectorAll('.favoriteBtn')[btnI];
    var favorBtnAll = document.querySelectorAll('.favoriteBtn');


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


                // for (let i=0 ; i < favorBtnAll.length ; i++){
                //     favorBtnAll[i].classList.remove("btn-outline-primary");
                //     favorBtnAll[i].classList.add("btn-primary");
                // }


                favorBtnAll.forEach(function (item) {
                item.classList.remove("btn-outline-primary")
                item.classList.add("btn-primary");
                })


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



                // for (let i=0 ; i < favorBtnAll.length ; i++){
                //     favorBtnAll[i].classList.remove("btn-primary");
                //     favorBtnAll[i].classList.add("btn-outline-primary");
                // }

                favorBtnAll.forEach(function (item) {
                    item.classList.remove("btn-primary")
                    item.classList.add("btn-outline-primary");
                })




                let firstCount = favorBtn.lastElementChild;
                newCount = Number(favorBtn.lastElementChild.textContent) - 1 ;
                firstCount.textContent =" " + newCount + " ";
            })
            .catch(error => console.log('error', error));


    }
    //   ------------------  Unfavorite Article deleteButton   -------------------

}

//   ----------------------------    ArticleFavorites   &   Unfavorite Article     -----------------------------



//   #########  Follow  ############    Follow Article &   Unfollow Article  ########################

function followPost(slug , btnI) {
    var followBtn = document.querySelectorAll('.followBtn')[btnI];
    let followBtnAll = document.querySelectorAll('.followBtn');

    //   ####################   Article Follow PostButton  ##################
    if (followBtn.classList.contains("btn-outline-warning")){

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Token " + getToken());
        myHeaders.append("Accept", "application/json");



        var raw = JSON.stringify({"user":{"email":users.user.email,"Token":getToken()}});

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://conduit.productionready.io/api/profiles/"+articleInfo.article.author.username+"/follow", requestOptions)

            .then(response => response.text())
            .then(result => {
                console.log(result);


                // for (let i=0 ; i < favorBtnAll.length ; i++){
                //     favorBtnAll[i].classList.remove("btn-outline-primary");
                //     favorBtnAll[i].classList.add("btn-primary");
                // }


                followBtnAll.forEach(function (item) {
                    item.classList.remove("btn-outline-warning")
                    item.classList.add("btn-warning");
                    item.innerHTML = `<i class="ion-close"></i>&nbsp;Unfollow ${articleInfo.article.author.username}`;
                })



            })
            .catch(error => console.log('error', error));


        //   ------------------  End Article Follow PostButton   -------------------

    }else if (followBtn.classList.contains("btn-warning")) {

        //   ####################   Unfollow Article deleteButton  ##################

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Token " + getToken());
        myHeaders.append("Accept", "application/json");

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://conduit.productionready.io/api/profiles/"+articleInfo.article.author.username+"/follow", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);



                // for (let i=0 ; i < favorBtnAll.length ; i++){
                //     favorBtnAll[i].classList.remove("btn-primary");
                //     favorBtnAll[i].classList.add("btn-outline-primary");
                // }

                followBtnAll.forEach(function (item) {
                    item.classList.remove("btn-warning")
                    item.classList.add("btn-outline-warning");
                    item.innerHTML = `<i class="ion-plus-round"></i>&nbsp;Follow ${articleInfo.article.author.username}`;
                })

            })
            .catch(error => console.log('error', error));


    }
    //   ------------------  Unfollow Article deleteButton   -------------------

}

//   ----------------------------    End  Follow Article &   Unfollow Article     -----------------------------


//   #########  Delete  ############      Delete   Article     #############################

function deleteArticle() {

     var myHeaders = new Headers();
     myHeaders.append("Content-Type", "application/json");
     myHeaders.append("Authorization", "Token " + getToken());
     myHeaders.append("Accept", "application/json");


    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://conduit.productionready.io/api/articles/"+slugUrl+"", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            alert("Article Deleted!");
            location.replace("https://conduit.productionready.io/html/profile.html?author="+articleInfo.article.author.username+"");
        })
        .catch(error => console.log('error', error));

}

//   ----------------------------         Delete   Article        -----------------------------







let favoriteBtnColorUser, followBtnColorUser, followBtnAttr;
(async function () {
    await getProfile();
    await getArticle();
    await articleComments();
    if (profile.profile.username !== '') {
        document.querySelector(".loading").style.display="initial";
        document.querySelector(".profileName1").innerHTML = "<a class='nav-link router-link-exact-active active' href='https://conduit.productionready.io/html/profile.html?author="+profile.profile.username+"'>"+profile.profile.username+" </a>";
        document.querySelector(".newArticle").setAttribute('href' , "https://mosaieb-mirzaey.github.io/realworld.test/html/newArticle.html?author="+users.user.username+"");


                    //  ############   favoriteBtnColor    ##############

                    favoriteBtnColorUser = articleInfo.article.favorited ? 'btn-primary' : 'btn-outline-primary';

                    //  -------------   End favoriteBtnColor  --------------


                    //  ############   followBtnColor  &   Function  ##############

                    followBtnColorUser = articleInfo.article.author.following ? 'btn-warning' : 'btn-outline-warning';

                    followBtnAttr = articleInfo.article.author.following ?
                        `<i class="ion-close"></i>&nbsp;Unfollow ${articleInfo.article.author.username}`
                        :
                        `<i class="ion-plus-round"></i>&nbsp;Follow ${articleInfo.article.author.username}`;

                    //  -------------   End followBtnColor  &   Function  --------------


                     //   #################    timeArticleCreated   ###############
                     let timeCreated = articleInfo.article.createdAt;
                     let format = "yyyy-MM-dd'T'HH:mm:ss+SS:ZZ";
                     let time = Date.parse(timeCreated, format);
                     let myDate = new Date(time);
                     let timeArticle = myDate.toDateString();
                     //*************    End timeArticleCreated     *************



        <!--    ************************       articles-detail user    *************************-->
        let articleDetailUser = document.querySelector("#articleDetailUser");
        let commentCurrent, commentCount;


        if (articleInfo.article.author.username == profile.profile.username){

            articleDetailUser.innerHTML = `
        <div class="banner">
            <div class="container">
                <h1>${articleInfo.article.title}</h1>
                <div class="article-meta">
                    <a href="https://conduit.productionready.io/html/profile.html?author=${articleInfo.article.author.username}" class="">
                        <img src="${articleInfo.article.author.image}">
                    </a>
                    <div class="info">
                        <a href="https://conduit.productionready.io/html/profile.html?author=${articleInfo.article.author.username}" class="author">${articleInfo.article.author.username}</a>
                        <span class="date">${timeArticle}</span>
                    </div>
                    <span>
                        <a href="https://conduit.productionready.io/html/editArticle.html?slug=${articleInfo.article.slug}" class="btn btn-sm btn-outline-secondary">
                            <i class="ion-edit"></i>
                            <span>&nbsp;Edit Article</span>
                        </a>
                        <span>&nbsp;&nbsp;</span>
                        <button onclick="deleteArticle()" class="btn btn-outline-danger btn-sm">
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
                        <p>${articleInfo.article.body}</p>
                    </div>
                    <ul class="tag-list">
                    </ul>
                </div>
            </div>

            <hr>

            <div class="article-actions">
                <div class="article-meta">
                    <a href="https://conduit.productionready.io/html/profile.html?author=${articleInfo.article.author.username}" class="">
                        <img src="${articleInfo.article.author.image}">
                    </a>
                    <div class="info">
                        <a href="https://conduit.productionready.io/html/profile.html?author=${articleInfo.article.author.username}" class="author">${articleInfo.article.author.username}</a>
                        <span class="date">${timeArticle}</span>
                    </div>
                    <span>
                        <a href="https://conduit.productionready.io/html/editArticle.html?slug=${articleInfo.article.slug}" class="btn btn-sm btn-outline-secondary">
                            <i class="ion-edit"></i>
                            <span>&nbsp;Edit Article</span>
                        </a>
                        <span>&nbsp;&nbsp;</span>
                        <button onclick="deleteArticle()" class="btn btn-outline-danger btn-sm">
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
                                <textarea placeholder="Write a comment..." rows="3" class="form-control" data-text="" value=""></textarea>
                            </div>
                            <div class="card-footer">
                                <img src="${articleInfo.article.author.image}" class="comment-author-img">
                                <button type="button" class="btn btn-sm btn-primary" data-commentBtn="">Post Comment</button>
                            </div>
                        </form>
                            <div class="commentCurrent" data-addComment="">
                            </div>
                            <div class="commentCurrent" data-commentCurrent="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

            <!--    #############       Comments Current for Article      #############-->
            commentCurrent = document.querySelector("[data-commentCurrent]");
            commentCount = artComment.comments.length;
            for (let i = 0 ; i < commentCount ; i++){
                                 //   ##############    timeCommentCreated   ##############
                                 let timeCreated = artComment.comments[i].createdAt;
                                 let format = "yyyy-MM-dd'T'HH:mm:ss+SS:ZZ";
                                 let time = Date.parse(timeCreated, format);
                                 const options = { year: 'numeric', day: 'numeric', month: 'long' };
                                 let myDate = new Date(time);
                                 let timeComment = myDate.toLocaleDateString(undefined , options);
                                 //*************    End timeCommentCreated     *************
                commentCurrent.innerHTML += `
                    <div class="card delComment${artComment.comments[i].id}">
                        <div class="card-block">
                            <p class="card-text">${artComment.comments[i].body}</p>
                        </div>
                        <div class="card-footer">
                            <a href="https://conduit.productionready.io/html/profile.html?author=${artComment.comments[i].author.username}/" class="comment-author">
                                <img src="${artComment.comments[i].author.image}" class="comment-author-img" />
                            </a>
                            &nbsp;
                            <a href="https://conduit.productionready.io/html/profile.html?author=${artComment.comments[i].author.username}/" class="comment-author">${artComment.comments[i].author.username}</a>
                            <span class="date-posted">${timeComment}</span>
                            <span class="mod-options"  onclick="deleteComment('${artComment.comments[i].id}')"><i class="ion-trash-a"></i></span>
                        </div>
                    </div>
                `;
            }
            <!--    -------------   End Comments Current for Article   -------------   -->

        }else {

            articleDetailUser.innerHTML = `
            
                 <div class="banner">
                     <div class="container">
           
                         <h1>${articleInfo.article.title}</h1>
           
                         <div class="article-meta">
                             <a href="https://conduit.productionready.io/html/profile.html?author=${articleInfo.article.author.username}">
                             <img src="${articleInfo.article.author.image}" />
                             </a>
                             <div class="info">
                                 <a href="https://conduit.productionready.io/html/profile.html?author=${articleInfo.article.author.username}" class="author">${articleInfo.article.author.username}</a>
                                 <span class="date">${timeArticle}</span>
                             </div>
                             <button onclick="followPost('${articleInfo.article.slug}' , 0)" class="btn ${followBtnColorUser} btn-sm followBtn">
                             ${followBtnAttr}
                             </button>
                             &nbsp;&nbsp;
                             <button onclick="favoritePost('${articleInfo.article.slug}' , 0)" class="btn ${favoriteBtnColorUser} btn-sm favoriteBtn">
                                 <i class="ion-heart"></i>
                                 &nbsp;
                                 Favorite Article (<span class="counter">${articleInfo.article.favoritesCount}</span>)
                             </button>
                         </div>
           
                     </div>
                 </div>
           
                 <div class="container page">
           
                     <div class="row article-content">
                         <div class="col-md-12">
                             <p>${articleInfo.article.description}</p>
                             <p>${articleInfo.article.body}</p>
                         </div>
                     </div>
                     <ul class="tag-list">
                     </ul>
                     
                     <hr />
           
                     <div class="article-actions">
                         <div class="article-meta">
                             <a href="https://conduit.productionready.io/html/profile.html?author=${articleInfo.article.author.username}">
                             <img src="${articleInfo.article.author.image}" />
                             </a>
                             <div class="info">
                                 <a href="https://conduit.productionready.io/html/profile.html?author=${articleInfo.article.author.username}" class="author">${articleInfo.article.author.username}</a>
                                 <span class="date">${timeArticle}</span>
                             </div>
                              <button onclick="followPost('${articleInfo.article.slug}' , 1)" class="btn ${followBtnColorUser} btn-sm followBtn">
                             ${followBtnAttr}
                             </button>

                             <button onclick="favoritePost('${articleInfo.article.slug}' , 1)" class="btn ${favoriteBtnColorUser} btn-sm favoriteBtn">
                                 <i class="ion-heart"></i>
                                 &nbsp;
                                 Favorite Article (<span class="counter">${articleInfo.article.favoritesCount}</span>)
                             </button>
                         </div>
                     </div>
           
                     <div class="row">
           
                         <div class="col-xs-12 col-md-8 offset-md-2">
                             <ul class="error-messages"></ul>
                             <form class="card comment-form">
                                 <div class="card-block">
                                     <textarea class="form-control" placeholder="Write a comment..." rows="3" data-text="" value=""></textarea>
                                 </div>
                                 <div class="card-footer">
                                     <img src="${profile.profile.image}" class="comment-author-img" />
                                     <button type="button" class="btn btn-sm btn-primary" data-commentBtn="">
                                         Post Comment
                                     </button>
                                 </div>
                             </form>
                             
                            <div class="commentCurrent" data-addComment="">
                            </div>
                            <div class="commentCurrent" data-commentCurrent="">
                            </div>
                            
                         </div>
           
                     </div>
           
                 </div>
           
            `;

            <!--    #############       Comments Current for Article      #############-->
            commentCurrent = document.querySelector("[data-commentCurrent]");
            commentCount = artComment.comments.length;

            for (let i = 0 ; i < commentCount ; i++){
                //   ##############    timeCommentCreated   ##############
                let timeCreated = artComment.comments[i].createdAt;
                let format = "yyyy-MM-dd'T'HH:mm:ss+SS:ZZ";
                let time = Date.parse(timeCreated, format);
                const options = { year: 'numeric', day: 'numeric', month: 'long' };
                let myDate = new Date(time);
                let timeComment = myDate.toLocaleDateString(undefined , options);
                //*************    End timeCommentCreated     *************
                commentCurrent.innerHTML += `
                    <div class="card delComment${artComment.comments[i].id}">
                        <div class="card-block">
                            <p class="card-text">${artComment.comments[i].body}</p>
                        </div>
                        <div class="card-footer">
                            <a href="https://conduit.productionready.io/html/profile.html?author=${artComment.comments[i].author.username}" class="comment-author">
                                <img src="${artComment.comments[i].author.image}" class="comment-author-img" />
                            </a>
                            &nbsp;
                            <a href="https://conduit.productionready.io/html/profile.html?author=${artComment.comments[i].author.username}" class="comment-author">${artComment.comments[i].author.username}</a>
                            <span class="date-posted">${timeComment}</span>
                        </div>
                    </div>
                `;
            }
            <!--    -------------   End Comments Current for Article   -------------   -->
        }

        document.querySelector('[data-commentBtn]').addEventListener('click' , addComments);
        commentText = document.querySelector('[data-text]');
        addCommentWrited = document.querySelector('[data-addComment]');
        errorMessages = document.querySelector('.error-messages');



        <!--    -----------------------   End articles-detail user  -------------------------   -->

        //  ############   Article Tags    ##############
        let tag = Object.entries(articleInfo.article.tagList);
        let tagLists = document.querySelector(".tag-list");
        for (let iTag = 0 ; iTag < tag.length ; iTag++){
            var tagHtml = `<li class="tag-default tag-pill tag-outline"><span>${articleInfo.article.tagList[iTag]}</span></li>`
            tagLists.innerHTML += tagHtml;
        }
        // -------------   End Article Tags  -------------


        document.querySelector(".loading").style.display="none";
    }
})()


