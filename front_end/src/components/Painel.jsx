import React, { useEffect, useState } from "react";
import dashboard from "../Assets/img/dashboard.png";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { Typography, Grid, Paper, Container } from "@mui/material";

const Painel = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [professor, setProfessor] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const data = {
    numProfessores: 35,
    numAlunos: 750,
    numTemasCadastrados: 120,
    numTemasDisponiveis: 80,
    numTrabalhosAndamento: 25,
    numTrabalhosConcluidos: 50,
    numBancasAgendadas: 10,
    notaMediaTrabalhos: 8.2,
    periodoTrabalhos: "2023",
    trabalhosPorSemestre: "15, 20, 30, 10"
  };

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        console.log(user.sub.split("|")[1]);
        buscarProfessor(userIdHandler(user.sub.split("|")[1]));
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  const buscarProfessor = async (idDoProfessor) => {
    try {
      const response = await axios.get(
        `http://localhost:4001/professores/${idDoProfessor}`
      );
      const resultado = response.data;
      setProfessor(resultado);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar o professor:", error);
    }
  };

  const userIdHandler = (valor) => {
    return valor;
  };

  return (
    <div className="Painel_Container">
      {loading ? (
        <div
          style={{
            display: "flex",
            flex: 1,
            height: "100vh",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ alignSelf: "center" }}>Carregando...</p>
          <Spinner
            style={{ alignSelf: "center", marginBottom: "50px" }}
            animation="grow"
          />
        </div>
      ) : professor.email_inst_verif === true ? (
        <>
          <Container maxWidth>
            <Typography variant="h4" gutterBottom>
              Painel de Controle
            </Typography>
            <Grid container spacing={3}>
              {Object.keys(data).map((key) => (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <Paper
                    style={{
                      padding: "16px",
                      textAlign: "center",
                      color: "text.primary",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography variant="h6">{key}</Typography>
                    <Typography variant="h4">{data[key]}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      ) : (
        <div>
          <h2 style={{ width: "50%" }}>Bem vindo ao SGB-Fatec-Ipiranga!</h2>
          <h3 style={{ width: "50%", marginTop: "30px" }}>
            Para ter acesso completo às funcionalidades do sistema, por favor,{" "}
            <b>verifique seu e-mail</b> e clique no link de ativação.
          </h3>
          <h4 style={{ marginTop: "30px" }}>
            Caso não tenha recebido o link, entre em contato com o suporte:
          </h4>
          <a href="">algumEmailDeSuporte@fatec.sp.gov.br</a>
        </div>
      )}
    </div>
  );
};

export default Painel;
