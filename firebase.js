var db = firebase.firestore();
// Your web app's Firebase configuration


var theme_file = document.querySelector("#theme-link");

if(localStorage.getItem('theme') == "dark"){
    theme_file.href = "dark-theme.css";
    document.getElementById("themeToggle").checked = true;
    console.log("loadPage with dark");
}
else{
    theme_file.href = "light-theme.css";
    document.getElementById("themeToggle").checked = false;
    console.log("loadPage with light");
}

function handleClick(cb) {
    if (cb.checked) {
        theme_file.href = "dark-theme.css";
        localStorage.setItem("theme", "dark");
    
    } else {
        theme_file.href = "light-theme.css";
        localStorage.setItem("theme", "light");
  }
}

function updateLiveView(){
    var user = firebase.auth().currentUser;
    var mainDiv = document.getElementById('live-view-content');
    mainDiv.innerHTML = '<h2 class="text-center pt-2">Live View</h1>';
    if (user) {
        var docRef = db.collection("users").doc(user.uid).collection("friends");
        docRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (user.uid != doc.id) {
                    var firstName = doc.data().firstName;
                    var lastName = doc.data().lastName;
                    const html =
                    `
                    <div class="row live-view-person mx-auto my-2 sidecard" id="card-${doc.id}">
                        <div class="col-3 my-auto ml-3 px-0 d-flex justify-content-center align-items-center live-view-img">
                            <img id="img-${doc.id}" class="rounded-circle img-thumbnail2" src="${getPFP(doc.id)} alt="">
                        </div>
                        <div class="col-8 mt-4 ml-1 pr-0 pl-2 pt-1 live-view-content">
                            <h6 class = "live-view-name mb-1">${firstName} ${lastName}</h6>
                            <div><h9 class = "live-view-media mb-2" id="recent1-${doc.id}">NotReady</h9></div>
                            <h9 class = "live-view-media" id="recent2-${doc.id}" onclick="test('${doc.id}')">Not Ready</h9>
                        </div>
                    </div>
                    `
                    /*const script =
                    `<script>
                        inner1 = document.getElementById("recent1-${doc.id}");
                        document.getElementById("recent1-N1kHR3IsTmPqGC5uOXLUxJTrYmw2").value="yoo";
                        rtdbRef = rtdb.child('${doc.id}');
                        rtdbRef.on('value', snap=> inner1.innerText = snap.val());
                        inner1 = document.getElementById("test");
                        rtdbRef = rtdb.child('tester');
                        rtdbRef.on('value', snap=> inner1.innerText = snap.val());
                        console.log("this ran");
                    </script>
                    `;*/
                    mainDiv.insertAdjacentHTML('beforeend',html);
                    //document.body.insertAdjacentHTML('beforeend',script);
                } 
            });
        }).then( function(){
            people = document.querySelectorAll('.sidecard');
            people.forEach(person => {
                console.log(person);
                id = person.id.split("-");
                console.log(id[1]);
                var script   = document.createElement("script");
                script.type  = "text/javascript";
                //script.src   = "path/to/your/javascript.js";    // use this for linked script
                script.text  = 
                `
                rtdb = firebase.database().ref('${id[1]}');
                rtdb.on('value', (snapshot) => {
                    song = snapshot.val();
                    res = song.split(":");
                    console.log(song,res[0],res[1],res)
                    inner1 = document.getElementById("recent1-${id[1]}");
                    inner2 = document.getElementById("recent2-${id[1]}");
                    inner1.innerText = res[0];
                    inner2.innerText = res[1];
                    
                });
                `              // use this for inline script
                document.body.appendChild(script);
            });
        });
    } else {
        const html =
                        `
                        <div class="row live-view-person mx-auto my-2">
                            You need to be signed in to use this feature
                        </div>
                        `;
                        mainDiv.insertAdjacentHTML('beforeend',html);
    }
    

    
}

document.getElementById("live-view-btn").addEventListener("click",function(){
    if(document.getElementById("live-view").style.display == 'none'){
        document.getElementById("live-view").style.display = 'flex';
    }
    else{
        document.getElementById("live-view").style.display = 'none';
    }    
});

firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        updateLiveView();
    }
});

//Search functions

function searchLoad(){
    var search_input = document.getElementById("search-bar").value;
    window.location.href = "search.html?search="+search_input;
    // window.location.replace("search.html");
    console.log(search_input);
    
    //getTvShowID(search_input);
    //call getSongID(search_input) function here
}


function getTVShowID(tv_show){
    const baseURL = "https://api.themoviedb.org/3/";
    const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
    let tv_show_id;
    let url = baseURL + "search/tv?api_key=" + API_key + "&query=\"" + tv_show + "\"";

    fetch(url)
    .then(result => result.json())
    .then((data) => {
        let info = data.results.slice(0, 15);
        for(let i = 0; i < info.length; i++){
            tv_show_id = info[i].id;
            getTVShowDetails(tv_show_id);      
        } 
    })
}
function getPFP(id) {
    var picRef = firebase.storage().ref(`users/${id}.jpg`).getDownloadURL().then( 
        (url) => {
            document.querySelector(`#img-${id}`).src=url;
    }).catch((error) => {
        var picRef = firebase.storage().ref(`users/${id}.png`).getDownloadURL().then( 
            (url) => {
                document.querySelector(`#img-${id}`).src=url;
        }).catch((error) => {
            picRef = firebase.storage().ref(`users/default${id.charCodeAt(0)%6}.jpg`).getDownloadURL().then(
                (url) => {
                    document.querySelector(`#img-${id}`).src=url;
            });
        });
    });
    
    return "";
    }
