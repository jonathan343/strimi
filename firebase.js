var db = firebase.firestore();
// Your web app's Firebase configuration


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

function searchPeople() {
    var value = document.getElementById("friendSearch").value;
    var list = inputToTuple(value);
    people = new Array;
    var count = 0;
    if (list[1] != null) {
        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().firstName.toLowerCase() == list[0].toLowerCase() && doc.data().lastName.toLowerCase() == list[1].toLowerCase()) {
                    people.push(doc.data().firstName);
                    console.log(doc.data().firstName, doc.data().lastName);
                    count = 1;
                }
            });
        });
    } else {
        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().firstName.toLowerCase() == list[0].toLowerCase() || doc.data().lastName.toLowerCase() == list[0].toLowerCase()) {
                    people.push(doc);
                    console.log(doc.data().firstName, doc.data().lastName);
                    count = 1;
                }
            });
            querySnapshot.forEach((doc) => {
                if (doc.data().firstName.toLowerCase().search(list[0].toLowerCase()) != -1 || doc.data().lastName.toLowerCase().search(list[0].toLowerCase()) != -1) {
                    if (!people.includes(doc)) {
                        people.push(doc);
                        console.log(doc.data().firstName, doc.data().lastName);
                        count = 1;
                    }
                }
            });
            return people;
        }).then(listToInnerText);
    }
    
}

function listToInnerText(docs) {
    docs.forEach((doc) => {
        var div = document.createElement('div');
        div.setAttribute(`onclick`,`addFriend("${ doc.id }")`);
        div.innerHTML = `${doc.data().firstName}`;
        document.getElementById('list').appendChild(div);
    })
}

function addFriend(doc) {
    var user = firebase.auth().currentUser;
    if (user) {
        console.log(user.uid);
        console.log(doc)
        db.collection("users").doc(user.uid).collection("friends").doc(doc).set({
        }).then(function() {
            console.log("Document successfully written!");
        });
        parent = document.getElementById('list');
        while (parent.lastChild) {
            parent.removeChild(parent.lastChild);
        }
    } else {
        console.log("Not currently signed in");
    }

}

function inputToTuple(input) {
    var tuple = ["","s"];
    if (input.lastIndexOf(" ") != input.indexOf(" ")) {
        console.error("incorrect syntax for name");
        return null;
    }
    if (input.indexOf(" ") == -1)
        return [input,null];
    tuple[0] = input.substring(0,input.indexOf(" "));
    tuple[1] = input.substring(input.indexOf(" ")+1, input.length);
    return tuple;
}