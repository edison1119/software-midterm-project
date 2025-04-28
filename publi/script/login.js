//AUTH ARE COPIED FROM firebase documents

import{ firebase }from "firebase/compat/app";
const auth = firebase.auth();
function login(){
    console.log("yes");
    var usernamehtml = document.getElementById("username");
    var passwordhtml = document.getElementById("password");
    var fireauth= firebase.auth();
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
        localStorage.setItem('loginSuccess', 'true');
        window.location.href = 'index.html';
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
    });

}
function createuser(){

    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        
        // ...
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);

    });
}
console.log("loaded");