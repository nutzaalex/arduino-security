import React, { Component } from "react";
import "./Thermometer.css";

class Thermometer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      intervals: []
    };
    for (let step = 0; step <= this.props.steps; step++) {
      let val = (this.props.max / this.props.steps * step).toFixed(0);
      let percent = val / this.props.max * 100;
      let interval = {
        percent: percent,
        label: val + this.props.format
      };
      this.state.intervals.push(interval);
    }
    this.valstr = this.valstr.bind(this);
    this.percent = this.percent.bind(this);
  }
  valstr() {
    if (this.props.value && this.props.format) {
      return this.props.value.toFixed(2) + this.props.format;
    } else {
      return 0.0;
    }
  }
  percent() {
    if (this.props.value && this.props.max) {
      return this.props.value / this.props.max * 100;
    } else {
      return 0;
    }
  }

  render() {
    const theme = `thermometer--theme-${this.props.theme}`;
    const size = `thermometer--${this.props.size}`;
    const height = { height: `${this.props.height}px` };
    const heightPercent = { height: `${this.percent()}%` };
    const heightBgColor = { height: `calc(${this.props.height}px - 57px)` };
    const valstr = this.valstr();
    const stepIntervals = this.state.intervals.map((step, i) => {
      return (
        <li key={i} style={{ bottom: `calc(${step.percent}% - 1px)` }}>
          {step.label}
        </li>
      );
    });

    return (
      <div style={height} className={`thermometer ${size} ${theme}`}>
        <div className="thermometer__draw-a" />
        <div className="thermometer__draw-b" />
        <div className="thermometer__meter">
          <ul className="thermometer__statistics">
            {stepIntervals}
          </ul>
          <div style={heightPercent} className="thermometer__mercury">
            <div className="thermometer__percent-current">
              {valstr}
            </div>
            <div className="thermometer__mask">
              <div className="thermometer__bg-color" style={heightBgColor} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Thermometer;
