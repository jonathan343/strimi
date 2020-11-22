var db = firebase.firestore();

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

    var docRef = db.collection("users").doc(user.uid).collection("friends");
    docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var friendRef = db.collection("users").doc(doc.id);
            friendRef.get().then(function(doc2) {
                if (doc2.exists) {
                    var firstName = doc2.data().firstName;
                    var lastName = doc2.data().lastName;
                    const html =
                    `
                    <div class="row live-view-person mx-auto my-2" id="${doc2.id}">
                        <div class="col-3 my-auto ml-3 px-0 d-flex justify-content-center align-items-center live-view-img">
                            <img src="Images/Profile_Pictures/${firstName[0].toUpperCase()}_Letter.png" alt="">
                        </div>
                        <div class="col-8 my-auto ml-1 pr-0 pl-2 pt-1 live-view-content">
                            <h6 class = "live-view-name">${firstName} ${lastName}</h6>
                            <div><h9 class = "live-view-media">Are You Bored Yet?</h9></div>
                            <h9 class = "live-view-media">Wallows</h9>
                        </div>
                    </div>
                    `;
                    mainDiv.insertAdjacentHTML('beforeend',html);
                } else {
                    // doc.data() will be undefined in this case
                    alert("No Friend In Data Base");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        });
    });
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

function searchs(){
    var search_input = document.getElementById("search-bar").value;
    console.log(search_input);
    getMovieID(search_input);
    getTvShowID(search_input);
    //call getSongID(search_input) function here
}

function getMovieID(movie){
    const baseURL = "https://api.themoviedb.org/3/";
    const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
    let movie_id;
    let url = baseURL + "search/movie?api_key=" + API_key + "&query=" + movie;

    fetch(url)
    .then(result => result.json())
    .then((data) => {
        let info = data.results.slice(0, 15);
        for(let i = 0; i < info.length; i++){
            movie_id = info[i].id;
            getMovieDetails(movie_id);      
        } 
    })
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
