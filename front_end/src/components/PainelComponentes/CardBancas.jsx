import React from "react";
import GraphBancas from "./GraphBancas";

const CardBancas = () => {
    return (
        <div className="row pt-1 cardBanca">
            <div className="col textCardBanca pl-5">
                <p className="textCardBancaValor">12</p>
                <p className="textCardBancaNome">Bancas</p>
            </div>
            <div className="col imgCardBanca">
                <i className="pi pi-calendar"></i>
                {/* <GraphBancas /> */}
            </div>
        </div>
    );
}

export default CardBancas;