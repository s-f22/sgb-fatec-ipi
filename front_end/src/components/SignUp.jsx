import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'react-bootstrap';

const SignUp = () => {

  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <Button variant='info' onClick={() => loginWithRedirect({
        authorizationParams: {
          screen_hint: "signup",
          redirect_uri: 'http://localhost:3000/SignUpInfo'
        }
      })}>
        Cadastre-se!
      </Button>
    )
  );
}

export default SignUp