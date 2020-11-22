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

    return {
        getToken() {
            return _getToken();
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
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
        divSonglist: '.song-list'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },

        // need method to create a track list group item 
        createTrack(SpotifyURL, name,artist,id2,imageURL) {
            // const track = await APICtrl.getTrack(token, id);
            // // load the track details
            // // UICtrl.createTrackDetail(track.album.images[0].url, track.name, track.artists[0].name);
            console.log("Spotify: ", SpotifyURL);
            console.log("Track Name: ",name);
            console.log("Artist: ", artist);
            console.log("id2: ", id2);
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
                        <div class="thumb-lg member-thumb mx-auto mb-2"><a href="${SpotifyURL}"><img src="${imageURL}" class=" img-thumbnail" alt="profile-image"></a></div>
                        
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
                        <div class="modal-body" id="reviews-show-${id2}">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal fade" id="modal2-show-${id2}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
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
        },

        // need method to create the song detail
        // createTrackDetail(img, title, artist) {

        //     const detailDiv = document.querySelector(DOMElements.divSongDetail);
        //     // any time user clicks a new song, we need to clear out the song detail div
        //     detailDiv.innerHTML = '';

        //     const html = 
        //     `
        //     <div class="row col-sm-12 px-0">
        //         <img src="${img}" alt="">        
        //     </div>
        //     <div class="row col-sm-12 px-0">
        //         <label for="Genre" class="form-label col-sm-12">${title}:</label>
        //     </div>
        //     <div class="row col-sm-12 px-0">
        //         <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
        //     </div> 
        //     `;

        //     detailDiv.insertAdjacentHTML('beforeend', html)
        // },

        // resetTrackDetail() {
        //     this.inputField().songDetail.innerHTML = '';
        // },

        // resetTracks() {
        //     this.inputField().tracks.innerHTML = '';
        //     this.resetTrackDetail();
        // },
        
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

    // create song selection click event listener
    // DOMInputs.tracks.addEventListener('click', async (e) => {
    //     // prevent page reset
    //     e.preventDefault();
    //     UICtrl.resetTrackDetail();
    //     // get the token
    //     const token = UICtrl.getStoredToken().token;
    //     // get the track endpoint
    //     const trackEndpoint = e.target.id;
    //     //get the track object
    //     const track = await APICtrl.getTrack(token, trackEndpoint);
    //     // load the track details
    //     UICtrl.createTrackDetail(track.album.images[0].url, track.name, track.artists[0].name);
    // });

    return {
        init() {
            console.log('App is starting');
            loadToken();
        }
    }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();




