import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { Button } from 'react-bootstrap';

const LogOut = () => {
  const { logout, isAuthenticated } = useAuth0();
  
  return (
    isAuthenticated && (
      <div style={{ textAlign: 'right', marginRight: '10px', marginTop: '10px' }}>
        <Button variant='outline-danger' onClick={() => logout()} size="sm">
          Sair
        </Button>
      </div>
    )
  )
}

export default LogOut;
