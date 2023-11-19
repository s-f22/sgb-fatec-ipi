import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Alteração aqui
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Auth0Provider } from "@auth0/auth0-react";

import Welcome from "./Welcome.js";
import ErrorPage from "../src/pages/ErrorPage";
import App from "../src/pages/App";
import Painel from "../src/components/Painel";
import SignUpInfo from "./pages/SignUpInfo";
import VerifyEmailAluno from "./pages/VerifyEmailAluno";
import VerifyEmailProfessor from "./pages/VerifyEmailProfessor";
import CustomToastContainer from "../src/components/ToastContainer";
import TemasCadastrar from "./components/Temas/TemasCadastrar";
import TemasListar from "./components/Temas/TemasListar";
import TrabalhoCadastrar from "./components/Trabalhos/TrabalhoCadastrar";
import TrabalhoListar from "./components/Trabalhos/TrabalhoListar";
import BancasCadastrar from "./components/Bancas/BancasCadastrar";
import BancasListar from "./components/Bancas/BancasListar";
import TrabalhoEditar from "./components/Trabalhos/TrabalhoEditar";
import TemasEditar from "./components/Temas/TemasEditar";

// require('dotenv').config({ path: '../../.env' });

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/SignUpInfo" element={<SignUpInfo />} />
    <Route path="/VerifyEmailAluno/:id_aluno/:codigo" element={<VerifyEmailAluno />} />
    <Route path="/VerifyEmailProfessor/:id_professor/:codigo" element={<VerifyEmailProfessor />} />
    <Route path="/sgb" element={<App />}>
      <Route path="/sgb" element={<Painel />} />
      <Route path="/sgb/temas_cadastrar" element={<TemasCadastrar />} />
      <Route path="/sgb/temas_listar" element={<TemasListar />} />
      <Route path="/sgb/trabalhos_cadastrar" element={<TrabalhoCadastrar />} />
      <Route path="/sgb/trabalhos_listar" element={<TrabalhoListar />} />
      <Route path="/sgb/trabalho_editar/:id_trabalho"
        element={<TrabalhoEditar />}
      />
      <Route path="/sgb/bancas_cadastrar" element={<BancasCadastrar />} />
      <Route path="/sgb/bancas_listar" element={<BancasListar />} />
    </Route>
  </Routes>
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      // redirect_uri: "http://localhost:3000/sgb#/sgb",
      redirect_uri: "https://s-f22.github.io/sgb-fatec-ipi/#/sgb"
    }}
  >
    <Router>
      <AppRoutes />
      <CustomToastContainer />
    </Router>
  </Auth0Provider>
);

export default AppRoutes;
