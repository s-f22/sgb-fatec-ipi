import React from "react";
import { InputText } from 'primereact/inputtext';
import { Image } from "primereact/image";
import { Button } from 'primereact/button';
import SInButton from "./SInButton";
// import { useNavigate } from "react-router-dom";

const Login = () => {
    // const navigate = useNavigate();

    const toHome = () => {
        // navigate("/home");
    }

    return (
        <div className="w-full pt-5 grid justify-content-center" style={styles.container}>
            <div className="flex flex-wrap justify-content-center align-items-center gap-2 col-12">
                <Image src="https://i.ibb.co/Y3mM4wk/fatec-logo.png" alt="logo" width={200} />
            </div>
            <div className="flex flex-column md:flex-row w-100 sm:col-6 md:col-6 lg:col-6 xl:col-6">
                <div className="w-full flex flex-column gap-3 pb-3">

                    <div className="flex flex-wrap justify-content-start ml-8 gap-2">
                        <label htmlFor="email" className="-mb-2 " style={styles.label}>Login</label>
                    </div>

                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <InputText id="email" type="email" className="w-full mx-8" style={styles.input} placeholder="exemplo@gmail.com" />
                    </div>

                    <div className="flex flex-wrap justify-content-start ml-8 gap-2">
                        <label htmlFor="password" className="-mb-2" style={styles.label}>Senha</label>
                    </div>

                    <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                        <InputText id="password" type="password" className="w-full mx-8 mb-2" style={styles.input} placeholder="Digite sua senha" />
                    </div>
                    <div className="w-full flex flex-column gap-3 pt-2">
                        <Button label="Acessar" severity="warning" icon="pi pi-user" className="w-100 font-bold mx-8" onClick={toHome} />
                    </div>
                    <div className="w-full flex flex-column gap-3 pt-2">
                        <SInButton />
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: "#EAEAEA",
        margin: "0",
        padding: "0",
    },
    input: {
        background: "linear-gradient( #E6E6E6, #FFFFFF)",
    },
    label: {
        color: "#345059",
    },
}

export default Login;