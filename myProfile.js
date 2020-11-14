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
                document.getElementById("profile-welcome").innerHTML = firstName + " " + lastName;
                document.getElementById('sign-out-btn').style.display='block';
            } else {
                // doc.data() will be undefined in this case
                alert("No User In Data Base");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }
});

function signOut() {
    firebase.auth().signOut().then(function() {
        console.log("Log out successful");
        document.getElementById("profile-welcome").innerHTML = "Signed Out";
        document.getElementById('sign-out-btn').style.display='none';
        var mainDiv = document.getElementById('live-view-content');
        mainDiv.innerHTML = '<h2 class="text-center pt-2">Live View</h1>';
      }).catch(function(error) {
        console.error("Log out not successful", error)
      });
      
}
