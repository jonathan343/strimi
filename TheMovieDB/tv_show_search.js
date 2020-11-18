const baseURL = "https://api.themoviedb.org/3/";
const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API

//installed npm i node-fetch --save
//const fetch = require("node-fetch");

function getTVShowID(tv_show){
    let tv_show_id;
    let url = baseURL + "search/tv?api_key=" + API_key + "&query=\"" + tv_show + "\"";
    //console.log(url);
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
