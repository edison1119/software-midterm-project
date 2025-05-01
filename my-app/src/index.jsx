import './basenavbarloader.jsx';
import './chatroom.jsx'
import { createRoot } from 'react-dom/client';
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get, child, onChildAdded } from "firebase/database";
import { Auth } from './firebaseinit'; // Make sure you have Auth exported from your Firebase config
import { Chatbox } from './chatroom.jsx';

const db = getDatabase();

const RoomCard = () => {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('');
  const [currentRoomName, setCurrentRoomName] = useState('');
  const [alert, setAlert] = useState(false);
  const [alertinner, setalertmsg] = useState('');
  var procroom = [];
  useEffect(() => {
    const unsubscribe = Auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchRooms = async () => {
      const roomsRef = ref(db, 'rooms');
      onChildAdded(roomsRef, (snap) => {
        //console.log(snap.val().allowed)
        for (var person in snap.val().allowed) {
          if (snap.val()["allowed"][person]["mail"] === user.email) {
            //console.log(snap.val()["name"])
            setRooms(prevRooms => [...prevRooms, snap.val()["name"]]);
          }
        }
      }
      )

    };

    fetchRooms();

  }, [user]);
  function addUser() {
    let discovering = false;
    onChildAdded(query(ref(db, "rooms/" + roomname + "/allowed"), orderByChild("email"), equalTo(inviteEmail)), (snap) => {
      setAlertGood(false)
      setSuccessMsg("Hey you already added this person into the chatroom, or someone else did it!")
      setTimeout(() => {
        setSuccessMsg("")
      }, 3000);
      discovering = true;
    })
    if (!discovering) {
      let inviteEmail = document.getElementById("inviteEmail")
      push(ref(db, "rooms/" + roomname + "/allowed"), { "mail": inviteEmail }).then(() => {
        setAlertGood(true)
        setSuccessMsg("Added, great")
        setTimeout(() => {
          setSuccessMsg("")
        }, 3000);
      }

      ).catch((e) => {
        console.log(e);
        setAlertGood(false)
        setSuccessMsg("Something went wrong when adding your friend!")
        setTimeout(() => {
          setSuccessMsg("")
        }, 3000);
      }

      )
    }

  }
  const join = async (roomid) => {
    //console.log("Joining room:", roomid);
    const chatRef = ref(db, `rooms/${roomid}`)
    //console.log((await get(chatRef)).val())
    setCurrentRoom(roomid);
    setCurrentRoomName((await get(chatRef)).val()["name"])
  };

  return (
    <>

      <div className="col-md-5">
        {currentRoom&&(<div className="mb-3">
          <h5>Invite User</h5>
          <div className="input-group">
            <input
              type="email"
              className="form-control"
              placeholder="Enter user's email"
              id="inviteEmail"
            />
            <button className="btn btn-success" onClick={addUser}>
              Invite
            </button>
          </div>
        </div>
        )}
        <div className="card shadow-sm mb-3" id="chatroomcard">
          {rooms.length === 0 && <p>you don't have any chatroom yet! (or it's just loading)</p>}
          {rooms.map((room, index) => (
            <div key={index} className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-1">room : {room}</h5>
              </div>
              <button className="btn btn-primary" onClick={() => { join(room) }}>Join</button>
            </div>
          ))}
        </div>
      </div>
      <div className="col-md-7" >
        <div id="messages" style={{maxHeight:"40vh"}}>

          <div className="card shadow-sm mb-3" style={{ height: "auto", maxHeight: "4ovh" }}>
            <div className="card-body d-flex flex-column h-100">
              <h5 className="card-title">{currentRoomName}</h5>
              {currentRoom && (
                <div className="mt-4">
                  <Chatbox roomid={currentRoom} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const domNode = document.getElementById('content');
const root = createRoot(domNode);
root.render(<RoomCard />);


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