import firebase from '../firebase';

const db=firebase.firestore();

var ref = firebase.database().ref('student');
  nextref=ref.child(headnode);
  nextref.orderByChild(childname).equalTo(findvalue).on("child_added",function (childSnapshot) {
    console.log(JSON.stringify(childSnapshot.val()));
  })