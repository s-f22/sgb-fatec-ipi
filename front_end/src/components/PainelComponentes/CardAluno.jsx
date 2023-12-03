import React from "react";
import GraphAluno from "./GraphAlunos";


const CardAluno = () => {
    return (
        <div className="row pt-1 cardAluno">
            <div className="col textCardAluno pl-5">
                <p className="textCardAlunoValor">750</p>
                <p className="textCardAlunoNome">Alunos</p>
            </div>
            <div className="col imgCardAluno">
                {/* <i className="pi pi-user"></i> */}
                <GraphAluno />
            </div>
        </div>
    );
}

export default CardAluno;