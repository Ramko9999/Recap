import React from "react";
import Profile from "./ui/profile/Profile";
import Onboarding from "./ui/auth/Onboarding";
import history from "./util/History";
import {Router, Route, Switch} from "react-router-dom";

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Onboarding}/>
        <Route path="/user/" component={Profile}/>
      </Switch>
    </Router>
  );
}

export default App;