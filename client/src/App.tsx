import React from "react";
import history from "./util/History";
import Core from "./ui/core/Core";
import Auth from "./ui/auth/Auth";
import {Router, Route, Switch} from "react-router-dom";
import "antd/dist/antd.css";
import { ModalState } from "./ui/context/ModalContext";

function App() {
  return (
    <Router history={history}>
        <Switch>
          <Route exact path="/" component={Auth}></Route>
          <ModalState>
              <Route path="/core" component={Core}></Route>
          </ModalState>
        </Switch>
    </Router>
  );
}

export default App;