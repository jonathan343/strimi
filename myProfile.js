var db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    // if (user) {
    //     var fname = user.email;
    //     document.getElementById('sign-in-form').style.display='none';
    //     alert('Welcome! ' + fname);
    // }
    if(user){
        var docRef = db.collection("users").doc(user.uid);

        docRef.get().then(function(doc) {
            if (doc.exists) {
                var firstName = doc.data().firstName;
                var lastName = doc.data().lastName;
                var bio = doc.data().bio;
                document.getElementById("profile-welcome").innerHTML = firstName + " " + lastName;
                document.getElementById('sign-out-btn').style.display='block';
                document.getElementById('bio').innerText = bio;
                setPFP(user.uid);
                showMovies();
            } else {
                // doc.data() will be undefined in this case
                alert("No User In Data Base");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }
    else{
        window.location.replace("index.html");
    }
});

function signOut() {
    firebase.auth().signOut().then(function() {
        console.log("Log out successful");
        alert("Log out successful");
        document.getElementById("profile-welcome").innerHTML = "Signed Out";
        document.getElementById('sign-out-btn').style.display='none';
        var mainDiv = document.getElementById('live-view-content');
        mainDiv.innerHTML = '<h2 class="text-center pt-2">Live View</h1>';
        // Simulate an HTTP redirect:
        window.location.replace("index.html");
      }).catch(function(error) {
        console.error("Log out not successful", error)
      });
      
}

function setPFP(id) {
    var picRef = firebase.storage().ref(`users/${id}.jpg`).getDownloadURL().then( 
        (url) => {
            document.querySelector(`#profile-img`).src=url;
            document.querySelector(`#modal-img`).src=url;
    }).catch((error) => {
        var picRef = firebase.storage().ref(`users/${id}.png`).getDownloadURL().then( 
            (url) => {
                document.querySelector(`#profile-img`).src=url;
                document.querySelector(`#modal-img`).src=url;
        }).catch((error) => {
            picRef = firebase.storage().ref(`users/default${id.charCodeAt(0)%6}.jpg`).getDownloadURL().then(
                (url) => {
                    document.querySelector(`#profile-img`).src=url;
                    document.querySelector(`#modal-img`).src=url;
            });
        });
    });
}

function updateBio(){
    user = firebase.auth().currentUser;
    firstName=document.getElementById('inputFName').value;
    lastName=document.getElementById('inputLName').value;
    bio=document.getElementById('inputBio').value;
    docRef = db.collection("users").doc(user.uid);
    docRef.get().then( function(doc){
        if (firstName == "") {
            firstName = doc.data().firstName;
        }
        if (lastName == "") {
            lastName = doc.data().lastName;
        }
        if (bio == "") {
            firstName = doc.data().bioName;
        }
        email = doc.data().email;
        followers = doc.data().followers;
        following = doc.data().following;
        reviewCount = doc.data().reviewCount;
        console.log(email,firstName,lastName,bio,followers,following,reviewCount);
        docRef.set({ 
            email: email,
            firstName: firstName,
            lastName: lastName,
            bio: bio,
            followers: followers,
            following: following,
            reviewCount: reviewCount,
        }).then( function() {
            document.getElementById("profile-welcome").innerHTML = firstName + " " + lastName;
            document.getElementById('bio').innerText = bio;
            console.log("successfully updated");
        }).catch( (error) => {
            console.log(error);
        });
    });

}

function showFile(){
    user = firebase.auth().currentUser;
    image = document.querySelector("#modal-img");
    image2 = document.querySelector("#profile-img");
    file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        image.src = reader.result;
        image2.src = reader.result;
    }
    if (file.type == "image/jpeg")
        picRef = firebase.storage().ref().child(`users/${user.uid}.jpg`);
        firebase.storage().ref().child(`users/${user.uid}.png`).delete().catch(function (error) {
            console.log("Didn't have png");
        });
    if (file.type == "image/png")
        picRef = firebase.storage().ref().child(`users/${user.uid}.png`);
        firebase.storage().ref().child(`users/${user.uid}.jpg`).delete().catch(function (error) {
            console.log("Didn't have jpg");
        });
    reader.readAsDataURL(file);
    console.log(file)
    picRef.put(file).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
    });
      
}

