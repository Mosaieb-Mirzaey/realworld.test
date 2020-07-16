
//   ##########################  List Global Article  ############################
let globalArticleInfo;
async function listArticleGlobal() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    console.log(getUrl)

    return fetch("https://conduit.productionready.io/api/articles?offset="+((getUrl * 5) - 5)+"&limit=40", requestOptions)
}


async function listGlobal() {
    try {
        let response = await listArticleGlobal();
        let result = await response.json();
        globalArticleInfo = result;
        console.log(globalArticleInfo)
        return globalArticleInfo
    } catch (error) {
        console.log('error' + error)
    }
}
//  ------------------------  End List Global Article   --------------------------



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




//  ############  ****************  ############   Pagination   ############  ****************  ################
let infoPage;
var getUrl, params ;


async  function getParamUrl(){
    let urlPage = window.location.search;
    params = new URLSearchParams(urlPage).get("page");
    getUrl = Number(params);

}
async function paginate(
    totalItems = globalArticleInfo.articlesCount,
    currentPage = getUrl,
    pageSize = 1,
    maxPages = 7
) {


    // calculate total pages

    let totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    let startPage, endPage;
    if (totalPages <= maxPages) {
        // total pages less than max so show all pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // total pages more than max so calculate start and end pages
        let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
        let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            // current page near the start
            startPage = 1;
            endPage = maxPages;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            // current page near the end
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        } else {
            // current page somewhere in the middle
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return infoPage= {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
}

//  ############  ****************  ############   End Pagination   ############  ****************  ################


//#########################################################  Global Articles  #############################################################


(async function f() {
    await getParamUrl();
    await listGlobal();
    await getParamUrl();

    let artGlobalFrame =document.querySelector('.artGlobalFrame');

    numOfGlobalArt = Object.entries(globalArticleInfo.articles);
    console.log(globalArticleInfo.articles);
    var globalArticleNum = numOfGlobalArt.length;


//########################  ساختار تکرار برای لیست مقاله های گلوبال  #####################

    for (c = 0 ; c < globalArticleNum ; c++) {

        //   #################    timeArticleCreated   ###############
        let timeCreated = globalArticleInfo.articles[c].createdAt;
        let format = "yyyy-MM-dd'T'HH:mm:ss+SS:ZZ";
        let time = Date.parse(timeCreated, format);
        let myDate = new Date(time);
        let timeArticle = myDate.toDateString();
        //*************    End timeArticleCreated     *************


        //  ############   favoriteBtnColor    ##############

        favoriteBtnColorAll = globalArticleInfo.articles[c].favorited ? 'btn-primary' : 'btn-outline-primary';

        //  -------------   End favoriteBtnColor  --------------



        artGlobalFrame.innerHTML += `


                   <div class="article-preview">
                        <div class="article-meta">
                            <a href="https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html" class="router-link-exact-active router-link-active">
                                <img src="${globalArticleInfo.articles[c].author.image}"></a>
                            <div class="info">
                            <a href="https://mosaieb-mirzaey.github.io/realworld.test/html/profile.html?author=${globalArticleInfo.articles[c].author.username}">
                                ${globalArticleInfo.articles[c].author.username}
                            </a>
                            <span class="date">${timeArticle}</span>
                            </div>
                            <button onclick="favoritePost('${globalArticleInfo.articles[c].slug}' , '${c}')" class="btn ${favoriteBtnColorAll} btn-sm pull-xs-right favoriteBtn" ">
                                <i class="ion-heart"></i><span class="counter"> ${globalArticleInfo.articles[c].favoritesCount} </span>
                            </button>
                        </div>
                        <a href="https://mosaieb-mirzaey.github.io/realworld.test/html/articles.html?slug=${globalArticleInfo.articles[c].slug}" class="preview-link">
                            <h1>${globalArticleInfo.articles[c].title}</h1>
                            <p>${globalArticleInfo.articles[c].description}</p>
                            <span>Read more...</span>
                            <ul class="tag-list">
                            </ul>
                        </a>
                   </div> 

        `;


        //  ############   Article Tags    ##############
        let tag = Object.entries(globalArticleInfo.articles[c].tagList);
        let tagList = document.querySelectorAll(".tag-list")[c];
        var listGlobalINum = c;
        for (d = 0 ; d < tag.length ; d++){
            var tagHtml = `<li class="tag-default tag-pill tag-outline"><span>${globalArticleInfo.articles[listGlobalINum].tagList[d]}</span></li>`
            tagList.innerHTML += tagHtml;
        }
        // -------------   End Article Tags  -------------


    }
//-------------------------  پایان ساختار تکرار برای لیست مقاله های گلوبال  ----------------------


//  ############ ************  Global Tags   ************ ##############
    await tagPopularGet();

    numOfGlobalTag = Object.entries(tagGlobal.tags);
    let tagNum = numOfGlobalTag.length;

    for (let i = 0 ; i < tagNum ; i++){
        let popularTag = document.querySelector(".popularTag");
        popularTag.innerHTML += `
            <a href="" class="tag-pill tag-default">${tagGlobal.tags[i]}</a>
        `;
    }

// ------------- ***********  End Global Tags  ************ -------------




    await paginate();
    let pagination = document.querySelector(".pagination");
    let pageNumLength = infoPage.pages.length;
    for (let i = 0 ; i < pageNumLength ; i++){
        pagination.innerHTML += `
           <li data-test="page-link-1" class="page-item">
               <a href="https://mosaieb-mirzaey.github.io/realworld.test/html/home.html?page=${infoPage.pages[i]}" class="page-link pageI">${infoPage.pages[i]}</a>
           </li>
            `;

        pageI = document.querySelectorAll(".pageI")[i];

        if (Number(pageI.textContent) == getUrl){
            pageI.parentElement.classList.add("active");
        }else if (window.location.href == "https://mosaieb-mirzaey.github.io/realworld.test/html/home.html?page=1"){
            document.querySelectorAll(".pageI")[0].parentElement.classList.add("active");
        }
    }

})();
//--------------------------------------------------------------  End Global Articles  -------------------------------------------------------------------
