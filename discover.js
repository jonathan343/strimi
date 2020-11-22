var db = firebase.firestore();

function addMovie(MovieID){
    var user = firebase.auth().currentUser;
        if(user){
        db.collection("users").doc(user.uid).collection("MovieList").doc(MovieID).set({}).then(function(){
            console.log("Movie Id succesfully written in database");
        });
    }
    else{
        console.log("No user is signed in");
    }  
}

function addTvShow(TvShowID){
    var user = firebase.auth().currentUser;
    if(user){
        db.collection("users").doc(user.uid).collection("TvShowList").doc(TvShowID).set({}).then(function(){
        console.log("Tv Show Id succesfully written in database");
        });
    }
    else{
        console.log("No user is signed in");
    }  
}

function addSong(SongID){
    var user = firebase.auth().currentUser;
    if(user){
        db.collection("users").doc(user.uid).collection("SongList").doc(SongID).set({}).then(function(){
        console.log("Song Id succesfully written in database");
        });
    }
    else{
        console.log("No user is signed in");
    }  
}

function createMovieCard(){
    var user = firebase.auth().currentUser;
    var MovieList = db.collection("users").doc(user.uid).collection("MovieList");

    MovieList.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc){
                var Movie = doc.id;
                getMovieDetails(Movie);    
            }
            else{
                console.log("User has no movies");
            }
        });
    });
}

function createTVShowCard(){
    var user = firebase.auth().currentUser;
    var TvShowList = db.collection("users").doc(user.uid).collection("TvShowList");

    TvShowList.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc){
                var TVShow = doc.id;
                getTVShowDetails(TVShow);    
            }
            else{
                console.log("User has no Tv Shows");
            }
        });
    });
}

function createSongCard(){
    var user = firebase.auth().currentUser;
    var SongList = db.collection("users").doc(user.uid).collection("SongList");

    SongList.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc){
                var Song = doc.id;
                //getTVShowDetails(Song);    change to Abraham's song information function
            }
            else{
                console.log("User has no Song");
            }
        });
    });
}

function getMovieDetails(movie_id){
    const baseURL = "https://api.themoviedb.org/3/";
    const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
    
    let url = baseURL + "movie/" + movie_id + "?api_key=" + API_key;
    details = new Array;
    fetch(url)
    .then(result => result.json())
    .then((data) => {
        //console.log(data);
        getMovieID(movie_id);
        getTitle(data.title);
        getGenres(data.genres);
        getOverview(data.overview);
        getPopularity(data.popularity);
        getProductionCompany(data.production_companies);
        getReleaseDate(data.release_date);
        getPosterImage(data.poster_path);
        getRunTime(data.runtime);
        details = [movie_id,data.title,data.production_companies[0].name];
        return details;
    })
}

// function getCompanyName(movie_id){
//     const baseURL = "https://api.themoviedb.org/3/";
//     const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
    
//     let url = baseURL + "movie/" + movie_id + "?api_key=" + API_key;
//     fetch(url)
//     .then(result => result.json())
//     .then((data) => {
//         console.log(data.production_companies[0].name);
//         return data.production_companies[0].name;
//     })
// }

