import React, { Component } from "react";
import Paper from "material-ui/Paper";
import PropTypes from "prop-types";
import RaisedButton from "material-ui/RaisedButton";
import ActionTimeline from "material-ui/svg-icons/action/timeline";
import NavigationClose from "material-ui/svg-icons/navigation/close";
import Modal from "react-modal";
import Moment from "react-moment";
import { Line } from "react-chartjs-2";
import moment from "moment";

let lineChartData = {
  labels: [
    "0:00 AM",
    "1:00 AM",
    "2:00 AM",
    "3:00 AM",
    "4:00 AM",
    "5:00 AM",
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
    "11:00 PM"
  ],
  datasets: [
    {
      label: "Alarm Status",
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(0, 255, 0, 1)",
      borderColor: "rgba(0, 255, 0, 1)",
      borderWidth: 1,
      pointBackgroundColor: "rgba(0, 255, 0, 1)",
      pointBorderWidth: 1,
      pointHoverRadius: 10,
      pointRadius: 4,
      pointHitRadius: 10,
      showLine: true,
      steppedLine: true,
      data: []
    },
    {
      label: "Detectections",
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(255, 0, 0, 1)",
      borderColor: "rgba(255, 0, 0, 1)",
      borderWidth: 1,
      pointBackgroundColor: "rgba(255, 0, 0, 1)",
      pointBorderWidth: 1,
      pointHoverRadius: 10,
      pointRadius: 4,
      pointHitRadius: 10,
      showLine: false,
      data: []
    }
  ]
};

class Alarm extends Component {
  static PropTypes = {
    status: PropTypes.oneOf(["Disabled", "Armed", "Detected", "Phone"]),
    isDisabled: PropTypes.bool,
    alarm: PropTypes.array,
    detected: PropTypes.array,
    isPhoneHome: PropTypes.object
  };
  static defaultProps = {
    status: "Disabled",
    isDisabled: true,
    alarm: [],
    detected: [],
    isPhoneHome: {}
  };
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      finalAlarmStatus: lineChartData
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.determineLastStatus = this.determineLastStatus.bind(this);
    this.handleNewTemps = this.handleNewTemps.bind(this);
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  determineLastStatus() {
    if (this.props.alarm) {
      const lastAlarm = this.props.alarm[this.props.alarm.length - 1];
      const lastDetected = this.props.detected[this.props.detected.length - 1];
      if (this.props.isPhoneHome.value === true) {
        return this.props.isPhoneHome.timestamp;
      } else if (lastAlarm.timestamp > lastDetected.timestamp) {
        return lastAlarm.timestamp;
      } else if (lastAlarm.timestamp < lastDetected.timestamp) {
        return lastDetected.timestamp;
      } else return null;
    } else return null;
  }

  handleNewTemps() {
    let x = lineChartData;
    let initAlarm = this.props.alarm;
    let initDetection = this.props.detected;
    initAlarm = initAlarm.filter(
      alarm => !moment().diff(alarm.timestamp, "days")
    );

    let newAlarm = initAlarm.map(alarm => {
      let x = new Date(alarm.timestamp);
      return {
        hour: x.getHours(),
        value: alarm.value
      };
    });

    newAlarm = newAlarm.reduce((nextAlarm, currentAlarm) => {
      nextAlarm[currentAlarm.hour] = currentAlarm.value;
      return nextAlarm;
    }, []);

    let finalAlarm = [];

    for (let i = 0; i <= 24; i++) {
      finalAlarm[i] = newAlarm[i] || 0;
    }

    initDetection = initDetection.filter(
      detection => !moment().diff(detection.timestamp, "days")
    );

    let newDetection = initDetection.map(detection => {
      let x = new Date(detection.timestamp);
      return {
        hour: x.getHours(),
        value: detection.value
      };
    });

    newDetection = newDetection.reduce((nextDetection, currentDetection) => {
      nextDetection[currentDetection.hour] = currentDetection.value;
      return nextDetection;
    }, []);

    let finalDetection = [];

    for (let i = 0; i <= 24; i++) {
      finalDetection[i] = newDetection[i] ? 0.5 : undefined;
    }

    x.datasets[0].data = finalAlarm;
    x.datasets[1].data = finalDetection;
    this.setState({ finalAlarmStatus: x });
  }

