

// `load` COPIED FROM https://cloud.google.com/appengine/docs/standard/python3/building-app/authenticating-users
// I THINK THIS ISN'T COUNTED RIGHT?????????
// GAMBLING WITH SCORE :D
import { createRoot } from 'react-dom/client';
import "./firebaseinit"
import React, { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
const Auth = getAuth();
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
                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="setting.html">Change name</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Link</a>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </li>
                <li className="nav-item">
                    <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>
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
root.render(<AuthStatus/>);