function getTopMovies(){
    const baseURL = "https://api.themoviedb.org/3/";
    const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
    
    let url = baseURL + "movie/popular" + "?api_key=" + API_key + "&language=en-US&page=1";
    fetch(url)
    .then(result => result.json())
    .then((data) => {

        info = data.results.slice(0, 20);
        var movieDiv = document.getElementById('discover-movies-list');
        movieDiv.innerHTML = "";
        for(let i = 0; i < info.length; i++){
            let movie_id = info[i].id;
            

            const baseURL = "https://api.themoviedb.org/3/";
            const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
            
            let url = baseURL + "movie/" + movie_id + "?api_key=" + API_key;
            fetch(url)
            .then(result => result.json())
            .then((data2) => {
                if(data2.production_companies.length == 0){
                    movie_maker = "&nbsp;";
                }
                else{
                    movie_maker = data2.production_companies[0].name;
                }
                
                poster_image = "https://image.tmdb.org/t/p/w500" + info[i].poster_path;

                const html =
            `
            <div class="col-lg-4 mt-2">
                <div class="text-center card-box">
                    <div class="member-card pb-2">
                        <div class="col-12">
                            <h4>${info[i].title}</h4>
                            <p class="text-muted">${movie_maker}</p>
                        </div>
                        <div class="thumb-lg member-thumb mx-auto mb-2"><img src="${poster_image}" class=" img-thumbnail" alt="profile-image"></div>
                        
                        <button type="button" id="" class="mr-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#modal-${data2.id}" onclick="">Read Reviews</button>
                        <button type="button" id="" class="ml-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#modal2-${data2.id}" onclick="writeMovieReview('${data2.id}')">Write Review</button>
                        <div class="mt-2">
                            <div class="row">
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="likes-${data2.id}">0</h4>
                                        <p class="mb-0 text-muted">Likes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="dislikes-${data2.id}">0</h4>
                                        <p class="mb-0 text-muted">Dislikes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="reviewCount-${data2.id}">0</h4>
                                        <p class="mb-0 text-muted">Reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            movieDiv.insertAdjacentHTML('beforeend',html);

            const modal =
            `
            <div class="modal fade" id="modal-${data2.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">${info[i].title} Reviews</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" id="reviews-${data2.id}">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modal2-${data2.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Write a Review for: ${info[i].title}</h5>
                            <button id="close-btn-${data2.id}" type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <textarea id="review-${data2.id}" class="form-control" aria-label="With textarea" placeholder="Write your Review Here..."></textarea>
                            </div>
                            <button id="dislike-${data2.id}" class="dislike" onclick="dislikeClick('${data2.id}')">
                                <i class="fa fa-thumbs-o-down fa-2x" aria-hidden="true"></i>
                            </button>
                            <button id="like-${data2.id}" class="like" onclick="likeClick('${data2.id}')">
                                <i class="fa fa-thumbs-o-up fa-2x" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="saveReview('${data2.id}')" >Save Review</button>
                        </div>
                    </div>
                </div>
            </div>
            `;

            document.body.insertAdjacentHTML('beforeend',modal);
            document.getElementById(`reviews-${data2.id}`).innerHTML = "";
            var user = firebase.auth().currentUser;
            if (user){
                var selfRef = db.collection("users").doc(user.uid);
                selfRef.get().then(function(doc5) {
                    if (doc5.exists) {
                        var reviewRef = db.collection("users").doc(doc5.id).collection("MovieList").doc(`${data2.id}`);
                        reviewRef.get().then(function(doc6) {
                            console.log(doc5.id,user.uid);
                            if (doc6.exists) {
                                var reviewDiv = document.getElementById(`reviews-${data2.id}`);
                                // console.log(doc6.data().rating);
                                if(doc6.data().rating == 1){
                                    // console.log("like detected");
                                    // likeTotal +=1;
                                    var likes = parseInt(document.getElementById(`likes-${data2.id}`).innerHTML);
                                    likes+=1;
                                    document.getElementById(`likes-${data2.id}`).innerHTML = likes;
                                    
                                }
                                else if(doc6.data().rating == -1){
                                    // dislikeTotal +=1;
                                    var dislikes = parseInt(document.getElementById(`dislikes-${data2.id}`).innerHTML);
                                    dislikes+=1;
                                    document.getElementById(`dislikes-${data2.id}`).innerHTML = dislikes;
                                }
                                // reviewCount +=1;
                                var reviewCount = parseInt(document.getElementById(`reviewCount-${data2.id}`).innerHTML);
                                reviewCount+=1;
                                document.getElementById(`reviewCount-${data2.id}`).innerHTML = reviewCount;
                                const reviewData = 
                                `
                                <h4>${doc5.data().firstName} ${doc5.data().lastName}</h4>
                                <h5>${doc6.data().review}</h5>
                                <p class="mb-0">&nbsp;</p>
                                `;
                                reviewDiv.insertAdjacentHTML('beforeend',reviewData);


                                
                            }
                        }).catch(function(error) {
                            console.log("Error getting document1:", error);
                        });
                    }
                })
                .catch(function(error) {
                    console.log("Error getting document2:", error);
                });
                
                var docRef = db.collection("users").doc(user.uid).collection("friends");
                docRef.get().then((querySnapshot) => {
                        // likeTotal = 0;
                        // dislikeTotal = 0;
                        // reviewCount = 0;
                    querySnapshot.forEach((doc) => {
                        var friendRef = db.collection("users").doc(doc.id);
                        friendRef.get().then(function(doc5) {
                            if (doc5.exists) {
                                var reviewRef = db.collection("users").doc(doc5.id).collection("MovieList").doc(`${data2.id}`);
                                reviewRef.get().then(function(doc6) {
                                    console.log(doc5.id,user.uid);
                                    if (doc6.exists) {
                                        var reviewDiv = document.getElementById(`reviews-${data2.id}`);
                                        // console.log(doc6.data().rating);
                                        if(doc6.data().rating == 1){
                                            // console.log("like detected");
                                            // likeTotal +=1;
                                            var likes = parseInt(document.getElementById(`likes-${data2.id}`).innerHTML);
                                            likes+=1;
                                            document.getElementById(`likes-${data2.id}`).innerHTML = likes;
                                            
                                        }
                                        else if(doc6.data().rating == -1){
                                            // dislikeTotal +=1;
                                            var dislikes = parseInt(document.getElementById(`dislikes-${data2.id}`).innerHTML);
                                            dislikes+=1;
                                            document.getElementById(`dislikes-${data2.id}`).innerHTML = dislikes;
                                        }
                                        // reviewCount +=1;
                                        var reviewCount = parseInt(document.getElementById(`reviewCount-${data2.id}`).innerHTML);
                                        reviewCount+=1;
                                        document.getElementById(`reviewCount-${data2.id}`).innerHTML = reviewCount;
                                        const reviewData = 
                                        `
                                        <h4>${doc5.data().firstName} ${doc5.data().lastName}</h4>
                                        <h5>${doc6.data().review}</h5>
                                        <p class="mb-0">&nbsp;</p>
                                        `;
                                        reviewDiv.insertAdjacentHTML('beforeend',reviewData);


                                        
                                    }
                                }).catch(function(error) {
                                    console.log("Error getting document1:", error);
                                });
                            }
                        })
                        .catch(function(error) {
                            console.log("Error getting document2:", error);
                        });
                        
                        })
                        // console.log("likes",likeTotal);
                        // console.log("dislikes",dislikeTotal);
                        // console.log("reviewCount",reviewCount);
                        // const vals = [likeTotal,dislikeTotal,reviewCount];

                        // document.getElementById(`likes-${data2.id}`).innerHTML = likeTotal;
                        // document.getElementById(`dislikes-${data2.id}`).innerHTML = dislikeTotal;
                        // document.getElementById(`reviewCount-${data2.id}`).innerHTML = reviewCount;

                    });
            }
            else{
                console.log("Not signed in");
            }
            });
            //test = getMovieDetails(movie_id);
        }     
    })
}

function likeClick(movie_id){
    btn = document.getElementById(`like-${movie_id}`).style.color = "#4278f5";
    btn2 = document.getElementById(`dislike-${movie_id}`).style.color = "#000000";
}

function dislikeClick(movie_id){
    btn = document.getElementById(`dislike-${movie_id}`).style.color = "#f55142";
    btn2 = document.getElementById(`like-${movie_id}`).style.color = "#000000";
}

function saveReview(movie_id){
    dislikeBtn = document.getElementById(`dislike-${movie_id}`).style.color;
    likeBtn = document.getElementById(`like-${movie_id}`).style.color;
    var rating = 0;
    var user = firebase.auth().currentUser;
    var review = document.getElementById(`review-${movie_id}`).value;

    if (likeBtn == "rgb(66, 120, 245)"){
        rating = 1;
        console.log("Like");
    }
    if (dislikeBtn == "rgb(245, 81, 66)"){
        rating = -1;
        console.log("Dislike");
    }

    if (user) {
        console.log(rating);
        db.collection("users").doc(user.uid).collection("MovieList").doc(movie_id).set({
            review: review,
            rating, rating
        }).then(function() {
            console.log("Review Written Successfully!");
            document.getElementById(`close-btn-${movie_id}`).click();
            
        });
    } else {
        console.log("Not currently signed in");
    }
    // getTopMovies();
}

function writeMovieReview(movie_id){
    var user = firebase.auth().currentUser;
    var reviewRef = db.collection("users").doc(user.uid).collection("MovieList").doc(`${movie_id}`);
    reviewRef.get().then(function(doc) {
        if (doc.exists) {
            document.getElementById(`review-${movie_id}`).innerHTML = doc.data().review;
            if(doc.data().rating == 1){
                btn = document.getElementById(`like-${movie_id}`).style.color = "#4278f5";
            }
            if(doc.data().rating == -1){
                btn = document.getElementById(`dislike-${movie_id}`).style.color = "#f55142";
            }
        }
        })
        .catch(function(error) {
            console.log("Error getting document1:", error);
        });
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        getTopMovies();
        // getTopShows();
    }
  });

function getMovieID(movie_id){
    console.log(movie_id);
}

function getTitle(movie_name){
    console.log("Title: " + movie_name);
    console.log("--------------------");
}

function getGenres(genres){
    console.log("Genres: ");
    for(let i = 0; i < genres.length; i++){
        console.log(genres[i].name);
    }
    console.log("--------------------");
}

function getOverview(overview){
    console.log("Overview: " + overview);
    console.log("--------------------");
}

function getPopularity(popularity){
    console.log("Popularity: " + popularity);
    console.log("--------------------");
}

function getProductionCompany(production_company){
    console.log("Production Companies: ");
    for(let i = 0; i < production_company.length; i++){
        console.log("Name: " + production_company[i].name);
        if(production_company[i].logo_path != null){
            url = "https://image.tmdb.org/t/p/w500" + production_company[i].logo_path;
            console.log("logo url: " + url);
        }  
    }
    console.log("--------------------");
}

function getReleaseDate(release_date){
    console.log("Release Date: " + release_date);
    console.log("--------------------");
}

function getPosterImage(poster_path){
    if(poster_path != null){
        url = "https://image.tmdb.org/t/p/w500" + poster_path;
        console.log("Poster url: " + url);
        console.log("--------------------");
    }
}

function getRunTime(run_time){
    let run_time_hours = Math.floor(run_time / 60);
    let run_time_minutes = run_time % 60;

    console.log("hours: " + run_time_hours);
    console.log("minutes: " + run_time_minutes);
    console.log("Run Time: " + run_time);
    console.log("--------------------");
}

function getTVShowDetails(tv_show_id){
    let url = baseURL + "tv/" + tv_show_id + "?api_key=" + API_key;
    console.log(url);
    fetch(url)
    .then(result => result.json())
    .then((data) => {
        //console.log(data);
        getTvShowID(tv_show_id);
        getTitle(data.name);
        getGenres(data.genres);
        getOverview(data.overview);
        getPopularity(data.popularity);
        getNetworkCompany(data.networks);
        getReleaseDate(data.release_date);
        getPosterImage(data.poster_path);
        getRunTime(data.runtime);
    })
}

function getTvShowID(tv_show_id){
    console.log(tv_show_id);
}

function getTitle(tv_show_name){
    console.log("Title: " + tv_show_name);
    console.log("--------------------");
}

function getGenres(genres){
    console.log("Genres: ");
    for(let i = 0; i < genres.length; i++){
        console.log(genres[i].name);
    }
    console.log("--------------------");
}

function getOverview(overview){
    console.log("Overview: " + overview);
    console.log("--------------------");
}

function getPopularity(popularity){
    console.log("Popularity: " + popularity);
    console.log("--------------------");
}

function getNetworkCompany(network_company){
    console.log("Network Companies: ");
    for(let i = 0; i < network_company.length; i++){
        console.log("Name: " + network_company[i].name);
        if(network_company[i].logo_path != null){
            url = "https://image.tmdb.org/t/p/w500" + network_company[i].logo_path;
            console.log("logo url: " + url);
        }  
    }
    console.log("--------------------");
}

function getReleaseDate(release_date){
    console.log("Release Date: " + release_date);
    console.log("--------------------");
}

function getPosterImage(poster_path){
    if(poster_path != null){
        url = "https://image.tmdb.org/t/p/w500" + poster_path;
        console.log("Poster url: " + url);
        console.log("--------------------");
    }
}

function getRunTime(run_time){
    let run_time_hours = Math.floor(run_time / 60);
    let run_time_minutes = run_time % 60;

    console.log("hours: " + run_time_hours);
    console.log("minutes: " + run_time_minutes);
    console.log("Run Time: " + run_time);
    console.log("--------------------");
}

function getTopShows(){
    const baseURL = "https://api.themoviedb.org/3/";
    const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
    
    let url = baseURL + "tv/popular" + "?api_key=" + API_key + "&language=en-US&page=1";
    fetch(url)
    .then(result => result.json())
    .then((data) => {

        info = data.results.slice(0, 20);
        var showsDiv = document.getElementById('discover-shows-list');
        showsDiv.innerHTML = "";
        for(let i = 0; i < info.length; i++){
            show_id = info[i].id;    

            const baseURL = "https://api.themoviedb.org/3/";
            const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
            
            let url = baseURL + "tv/" + show_id + "?api_key=" + API_key;
            fetch(url)
            .then(result => result.json())
            .then((data2) => {

                if(data2.networks.length == 0){
                    show_maker = "&nbsp;";
                }
                else{
                    show_maker = data2.networks[0].name;
                }
                
                poster_image = "https://image.tmdb.org/t/p/w500" + data2.poster_path;

                const html =
            `
            <div class="col-lg-4 mt-2">
                <div class="text-center card-box">
                    <div class="member-card pb-2">
                        <div class="col-12">
                            <h4>${data2.name}</h4>
                            <p class="text-muted">${show_maker}</p>
                        </div>
                        <div class="thumb-lg member-thumb mx-auto mb-2"><img src="${poster_image}" class=" img-thumbnail" alt="profile-image"></div>
                        
                        <button type="button" id="" class="mr-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#modal-show-${data2.id}" onclick="">Read Reviews</button>
                        <button type="button" id="" class="ml-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#modal2-show-${data2.id}" onclick="writeShowReview('${data2.id}')">Write Review</button>
                        <div class="mt-2">
                            <div class="row">
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="likes-show-${data2.id}">0</h4>
                                        <p class="mb-0 text-muted">Likes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="dislikes-show-${data2.id}">0</h4>
                                        <p class="mb-0 text-muted">Dislikes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="reviewCount-show-${data2.id}">0</h4>
                                        <p class="mb-0 text-muted">Reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            showsDiv.insertAdjacentHTML('beforeend',html);
            
            const modal =
            `
            <div class="modal fade" id="modal-show-${data2.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">${data2.name} Reviews</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" id="reviews-show-${data2.id}">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal fade" id="modal2-show-${data2.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Write a Review for: ${data2.name}</h5>
                            <button id="close-show-btn-${data2.id}" type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <textarea id="review-show-${data2.id}" class="form-control" aria-label="With textarea" placeholder="Write your Review Here..."></textarea>
                            </div>
                            <button id="dislike-show-${data2.id}" class="dislike" onclick="dislikeShowClick('${data2.id}')">
                                <i class="fa fa-thumbs-o-down fa-2x" aria-hidden="true"></i>
                            </button>
                            <button id="like-show-${data2.id}" class="like" onclick="likeShowClick('${data2.id}')">
                                <i class="fa fa-thumbs-o-up fa-2x" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="saveShowReview('${data2.id}')" >Save Review</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend',modal);
            document.getElementById(`reviews-show-${data2.id}`).innerHTML = "";

            var user = firebase.auth().currentUser;
            if (user){
                var selfRef = db.collection("users").doc(user.uid);
                selfRef.get().then(function(doc5) {
                    if (doc5.exists) {
                        var reviewRef = db.collection("users").doc(doc5.id).collection("ShowsList").doc(`${data2.id}`);
                        reviewRef.get().then(function(doc6) {
                            console.log(doc5.id,user.uid);
                            if (doc6.exists) {
                                var reviewDiv = document.getElementById(`reviews-show-${data2.id}`);
                                // console.log(doc6.data().rating);
                                if(doc6.data().rating == 1){
                                    // console.log("like detected");
                                    // likeTotal +=1;
                                    var likes = parseInt(document.getElementById(`likes-show-${data2.id}`).innerHTML);
                                    likes+=1;
                                    document.getElementById(`likes-show-${data2.id}`).innerHTML = likes;
                                    
                                }
                                else if(doc6.data().rating == -1){
                                    // dislikeTotal +=1;
                                    var dislikes = parseInt(document.getElementById(`dislikes-show-${data2.id}`).innerHTML);
                                    dislikes+=1;
                                    document.getElementById(`dislikes-show-${data2.id}`).innerHTML = dislikes;
                                }
                                // reviewCount +=1;
                                var reviewCount = parseInt(document.getElementById(`reviewCount-show-${data2.id}`).innerHTML);
                                reviewCount+=1;
                                document.getElementById(`reviewCount-show-${data2.id}`).innerHTML = reviewCount;
                                const reviewData = 
                                `
                                <h4>${doc5.data().firstName} ${doc5.data().lastName}</h4>
                                <h5>${doc6.data().review}</h5>
                                <p class="mb-0">&nbsp;</p>
                                `;
                                reviewDiv.insertAdjacentHTML('beforeend',reviewData);
                                
                            }
                        }).catch(function(error) {
                            console.log("Error getting document1:", error);
                        });
                    }
                })
                .catch(function(error) {
                    console.log("Error getting document2:", error);
                });


                var docRef = db.collection("users").doc(user.uid).collection("friends");
                docRef.get().then((querySnapshot) => {
                        // likeTotal = 0;
                        // dislikeTotal = 0;
                        // reviewCount = 0;
                    querySnapshot.forEach((doc) => {
                        var friendRef = db.collection("users").doc(doc.id);
                        friendRef.get().then(function(doc5) {
                            if (doc5.exists) {
                                var reviewRef = db.collection("users").doc(doc5.id).collection("ShowsList").doc(`${data2.id}`);
                                reviewRef.get().then(function(doc6) {
                                    console.log(doc5.id,user.uid);
                                    if (doc6.exists) {
                                        var reviewDiv = document.getElementById(`reviews-show-${data2.id}`);
                                        // console.log(doc6.data().rating);
                                        if(doc6.data().rating == 1){
                                            // console.log("like detected");
                                            // likeTotal +=1;
                                            var likes = parseInt(document.getElementById(`likes-show-${data2.id}`).innerHTML);
                                            likes+=1;
                                            document.getElementById(`likes-show-${data2.id}`).innerHTML = likes;
                                            
                                        }
                                        else if(doc6.data().rating == -1){
                                            // dislikeTotal +=1;
                                            var dislikes = parseInt(document.getElementById(`dislikes-show-${data2.id}`).innerHTML);
                                            dislikes+=1;
                                            document.getElementById(`dislikes-show-${data2.id}`).innerHTML = dislikes;
                                        }
                                        // reviewCount +=1;
                                        var reviewCount = parseInt(document.getElementById(`reviewCount-show-${data2.id}`).innerHTML);
                                        reviewCount+=1;
                                        document.getElementById(`reviewCount-show-${data2.id}`).innerHTML = reviewCount;
                                        const reviewData = 
                                        `
                                        <h4>${doc5.data().firstName} ${doc5.data().lastName}</h4>
                                        <h5>${doc6.data().review}</h5>
                                        <p class="mb-0">&nbsp;</p>
                                        `;
                                        reviewDiv.insertAdjacentHTML('beforeend',reviewData);
                                        
                                    }
                                }).catch(function(error) {
                                    console.log("Error getting document1:", error);
                                });
                            }
                        })
                        .catch(function(error) {
                            console.log("Error getting document2:", error);
                        });
                        
                        })
                        // console.log("likes",likeTotal);
                        // console.log("dislikes",dislikeTotal);
                        // console.log("reviewCount",reviewCount);
                        // const vals = [likeTotal,dislikeTotal,reviewCount];

                        // document.getElementById(`likes-${data2.id}`).innerHTML = likeTotal;
                        // document.getElementById(`dislikes-${data2.id}`).innerHTML = dislikeTotal;
                        // document.getElementById(`reviewCount-${data2.id}`).innerHTML = reviewCount;

                    });
            }
            else{
                console.log("Not signed in");
            }

            })
        
            //test = getMovieDetails(movie_id);
        } 
    
    })
}

function likeShowClick(movie_id){
    btn = document.getElementById(`like-show-${movie_id}`).style.color = "#4278f5";
    btn2 = document.getElementById(`dislike-show-${movie_id}`).style.color = "#000000";
}

function dislikeShowClick(movie_id){
    btn = document.getElementById(`dislike-show-${movie_id}`).style.color = "#f55142";
    btn2 = document.getElementById(`like-show-${movie_id}`).style.color = "#000000";
}

function likeSongClick(movie_id){
    btn = document.getElementById(`like-song-${movie_id}`).style.color = "#4278f5";
    btn2 = document.getElementById(`dislike-song-${movie_id}`).style.color = "#000000";
}

function dislikeSongClick(movie_id){
    btn = document.getElementById(`dislike-song-${movie_id}`).style.color = "#f55142";
    btn2 = document.getElementById(`like-song-${movie_id}`).style.color = "#000000";
}

function saveShowReview(movie_id){
    dislikeBtn = document.getElementById(`dislike-show-${movie_id}`).style.color;
    likeBtn = document.getElementById(`like-show-${movie_id}`).style.color;
    var rating = 0;
    var user = firebase.auth().currentUser;
    var review = document.getElementById(`review-show-${movie_id}`).value;

    if (likeBtn == "rgb(66, 120, 245)"){
        rating = 1;
        console.log("Like");
    }
    if (dislikeBtn == "rgb(245, 81, 66)"){
        rating = -1;
        console.log("Dislike");
    }

    if (user) {
        console.log(rating);
        db.collection("users").doc(user.uid).collection("ShowsList").doc(movie_id).set({
            review: review,
            rating, rating
        }).then(function() {
            console.log("Review Written Successfully!");
            document.getElementById(`close-show-btn-${movie_id}`).click();
            
        });
    } else {
        console.log("Not currently signed in");
    }

    // getTopShows();
}

function writeShowReview(movie_id){
    var user = firebase.auth().currentUser;
    var reviewRef = db.collection("users").doc(user.uid).collection("ShowsList").doc(`${movie_id}`);
    reviewRef.get().then(function(doc) {
        if (doc.exists) {
            document.getElementById(`review-show-${movie_id}`).innerHTML = doc.data().review;
            if(doc.data().rating == 1){
                btn = document.getElementById(`like-show-${movie_id}`).style.color = "#4278f5";
            }
            if(doc.data().rating == -1){
                btn = document.getElementById(`dislike-show-${movie_id}`).style.color = "#f55142";
            }
        }
        })
        .catch(function(error) {
            console.log("Error getting document1:", error);
        });
}

function saveSongReview(movie_id){
    dislikeBtn = document.getElementById(`dislike-song-${movie_id}`).style.color;
    likeBtn = document.getElementById(`like-song-${movie_id}`).style.color;
    var rating = 0;
    var user = firebase.auth().currentUser;
    var review = document.getElementById(`review-song-${movie_id}`).value;

    if (likeBtn == "rgb(66, 120, 245)"){
        rating = 1;
        console.log("Like");
    }
    if (dislikeBtn == "rgb(245, 81, 66)"){
        rating = -1;
        console.log("Dislike");
    }

    if (user) {
        console.log(rating);
        db.collection("users").doc(user.uid).collection("MusicList").doc(movie_id).set({
            review: review,
            rating, rating
        }).then(function() {
            console.log("Review Written Successfully!");
            document.getElementById(`close-song-btn-${movie_id}`).click();
            
        });
    } else {
        console.log("Not currently signed in");
    }

    // getTopShows();
}

function writeSongReview(movie_id){
    var user = firebase.auth().currentUser;
    var reviewRef = db.collection("users").doc(user.uid).collection("MusicList").doc(`${movie_id}`);
    reviewRef.get().then(function(doc) {
        if (doc.exists) {
            document.getElementById(`review-song-${movie_id}`).innerHTML = doc.data().review;
            if(doc.data().rating == 1){
                btn = document.getElementById(`like-song-${movie_id}`).style.color = "#4278f5";
            }
            if(doc.data().rating == -1){
                btn = document.getElementById(`dislike-song-${movie_id}`).style.color = "#f55142";
            }
        }
        })
        .catch(function(error) {
            console.log("Error getting document1:", error);
        });
}

//showMovies();
function showMovies(){
    getTopMovies();
    document.getElementById("discover-music-list").style.display = 'none';
    document.getElementById("discover-shows-list").style.display = 'none';
    document.getElementById("discover-movies-list").style.display = 'block';
    document.getElementById("discover-music-btn").classList.remove('active');
    document.getElementById("discover-shows-btn").classList.remove('active');
    document.getElementById("discover-movies-btn").classList.add('active');
}
function showShows(){
    getTopShows();
    document.getElementById("discover-music-list").style.display = 'none';
    document.getElementById("discover-movies-list").style.display = 'none';
    document.getElementById("discover-shows-list").style.display = 'block';
    document.getElementById("discover-music-btn").classList.remove('active');
    document.getElementById("discover-shows-btn").classList.add('active');
    document.getElementById("discover-movies-btn").classList.remove('active');
}
function showMusic(){
    document.getElementById("discover-shows-list").style.display = 'none';
    document.getElementById("discover-movies-list").style.display = 'none';
    document.getElementById("discover-music-list").style.display = 'block';
    document.getElementById("discover-music-btn").classList.add('active');
    document.getElementById("discover-shows-btn").classList.remove('active');
    document.getElementById("discover-movies-btn").classList.remove('active');
}
