

// `load` COPIED FROM https://cloud.google.com/appengine/docs/standard/python3/building-app/authenticating-users
// I THINK THIS ISN'T COUNTED RIGHT?????????
// GAMBLING WITH SCORE :D

window.addEventListener('load', function () {
    document.getElementById('loginbtn').onclick = function () {
      firebase.auth().signOut();
    };
  
    if(this.localStorage.getItem('loginsuccess')){
      document.getElementById("loginalert").classList.remove("d-none");
      setTimeout(() => {
          document.getElementById("loginalert").classList.add("d-none");
      }, 3000);
    }
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in, so display the "sign out" button and login info.
        document.getElementById('loginbtn').innerHTML= "logout";
        document.getElementById('loginbtn').onclick = function () {
          firebase.auth().signOut();
        };
        console.log("yesyesyes");
        document.getElementById('login-info').innerHTML = `user:${user.email}`;
        console.log(`Signed in as ${user.displayName} (${user.email})`);
        user.getIdToken().then(function (token) {
          // Add the token to the browser's cookies. The server will then be
          // able to verify the token against the API.
          // SECURITY NOTE: As cookies can easily be modified, only put the
          // token (which is verified server-side) in a cookie; do not add other
          // user information.
          document.cookie = "token=" + token;
        });
      } else {
        // User is signed out.
        // Initialize the FirebaseUI Widget using Firebase.
        // Show the Firebase login button.
        // Update the login state indicators.

        document.getElementById('login-info').innerHTML = "not logged in";
        document.getElementById('loginbtn').innerHTML = "login";
        document.getElementById('loginbtn').onclick = function () {
          window.location.href = 'login.html';
        };
        // Clear the token cookie.
        document.cookie = "token=";
      }
    }, function (error) {
      console.log(error);
      alert('Unable to log in: ' + error);
    });
  });
console.log("Hello from index.js!");