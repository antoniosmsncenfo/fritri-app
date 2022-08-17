import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import MDButton from "components/MDButton";

function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return <MDButton onClick={() => loginWithRedirect()}>Log In</MDButton>;
}

export default LoginButton;
