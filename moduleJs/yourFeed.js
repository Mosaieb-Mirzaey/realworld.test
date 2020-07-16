

function getToken() {
    return window.localStorage.getItem('id_token');
}



let users;
async function getUsername() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Token " + getToken());
    return   fetch("https://conduit.productionready.io/api/user", {
        method: 'GET',
        headers: myHeaders,
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




//#########################################################  Your Feed Articles  #############################################################
let feedList;
async function feed(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", "Token " + getToken());

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    return  fetch("https://conduit.productionready.io/api/articles/feed", requestOptions)
}
async function feedArt(){
    try{
        let response = await feed()
        let result = await response.json()
        feedList = result;
        return feedList;
    }catch(error){
        console.log('error', error)
    }
}

//--------------------------------------------------------------  End Your Feed Articles  -------------------------------------------------------------------




//   ##########################   Favorite Article  &   Unfavorite Article  ########################
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





//#########################################################  Popular Tag list #############################################################
let tagGlobal;
async function popularTagGet() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch("https://conduit.productionready.io/api/tags", requestOptions)
}

async function tagPopularGet(){
    try{
        let response = await popularTagGet()
        let result = await response.json()
        tagGlobal = result;
        return tagGlobal;
    }catch(error){
        console.log('error', error)
    }
}

//---------------------------------------------------------  End Popular Tag list ----------------------------------------------------------






// ********************************************************************************************************************************



//  ##############################################   General    ##########################################################
let c , d;
var numOfFeedArt, numOfPopularTag;
var favoriteBtnColorAll;

(async function () {
    await getCurrentUser();
    await feedArt();

    if (users.user.username !== ''){
        document.querySelector(".loading").style.display="initial";
        document.querySelector(".listNav").innerHTML = `
                <li class="nav-item">
                    <a class="nav-link active" href="https://mosaieb-mirzaey.github.io/realworld.test/index.html?page=1">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="">
                        <i class="ion-compose"></i>&nbsp;New Article
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="https://mosaieb-mirzaey.github.io/realworld.test/html/setting.html">
                        <i class="ion-gear-a"></i>&nbsp;Settings
                    </a>
                </li>
                <li class="nav-item">
                    <a class='nav-link' href="https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html?author=${users.user.username}">${users.user.username}</a>
                </li>
        `;

        let globalFeed =document.querySelector('.globalFeed');
        globalFeed.setAttribute("href" , "https://mosaieb-mirzaey.github.io/realworld.test/index.html?author="+users.user.username+"")



//#########################################################  Feed Articles  #############################################################

        let artFeedFrame =document.querySelector('.artFeedFrame');

        numOfFeedArt = Object.entries(feedList.articles);
        console.log(feedList.articles);
        var feedArticleNum = numOfFeedArt.length;


        //########################  ساختار تکرار برای لیست مقاله های Feed  #####################

        for (c = 0 ; c < feedArticleNum ; c++) {

            //   #################    timeArticleCreated   ###############
            let timeCreated = feedList.articles[c].createdAt;
            let format = "yyyy-MM-dd'T'HH:mm:ss+SS:ZZ";
            let time = Date.parse(timeCreated, format);
            let myDate = new Date(time);
            let timeArticle = myDate.toDateString();
            //*************    End timeArticleCreated     *************


            //  ############   favoriteBtnColor    ##############

            favoriteBtnColorAll = feedList.articles[c].favorited ? 'btn-primary' : 'btn-outline-primary';

            //  -------------   End favoriteBtnColor  --------------



            artFeedFrame.innerHTML += `


                   <div class="article-preview">
                        <div class="article-meta">
                            <a href="https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html" class="router-link-exact-active router-link-active">
                                <img src="${feedList.articles[c].author.image}"></a>
                            <div class="info">
                            <a href="https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html?author=${feedList.articles[c].author.username}">
                                ${feedList.articles[c].author.username}
                            </a>
                            <span class="date">${timeArticle}</span>
                            </div>
                            <button onclick="favoritePost('${feedList.articles[c].slug}' , '${c}')" class="btn ${favoriteBtnColorAll} btn-sm pull-xs-right favoriteBtn" ">
                                <i class="ion-heart"></i><span class="counter"> ${feedList.articles[c].favoritesCount} </span>
                            </button>
                        </div>
                        <a href="https://mosaieb-mirzaey.github.io/realworld.test/html/articles.html?slug=${feedList.articles[c].slug}" class="preview-link">
                            <h1>${feedList.articles[c].title}</h1>
                            <p>${feedList.articles[c].description}</p>
                            <span>Read more...</span>
                            <ul class="tag-list">
                            </ul>
                        </a>
                   </div> 

        `;


            //  ############   Article Tags    ##############
            let tag = Object.entries(feedList.articles[c].tagList);
            let tagList = document.querySelectorAll(".tag-list")[c];
            var listGlobalINum = c;
            for (d = 0 ; d < tag.length ; d++){
                var tagHtml = `<li class="tag-default tag-pill tag-outline"><span>${feedList.articles[listGlobalINum].tagList[d]}</span></li>`
                tagList.innerHTML += tagHtml;
            }
            // -------------   End Article Tags  -------------


        }
        //-------------------------  پایان ساختار تکرار برای لیست مقاله های Feed  ----------------------


        //  ############ ************  Global Tags   ************ ##############
        await tagPopularGet();

        numOfPopularTag = Object.entries(tagGlobal.tags);
        var tagNum = numOfPopularTag.length;

        for (let i = 0 ; i < tagNum ; i++){
            let popularTag = document.querySelector(".popularTag");
            popularTag.innerHTML += `
            <a href="" class="tag-pill tag-default">${tagGlobal.tags[i]}</a>
        `;
        }

        // ------------- ***********  End Global Tags  ************ -------------


//--------------------------------------------------------------  End Global Articles  -------------------------------------------------------------------



        document.querySelector(".loading").style.display="none";
    }
})();

//   ---------------------------    General     --------------------------------
