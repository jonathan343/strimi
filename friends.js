var db = firebase.firestore();
document.getElementById("friend-search").onkeypress = function(e) {
    if(e.key === 'Enter') {
        searchPeople();
    }
}

function searchPeople() {
    var user = firebase.auth().currentUser;
    var value = document.getElementById("friend-search").value;
    var list = inputToTuple(value);
    people = new Array;
    var count = 0;
    if (list[1] != null) {
        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().firstName.toLowerCase() == list[0].toLowerCase() && doc.data().lastName.toLowerCase() == list[1].toLowerCase()) {
                    people.push(doc);
                    console.log(doc.data().firstName, doc.data().lastName);
                    count = 1;
                }
            });
            return people;
        }).then(listToInnerText);
    } else {
        db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().firstName.toLowerCase() == list[0].toLowerCase() || doc.data().lastName.toLowerCase() == list[0].toLowerCase()) {
                    if (user.uid != doc.id) {
                        people.push(doc);
                        console.log(doc.data().firstName, doc.data().lastName);
                        count = 1;
                    }
                }
                
            });
            querySnapshot.forEach((doc) => {
                if (doc.data().firstName.toLowerCase().search(list[0].toLowerCase()) != -1 || doc.data().lastName.toLowerCase().search(list[0].toLowerCase()) != -1) {
                    if (!isInList(people,doc)) {
                        if (user.uid != doc.id) {
                            people.push(doc);
                            console.log(doc.data().firstName, doc.data().lastName);
                            count = 1;
                        }
                    }
                }
            });
            return people;
        }).then(listToInnerText);
    }
}

function isInList(list,doc) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id == doc.id) {
            return 1;
        }
    }
    return 0;
}



