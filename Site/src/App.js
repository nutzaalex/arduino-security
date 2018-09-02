import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";

import Dashboard from "./Dashboard";

const muiTheme = getMuiTheme({
  fontFamily:
    "HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Lucida Grande, sans-serif"
});

class App extends Component {
  render() {
    return (
      <div>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Dashboard />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
