var database = firebase.database();
const auth = firebase.auth();
console.log(4);
function createroom(){
    var roomnamehtml = document.getElementById("chatroomName");
    var roomname = roomnamehtml.value;
    var cre=true;
    database.ref("rooms").child(roomname).on('value',(snap)=>{
        if(snap.exists()){
            window.alert('already have this room! maybe change up the name a bit')
            cre=false;
        }
        })
    if(cre){
        var newroom = database.ref("rooms/"+roomname);
        
        newroom.set({
            "name" : roomname,
        })
        newroom.child("allowed").push().set({
            "mail": auth.currentUser.email
        })
        
    }
    console.log("anotherone");
}
