import React from "react";
import { createRoot } from "react-dom/client"; // React 18 new way of rendering
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // BrowserRouter should be here
import App from "./App";
import store from "./redux/store";

//CSS
import "./index.css"; // Default global styles like resets, etc.
import "./styles/global/Variables.css"; // Import your variables for consistency
import "@fortawesome/fontawesome-free/css/all.min.css";

const container = document.getElementById("root");
const root = createRoot(container); // New API for React 18

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
