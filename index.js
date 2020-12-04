firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        window.location.replace("discover.html");
    }
    else{
        document.getElementById("navbar").style.display = "none";
    }
});


function handleSignUp() {
    var firstName = document.getElementById("inputFName").value;
    var lastName = document.getElementById("inputLName").value;
    var email = document.getElementById('inputEmail').value;
    var password = document.getElementById('inputPassword').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Create user with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                db.collection("users").doc(user.uid).set({
                email: email,
                firstName: firstName,
                lastName: lastName,
                bio: "",
                followers: 0,
                following: 0,
                reviewCount: 0,
                recentPrimary: "No Reviews",
                recentSecondary: ""
                }).then(function() {
                    console.log("Document successfully written!");
                    document.getElementById('sign-up-form').style.display='none';
                    db.collection("users").doc(user.uid).collection("MovieList").doc("abcdefghij").set({
                    }).then(function() {
                        console.log("Movie Collection Created");
                    });
                    db.collection("users").doc(user.uid).collection("MusicList").doc("abcdefghij").set({
                    }).then(function() {
                        console.log("Music Collection Created");
                    });
                    db.collection("users").doc(user.uid).collection("ShowsList").doc("abcdefghij").set({
                    }).then(function() {
                        console.log("Shows Collection Created");
                    });
                }).catch(function(error) {
                    console.log("error adding document: ", error);
                })
            }
        });
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END createwithemail]
    //var user = firebase.auth().currentUser;
  }

function signIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
    //else{
        var email = document.getElementById("inputEmail2").value;
        var password = document.getElementById("inputPassword2").value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
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
                            document.getElementById('sign-in-form').style.display='none';
                            window.location.replace("discover.html");
                            alert("Welcome " + firstName + " " + lastName + "!");
                        } else {
                            // doc.data() will be undefined in this case
                            alert("No User In Data Base");
                        }
                    }).catch(function(error) {
                        console.log("Error getting document:", error);
                    });
                }
            });
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
            } else {
            alert(errorMessage);
            }
            console.log(error);
        });
    //}
    
}


var sign_in_btn = document.getElementById("sign-in-btn");
var sign_up_btn = document.getElementById("sign-up-btn");


// Execute a function when the user releases a key on the keyboard
// sign_in_btn.addEventListener("keyup", function(event) {
//     if (event.key === 'Enter') {
//         document.getElementById('sign-in-form').style.display='block';
//     }
// });


// sign_up_btn.addEventListener("keyup", function(event) {
//     if (event.key === 'Enter') {
//         document.getElementById('sign-up-form').style.display='block';
//     }
// });