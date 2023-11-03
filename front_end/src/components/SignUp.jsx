import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'react-bootstrap';

const SignUp = () => {

  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <Button className='btnCadastro' 
      style={{ width: 110, height: 31, fontSize: 12, fontWeight: 'bold', color: 'white', border: 'none'}}
      onClick={() => loginWithRedirect({
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