import React from "react";
import { upcase } from "../src/libs/utils";
import txt from "./nail.txt";
import halo from "./assets/img/halo.svg";

const App = () => (
  <div className="app">
    <div className="logo" />
    <h1>${upcase(txt)}</h1>
    <div style={{ display: "none" }}>${halo}</div>
  </div>
);

export default App;
