import React from "react";
import history from "./util/History";
import Auth from "./ui/auth/Auth";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import "antd/dist/antd.css";
import Protected from "./util/Protected";
import { ModalState } from "./ui/context/ModalContext";
import { UserState } from "./ui/context/UserContext";
import Core from "./ui/core/Core";

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route exact path="/login" component={Auth}></Route>
          <Protected path="/">
            <UserState>
              <ModalState>
                <Route path="/home" component={Core} />
              </ModalState>
            </UserState>
          </Protected>
        </Switch>
      </Router>
    </div>
  );
}

export default App;