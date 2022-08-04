import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import { useAuth0 } from "@auth0/auth0-react";

import { LoginButton } from "./Auth0-Login/Login";
import { LogoutButton } from "./Auth0-Login/Logout";
import { Profile } from "./Auth0-Login/Profile";
import logo from "./logo.svg";
import "./App.css";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))



function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App">
      <div className="App-header1">
        <img src={logo} className="App-logo" alt="logo" />
        {isAuthenticated ? (
          <>
                  <Profile />

        <LogoutButton />
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
         
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>


            
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
}

class Apps extends Component {
  render() {
    return (
      App()
    )
  }
}

export default App
