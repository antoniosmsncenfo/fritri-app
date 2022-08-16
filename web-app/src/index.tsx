/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { Auth0Provider } from "@auth0/auth0-react";

// Material Dashboard 2 PRO React TS Context Provider
import { MaterialUIControllerProvider } from "context";

ReactDOM.render(
  <Auth0Provider
    domain="fritri.us.auth0.com"
    clientId="FJlfJ6P91fWYYYJ0iwv6oS8Qzum8lx7a"
    redirectUri="http://localhost:3000/dashboards/analytics"
  >
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </Auth0Provider>,
  document.getElementById("root")
);
