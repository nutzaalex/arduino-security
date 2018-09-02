import * as firebase from "firebase";

var config = {};
firebase.initializeApp(config);
const database = firebase.database();
window.database = database;

export const getTemperature = callback => {
  database
    .ref("/temperature")
    .on("value", snapshot => callback(snapshot.val()));
};

export const getAlarm = callback => {
  database.ref("/alarm").on("value", snapshot => callback(snapshot.val()));
};

export const getDetected = callback => {
  database.ref("/detected").on("value", snapshot => callback(snapshot.val()));
};

export const getLastOnline = callback => {
  database
    .ref("/last-online")
    .on("value", snapshot => callback(snapshot.val()));
};

export const getIsOwnerPhoneHome = callback => {
  database
    .ref("/phoneOnWifi")
    .on("value", snapshot => callback(snapshot.val()));
};

// enabling the follwing code and writing window.resetDb from the console where the site is loaded will cause a full reset of the databse.
// window.resetDb = () => {
//   database.ref("/temperature").set([]);
//   database.ref("/alarm").set([]);
//   database.ref("/detected").set([]);
// };
