import { useAuth0 } from '@auth0/auth0-react';
import React from 'react'
import { Button } from 'react-bootstrap';

const LogOut = () => {
  const { logout, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <Button onClick={() => logout()}>
        sign out
      </Button>
    )
  )
}

export default LogOut