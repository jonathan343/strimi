//Run: node movie_search.js

//Global variables
let info;
let url;
const baseURL = "https://api.themoviedb.org/3/";
const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API

//installed npm i node-fetch --save
//const fetch = require("node-fetch");

function getMovieID(movie){
    let movie_id;
    url = baseURL + "search/movie?api_key=" + API_key + "&query=" + movie;
    //console.log(url);
    fetch(url)
    .then(result => result.json())
    .then((data) => {
        info = data.results.slice(0, 15);
        for(let i = 0; i < info.length; i++){
            movie_id = info[i].id;
            getMovieDetails(movie_id);      
        } 
    })
}

function getMovieDetails(movie_id){
    url = baseURL + "movie/" + movie_id + "?api_key=" + API_key;

    fetch(url)
    .then(result => result.json())
    .then((data) => {
        //console.log(data)
        getMovieID(movie_id);
        getTitle(data.title);
        getGenres(data.genres);
        getOverview(data.overview);
        getPopularity(data.popularity);
        getProductionCompany(data.production_companies);
        getReleaseDate(data.release_date);
        getPosterImage(data.poster_path);
        getRunTime(data.runtime);
    })
}

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

getMovieID("avengers");