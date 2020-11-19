var db = firebase.firestore();
updateLiveView();

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
            movie_id = info[i].id;
            

            const baseURL = "https://api.themoviedb.org/3/";
            const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
            
            let url = baseURL + "movie/" + movie_id + "?api_key=" + API_key;
            fetch(url)
            .then(result => result.json())
            .then((data2) => {
                // console.log(data2.production_companies);
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
                        
                        <button type="button" id="" class="btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" onclick="">Read Reviews</button>
                        <div class="mt-2">
                            <div class="row">
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="followers-${11}">11</h4>
                                        <p class="mb-0 text-muted">Likes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="following-$${11}">11</h4>
                                        <p class="mb-0 text-muted">Dislikes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="reviewCount-${11}">11</h4>
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
            })
        
            //test = getMovieDetails(movie_id);
        } 
    
    })
}

getTopMovies();

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
                    movie_maker = "&nbsp;";
                }
                else{
                    movie_maker = data2.networks[0].name;
                }
                
                poster_image = "https://image.tmdb.org/t/p/w500" + data2.poster_path;

                const html =
            `
            <div class="col-lg-4 mt-2">
                <div class="text-center card-box">
                    <div class="member-card pb-2">
                        <div class="col-12">
                            <h4>${data2.name}</h4>
                            <p class="text-muted">${movie_maker}</p>
                        </div>
                        <div class="thumb-lg member-thumb mx-auto mb-2"><img src="${poster_image}" class=" img-thumbnail" alt="profile-image"></div>
                        
                        <button type="button" id="" class="btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" onclick="">Read Reviews</button>
                        <div class="mt-2">
                            <div class="row">
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="followers-${11}">11</h4>
                                        <p class="mb-0 text-muted">Likes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="following-$${11}">11</h4>
                                        <p class="mb-0 text-muted">Dislikes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="reviewCount-${11}">11</h4>
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
            })
        
            //test = getMovieDetails(movie_id);
        } 
    
    })
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
