var db = firebase.firestore();

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
                lastName: lastName
                }).then(function() {
                    console.log("Document successfully written!");
                    document.getElementById('sign-up-form').style.display='none';
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

/*firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            db.collection("users").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id == user.uid) {
                        console.log("here")
                    } else {
                        console.log(doc.id,user.uid);
                    }
                });
            });
        }
    });
}*/

function signIn() {
    var email = document.getElementById("inputEmail2").value;
    var password = document.getElementById("inputPassword2").value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                db.collection("users").get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.id == user.uid) {
                            document.getElementById('sign-in-form').style.display='none';
                            alert('Welcome!');
                            // console.log(doc.data().firstName);
                        } 
                    });
                });
            }
        });
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        alert('Incorrect Email and Password Combination');
        return;
        // ...
      });
    
}

function signout() {
    firebase.auth().signOut().then(function() {
        console.log("Log out successful");
      }).catch(function(error) {
        console.error("Log out not successful", error)
      });
      
}