

// *************    html Button    *************

import * as getUsername from "./moduleJs/getUsername.js";


var a=1;

//      ***********     getUsername     ***********

(async function (){

    // document.querySelector("body > div.row").style.display="block";
    let res= await getUsername.getCurrentUser();
    if (res.user.username !== ""){
        document.querySelector(".loading").style.display = "initial";
        document.querySelector("body > nav > div > ul > li:nth-child(4)").style.display = 'none';
        document.querySelector("body > nav > div > ul > li:nth-child(5)").style.display = 'none';
        let item = document.createElement('li');
        item.innerHTML="<a class='nav-link' href='html/profile.html'>"+res.user.username+"</a>";
        item.className="nav-item";
        document.querySelector("body > nav > div > ul").appendChild(item);
        document.querySelector("body > nav > div > ul > li:nth-child(2) > a").innerHTML = `<i class="ion-compose"></i>&nbsp;New Article`;
        document.querySelector(".loading").style.display = "none";
    }
})();





