import './basenavbarloader.jsx';
import { createRoot } from 'react-dom/client';
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get, child, onChildAdded, push, increment, update, remove } from "firebase/database";
import { Auth } from './firebaseinit.jsx'; // Make sure you have Auth exported from your Firebase config

const db = getDatabase();
const Chatbox = ({ roomid }) => {
  const [roomname, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [messagesId, setMessagesId] = useState([]);
  const [user, setUser] = useState(null);
  const [updatev, setupdateV] = useState(0);
  console.log("yes")
  useEffect(() => {
    const unsubscribe = Auth.onAuthStateChanged((ur) => {
      setUser(ur);
      //console.log("t", ur)
    });
    return () => unsubscribe();
  }, []);
  /*get(ref(db, "rooms/" + roomid + "/name")).then((snap) => {
    console.log("joined", snap.val());

  })*/
  useEffect(() => {
    setMessages([]);
    setMessagesId([]);
    onChildAdded(ref(db, "rooms/" + roomid + "/messages"), (snap) => {
      console.log(`${snap.val()["sender"]} : ${snap.val()["value"]}`);
      setMessages(prev => [...prev, `${snap.val()["sender"]} : ${snap.val()["value"]?snap.val()["value"]:"(no content)"}`]);
      setMessagesId(prev => [...prev, snap.key]);
    });
  }, [roomid, updatev]);
  /*
  onChildAdded(ref(db, "rooms/" + roomid + "/messages"), (snap) => {
    console.log(snap.val());
    setMessages(prev => [...prev, snap.val()]);
  })
  */
  async function send() {
    const chatRoomRef = ref(db, "rooms/" + roomid)
    setupdateV(updatev + 1);
    var content = document.getElementById("Msg").value
    //console.log("sending", user?.displayName, content)
    await push(child(chatRoomRef, "messages"), {
      "sender": user.displayName,
      "value": content
    })
    const updates = {};
    updates["messagecount"] = increment(1);
    update(chatRoomRef, updates)
  }
  function deletemsg(Id) {
    remove(ref(db, "rooms/" + roomid + "/messages/" + Id))
    console.log("deleting",Id)
    setupdateV(updatev+1);
  }
  return (
    <>

      <div style={{ overflowY: "auto", minHeight: "10vh", maxHeight: "50vh" }} className="flex-grow-1 mb-3">
        {messages ? (messages.map((content, index) => (
          <>
            <div key={index} className="d-flex justify-content-between align-items-center mb-2">
              <p className="mb-0 me-2">{content}</p>
              <button className="btn btn-sm btn-outline-secondary btn-outline-red align-items-right" onClick={() => deletemsg(messagesId[index])}>
                delete
              </button>
            </div>
          </>
        ))
        ) : <p1>No message found!</p1>

        }
      </div>

      <div className="input-group">
        <input
          type="text"
          id="Msg"
          className="form-control"
          placeholder="Type your message"
        />
        <button
          className="btn btn-primary"
          type="button"
          id="sendMsgbtn"
          onClick={send}
        >
          Send
        </button>
      </div>

    </>
  )
}


export { Chatbox }

// Clear the existing HTML content
//document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
//const root = createRoot(document.getElementById('app'));
//root.render(<h1>Hello, world</h1>);



// `load` COPIED FROM https://cloud.google.com/appengine/docs/standard/python3/building-app/authenticating-users
// I THINK THIS ISN'T COUNTED RIGHT?????????
// GAMBLING WITH SCORE :D
/*
window.addEventListener('load', function () {
    document.getElementById('loginbtn').onclick = function () {
      firebase.auth().signOut();
    };
  
    // Firebas-eUI config.
    var uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        // Comment out any lines corresponding to providers you did not check in
        // the Firebase console.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,
        //firebase.auth.PhoneAuthProvider.PROVIDER_ID
      ],
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
*/