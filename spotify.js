const APIController = (function() {
    
    const clientId = config.CLIENT_ID;
    const clientSecret = config.SECRET_KEY;

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 20;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    const _searchTrack = async (token, q) => {

        const limit = 10;

        const result = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=track&limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        },
        searchTrack(token, q) {
            return _searchTrack(token, q);
        }
    }
})();


// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        buttonSubmit: '#discover-music-btn',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list',
        divSongSearch: '#search-music-btn'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail),
            }
        },

        // need method to create a track list group item 
        createTrack(SpotifyURL, name,artist,id2,imageURL) {
            // const track = await APICtrl.getTrack(token, id);
            // // load the track details
            // // UICtrl.createTrackDetail(track.album.images[0].url, track.name, track.artists[0].name);
            var songDiv = document.getElementById('discover-music-list');

            const html =
            `
            <div class="col-lg-4 mt-2">
                <div class="text-center card-box">
                    <div class="member-card pb-2">
                        <div class="col-12">
                            <h4>${name}</h4>
                            <p class="text-muted">${artist}</p>
                        </div>
                        <div class="thumb-xlg member-thumb mx-auto mb-2"><a href="${SpotifyURL}" target="_blank"><img src="${imageURL}" class=" img-thumbnail" alt="profile-image"></a></div>
                        
                        <button type="button" id="" class="mr-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#modal-song-${id2}" onclick="">Read Reviews</button>
                        <button type="button" id="" class="ml-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#modal2-song-${id2}" onclick="writeSongReview('${id2}')">Write Review</button>
                        <div class="mt-2">
                            <div class="row">
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="likes-song-${id2}">0</h4>
                                        <p class="mb-0 text-muted">Likes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="dislikes-song-${id2}">0</h4>
                                        <p class="mb-0 text-muted">Dislikes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="reviewCount-song-${id2}">0</h4>
                                        <p class="mb-0 text-muted">Reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            songDiv.insertAdjacentHTML('beforeend',html);
            
            const modal =
            `
            <div class="modal fade" id="modal-song-${id2}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">${name} Reviews</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" id="reviews-song-${id2}">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal fade" id="modal2-song-${id2}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Write a Review for: ${name}</h5>
                            <button id="close-song-btn-${id2}" type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <textarea id="review-song-${id2}" class="form-control" aria-label="With textarea" placeholder="Write your Review Here..."></textarea>
                            </div>
                            <button id="dislike-song-${id2}" class="dislike" onclick="dislikeSongClick('${id2}')">
                                <i class="fa fa-thumbs-o-down fa-2x" aria-hidden="true"></i>
                            </button>
                            <button id="like-song-${id2}" class="like" onclick="likeSongClick('${id2}')">
                                <i class="fa fa-thumbs-o-up fa-2x" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="saveSongReview('${id2}')" >Save Review</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend',modal);
            document.getElementById(`reviews-song-${id2}`).innerHTML = "";

            var user = firebase.auth().currentUser;
            if (user){
                var selfRef = db.collection("users").doc(user.uid);
                selfRef.get().then(function(doc5) {
                    if (doc5.exists) {
                        var reviewRef = db.collection("users").doc(doc5.id).collection("MusicList").doc(`${id2}`);
                        reviewRef.get().then(function(doc6) {
                            console.log(doc5.id,user.uid);
                            if (doc6.exists) {
                                var reviewDiv = document.getElementById(`reviews-song-${id2}`);
                                // console.log(doc6.data().rating);
                                if(doc6.data().rating == 1){
                                    // console.log("like detected");
                                    // likeTotal +=1;
                                    var likes = parseInt(document.getElementById(`likes-song-${id2}`).innerHTML);
                                    likes+=1;
                                    document.getElementById(`likes-song-${id2}`).innerHTML = likes;
                                    
                                }
                                else if(doc6.data().rating == -1){
                                    // dislikeTotal +=1;
                                    var dislikes = parseInt(document.getElementById(`dislikes-song-${id2}`).innerHTML);
                                    dislikes+=1;
                                    document.getElementById(`dislikes-song-${id2}`).innerHTML = dislikes;
                                }
                                // reviewCount +=1;
                                var reviewCount = parseInt(document.getElementById(`reviewCount-song-${id2}`).innerHTML);
                                reviewCount+=1;
                                document.getElementById(`reviewCount-song-${id2}`).innerHTML = reviewCount;
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
                                var reviewRef = db.collection("users").doc(doc5.id).collection("MusicList").doc(`${id2}`);
                                reviewRef.get().then(function(doc6) {
                                    console.log(doc5.id,user.uid);
                                    if (doc6.exists) {
                                        var reviewDiv = document.getElementById(`reviews-song-${id2}`);
                                        // console.log(doc6.data().rating);
                                        if(doc6.data().rating == 1){
                                            // console.log("like detected");
                                            // likeTotal +=1;
                                            var likes = parseInt(document.getElementById(`likes-song-${id2}`).innerHTML);
                                            likes+=1;
                                            document.getElementById(`likes-song-${id2}`).innerHTML = likes;
                                            
                                        }
                                        else if(doc6.data().rating == -1){
                                            // dislikeTotal +=1;
                                            var dislikes = parseInt(document.getElementById(`dislikes-song-${id2}`).innerHTML);
                                            dislikes+=1;
                                            document.getElementById(`dislikes-song-${id2}`).innerHTML = dislikes;
                                        }
                                        // reviewCount +=1;
                                        var reviewCount = parseInt(document.getElementById(`reviewCount-song-${id2}`).innerHTML);
                                        reviewCount+=1;
                                        document.getElementById(`reviewCount-song-${id2}`).innerHTML = reviewCount;
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
                    });
            }
            else{
                console.log("Not signed in");
            }
        },
        // need method to create a track list group item 
        createSearchTrack(SpotifyURL, name,artist,id2,imageURL) {
            // const track = await APICtrl.getTrack(token, id);
            // // load the track details
            // // UICtrl.createTrackDetail(track.album.images[0].url, track.name, track.artists[0].name);
            var songDiv = document.getElementById('search-music-list');

            const html =
            `
            <div class="col-lg-4 mt-2">
                <div class="text-center card-box">
                    <div class="member-card pb-2">
                        <div class="col-12">
                            <h4>${name}</h4>
                            <p class="text-muted">${artist}</p>
                        </div>
                        <div class="thumb-xlg member-thumb mx-auto mb-2"><a href="${SpotifyURL}" target="_blank"><img src="${imageURL}" class=" img-thumbnail" alt="profile-image"></a></div>
                        
                        <button type="button" id="" class="mr-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#search-modal-song-${id2}" onclick="">Read Reviews</button>
                        <button type="button" id="" class="ml-2 btn btn-primary mt-2 btn-rounded waves-effect w-md waves-light" data-toggle="modal" data-target="#search-modal2-song-${id2}" onclick="writeSearchSongReview('${id2}')">Write Review</button>
                        <div class="mt-2">
                            <div class="row">
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="search-likes-song-${id2}">0</h4>
                                        <p class="mb-0 text-muted">Likes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="search-dislikes-song-${id2}">0</h4>
                                        <p class="mb-0 text-muted">Dislikes</p>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="mt-3">
                                        <h4 id="search-reviewCount-song-${id2}">0</h4>
                                        <p class="mb-0 text-muted">Reviews</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            songDiv.insertAdjacentHTML('beforeend',html);
            
            const modal =
            `
            <div class="modal fade" id="search-modal-song-${id2}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">${name} Reviews</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" id="search-reviews-song-${id2}">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal fade" id="search-modal2-song-${id2}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Write a Review for: ${name}</h5>
                            <button id="search-close-song-btn-${id2}" type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <textarea id="search-review-song-${id2}" class="form-control" aria-label="With textarea" placeholder="Write your Review Here..."></textarea>
                            </div>
                            <button id="search-dislike-song-${id2}" class="dislike" onclick="dislikeSearchSongClick('${id2}')">
                                <i class="fa fa-thumbs-o-down fa-2x" aria-hidden="true"></i>
                            </button>
                            <button id="search-like-song-${id2}" class="like" onclick="likeSearchSongClick('${id2}')">
                                <i class="fa fa-thumbs-o-up fa-2x" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="saveSearchSongReview('${id2}')" >Save Review</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend',modal);
            document.getElementById(`search-reviews-song-${id2}`).innerHTML = "";

            var user = firebase.auth().currentUser;
            if (user){
                var selfRef = db.collection("users").doc(user.uid);
                selfRef.get().then(function(doc5) {
                    if (doc5.exists) {
                        var reviewRef = db.collection("users").doc(doc5.id).collection("MusicList").doc(`${id2}`);
                        reviewRef.get().then(function(doc6) {
                            console.log(doc5.id,user.uid);
                            if (doc6.exists) {
                                var reviewDiv = document.getElementById(`search-reviews-song-${id2}`);
                                // console.log(doc6.data().rating);
                                if(doc6.data().rating == 1){
                                    // console.log("like detected");
                                    // likeTotal +=1;
                                    var likes = parseInt(document.getElementById(`search-likes-song-${id2}`).innerHTML);
                                    likes+=1;
                                    document.getElementById(`search-likes-song-${id2}`).innerHTML = likes;
                                    
                                }
                                else if(doc6.data().rating == -1){
                                    // dislikeTotal +=1;
                                    var dislikes = parseInt(document.getElementById(`search-dislikes-song-${id2}`).innerHTML);
                                    dislikes+=1;
                                    document.getElementById(`search-dislikes-song-${id2}`).innerHTML = dislikes;
                                }
                                // reviewCount +=1;
                                var reviewCount = parseInt(document.getElementById(`search-reviewCount-song-${id2}`).innerHTML);
                                reviewCount+=1;
                                document.getElementById(`search-reviewCount-song-${id2}`).innerHTML = reviewCount;
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
                                var reviewRef = db.collection("users").doc(doc5.id).collection("MusicList").doc(`${id2}`);
                                reviewRef.get().then(function(doc6) {
                                    console.log(doc5.id,user.uid);
                                    if (doc6.exists) {
                                        var reviewDiv = document.getElementById(`search-reviews-song-${id2}`);
                                        // console.log(doc6.data().rating);
                                        if(doc6.data().rating == 1){
                                            // console.log("like detected");
                                            // likeTotal +=1;
                                            var likes = parseInt(document.getElementById(`search-likes-song-${id2}`).innerHTML);
                                            likes+=1;
                                            document.getElementById(`search-likes-song-${id2}`).innerHTML = likes;
                                            
                                        }
                                        else if(doc6.data().rating == -1){
                                            // dislikeTotal +=1;
                                            var dislikes = parseInt(document.getElementById(`search-dislikes-song-${id2}`).innerHTML);
                                            dislikes+=1;
                                            document.getElementById(`search-dislikes-song-${id2}`).innerHTML = dislikes;
                                        }
                                        // reviewCount +=1;
                                        var reviewCount = parseInt(document.getElementById(`search-reviewCount-song-${id2}`).innerHTML);
                                        reviewCount+=1;
                                        document.getElementById(`search-reviewCount-song-${id2}`).innerHTML = reviewCount;
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
                    });
            }
            else{
                console.log("Not signed in");
            }
        },
        
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // get genres on page load
    const loadToken = async () => {
        //get the token
        const token = await APICtrl.getToken();           
        //store the token onto the page
        UICtrl.storeToken(token);
    }     

    // create submit button click event listener
    DOMInputs.submit.addEventListener('click', async (e) => {

        // prevent page reset
        e.preventDefault();
        // clear tracks
        // UICtrl.resetTracks();
        //get the token
        const token = UICtrl.getStoredToken().token;        
        const tracksEndPoint = "https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks";
        // get the list of tracks
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        // create a track list item
        console.log(tracks);
        tracks.forEach(el => UICtrl.createTrack(el.track.external_urls.spotify, el.track.name,el.track.artists[0].name,el.track.id,el.track.album.images[0].url))
        
    });

    return {
        init() {
            console.log('App is starting');
            loadToken();
        }
    }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();