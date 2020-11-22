var db = firebase.firestore();
// Your web app's Firebase configuration


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
    if (user) {
        var docRef = db.collection("users").doc(user.uid).collection("friends");
        docRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var friendRef = db.collection("users").doc(doc.id);
                friendRef.get().then(function(doc2) {
                    if (doc2.exists) {
                        if (user.uid != doc.id) {
                            var firstName = doc2.data().firstName;
                            var lastName = doc2.data().lastName;
                            const html =
                            `
                            <div class="row live-view-person mx-auto my-2" id="${doc.id}">
                                <div class="col-3 my-auto ml-3 px-0 d-flex justify-content-center align-items-center live-view-img">
                                    <img id="img-${doc.id}" class="rounded-circle img-thumbnail2" src="${getPFP(doc.id)} alt="">
                                </div>
                                <div class="col-8 my-auto ml-1 pr-0 pl-2 pt-1 live-view-content">
                                    <h6 class = "live-view-name">${firstName} ${lastName}</h6>
                                    <div><h9 class = "live-view-media">Are You Bored Yet?</h9></div>
                                    <h9 class = "live-view-media">Wallows</h9>
                                </div>
                            </div>
                            `;
                            mainDiv.insertAdjacentHTML('beforeend',html);
                        } 
                    } else {
                        // doc.data() will be undefined in this case
                        alert("No Friend In Data Base");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
            });
        });
    } else {
        const html =
                        `
                        <div class="row live-view-person mx-auto my-2">
                            You need to be signed in to use this feature
                        </div>
                        `;
                        mainDiv.insertAdjacentHTML('beforeend',html);
    }
    

    
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

function getPFP(id) {
    console.log('live');
    var picRef = firebase.storage().ref(`users/${id}.jpg`).getDownloadURL().then( 
        (url) => {
            document.querySelector(`#img-${id}`).src=url;
    }).catch((error) => {
        picRef = firebase.storage().ref(`users/default${id.charCodeAt(0)%6}.jpg`).getDownloadURL().then(
            (url) => {
                document.querySelector(`#img-${id}`).src=url;
        });
    });
    
    return "";
}