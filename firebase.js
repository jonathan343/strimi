var db = firebase.firestore();
// Your web app's Firebase configuration


// window.onload = function() {
//     initApp();
// };

// function initApp() {
//     // Listening for auth state changes.
//     // [START authstatelistener]
//     firebase.auth().onAuthStateChanged(function(user) {
//       // [START_EXCLUDE silent]
//       //document.getElementById('quickstart-verify-email').disabled = true;
//       // [END_EXCLUDE]
//       if (user) {
//         // User is signed in.
//         var displayName = user.firstName;
//         var email = user.email;
//         // var emailVerified = user.emailVerified;
//         // var photoURL = user.photoURL;
//         // var isAnonymous = user.isAnonymous;
//         var uid = user.uid;
//         // var providerData = user.providerData;
//         // [START_EXCLUDE]
//         // document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
//         // document.getElementById('quickstart-sign-in').textContent = 'Sign out';
//         // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
//         // if (!emailVerified) {
//         //   document.getElementById('quickstart-verify-email').disabled = false;
//         // }

//         alert("Welcome! " + displayName);
//         // [END_EXCLUDE]
//       } else {
//         // User is signed out.
//         // [START_EXCLUDE]
//         // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
//         // document.getElementById('quickstart-sign-in').textContent = 'Sign in';
//         // document.getElementById('quickstart-account-details').textContent = 'null';
//         // [END_EXCLUDE]
//       }
//       // [START_EXCLUDE silent]
//       //document.getElementById('quickstart-sign-in').disabled = false;
//       // [END_EXCLUDE]
//     });
//     // [END authstatelistener]

//     // document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
//     // document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
//     // document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
//     // document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
//   }


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
        if (user) {
            db.collection("users").doc(user.uid).set({
            email: email,
            firstName: firstName,
            lastName: lastName,
            }).then(function() {
                console.log("Document successfully written!");
                document.getElementById('sign-up-form').style.display='none';
            }).catch(function(error) {
                console.log("error adding document: ", error);
            })
        }
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

// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//         db.collection("users").get().then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//                 if (doc.id == user.uid) {
//                     console.log("here")
//                 } else {
//                     console.log(doc.id,user.uid);
//                 }
//             });
//         });
//     }
//     });
// }

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
                            alert("Welcome " + firstName + lastName + "!");
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

function updateLiveView(){
    var user = firebase.auth().currentUser;
    var mainDiv = document.getElementById('live-view-content');
    mainDiv.innerHTML = '<h2 class="text-center pt-2">Live View</h1>';

    var docRef = db.collection("users").doc(user.uid).collection("friends");
    docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var friendRef = db.collection("users").doc(doc.id);
            friendRef.get().then(function(doc2) {
                if (doc2.exists) {
                    var firstName = doc2.data().firstName;
                    var lastName = doc2.data().lastName;
                    const html =
                    `
                    <div class="row live-view-person mx-auto my-2" id="${doc2.id}">
                        <div class="col-3 my-auto ml-3 px-0 d-flex justify-content-center align-items-center live-view-img">
                            <img id="${realID(doc.id)}" src="${getPFP(doc.id)} alt="">
                        </div>
                        <div class="col-8 my-auto ml-1 pr-0 pl-2 pt-1 live-view-content">
                            <h6 class = "live-view-name">${firstName} ${lastName}</h6>
                            <div><h9 class = "live-view-media">Are You Bored Yet?</h9></div>
                            <h9 class = "live-view-media">Wallows</h9>
                        </div>
                    </div>
                    `;
                    mainDiv.insertAdjacentHTML('beforeend',html);
                } else {
                    // doc.data() will be undefined in this case
                    alert("No Friend In Data Base");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        });
    });
}



firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        updateLiveView();
    }
});


function getPFP(id) {
    var picRef = firebase.storage().ref(`users/${id}.jpg`).getDownloadURL().then( 
        (url) => {
            document.querySelector(`#${realID(id)}`).src=url;
    }).catch((error) => {
        picRef = firebase.storage().ref(`users/default${id.charCodeAt(0)%6}.jpg`).getDownloadURL().then(
            (url) => {
                document.querySelector(`#${realID(id)}`).src=url;
        });
    });
    
    return "";
    

}


function realID(id){
    var test;
    console.log(id[0])
    if (id[0]<9) {
        console.log("here");
        test = "a";
    }
    var test = test + id
    return test;
}