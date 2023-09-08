import React from 'react'
import dashboard from '../assets/img/dashboard.png'

const Painel = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', }}>
      <img style={{width: 580, height: '100%' }} src={dashboard} alt="" />
    </div>
  )
}

export default Painel