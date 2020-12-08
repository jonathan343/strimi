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
    mainDiv.innerHTML = 
    `
    <h2 class="text-center pt-2">Live View</h1>
    <div class="text-center mb-1 mx-auto">
        <div class="btn-group mb-3 ml-3" role="group" aria-label="Discover Selections">
            <button type="button" id="live-movies-btn" class="btn btn-secondary" onclick="showLiveMovies()"> Movies</button>
            <button type="button" id="live-shows-btn" class="btn btn-secondary" onclick="showLiveShows()">TV Shows</button>
            <button type="button" id="live-music-btn" class="btn btn-secondary active" onclick="showLiveSongs()">Songs</button>
        </div>
    </div>
    `
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
                            <div><h9 class = "live-view-media mb-2" id="recent1-${doc.id}">No Reviews</h9></div>
                            <h9 class = "live-view-media" id="recent2-${doc.id}" onclick="test('${doc.id}')"></h9>
                        </div>
                    </div>
                    `
                    mainDiv.insertAdjacentHTML('beforeend',html);
                    var script = document.createElement("script");
                    script.id = `script-${doc.id}`
                    script.type  = "text/javascript";
                    document.body.appendChild(script);
                } 
            });
        }).then( function(){
            showLiveMovies();
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


function showLiveMovies() {
    runMovies();
    document.getElementById("live-music-btn").classList.remove('active');
    document.getElementById("live-shows-btn").classList.remove('active');
    document.getElementById("live-movies-btn").classList.add('active');
}

function showLiveShows() {
    runShows();
    document.getElementById("live-music-btn").classList.remove('active');
    document.getElementById("live-shows-btn").classList.add('active');
    document.getElementById("live-movies-btn").classList.remove('active');
}

function showLiveSongs() {
    runSongs();
    document.getElementById("live-music-btn").classList.add('active');
    document.getElementById("live-shows-btn").classList.remove('active');
    document.getElementById("live-movies-btn").classList.remove('active');
}

function runSongs() {
    people = document.querySelectorAll('.sidecard');
    people.forEach(person => {
        console.log(person);
        id = person.id.split("-")[1];
        document.getElementById(`script-${id}`).remove();
        var script = document.createElement("script");
        script.id = `script-${id}`
        script.type  = "text/javascript";
        script.text  = 
            `
            firebase.database().ref('${id}/movie').off();
            firebase.database().ref('${id}/show').off();
            rtdb = firebase.database().ref('${id}/song');
            rtdb.on('value', (snapshot) => {
                console.log(id);
                song = snapshot.val();
                res = song.split(":");
                console.log(song,res[0],res[1],res)
                inner1 = document.getElementById("recent1-${id}");
                inner2 = document.getElementById("recent2-${id}");
                inner1.innerText = res[0];
                inner2.innerText = res[1];
                
            });
            `              // use this for inline script
       document.body.appendChild(script);
    });
}

function runShows() {
    people = document.querySelectorAll('.sidecard');
    people.forEach(person => {
        console.log(person);
        id = person.id.split("-")[1];
        document.getElementById(`script-${id}`).remove();
        var script = document.createElement("script");
        script.id = `script-${id}`
        script.text  = 
            `
            firebase.database().ref('${id}/movie').off();
            firebase.database().ref('${id}/song').off();
            firebase.database().ref('${id}/show').on('value', (snapshot) => {
                console.log(id);
                song = snapshot.val();
                res = song.split(":");
                console.log(song,res[0],res[1],res)
                inner1 = document.getElementById("recent1-${id}");
                inner2 = document.getElementById("recent2-${id}");
                inner1.innerText = res[0];
                inner2.innerText = res[1];
                
            });
            `              // use this for inline script
       document.body.appendChild(script);
    });
}

function runMovies() {
    people = document.querySelectorAll('.sidecard');
    people.forEach(person => {
        console.log(person);
        id = person.id.split("-")[1];
        document.getElementById(`script-${id}`).remove();
        var script = document.createElement("script");
        script.id = `script-${id}`
        script.text  = 
            `
            firebase.database().ref('${id}/show').off();
            firebase.database().ref('${id}/song').off();
            firebase.database().ref('${id}/movie').on('value', (snapshot) => {
                console.log(id);
                song = snapshot.val();
                res = song.split(":");
                console.log(song,res[0],res[1],res)
                inner1 = document.getElementById("recent1-${id}");
                inner2 = document.getElementById("recent2-${id}");
                inner1.innerText = res[0];
                inner2.innerText = res[1];
                
            });
            `              // use this for inline script
       document.body.appendChild(script);
    });
}