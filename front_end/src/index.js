import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/saga-blue/theme.css";
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Welcome from './Welcome.js';
import ErrorPage from '../src/pages/ErrorPage';
import App from '../src/pages/App';
import Painel from '../src/components/Painel';
import SignUpInfo from './pages/SignUpInfo';
import VerifyEmailAluno from './pages/VerifyEmailAluno';
import VerifyEmailProfessor from './pages/VerifyEmailProfessor';
import CustomToastContainer from '../src/components/ToastContainer';
import TemasCadastrar from './components/Temas/TemasCadastrar'
import TemasListar from './components/Temas/TemasListar';
import TrabalhoCadastrar from './components/Trabalhos/TrabalhoCadastrar';
import TrabalhoListar from './components/Trabalhos/TrabalhoListar';
import BancasCadastrar from './components/Bancas/BancasCadastrar';
import BancasListar from './components/Bancas/BancasListar';
import TrabalhoEditar from './components/Trabalhos/TrabalhoEditar';
import TemasEditar from './components/Temas/TemasEditar';

// require('dotenv').config({ path: '../../.env' });


const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const AppRoutes = () => {

  const router = createBrowserRouter([
    {
      path: '/sgb-fatec-ipi/',
      element: <Welcome />,
      errorElement: <ErrorPage />
    },
    {
      path: '/sgb-fatec-ipi/SignUpInfo',
      element: <SignUpInfo />,
    },
    {
      path: '/sgb-fatec-ipi/VerifyEmailAluno/:id_aluno/:codigo',
      element: <VerifyEmailAluno />,
    },
    {
      path: '/sgb-fatec-ipi/VerifyEmailProfessor/:id_professor/:codigo',
      element: <VerifyEmailProfessor />,
    },
    {
      path: '/sgb-fatec-ipi/sgb',
      element: <App />,
      children: [
        {
          path: '/sgb-fatec-ipi/sgb',
          element: <Painel />
        },
        {
          path: '/sgb-fatec-ipi/sgb/temas_cadastrar',
          element: <TemasCadastrar />
        },
        {
          path: '/sgb-fatec-ipi/sgb/temas_listar',
          element: <TemasListar />
        },
        {
          path: '/sgb-fatec-ipi/sgb/trabalhos_cadastrar',
          element: <TrabalhoCadastrar />
        },
        {
          path: '/sgb-fatec-ipi/sgb/trabalhos_listar',
          element: <TrabalhoListar />
        },
        {
          path: '/sgb-fatec-ipi/sgb/trabalho_editar/:id_trabalho',
          element: <TrabalhoEditar />
        },
        {
<<<<<<< HEAD
          path: '/sgb-fatec-ipi/sgb/bancas_cadastrar',
=======
          path: '/sgb/temas_editar/:id',
          element: <TemasEditar />
        },
        {
          path: '/sgb/bancas_cadastrar',
>>>>>>> 8de93d47edd2def9f3422fbd08d90baeb3b74170
          element: <BancasCadastrar />
        },
        {
          path: '/sgb-fatec-ipi/sgb/bancas_listar',
          element: <BancasListar />
        }
      ]
    }
  ]);

  return router;
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: 'http://localhost:3000/sgb'
    }}
  >
    <RouterProvider router={AppRoutes()} /> {/* Chame AppRoutes como uma função */}
    <CustomToastContainer />
  </Auth0Provider>,
);

export default AppRoutes;