  componentDidMount() {
    setTimeout(() => {
      this.handleNewTemps();
    }, 2000);
  }

  render() {
    const lineChartOptions = {
      tooltips: {
        mode: "x",
        titleFontFamily: "Montserrat",
        titleFontSize: 14,
        titleMarginBottom: 12,
        bodyFontFamily: "Montserrat",
        bodyFontSize: 12,
        bodySpacing: 6
      },
      legend: {
        display: true
      }
    };
    const style = {
      backgroundColor: "#F5F5F5",
      padding: "2%",
      margin: "5%",
      flex: "1",
      borderRadius: "200px",
      textAlign: "center",
      color: "#b88f51",
      position: "relative"
    };
    const styleIndicatorArmed = {
      backgroundColor: "green",
      padding: "15%",
      margin: "20% 30%",
      flex: "1",
      flexDirection: "row",
      borderRadius: "200px",
      textAlign: "center"
    };

    const styleIndicatorDisabled = {
      backgroundColor: "red",
      padding: "15%",
      margin: "20% 30%",
      flex: "1",
      flexDirection: "row",
      borderRadius: "200px",
      textAlign: "center"
    };
    const styleIndicatorDetected = {
      backgroundColor: "orange",
      padding: "15%",
      margin: "20% 30%",
      flex: "1",
      flexDirection: "row",
      borderRadius: "200px",
      textAlign: "center"
    };
    const buttonStyle = {
      marginLeft: "-45px",
      position: "absolute",
      bottom: "10px",
      textAlign: "center",
      borderRadius: "20px"
    };
    const ButtonStyleOverride = {
      borderRadius: "20px"
    };
    const modalButtonStyle = {
      position: "absolute",
      bottom: "10px",
      textAlign: "center",
      borderRadius: "20px",
      minWidth: "96%"
    };

    const modalStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        minHeight: "60%",
        minWidth: "50%"
      },
      overlay: {
        zIndex: "3"
      }
    };

    let alarmStatus;
    let alarmText;
    if (this.props.status === "Disabled") {
      alarmStatus = (
        <Paper style={styleIndicatorDisabled} zDepth={4} circle={true} />
      );
      alarmText = <p style={{ color: "red" }}> Disabled </p>;
    } else if (this.props.status === "Phone") {
      alarmStatus = (
        <Paper style={styleIndicatorArmed} zDepth={4} circle={true} />
      );
      alarmText = <p style={{ color: "blue" }}> Online, you are home </p>;
    } else if (this.props.status === "Armed") {
      alarmStatus = (
        <Paper style={styleIndicatorArmed} zDepth={4} circle={true} />
      );
      alarmText = <p style={{ color: "green" }}> Armed </p>;
    } else if (this.props.status === "Detected") {
      alarmStatus = (
        <Paper style={styleIndicatorDetected} zDepth={4} circle={true} />
      );
      alarmText = <p style={{ color: "orange" }}> Intruder detected! </p>;
    }
    return (
      <Paper style={style} zDepth={3}>
        <div
          style={
            this.props.isDisabled
              ? {
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  top: "0",
                  left: "0",
                  borderRadius: "200px",
                  zIndex: "3"
                }
              : {}
          }
        />
        <p style={{ fontSize: "18px" }}>Home Alarm</p>
        <hr />
        {alarmStatus}
        {alarmText}
        {this.props.alarm[this.props.alarm.length - 1].timestamp &&
          <div style={{ marginTop: "30px" }}>
            <p>Last status change:</p>
            <Moment fromNow interval={1000}>
              {this.determineLastStatus()}
            </Moment>
          </div>}
        <RaisedButton
          icon={<ActionTimeline />}
          backgroundColor="#a4c639"
          style={buttonStyle}
          buttonStyle={ButtonStyleOverride}
          onClick={this.openModal}
        />
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={modalStyles}
          contentLabel="Status"
        >
          <div>
            <Line
              data={this.state.finalAlarmStatus}
              options={lineChartOptions}
            />
          </div>
          <RaisedButton
            icon={<NavigationClose />}
            backgroundColor="#a4c639"
            style={modalButtonStyle}
            buttonStyle={ButtonStyleOverride}
            onClick={this.closeModal}
          />
        </Modal>
      </Paper>
    );
  }
}

export default Alarm;
