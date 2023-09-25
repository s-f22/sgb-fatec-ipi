import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Você não está logado.</div>;
  }

  const firstName = user.name.split(' ')[0];

  return (
    isAuthenticated && (
      <div style={{ textAlign: 'right', marginRight: '10px', color: '#555', display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '10px' }}>
          <h4 style={{ margin: '0', fontSize: '1em' }}>{firstName.split('@')[0]}</h4>
          <p style={{ margin: '0', fontSize: '0.8em' }}>{user.email}</p>
        </div>
        <img src={user.picture} alt={user?.name} style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
      </div>
    )
  );
};

export default Profile;
