import React, { useEffect } from 'react'
import dashboard from '../assets/img/dashboard.png'
import { useAuth0 } from '@auth0/auth0-react';

const Painel = () => {

  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    isAuthenticated &&
      console.log(user.sub.split('|')[1])
  }, [isAuthenticated]);

  return (
    <div className='Painel_Container'>
      <h1>Painel Geral</h1>
      <img style={{borderRadius: 30}} src={dashboard} alt="" />
    </div>
  )
}

export default Painel