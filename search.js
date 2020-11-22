searchValue = window.location.href.substring(window.location.href.indexOf("?search=")+8).replaceAll("%20"," ");
document.getElementById("search-bar").value = searchValue;
// var search_input = ;


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        getMovieID(searchValue);
    }
  });

function getMovieID(movie){
    const baseURL = "https://api.themoviedb.org/3/";
    const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
    let url = baseURL + "search/movie?api_key=" + API_key + "&query=" + movie;

    fetch(url)
    .then(result => result.json())
    .then((data) => {

        info = data.results.slice(0, 15);
        var movieDiv = document.getElementById("search-movies-list");
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
                        
                        <button type="button" id="" class="mr-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#search-modal-${movie_id}" onclick="">Read Reviews</button>
                        <button type="button" id="" class="ml-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#search-modal2-${movie_id}" onclick="writeMovieSearchReview('${movie_id}')">Write Review</button>
                        <div class="mt-2">
                            <div class="row">
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="search-likes-${movie_id}">0</h4>
                                        <p class="mb-0 text-muted">Likes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="search-dislikes-${movie_id}">0</h4>
                                        <p class="mb-0 text-muted">Dislikes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="search-reviewCount-${movie_id}">0</h4>
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
            <div class="modal fade" id="search-modal-${movie_id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">${info[i].title} Reviews</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" id="search-reviews-${movie_id}">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="search-modal2-${movie_id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Write a Review for: ${info[i].title}</h5>
                            <button id="search-close-btn-${movie_id}" type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <textarea id="search-review-${movie_id}" class="form-control" aria-label="With textarea" placeholder="Write your Review Here..."></textarea>
                            </div>
                            <button id="search-dislike-${movie_id}" class="dislike" onclick="dislikeSearchClick('${movie_id}')">
                                <i class="fa fa-thumbs-o-down fa-2x" aria-hidden="true"></i>
                            </button>
                            <button id="search-like-${movie_id}" class="like" onclick="likeSearchClick('${movie_id}')">
                                <i class="fa fa-thumbs-o-up fa-2x" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="saveSearchReview('${movie_id}')" >Save Review</button>
                        </div>
                    </div>
                </div>
            </div>
            `;

            document.body.insertAdjacentHTML('beforeend',modal);

            document.body.insertAdjacentHTML('beforeend',modal);
            document.getElementById(`search-reviews-${data2.id}`).innerHTML = "";
            var user = firebase.auth().currentUser;
            if (user){
                var selfRef = db.collection("users").doc(user.uid);
                selfRef.get().then(function(doc5) {
                    if (doc5.exists) {
                        var reviewRef = db.collection("users").doc(doc5.id).collection("MovieList").doc(`${data2.id}`);
                        reviewRef.get().then(function(doc6) {
                            console.log(doc5.id,user.uid);
                            if (doc6.exists) {
                                var reviewDiv = document.getElementById(`search-reviews-${data2.id}`);
                                // console.log(doc6.data().rating);
                                if(doc6.data().rating == 1){
                                    // console.log("like detected");
                                    // likeTotal +=1;
                                    var likes = parseInt(document.getElementById(`search-likes-${data2.id}`).innerHTML);
                                    likes+=1;
                                    document.getElementById(`search-likes-${data2.id}`).innerHTML = likes;
                                    
                                }
                                else if(doc6.data().rating == -1){
                                    // dislikeTotal +=1;
                                    var dislikes = parseInt(document.getElementById(`search-dislikes-${data2.id}`).innerHTML);
                                    dislikes+=1;
                                    document.getElementById(`search-dislikes-${data2.id}`).innerHTML = dislikes;
                                }
                                // reviewCount +=1;
                                var reviewCount = parseInt(document.getElementById(`search-reviewCount-${data2.id}`).innerHTML);
                                reviewCount+=1;
                                document.getElementById(`search-reviewCount-${data2.id}`).innerHTML = reviewCount;
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
                                        var reviewDiv = document.getElementById(`search-reviews-${data2.id}`);
                                        // console.log(doc6.data().rating);
                                        if(doc6.data().rating == 1){
                                            // console.log("like detected");
                                            // likeTotal +=1;
                                            var likes = parseInt(document.getElementById(`search-likes-${data2.id}`).innerHTML);
                                            likes+=1;
                                            document.getElementById(`search-likes-${data2.id}`).innerHTML = likes;
                                            
                                        }
                                        else if(doc6.data().rating == -1){
                                            // dislikeTotal +=1;
                                            var dislikes = parseInt(document.getElementById(`search-dislikes-${data2.id}`).innerHTML);
                                            dislikes+=1;
                                            document.getElementById(`search-dislikes-${data2.id}`).innerHTML = dislikes;
                                        }
                                        // reviewCount +=1;
                                        var reviewCount = parseInt(document.getElementById(`search-reviewCount-${data2.id}`).innerHTML);
                                        reviewCount+=1;
                                        document.getElementById(`search-reviewCount-${data2.id}`).innerHTML = reviewCount;
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

function likeSearchClick(movie_id){
    btn = document.getElementById(`search-like-${movie_id}`).style.color = "#4278f5";
    btn2 = document.getElementById(`search-dislike-${movie_id}`).style.color = "#000000";
}

function dislikeSearchClick(movie_id){
    btn = document.getElementById(`search-dislike-${movie_id}`).style.color = "#f55142";
    btn2 = document.getElementById(`search-like-${movie_id}`).style.color = "#000000";
}

function saveSearchReview(movie_id){
    dislikeBtn = document.getElementById(`search-dislike-${movie_id}`).style.color;
    likeBtn = document.getElementById(`search-like-${movie_id}`).style.color;
    var rating = 0;
    var user = firebase.auth().currentUser;
    var review = document.getElementById(`search-review-${movie_id}`).value;

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
            document.getElementById(`search-close-btn-${movie_id}`).click();
            
        });
    } else {
        console.log("Not currently signed in");
    }
    // getTopMovies();
}

function writeMovieSearchReview(movie_id){
    var user = firebase.auth().currentUser;
    var reviewRef = db.collection("users").doc(user.uid).collection("MovieList").doc(`${movie_id}`);
    reviewRef.get().then(function(doc) {
        if (doc.exists) {
            document.getElementById(`search-review-${movie_id}`).innerHTML = doc.data().review;
            if(doc.data().rating == 1){
                btn = document.getElementById(`search-like-${movie_id}`).style.color = "#4278f5";
            }
            if(doc.data().rating == -1){
                btn = document.getElementById(`search-dislike-${movie_id}`).style.color = "#f55142";
            }
        }
        })
        .catch(function(error) {
            console.log("Error getting document1:", error);
        });
}


function getShowID(movie){
    const baseURL = "https://api.themoviedb.org/3/";
    const API_key = "0b3c99fd0f35bf406b61b4076e59dce5"; //key for the movie database API
    let url = baseURL + "search/tv?api_key=" + API_key + "&query=\"" + movie + "\"";
    fetch(url)
    .then(result => result.json())
    .then((data) => {
        info = data.results.slice(0, 20);
        var showsDiv = document.getElementById('search-shows-list');
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
                        
                        <button type="button" id="" class="mr-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#search-modal-show-${data2.id}" onclick="">Read Reviews</button>
                        <button type="button" id="" class="ml-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#search-modal2-show-${data2.id}" onclick="writeShowSearchReview('${data2.id}')">Write Review</button>
                        <div class="mt-2">
                            <div class="row">
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="search-likes-show-${data2.id}">0</h4>
                                        <p class="mb-0 text-muted">Likes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="search-dislikes-show-${data2.id}">0</h4>
                                        <p class="mb-0 text-muted">Dislikes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="search-reviewCount-show-${data2.id}">0</h4>
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
            <div class="modal fade" id="search-modal-show-${data2.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">${data2.name} Reviews</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" id="search-reviews-show-${data2.id}">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal fade" id="search-modal2-show-${data2.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Write a Review for: ${data2.name}</h5>
                            <button id="search-close-btn-show-${data2.id}" type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <textarea id="search-review-show-${data2.id}" class="form-control" aria-label="With textarea" placeholder="Write your Review Here..."></textarea>
                            </div>
                            <button id="search-dislike-show-${data2.id}" class="dislike" onclick="dislikeShowSearchClick('${data2.id}')">
                                <i class="fa fa-thumbs-o-down fa-2x" aria-hidden="true"></i>
                            </button>
                            <button id="search-like-show-${data2.id}" class="like" onclick="likeShowSearchClick('${data2.id}')">
                                <i class="fa fa-thumbs-o-up fa-2x" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="saveShowSearchReview('${data2.id}')" >Save Review</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend',modal);
            document.getElementById(`search-reviews-show-${data2.id}`).innerHTML = "";

            var user = firebase.auth().currentUser;
            if (user){
                var selfRef = db.collection("users").doc(user.uid);
                selfRef.get().then(function(doc5) {
                    if (doc5.exists) {
                        var reviewRef = db.collection("users").doc(doc5.id).collection("ShowsList").doc(`${data2.id}`);
                        reviewRef.get().then(function(doc6) {
                            console.log(doc5.id,user.uid);
                            if (doc6.exists) {
                                var reviewDiv = document.getElementById(`search-reviews-show-${data2.id}`);
                                // console.log(doc6.data().rating);
                                if(doc6.data().rating == 1){
                                    // console.log("like detected");
                                    // likeTotal +=1;
                                    var likes = parseInt(document.getElementById(`search-likes-show-${data2.id}`).innerHTML);
                                    likes+=1;
                                    document.getElementById(`search-likes-show-${data2.id}`).innerHTML = likes;
                                    
                                }
                                else if(doc6.data().rating == -1){
                                    // dislikeTotal +=1;
                                    var dislikes = parseInt(document.getElementById(`search-dislikes-show-${data2.id}`).innerHTML);
                                    dislikes+=1;
                                    document.getElementById(`search-dislikes-show-${data2.id}`).innerHTML = dislikes;
                                }
                                // reviewCount +=1;
                                var reviewCount = parseInt(document.getElementById(`search-reviewCount-show-${data2.id}`).innerHTML);
                                reviewCount+=1;
                                document.getElementById(`search-reviewCount-show-${data2.id}`).innerHTML = reviewCount;
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
                                        var reviewDiv = document.getElementById(`search-reviews-show-${data2.id}`);
                                        // console.log(doc6.data().rating);
                                        if(doc6.data().rating == 1){
                                            // console.log("like detected");
                                            // likeTotal +=1;
                                            var likes = parseInt(document.getElementById(`search-likes-show-${data2.id}`).innerHTML);
                                            likes+=1;
                                            document.getElementById(`search-likes-show-${data2.id}`).innerHTML = likes;
                                            
                                        }
                                        else if(doc6.data().rating == -1){
                                            // dislikeTotal +=1;
                                            var dislikes = parseInt(document.getElementById(`search-dislikes-show-${data2.id}`).innerHTML);
                                            dislikes+=1;
                                            document.getElementById(`search-dislikes-show-${data2.id}`).innerHTML = dislikes;
                                        }
                                        // reviewCount +=1;
                                        var reviewCount = parseInt(document.getElementById(`search-reviewCount-show-${data2.id}`).innerHTML);
                                        reviewCount+=1;
                                        document.getElementById(`search-reviewCount-show-${data2.id}`).innerHTML = reviewCount;
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

function likeShowSearchClick(movie_id){
    btn = document.getElementById(`search-like-show-${movie_id}`).style.color = "#4278f5";
    btn2 = document.getElementById(`search-dislikes-show-${movie_id}`).style.color = "#000000";
}

function dislikeShowSearchClick(movie_id){
    btn = document.getElementById(`search-dislike-show-${movie_id}`).style.color = "#f55142";
    btn2 = document.getElementById(`search-like-show-${movie_id}`).style.color = "#000000";
}

function saveShowSearchReview(movie_id){
    dislikeBtn = document.getElementById(`search-dislike-show-${movie_id}`).style.color;
    likeBtn = document.getElementById(`search-like-show-${movie_id}`).style.color;
    var rating = 0;
    var user = firebase.auth().currentUser;
    var review = document.getElementById(`search-review-show-${movie_id}`).value;

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
            document.getElementById(`search-close-btn-show-${movie_id}`).click();
            
        });
    } else {
        console.log("Not currently signed in");
    }
    // getTopMovies();
}

function writeShowSearchReview(movie_id){
    var user = firebase.auth().currentUser;
    var reviewRef = db.collection("users").doc(user.uid).collection("MovieList").doc(`${movie_id}`);
    reviewRef.get().then(function(doc) {
        if (doc.exists) {
            document.getElementById(`search-review-show-${movie_id}`).innerHTML = doc.data().review;
            if(doc.data().rating == 1){
                btn = document.getElementById(`search-like-show-${movie_id}`).style.color = "#4278f5";
            }
            if(doc.data().rating == -1){
                btn = document.getElementById(`search-dislike-show-${movie_id}`).style.color = "#f55142";
            }
        }
        })
        .catch(function(error) {
            console.log("Error getting document1:", error);
        });
}


function searchMovies(){
    getMovieID(searchValue);
    document.getElementById("search-music-list").style.display = 'none';
    document.getElementById("search-shows-list").style.display = 'none';
    document.getElementById("search-movies-list").style.display = 'block';
    document.getElementById("search-music-btn").classList.remove('active');
    document.getElementById("search-shows-btn").classList.remove('active');
    document.getElementById("search-movies-btn").classList.add('active');
}
function searchShows(){
    getShowID(searchValue);
    document.getElementById("search-music-list").style.display = 'none';
    document.getElementById("search-movies-list").style.display = 'none';
    document.getElementById("search-shows-list").style.display = 'block';
    document.getElementById("search-music-btn").classList.remove('active');
    document.getElementById("search-shows-btn").classList.add('active');
    document.getElementById("search-movies-btn").classList.remove('active');
}
function searchMusic(){
    document.getElementById("search-shows-list").style.display = 'none';
    document.getElementById("search-movies-list").style.display = 'none';
    document.getElementById("search-music-list").style.display = 'block';
    document.getElementById("search-music-btn").classList.add('active');
    document.getElementById("search-shows-btn").classList.remove('active');
    document.getElementById("search-movies-btn").classList.remove('active');
}