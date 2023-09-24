import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/saga-blue/theme.css";
import 'react-toastify/dist/ReactToastify.css';

import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Welcome from './Welcome.js';
import ErrorPage from '../src/pages/ErrorPage';
import App from '../src/pages/App';
import Painel from '../src/components/Painel';
import SignUpInfo from './pages/SignUpInfo';
import VerifyEmailAluno from './pages/VerifyEmailAluno';
import Trabalhos from '../src/components/Trabalhos'
import VerifyEmailProfessor from './pages/VerifyEmailProfessor';
import CustomToastContainer from '../src/components/ToastContainer';
import Trabalhos_Listar from './components/Trabalhos_Listar';

// require('dotenv').config({ path: '../../.env' });


const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const AppRoutes = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Welcome />,
      errorElement: <ErrorPage />
    },
    {
      path: '/SignUpInfo',
      element: <SignUpInfo />,
    },
    {
      path: '/VerifyEmailAluno/:id_aluno/:codigo',
      element: <VerifyEmailAluno />,
    },
    {
      path: '/VerifyEmailProfessor/:id_professor/:codigo',
      element: <VerifyEmailProfessor />,
    },
    {
      path: '/sgb',
      element: <App />,
      children: [
        {
          path: '/sgb',
          element: <Painel />
        },
        {
          path: '/sgb/trabalhos',
          element: <Trabalhos />
        },
        {
          path: '/sgb/trabalhos_listagem',
          element: <Trabalhos_Listar />
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