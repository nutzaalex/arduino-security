import React, { Component } from "react";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import ActionTimeline from "material-ui/svg-icons/action/timeline";
import NavigationClose from "material-ui/svg-icons/navigation/close";
import PropTypes from "prop-types";
import Modal from "react-modal";
import Moment from "react-moment";
import { Line } from "react-chartjs-2";
import moment from "moment";

import Thermometer from "./Thermometer.js";

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
      label: "Temperature in °Celsius",
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(0, 165, 153, 1)",
      borderColor: "rgba(0, 165, 153, 1)",
      borderWidth: 1,
      pointBackgroundColor: "rgba(0, 165, 153, 1)",
      pointBorderWidth: 1,
      pointHoverRadius: 10,
      pointRadius: 4,
      pointHitRadius: 10,
      showLine: false,
      data: []
    }
  ]
};

class Temperature extends Component {
  static PropTypes = {
    currentTemperature: PropTypes.object,
    isDisabled: PropTypes.bool,
    temperature: PropTypes.array
  };
  static defaultProps = {
    currentTemperature: {},
    isDisabled: true,
    temperature: []
  };
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      finalTemps: lineChartData
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleNewTemps = this.handleNewTemps.bind(this);
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  handleNewTemps() {
    let x = lineChartData;

    let initTemps = this.props.temperature;

    initTemps = initTemps.filter(
      temp => !moment().diff(temp.timestamp, "days")
    );

    let newTemps = initTemps.map(temp => {
      let x = new Date(temp.timestamp);
      return {
        hour: x.getHours(),
        value: temp.value
      };
    });

    newTemps = newTemps.reduce((nextTemps, currentTemp) => {
      nextTemps[currentTemp.hour] = currentTemp.value.toFixed(2);
      return nextTemps;
    }, []);

    let finalTemps = [];

    for (let i = 0; i <= 24; i++) {
      finalTemps[i] = newTemps[i] || undefined;
    }
    x.datasets[0].data = finalTemps;
    this.setState({ finalTemps: x });
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
      flexDirection: "column",
      borderRadius: "200px",
      textAlign: "center",
      color: "#b88f51",
      position: "relative"
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

        <p style={{ fontSize: "18px" }}>Room Temperature</p>
        <hr />
        <div style={{ paddingTop: "5%" }}>
          <Thermometer
            theme={"light"}
            value={this.props.currentTemperature.value}
            max={45}
            format={"°C"}
            steps={5}
            size={"normal"}
            height={180}
          />
        </div>
        {this.props.currentTemperature.timestamp &&
          <div style={{ marginTop: "20px" }}>
            <p>Last updated:</p>
            <Moment fromNow interval={1000}>
              {this.props.currentTemperature.timestamp}
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
            <Line data={this.state.finalTemps} options={lineChartOptions} />
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

export default Temperature;
