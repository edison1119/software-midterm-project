//AUTH ARE COPIED FROM firebase documents
import { createRoot } from 'react-dom/client';
import "./firebaseinit"
import React, { useEffect, useState } from 'react';
import { getAuth ,createUserWithEmailAndPassword,signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import {getDatabase,ref,get} from "firebase/database";
const Auth = getAuth();
const Loginpage = ()=> {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(false);
    const [alertinner, setalertmsg]=useState('');

    function login(){
        console.log("yes");
        var emailhtml = document.getElementById("email");
        var passwordhtml = document.getElementById("password");
        var email = emailhtml.value;
        var password =  passwordhtml.value;
        signInWithEmailAndPassword(Auth, email, password)
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
            setalertmsg("Something went wrong when logging in");
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 3000);

        });
    
    };
    function createuser(){
        createUserWithEmailAndPassword(Auth, email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            console.log(user,userCredential);
            updateProfile(user, {
                    "displayName": `${email}`,
            }).then(() => {
                    // Update successful
                    // ...
            }).catch((error) => {
                    // An error occurred
                    // ...
            });  
            //var newtk = database.ref("usertk/"+user.displayName).push();
            //startcomment
            push(ref(db, "rooms/" + roomname + "/allowed"), { "mail": email })

            //endcomment
            window.alert("account created, automatically logging you in");
            signInWithEmailAndPassword(Auth,email, password)
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
                setalertmsg("Something went wrong when trying auto login...");
                setAlert(true);
                setTimeout(() => {
                    setAlert(false);
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
    return (
    <div className="card login-board shadow p-4">
        <h2 className="text-center mb-4">Login</h2>

        {alert&&
        (<div id="login-alert" className="alert alert-danger" role="alert">
            {alertinner}
        </div>)
        }
        <form>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="text" className="form-control" id="email" placeholder="Enter email" required/>
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Enter password" required/>
            </div>
            <div className="d-grid gap-2">
                <button type="button" className="btn btn-primary" onClick={login}>Login</button>
                <button type="button" className="btn btn-secondary" onClick={createuser}>Register</button>
            </div>
        </form>
    </div>
    )
}

/*
function createuser(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMsg, setAlertMsg] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    Auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        var user = userCredential.user;
        console.log(user,userCredential);
        user.updateProfile({
                "displayName": `${email}`,
        }).then(() => {
                // Update successful
                // ...
        }).catch((error) => {
                // An error occurred
                // ...
        });  
        //var newtk = database.ref("usertk/"+user.displayName).push();
        //startcomment
        database.ref("users/"+user.uid+"/chatroom").set({
            "General chatroom":1
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);});
        //endcomment
        window.alert("account created, automatically logging you in");
        Auth.signInWithEmailAndPassword(email, password)
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
*/
const domNode = document.getElementById('logincard');
const root = createRoot(domNode);
root.render(<Loginpage/>);


console.log("loaded");