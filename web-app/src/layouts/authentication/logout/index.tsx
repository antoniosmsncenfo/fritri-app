import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

function Logout(): JSX.Element {
  const { logout } = useAuth0();
  useEffect(() => {
    logout();
  }, []);

  return <div />;
}
export default Logout;
