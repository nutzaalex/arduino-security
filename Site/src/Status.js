import React, { Component } from "react";
import Paper from "material-ui/Paper";
import PropTypes from "prop-types";
import Moment from "react-moment";

class Status extends Component {
  static PropTypes = {
    status: PropTypes.bool
  };
  static defaultProps = {
    status: false
  };

  render() {
    const styleContainer = {
      backgroundColor: "#F5F5F5",
      padding: "2%",
      margin: "5%",
      flex: "1",
      borderRadius: "200px",
      textAlign: "center",
      color: "#b88f51",
      position: "relative"
    };
    const styleIndicatorFalse = {
      backgroundColor: "red",
      padding: "15%",
      margin: "20% 30%",
      flex: "1",
      flexDirection: "row",
      borderRadius: "200px",
      textAlign: "center"
    };
    const styleIndicatorTrue = {
      backgroundColor: "green",
      padding: "15%",
      margin: "20% 30%",
      flex: "1",
      flexDirection: "row",
      borderRadius: "200px",
      textAlign: "center"
    };
    return (
      <Paper style={styleContainer} zDepth={3}>
        <p style={{ fontSize: "18px" }}>Arduino Status</p>
        <hr />
        {this.props.status
          ? <Paper style={styleIndicatorTrue} zDepth={4} circle={true} />
          : <Paper style={styleIndicatorFalse} zDepth={4} circle={true} />}
        {this.props.status
          ? <p style={{ color: "green" }}> Online </p>
          : <p style={{ color: "red" }}> Offline </p>}
        {this.props.lastOnline &&
          <div style={{ marginTop: "30px" }}>
            <p>Last heartbeat:</p>
            <Moment fromNow interval={1000}>
              {this.props.lastOnline}
            </Moment>
          </div>}
      </Paper>
    );
  }
}

export default Status;