function listToInnerText(docs) {
    var user = firebase.auth().currentUser;
    var mainDiv = document.getElementById('friendList');
    mainDiv.innerHTML = "";
    
    docs.forEach((doc) => {
        var buttonVal = "Follow";
        var functionName = "addFriend";
        var buttonClass = "btn-primary";
        var docRef = db.collection("users").doc(user.uid).collection("friends").doc(doc.id);

        docRef.get().then(function(doc2) {
            if (doc2.exists) {
                buttonVal = "Unfollow";
                functionName = "removeFriend";
                buttonClass = "btn-danger";
            }
            var vals = [buttonVal,functionName,buttonClass];
            return vals;
        }).then(function(vals) {
            const html =
        `
        <div class="col-lg-4">
            <div class="text-center card-box">
                <div class="member-card pb-2">
                    <div class="thumb-lg member-thumb mx-auto mb-2"><img id="friend-${doc.id}" src="Images/Profile_Pictures/${searchFriendPFP(doc.id)}_Letter.png" class="rounded-circle img-thumbnail" alt="profile-image"></div>
                    <div class="">
                        <h4>${doc.data().firstName} ${doc.data().lastName}</h4>
                        <p class="text-muted">@${doc.data().firstName}</p>
                    </div>
                    <button type="button" id="btn-${doc.id}" class="btn ${vals[2]} mt-3 btn-rounded waves-effect w-md waves-light" onclick="${vals[1]}('${doc.id}')">${vals[0]}</button>
                    <div class="mt-4">
                        <div class="row">
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4 id="followers-${doc.id}">${doc.data().followers}</h4>
                                    <p class="mb-0 text-muted">Followers</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4 id="following-${doc.id}">${doc.data().following}</h4>
                                    <p class="mb-0 text-muted">Following</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4 id="reviewCount-${doc.id}">${doc.data().reviewCount}</h4>
                                    <p class="mb-0 text-muted">Reviews</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        mainDiv.insertAdjacentHTML('beforeend',html);
        })
        .catch(function(error) {
            console.log("Error getting document:", error);
        });
        
    })
}

function addFriend(doc) {
    var user = firebase.auth().currentUser;
    document.getElementById(`btn-${doc}`).classList.remove("btn-primary");
    document.getElementById(`btn-${doc}`).classList.add("btn-danger");
    document.getElementById(`btn-${doc}`).innerHTML = "Unfollow";

    // document.getElementById(`btn-${doc}`).onclick = function() { removeFriend(doc); }
    document.getElementById(`btn-${doc}`).setAttribute('onclick',`removeFriend("${doc}");`)

    if (user) {
        db.collection("users").doc(user.uid).collection("friends").doc(doc).set({
        }).then(function() {
            db.collection("users").doc(user.uid).update({
                following: firebase.firestore.FieldValue.increment(1)
            });
            db.collection("users").doc(doc).update({
                followers: firebase.firestore.FieldValue.increment(1)
            }).then(function() {
                var selectedUser = db.collection("users").doc(doc);
                selectedUser.get().then(function(doc2) {
                    if (doc2.exists) {
                        document.getElementById(`followers-${doc}`).innerHTML = doc2.data().followers;
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
                
            })
            .catch(function(error) {
                console.log("Error updating document:", error);
            });
            console.log("Document successfully written!");
            updateLiveView();
        });
        // parent = document.getElementById('list');
        // while (parent.lastChild) {
        //     parent.removeChild(parent.lastChild);
        // }
    } else {
        console.log("Not currently signed in");
    }
    var selectedUser = db.collection("users").doc(doc);
    selectedUser.get().then(function(doc2) {
        if (doc2.exists) {
            console.log("Test1",doc2.data().followers);
            document.getElementById(`followers-${doc}`).innerHTML = doc2.data().followers;
            document.getElementById(`following-${doc}`).innerHTML = doc2.data().following;
            document.getElementById(`reviewCount-${doc}`).innerHTML = doc2.data().reviewCount;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

}


function removeFriend(doc) {
    var user = firebase.auth().currentUser;
    document.getElementById(`btn-${doc}`).classList.remove("btn-danger");
    document.getElementById(`btn-${doc}`).classList.add("btn-primary");
    document.getElementById(`btn-${doc}`).innerHTML = "Follow";
    // document.getElementById(`btn-${doc}`).onclick = function() { addFriend(doc); }
    document.getElementById(`btn-${doc}`).setAttribute('onclick',`addFriend("${doc}");`)
    if (user) {

        db.collection("users").doc(user.uid).collection("friends").doc(doc).delete({
        }).then(function() {
            db.collection("users").doc(user.uid).update({
                following: firebase.firestore.FieldValue.increment(-1)
            });
            db.collection("users").doc(doc).update({
                followers: firebase.firestore.FieldValue.increment(-1)
            }).then(function() {
                var selectedUser = db.collection("users").doc(doc);
                selectedUser.get().then(function(doc2) {
                    if (doc2.exists) {
                        document.getElementById(`followers-${doc}`).innerHTML = doc2.data().followers;
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });
                
            })
            .catch(function(error) {
                console.log("Error updating document:", error);
            });
            console.log("Friend unfollowed");
            updateLiveView();
        });
        // parent = document.getElementById('list');
        // while (parent.lastChild) {
        //     parent.removeChild(parent.lastChild);
        // }
    } else {
        console.log("Not currently signed in");
    }

    var selectedUser = db.collection("users").doc(doc);
    selectedUser.get().then(function(doc2) {
        if (doc2.exists) {
            console.log("Test1",doc2.data().followers);
            document.getElementById(`followers-${doc}`).innerHTML = doc2.data().followers;
            document.getElementById(`following-${doc}`).innerHTML = doc2.data().following;
            document.getElementById(`reviewCount-${doc}`).innerHTML = doc2.data().reviewCount;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    
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

function searchFriendPFP(id) {
    var picRef = firebase.storage().ref(`users/${id}.jpg`).getDownloadURL().then( 
        (url) => {
            document.querySelector(`#friend-${id}`).src=url;
    }).catch((error) => {
        var picRef = firebase.storage().ref(`users/${id}.png`).getDownloadURL().then( 
            (url) => {
                document.querySelector(`#friend-${id}`).src=url;
        }).catch((error) => {
            picRef = firebase.storage().ref(`users/default${id.charCodeAt(0)%6}.jpg`).getDownloadURL().then(
                (url) => {
                    document.querySelector(`#friend-${id}`).src=url;
            });
        });
    });
}