function getMovies(){
    const baseURL = "https://api.themoviedb.org/3/";
    const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
    user = firebase.auth().currentUser;
    var docRef = db.collection("users").doc(user.uid).collection("MovieList");
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
                    <div class="col-lg-4 mt-2">
                        <div class="text-center card-box">
                            <div class="member-card pb-2">
                                <div class="col-12">
                                    <h4>${data2.title}</h4>
                                    <p class="text-muted">${movie_maker}</p>
                                </div>
                                <div class="thumb-lg member-thumb mx-auto mb-2"><img src="${poster_image}" class=" img-thumbnail" alt="profile-image"></div>
                                <button id="like-${data2.id}" class="like" onclick="likeMovieClick('${data2.id}')">
                                    <i class="fa fa-thumbs-o-up fa-2x" aria-hidden="true"></i>
                                </button>
                                <button id="dislike-${data2.id}" class="dislike" onclick="dislikeMovieClick('${data2.id}')">
                                    <i class="fa fa-thumbs-o-down fa-2x" aria-hidden="true"></i>
                                </button>
                                <div>
                                    <button type="button" id="" class="ml-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#modal-movie-${data2.id}" >Edit Review</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="modal-movie-${data2.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true" style="color: black;">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLongTitle">Edit ${data2.title} reviews</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <input type="text" class="modal-body" id="review-movie-${data2.id}">
                                </input>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary" onclick="saveMovieChanges(${data2.id})">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    movieDiv = document.getElementById("profile-movies-list");
                    movieDiv.insertAdjacentHTML('beforeend',html);
                    }).then(function() {
                        if (movie.data().rating == 1) {
                            document.getElementById(`like-${movie.id}`).style.color = "#4278f5";
                        } else if (movie.data().rating == -1) {
                            document.getElementById(`dislike-${movie.id}`).style.color = "#f55142";
                        }
                        document.getElementById(`review-movie-${movie.id}`).value = movie.data().review;
                    })
            
                }
            });
        });
}

