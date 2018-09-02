import React, { Component } from "react";
import moment from "moment";
import Paper from "material-ui/Paper";

import Temperature from "./Temperature";
import Alarm from "./Alarm";
import Status from "./Status";
import {
  getTemperature,
  getLastOnline,
  getAlarm,
  getDetected,
  getIsOwnerPhoneHome
} from "./firebase.js";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastOnline: null,
      temperature: [],
      alarm: [{}, { value: 0 }],
      detected: [{}, { value: 0 }],
      isPhoneHome: {}
    };
    this.shouldBeDisabled = this.shouldBeDisabled.bind(this);
    this.calculateAlarmStatus = this.calculateAlarmStatus.bind(this);
  }
  componentWillMount() {
    getTemperature(data => {
      var temperature = Object.values(data || {});
      this.setState(() => ({ temperature }));
    });
    getLastOnline(timestamp =>
      this.setState(() => ({ lastOnline: timestamp }))
    );
    getAlarm(data => {
      var alarm = Object.values(data || {});
      this.setState(() => ({ alarm }));
    });
    getDetected(data => {
      var detected = Object.values(data || {});
      this.setState(() => ({ detected }));
    });
    getIsOwnerPhoneHome(data => {
      this.setState(() => ({ isPhoneHome: data }));
    });
  }
  shouldBeDisabled() {
    if (moment().diff(this.state.lastOnline, "minutes") < 1) {
      return false;
    } else return true;
  }
  calculateAlarmStatus() {
    if (this.state.alarm && this.state.detected && this.state.isPhoneHome) {
      const alarm = this.state.alarm[this.state.alarm.length - 1];
      const detected = this.state.detected[this.state.detected.length - 1];
      if (alarm.value === true) {
        if (this.state.isPhoneHome.value === true) {
          return "Phone";
        } else if (moment(detected.timestamp).diff(alarm.timestamp) > 0) {
          return "Detected";
        } else return "Armed";
      } else return "Disabled";
    } else return "Disabled";
  }
  render() {
     console.log(this.state.temperature);
    const style = {
      display: "flex",
      flexDirection: "row",
      height: "70vh",
      width: "80vw",
      margin: "15vh 10vw",
      padding: "2%",
      float: "left",
      backgroundColor: "#d3d4b5"
    };
    return (
      <Paper style={style} zDepth={5}>
        <Status
          lastOnline={this.state.lastOnline}
          status={moment().diff(this.state.lastOnline, "minutes") < 1}
        />
        <Temperature
          currentTemperature={
            this.state.temperature[this.state.temperature.length - 1]
          }
          isDisabled={false}
          temperature={this.state.temperature}
        />
        <Alarm
          status={this.calculateAlarmStatus()}
          isDisabled={false}
          alarm={this.state.alarm}
          detected={this.state.detected}
          isPhoneHome={this.state.isPhoneHome}
        />
      </Paper>
    );
  }
}

export default Dashboard;
