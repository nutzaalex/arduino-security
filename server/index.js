const express = require("express");
const bodyParser = require("body-parser");
const url = require("url");
const firebase = require("firebase");
const arp = require("node-arp");
const moment = require("moment");
const Nexmo = require("nexmo");
const config = {};
//the sms service
const nexmo = new Nexmo({});
const from = "HomeArduino";
const to = "";
const text = "Someone is in your house!";
//the targeted Phone mac is
const myPhoneMac = "";
const myPhoneIP = "";

var phoneMac = "";
var lastDetected = 0;
firebase.initializeApp(config);
const database = firebase.database();
const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
//find the phone mac (it tells us if the phone is connected or not to the wifi) so we know if we should send an sms notification or not
function isPhoneHome() {
  arp.getMAC(myPhoneIP, function(err, mac) {
    if (!err) {
      phoneMac = mac;
      var value = {
        value: true,
        timestamp: Date.now()
      };
      console.log("Phome is home.");
      isOwnerPhoneHome(value);
    } else {
      phoneMac = "";
      console.log("Phone is not home.");
      var value = {
        value: false,
        timestamp: Date.now()
      };
      isOwnerPhoneHome(value);
    }
  });
  setTimeout(isPhoneHome, 5000);
}
isPhoneHome();

//functions to write to the firebase database
const writeTemperature = temperature => {
  database.ref("/temperature").push(temperature);
};
const writeAlarm = alarm => {
  database.ref("/alarm").push(alarm);
};
const writeDetected = detected => {
  database.ref("/detected").push(detected);
};
const heartbeatDetected = heartbeat => {
  database.ref("/last-online").set(heartbeat);
};
const isOwnerPhoneHome = phoneOnWifi => {
  database.ref("/phoneOnWifi").set(phoneOnWifi);
};


const getTemperature = callback => {
  database
    .ref("/temperature")
    .on("value", snapshot => callback(snapshot.val()));
};



function gettemp(){
  getTemperature(data => {
    var temperature = Object.values(data || {});
    console.log("tttt",temperature);
  });
  getTemperature();
  setTimeout(gettemp,1000);
}
gettemp();

//the http post requests that the server accepts and will get from the arduino
app.post("/temperature", function(req, res) {
  const temp = parseFloat(req.body.temp);
  res.setHeader("Content-Type", "application/json");
  if (Number.isNaN(temp)) {
    res.json({ success: false, error: "Not a number!" });
  } else {
    res.json({ success: true, error: null });
    var value = {
      value: temp,
      timestamp: Date.now()
    };
    writeTemperature(value);
    console.log("New temperature recorded:", value);
  }
});

app.post("/alarm", function(req, res) {
  const alarmStatus = !!+req.body.alarm;
  res.setHeader("Content-Type", "application/json");
  if (!typeof variable === "boolean") {
    res.json({ success: false, error: "Not a boolean!" });
  } else {
    res.json({ success: true, error: null });
    var value = {
      value: alarmStatus,
      timestamp: Date.now()
    };
    writeAlarm(value);
    console.log("New alarm recorded:", value);
  }
});

app.post("/detected", function(req, res) {
  const alarmStatusDetected = !!req.body.detected;
  res.setHeader("Content-Type", "application/json");
  if (!typeof variable === "boolean") {
    res.json({ success: false, error: "Not a boolean!" });
  } else {
    res.json({ success: true, error: null });
    var value = {
      value: alarmStatusDetected,
      timestamp: Date.now()
    };
    console.log("The sensor detected something!");
    // the sensor will detect multiple times when someone is in front of it,
    // we insure that if it happened within 1 minute it will be recorded only once
    if (moment(value.timestamp).diff(lastDetected, "minutes") > 1) {
      // if there is no mac found this means that the phone is not connected to wifi
      // (owner is not home) so we send an sms notification
      if (phoneMac.localeCompare(myPhoneMac) != 0) {
        console.log("Phone not detected, sending SMS!");
        writeDetected(value);
        console.log("New detection recorded:", value);
        nexmo.message.sendSms(from, to, text, (error, response) => {
          lastDetected = value.timestamp;
          if (error) {
            throw error;
          } else if (response.messages[0].status != "0") {
            console.error(response);
            throw "Nexmo returned back a non-zero status.";
          } else {
            console.log(response);
          }
        });
      }
    }
  }
});

app.post("/heartbeat", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.json({ success: true, error: null });
  var value = Date.now();
  heartbeatDetected(value);
  console.log("New heartbeat recored, timestamp:", value);
});

//the port numbert the server will listen to in order to get requests from the arduino
app.listen(3000, function() {
  console.log("The server is listening on port 3000!");
});
