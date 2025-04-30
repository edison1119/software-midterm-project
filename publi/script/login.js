//AUTH ARE COPIED FROM firebase documents
const auth = firebase.auth();
function login(){
    console.log("yes");
    var emailhtml = document.getElementById("email");
    var passwordhtml = document.getElementById("password");
    var email = emailhtml.value;
    var password =  passwordhtml.value;
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
        console.log(errorMessage);
        document.getElementById("login-alert").classList.remove("d-none");
        setTimeout(() => {
            document.getElementById("login-alert").classList.add("d-none");
        }, 3000);
    });

}
function createuser(){
    var emailhtml = document.getElementById("email");
    var passwordhtml = document.getElementById("password");
    var email = emailhtml.value;
    var password =  passwordhtml.value;
    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;
        window.alert("account created, automatically logging you in");
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
            console.log(errorMessage);
            document.getElementById("login-alert").innerHTML="Something went wrong when trying auto login..."
            document.getElementById("login-alert").classList.remove("d-none");
            setTimeout(() => {
                document.getElementById("login-alert").classList.add("d-none");
            }, 3000);

        });
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        window.alert("account creation failed")
    }); 
}
console.log("loaded");