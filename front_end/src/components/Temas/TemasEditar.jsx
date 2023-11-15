import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from 'react-router-dom';

const EditarTema = () => {
    const { id } = useParams();
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [id_autor, setId_autor] = useState(12)
    const navigate = useNavigate();
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    const fetchData = async () => {
        console.log("id da rota => " + id);
        try {
            const response = await axios.get(`http://localhost:4004/temas/${id}`);
            const tema = response.data;

            setTitulo(tema.titulo);
            setDescricao(tema.descricao);

        } catch (error) {
            console.error('Erro ao carregar os dados do tema:', error);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            loginWithRedirect()
        }

        fetchData();


    }, [id, isAuthenticated, loginWithRedirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ titulo, descricao });


        try {
            const response = await axios.put(`http://localhost:4004/temas/${id}`, {
                id_autor,
                titulo,
                descricao
            })

            toast.success('Tema cadastrado com sucesso!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })

            console.log("Dados enviados com sucesso:", response.data)

            navigate('/sgb')

        } catch (error) {

            toast.error('Erro ao cadastrar o tema. Tente novamente mais tarde.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            console.error('Erro ao enviar os dados:', error)

        }

    };

    return (
        <Form className='Temas_Container mb-8 pr-3' onSubmit={handleSubmit}>
            <Form.Group controlId="formTitulo">
                <h6 className="titulo-cad-tem">Editar Tema</h6>
                <Form.Label style={{ marginTop: '18px' }}>Título</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Digite o título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="formDescricao" style={{ marginTop: '18px' }}>
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Digite a descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />
            </Form.Group>
            <Button style={{ marginTop: 10, width: '100%', height: 45, marginTop: 26, backgroundColor: '#345059' }} type="submit" >
                Atualizar
            </Button>
        </Form>
    );
};

export default EditarTema;