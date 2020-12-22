searchValue = window.location.href.substring(window.location.href.indexOf("?user=")+6);
setPFP();
docRef = firebase.firestore().collection("users").doc(searchValue);
docRef.get().then(function(doc) {
    document.getElementById('profile-welcome').innerText = `${doc.data().firstName} ${doc.data().lastName}`;
});

function setPFP() {
    searchValue;
    var picRef = firebase.storage().ref(`users/${searchValue}.jpg`).getDownloadURL().then( 
        (url) => {
            document.getElementById(`profile-img`).src=url;
    }).catch((error) => {
        var picRef = firebase.storage().ref(`users/${searchValue}.png`).getDownloadURL().then(
            (url) => {
                document.getElementById(`profile-img`).src=url;
        }).catch((error) => {
            picRef = firebase.storage().ref(`users/default${searchValue.charCodeAt(0)%6}.jpg`).getDownloadURL().then(
                (url) => {
                    document.getElementById(`profile-img`).src=url;
            });
        });
    });
}

function getMovies(){
    const baseURL = "https://api.themoviedb.org/3/";
    const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API

    document.getElementById("profile-movies-list").innerHTML = "";
    //document.getElementById("profile-movies-list-1").innerHTML = "";
    //document.getElementById("profile-movies-list-2").innerHTML = "";
    var docRef = db.collection("users").doc(searchValue).collection("MovieList");
        docRef.get().then((querySnapshot) => {
            querySnapshot.forEach((movie) => {
                
                if (movie.id != "abcdefghij") {
                    let url = baseURL + "movie/" + movie.id + "?api_key=" + API_key;
                    fetch(url).then(result => result.json()).then((data2) => {
                        if(data2.production_companies.length == 0){
                            movie_maker = "&nbsp;";
                        }
                        else{
                            movie_maker = data2.production_companies[0].name;
                        }
                        
                        poster_image = "https://image.tmdb.org/t/p/w500" + data2.poster_path;
        
                        const html =
                    `
                    <div class="card card-box" style="width: 100%">
                        <div class="card-body">
                            <div class="card-title">
                                <div class="col-12">
                                    <h4>${data2.title}</h4>
                                    <p class="text-muted">${movie_maker}</p>
                                </div>
                            </div>
                            <div class="card-text">
                                <div class="thumb-lg member-thumb mx-auto mb-2"><img src="${poster_image}" class=" img-thumbnail" alt="profile-image"></div>
                                <i class="fa fa-2x" id="thumbs-${data2.id}" aria-hidden="true"></i>
                                <div id = "review-movie-${movie.id}" style="align-self: stretch; overflow-wrap: break-word;">
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    movieDiv = document.getElementById(`profile-movies-list`);
                    movieDiv.insertAdjacentHTML('beforeend',html);
                    }).then(function() {
                        if (movie.data().rating == 1) {
                            document.getElementById(`thumbs-${movie.id}`).classList.add("fa-thumbs-o-up");
                            document.getElementById(`thumbs-${movie.id}`).style.color = "#4278f5";
                        } else if (movie.data().rating == -1) {
                            document.getElementById(`thumbs-${movie.id}`).classList.add("fa-thumbs-o-down");
                            document.getElementById(`thumbs-${movie.id}`).style.color = "#f55142";
                        }
                        document.getElementById(`review-movie-${movie.id}`).innerText = movie.data().review;
                    })
            
                }
            });
        });
}

function getShows(){
    const baseURL = "https://api.themoviedb.org/3/";
    const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
    showsDiv = document.getElementById("profile-shows-list");
    showsDiv.innerHTML = "";
    var docRef = db.collection("users").doc(searchValue).collection("ShowsList");
        docRef.get().then((querySnapshot) => {
            querySnapshot.forEach((show) => {
                if (show.id != "abcdefghij") {
                    let url = baseURL + "tv/" + show.id + "?api_key=" + API_key;
                    fetch(url).then(result => result.json()).then((data2) => {
                        if(data2.production_companies.length == 0){
                            movie_maker = "&nbsp;";
                        }
                        else{
                            movie_maker = data2.production_companies[0].name;
                        }
                        
                        poster_image = "https://image.tmdb.org/t/p/w500" + data2.poster_path;
        
                        const html =
                    `
                    <div class="card card-box" style="width: 100%">
                        <div class="card-body">
                            <div class="card-title">
                                <div class="col-12">
                                    <h4>${data2.name}</h4>
                                    <p class="text-muted">${movie_maker}</p>
                                </div>
                            </div>
                            <div class="card-text">
                                <div class="thumb-lg member-thumb mx-auto mb-2"><img src="${poster_image}" class=" img-thumbnail" alt="profile-image"></div>
                                <i class="fa fa-2x" id="thumbs-${data2.id}" aria-hidden="true"></i>
                                <div id = "review-show-${show.id}" style="align-self: stretch; overflow-wrap: break-word;">
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    showDiv = document.getElementById("profile-shows-list");
                    showDiv.insertAdjacentHTML('beforeend',html);
                    }).then(function() {
                        if (show.data().rating == 1) {
                            document.getElementById(`thumbs-${data2.id}`).classList.add("fa-thumbs-o-up");
                            document.getElementById(`like-${show.id}`).style.color = "#4278f5";
                        } else if (show.data().rating == -1) {
                            document.getElementById(`dislike-${show.id}`).style.color = "#f55142";
                        }
                        document.getElementById(`review-show-${show.id}`).value = show.data().review;
                    })
                }
            });
        });
}
showMovies();
function showMovies(){
    getMovies();
    document.getElementById("profile-music-list").style.display = 'none';
    document.getElementById("profile-shows-list").style.display = 'none';
    document.getElementById("profile-movies-list").style.display = 'flex';
    document.getElementById("profile-music-btn").classList.remove('active');
    document.getElementById("profile-shows-btn").classList.remove('active');
    document.getElementById("profile-movies-btn").classList.add('active');
}
function showShows(){
    getShows();
    document.getElementById("profile-music-list").style.display = 'none';
    document.getElementById("profile-movies-list").style.display = 'none';
    document.getElementById("profile-shows-list").style.display = 'flex';
    document.getElementById("profile-music-btn").classList.remove('active');
    document.getElementById("profile-shows-btn").classList.add('active');
    document.getElementById("profile-movies-btn").classList.remove('active');
}
function showMusic(){
    getMusic();
    document.getElementById("profile-shows-list").style.display = 'none';
    document.getElementById("profile-movies-list").style.display = 'none';
    document.getElementById("profile-music-list").style.display = 'flex';
    document.getElementById("profile-music-btn").classList.add('active');
    document.getElementById("profile-shows-btn").classList.remove('active');
    document.getElementById("profile-movies-btn").classList.remove('active');
}