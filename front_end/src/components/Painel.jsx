import React, { useEffect, useState } from "react";
import dashboard from "../assets/img/dashboard.png";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const Painel = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [professor, setProfessor] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      buscarProfessor(userIdHandler(user.sub.split("|")[1]));
    } else {
      console.log("Não há usuário logado");
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   console.log("professor: ", professor);
  // }, [professor]);

  const buscarProfessor = async (idDoProfessor) => {
    try {
      const response = await axios.get(
        `http://localhost:4001/professores/${idDoProfessor}`
      );
      const resultado = response.data;
      setProfessor(resultado);
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao buscar o professor:", error);
    }
  };

  const userIdHandler = (valor) => {
    const userID = valor;
    return userID;
  };

  return (
    <div className="Painel_Container">
      {professor.email_inst_verif === true ? (
        <>
          <h1>Painel Geral</h1>
          <img style={{ borderRadius: 30 }} src={dashboard} alt="" />
        </>
      ) : (
        <div>
          <h2 style={{width: '50%'}}>Bem vindo ao SGB-Fatec-Ipiranga!</h2>
          <h3 style={{width: '50%', marginTop: '30px'}}>Para ter acesso completo as funcionalidades do sistema, por favor, <b>verifique seu e-mail</b> e clique no link de ativação.</h3>
          <h4 style={{marginTop: '30px'}}>Caso não tenha recebido o link, entre em contato com o suporte:</h4>
          <a href="">algumEmailDeSuporte@fatec.sp.gov.br</a>
        </div>
      )}
    </div>
  );
};

export default Painel;
