import React from "react";
import ReactDOM from "react-dom";
import LocationCheck from "./Components/LocationCheck";
import "./index.css";

const rootEl = document.getElementById("root");

const render = () => {
  ReactDOM.render(<LocationCheck />, rootEl);
};
render();
