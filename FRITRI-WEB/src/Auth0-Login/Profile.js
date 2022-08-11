import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const myStyle={
    width:'255px',
    };
    const log1={
      width:'70px',
      
      };
  
  return (
    isAuthenticated && (
      <div  style={myStyle} >
        <img style={log1} src={user.picture} alt={user.name} />
        <h4> {user.name}</h4>
        {/* <p>Email: {user.email}</p> */}
      </div>
    )
  );
};
