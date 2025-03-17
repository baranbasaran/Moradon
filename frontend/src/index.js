import React from "react";
import ReactDOM from "react-dom/client"; // React 18 new way of rendering
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // BrowserRouter should be here
import store from "./redux/store";
import App from "./App";

//CSS
import "./index.css"; // Default global styles like resets, etc.
import "./styles/global/Variables.css"; // Import your variables for consistency
import "@fortawesome/fontawesome-free/css/all.min.css";

const root = ReactDOM.createRoot(document.getElementById("root")); // New API for React 18
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ 
        v7_startTransition: true,
        v7_relativeSplatPath: true 
      }}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
