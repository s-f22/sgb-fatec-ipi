import React from 'react'
import { Image } from 'primereact/image';
import  Profile  from './Profile.js';
import SOutButton  from './SOutButton.js';


const  Home = () => {
    return (
        <div>
            <div className='flex col-12'>
                <div className='col-2'>
                    <Image src="https://i.ibb.co/Dk6903H/fatec-logo-2.png" alt="Logo Fatec" width={130} />
                </div>

                <div  className='mt-2 col-8 flex align-items-center justify-content-center'>
                    <p>
                        Bem vindo ao sistema de gerenciamento de Bancas da Fatec Ipiranga!  
                    </p>
                </div>
                <div className='col-2 -mt-3 flex flex-column align-items-end justify-content-end'>
                    <div  className='mt-5'>
                        <Profile />
                    </div>
                    <div className='-mt-2 pr-3'>
                        <SOutButton />
                    </div>
                </div>
            </div>
            <div>
            <hr className='-mt-2 w-100'/>
            </div>
        </div>
    )
}


export default Home