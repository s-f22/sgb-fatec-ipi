import React from 'react'
import Profile from './Profile'
import LogOut from './LogOut'

const Header = () => {
  return (
    <div>
      <div className='flex col-12'>
        <div className='col-2'>
          <img style={{ display: 'flex', width: 130, marginTop: 20, marginLeft: 'auto', marginRight: 'auto', borderRadius: 5 }} src={"https://i.ibb.co/Y3mM4wk/fatec-logo.png"} alt="Logo Fatec" />
        </div>

        <p className='mt-2 col-8 flex align-items-center justify-content-center'>
          Bem vindo ao sistema de gerenciamento de Bancas da Fatec Ipiranga!
        </p>

        <div className='col-2 -mt-3 flex flex-column align-items-end justify-content-end'>
          <Profile />
          <LogOut />
        </div>
      </div>
      <div>
        <hr className='-mt-2 w-100' />
      </div>
    </div>
  )
}

export default Header