function getShows(){
    const baseURL = "https://api.themoviedb.org/3/";
    const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
    user = firebase.auth().currentUser;
    showsDiv = document.getElementById("profile-shows-list");
    showsDiv.innerHTML = "";
    var docRef = db.collection("users").doc(user.uid).collection("ShowsList");
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
                    <div class="col-lg-4 mt-2">
                        <div class="text-center card-box">
                            <div class="member-card pb-2">
                                <div class="col-12">
                                    <h4>${data2.name}</h4>
                                    <p class="text-muted">${movie_maker}</p>
                                </div>
                                <div class="thumb-lg member-thumb mx-auto mb-2"><img src="${poster_image}" class=" img-thumbnail" alt="profile-image"></div>
                                <button id="like-${data2.id}" class="like" onclick="likeShowClick('${data2.id}')">
                                    <i class="fa fa-thumbs-o-up fa-2x" aria-hidden="true"></i>
                                </button>
                                <button id="dislike-${data2.id}" class="dislike" onclick="dislikeShowClick('${data2.id}')">
                                    <i class="fa fa-thumbs-o-down fa-2x" aria-hidden="true"></i>
                                </button>
                                <div>
                                    <button type="button" id="" class="ml-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#modal-show-${data2.id}" >Edit Review</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="modal-show-${data2.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true" style="color: black;">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLongTitle">Edit ${data2.name} reviews</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <input type="text" class="modal-body" id="review-show-${data2.id}">
                                </input>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary" onclick="saveShowChanges(${data2.id})">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    showDiv = document.getElementById("profile-shows-list");
                    showDiv.insertAdjacentHTML('beforeend',html);
                    }).then(function() {
                        if (show.data().rating == 1) {
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

/*
function getMusic() {
    user = firebase.auth().currentUser;
    showsDiv = document.getElementById("profile-shows-list");
    showsDiv.innerHTML = "";
    var docRef = db.collection("users").doc(user.uid).collection("ShowsList");
        docRef.get().then((querySnapshot) => {
            querySnapshot.forEach((music) => {
                if (music.id != "abcdefghij") {
                    let url = baseURL + "tv/" + music.id + "?api_key=" + API_key;    //search API Here
                    fetch(url).then(result => result.json()).then((data2) => {
                        artist = ""  //Artist Goes here
                        
                        poster_image = "https://image.tmdb.org/t/p/w500" + data2.poster_path; //Song image Goes here
        
                        const html =
                    `
                    <div class="col-lg-4 mt-2">
                        <div class="text-center card-box">
                            <div class="member-card pb-2">
                                <div class="col-12">
                                    <h4>${data2.name}</h4>
                                    <p class="text-muted">${artist}</p>
                                </div>
                                <div class="thumb-lg member-thumb mx-auto mb-2"><img src="${poster_image}" class=" img-thumbnail" alt="profile-image"></div>
                                <button id="like-${data2.id}" class="like" onclick="likeMusicClick('${data2.id}')">
                                    <i class="fa fa-thumbs-o-up fa-2x" aria-hidden="true"></i>
                                </button>
                                <button id="dislike-${data2.id}" class="dislike" onclick="dislikeMusicClick('${data2.id}')">
                                    <i class="fa fa-thumbs-o-down fa-2x" aria-hidden="true"></i>
                                </button>
                                <div>
                                    <button type="button" id="" class="ml-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#modal-show-${data2.id}" >Edit Review</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="modal-music-${data2.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true" style="color: black;">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLongTitle">Edit ${data2.name} reviews</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <input type="text" class="modal-body" id="review-music-${data2.id}">
                                </input>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary" onclick="saveMusicChanges(${data2.id})">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    musicDiv = document.getElementById("profile-music-list");
                    musicDiv.insertAdjacentHTML('beforeend',html);
                    }).then(function() {
                        if (music.data().rating == 1) {
                            document.getElementById(`like-${music.id}`).style.color = "#4278f5";
                        } else if (music.data().rating == -1) {
                            document.getElementById(`dislike-${music.id}`).style.color = "#f55142";
                        }
                        document.getElementById(`review-music-${music.id}`).value = music.data().review;
                    })
                }
            });
        });
}*/



function saveMovieChanges(id) {
    user = firebase.auth().currentUser;
    var updated = document.getElementById(`review-movie-${id}`).value;
    console.log(id);
    docRef = db.collection("users").doc(user.uid).collection(`MovieList`).doc(`${id}`);
    console.log(updated);
    docRef.get().then(function(doc){
        rating = doc.data().rating;
        db.collection("users").doc(user.uid).collection(`MovieList`).doc(`${id}`).set({
            rating: rating,
            review: updated
        });
    });
}

function saveShowChanges(id) {
    user = firebase.auth().currentUser;
    var updated = document.getElementById(`review-show-${id}`).value;
    docRef = db.collection("users").doc(user.uid).collection(`MovieList`).doc(`${id}`);
    docRef.get().then(function(doc){
        rating = doc.data().rating;
        db.collection("users").doc(user.uid).collection(`MovieList`).doc(`${id}`).set({
            rating: rating,
            review: updated
        });
    });
}

function saveSongChanges(id) {
    user = firebase.auth().currentUser;
    var updated = document.getElementById(`review-music-${id}`).value;
    docRef = db.collection("users").doc(user.uid).collection(`MusicList`).doc(`${id}`);
    docRef.get().then(function(doc){
        rating = doc.data().rating;
        db.collection("users").doc(user.uid).collection(`MusicList`).doc(`${id}`).set({
            rating: rating,
            review: updated
        });
    });
}

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

function likeMovieClick(movie_id){
    user = firebase.auth().currentUser;
    docRef = db.collection("users").doc(user.uid).collection(`MovieList`).doc(movie_id);
        docRef.get().then(function(doc){
            if (doc.data().rating != 1) {
                document.getElementById(`like-${movie_id}`).style.color = "#4278f5";
                document.getElementById(`dislike-${movie_id}`).style.color = "#000000";
                review = doc.data().review;
                rating = 1;
                db.collection("users").doc(user.uid).collection(`MovieList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            } else {
                document.getElementById(`dislike-${movie_id}`).style.color = "#000000";
                document.getElementById(`like-${movie_id}`).style.color = "#000000";
                review = doc.data().review;
                rating = 0;
                db.collection("users").doc(user.uid).collection(`MovieList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            }
        })
}

function dislikeMovieClick(movie_id){
    user = firebase.auth().currentUser;
    docRef = db.collection("users").doc(user.uid).collection(`MovieList`).doc(movie_id);
        docRef.get().then(function(doc){
            if (doc.data().rating != -1) {
                document.getElementById(`like-${movie_id}`).style.color = "#000000";
                document.getElementById(`dislike-${movie_id}`).style.color = "#f55142";
                review = doc.data().review;
                rating = -1;
                db.collection("users").doc(user.uid).collection(`MovieList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            } else {
                document.getElementById(`dislike-${movie_id}`).style.color = "#000000";
                document.getElementById(`like-${movie_id}`).style.color = "#000000";
                review = doc.data().review;
                rating = 0;
                db.collection("users").doc(user.uid).collection(`MovieList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            }
        })
}

function likeShowClick(movie_id){
    user = firebase.auth().currentUser;
    docRef = db.collection("users").doc(user.uid).collection(`ShowsList`).doc(movie_id);
        docRef.get().then(function(doc){
            if (doc.data().rating != 1) {
                document.getElementById(`like-${movie_id}`).style.color = "#4278f5";
                document.getElementById(`dislike-${movie_id}`).style.color = "#000000";
                console.log(doc.data().rating);
                review = doc.data().review;
                rating = 1;
                db.collection("users").doc(user.uid).collection(`ShowsList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            } else {
                document.getElementById(`dislike-${movie_id}`).style.color = "#000000";
                console.log("here");
                document.getElementById(`like-${movie_id}`).style.color = "#000000";
                review = doc.data().review;
                rating = 0;
                db.collection("users").doc(user.uid).collection(`ShowsList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            }
        })
}

function dislikeShowClick(movie_id){
    user = firebase.auth().currentUser;
    docRef = db.collection("users").doc(user.uid).collection(`ShowsList`).doc(movie_id);
        docRef.get().then(function(doc){
            if (doc.data().rating != -1) {
                document.getElementById(`like-${movie_id}`).style.color = "#000000";
                document.getElementById(`dislike-${movie_id}`).style.color = "#f55142";
                review = doc.data().review;
                rating = -1;
                db.collection("users").doc(user.uid).collection(`ShowsList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            } else {
                document.getElementById(`dislike-${movie_id}`).style.color = "#000000";
                document.getElementById(`like-${movie_id}`).style.color = "#000000";
                review = doc.data().review;
                rating = 0;
                db.collection("users").doc(user.uid).collection(`ShowsList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            }
        })
}

function likeSongClick(movie_id){
    user = firebase.auth().currentUser;
    docRef = db.collection("users").doc(user.uid).collection(`MusicList`).doc(movie_id);
        docRef.get().then(function(doc){
            if (doc.data().rating != 1) {
                document.getElementById(`like-${movie_id}`).style.color = "#4278f5";
                document.getElementById(`dislike-${movie_id}`).style.color = "#000000";
                console.log(doc.data().rating);
                review = doc.data().review;
                rating = 1;
                db.collection("users").doc(user.uid).collection(`MusicList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            } else {
                document.getElementById(`dislike-${movie_id}`).style.color = "#000000";
                console.log("here");
                document.getElementById(`like-${movie_id}`).style.color = "#000000";
                review = doc.data().review;
                rating = 0;
                db.collection("users").doc(user.uid).collection(`MusicList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            }
        })
}

function dislikeSongClick(movie_id){
    user = firebase.auth().currentUser;
    docRef = db.collection("users").doc(user.uid).collection(`MusicList`).doc(movie_id);
        docRef.get().then(function(doc){
            if (doc.data().rating != -1) {
                document.getElementById(`like-${movie_id}`).style.color = "#000000";
                document.getElementById(`dislike-${movie_id}`).style.color = "#f55142";
                review = doc.data().review;
                rating = -1;
                db.collection("users").doc(user.uid).collection(`MusicList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            } else {
                document.getElementById(`dislike-${movie_id}`).style.color = "#000000";
                document.getElementById(`like-${movie_id}`).style.color = "#000000";
                review = doc.data().review;
                rating = 0;
                db.collection("users").doc(user.uid).collection(`MusicList`).doc(movie_id).set({
                    rating: rating,
                    review: review
                });
            }
        })
}