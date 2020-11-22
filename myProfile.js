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