import React from 'react'
import dashboard from '../assets/img/dashboard.png'

const Painel = () => {
  return (
    <div className='Painel_Container'>
      <h1>Painel Geral</h1>
      <img style={{borderRadius: 30}} src={dashboard} alt="" />
    </div>
  )
}

export default Painel