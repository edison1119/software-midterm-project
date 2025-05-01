import { createRoot } from 'react-dom/client';
import {Auth} from "./firebaseinit"
import React, { useEffect, useState } from 'react';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, get, set, child, onChildAdded, orderByChild, query, equalTo, push, orderByKey } from "firebase/database";
const db = getDatabase();
console.log(4);
import "./basenavbarloader";
const Content = () => {
    const [roomname, setRoomName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [roomCreated, setRoomCreated] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [alertgood, setAlertGood] = useState(false);
    async function createRoom() {
        let cre = true;
        await get(query(ref(db, "rooms/"), orderByKey(), equalTo(roomname))).then((snap) => {
            if (snap.val()) {
                console.log(snap.val())
                window.alert('already have this room! maybe change up the name a bit')//fuck i dont want to create another box for it
                cre = false;
            }
        }).catch((e) => { console.log(e) })

        if (cre) {
            var newroom = ref(db, "rooms/" + roomname);

            set(newroom, {
                "name": roomname,
            })
            push(child(newroom, "allowed"), { "mail": Auth.currentUser.email })
            setRoomCreated(true);
        }
        console.log("anotherone");
    }
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
    return (
        <>
            <div className="row mb-5">
                <div className="col-md-5">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter chatroom name"
                        value={roomname}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <button
                        className="btn btn-success w-100"
                        onClick={createRoom}
                    >
                        Create Room
                    </button>
                </div>
            </div>

            <p className="text-muted text-center mb-4">
                Add your friends after creating a room :D
            </p>

            <div className="row">
                <div className="col-md-5">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter username to invite"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        disabled={!roomCreated}
                    />
                </div>
                <div className="col-md-3">
                    <button
                        className="btn btn-primary w-100"
                        onClick={addUser}
                        disabled={!roomCreated}
                    >
                        Add User with Email
                    </button>
                </div>
            </div>

            {!roomCreated && (
                <p id="disabled-invite" className="text-muted text-center mb-4">
                    Create the room before adding friends!
                </p>
            )}
            {successMsg && (
                <div className={"alert text-center mx-auto col-md-6 " + alertgood ? "alert-success" : "alert-danger"} role="alert">
                    {successMsg}
                </div>
            )}
        </>
    );

}
const domNode = document.getElementById('content');
const root = createRoot(domNode);
root.render(<Content />);
