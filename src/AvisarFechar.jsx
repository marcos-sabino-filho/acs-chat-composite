import React from 'react';

export const AvisarFechar = () => {

    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        e.returnValue = '';
    });

    return (
        <h1>Alerta antes de fechar</h1>
    );
};
