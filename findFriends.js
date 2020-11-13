document.getElementById("friend-search").onkeypress = function(e) {
    if(e.key === 'Enter') {
        searchPeople();
    }
}

function searchPeople() {
    var value = document.getElementById("friend-search").value;
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
    var mainDiv = document.getElementById('friendList');
    mainDiv.innerHTML = "";
    docs.forEach((doc) => {
        const html =
        `
        <div class="col-lg-4">
            <div class="text-center card-box">
                <div class="member-card pb-2">
                    <div class="thumb-lg member-thumb mx-auto mb-2"><img src="Images/Profile_Pictures/${doc.data().firstName[0].toUpperCase()}_Letter.png" class="rounded-circle img-thumbnail" alt="profile-image"></div>
                    <div class="">
                        <h4>${doc.data().firstName} ${doc.data().lastName}</h4>
                        <p class="text-muted">@${doc.data().firstName}</p>
                    </div>
                    <button type="button" class="btn btn-primary mt-3 btn-rounded waves-effect w-md waves-light" onclick="addFriend('${doc.id}')">Follow</button>
                    <div class="mt-4">
                        <div class="row">
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4>2563</h4>
                                    <p class="mb-0 text-muted">Followers</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4>6952</h4>
                                    <p class="mb-0 text-muted">Following</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4>1125</h4>
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
}

function addFriend(doc) {
    console.log("Test1");
    var user = firebase.auth().currentUser;
    console.log("Test1");
    if (user) {
        console.log(user.uid);
        console.log("Test2");
        console.log(doc)
        db.collection("users").doc(user.uid).collection("friends").doc(doc).set({
        }).then(function() {
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