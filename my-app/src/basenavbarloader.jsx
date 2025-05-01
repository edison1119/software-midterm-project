


import { createRoot } from 'react-dom/client';
import { Auth } from "./firebaseinit"
import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
const AuthStatus = () => {
  const [user, setUser] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    // Handle login success alert
    if (localStorage.getItem('loginsuccess')) {
      setLoginSuccess(true);
      setTimeout(() => setLoginSuccess(false), 3000);
    }

    // Listen for auth state change
    const unsubscribe = Auth.onAuthStateChanged((user) => {
      setUser(user);
      console.log(user.email)
      if (user) {
        user.getIdToken().then((token) => {
          document.cookie = `token=${token}`;
        });
      } else {
        document.cookie = 'token=';
      }
    }, (error) => {
      console.error(error);
      alert('Unable to log in: ' + error);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleLoginClick = () => {
    if (user) {
      Auth.signOut();
    } else {
      window.location.href = 'login.html';
    }
  };
  const changename = () => {
    updateProfile(user, { displayName:document.getElementById("newDisplayName").value})
  }

  return (
    <>

      <div className="container-fluid">
        <a className="navbar-brand" href="#">your (not) local chatroom</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="index.html">Lobby</a>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Change Name
              </button>
              <ul className="dropdown-menu p-3" style={{ minWidth: "250px" }}>
                <li>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="New display name"
                    id="newDisplayName"
                  />
                </li>
                <li>
                  <button
                    className="btn btn-primary w-100"
                    onClick={changename}
                  >
                    Confirm
                  </button>
                </li>
              </ul>
            </li>
          </ul>
          <b id="login-info" className="me-5">
            {user ? `user: ${user.email}` : 'not logged in'}
          </b>
          <button className="btn btn-outline-primary" type="button" onClick={handleLoginClick}>
            {user ? 'logout' : 'login'}
          </button>
        </div>
      </div>
      {loginSuccess && (
        <div id="loginalert" className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> You have logged in successfully.
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
    </>
  );
};

const domNode = document.getElementById('topnavbar');
const root = createRoot(domNode);
root.render(<AuthStatus />);
