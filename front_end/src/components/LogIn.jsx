import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'react-bootstrap';

const LogIn = () => {

  const { loginWithRedirect } = useAuth0();

  return (
    <Button 
    className='btnLogin'  
    style={{ width: 110, height: 31, fontSize: 12, fontWeight: 'bold', color: 'black', border: 'none'}}
    onClick={() => loginWithRedirect()}>Login</Button>
  )
}

export default LogIn