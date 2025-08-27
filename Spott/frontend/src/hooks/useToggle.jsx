import { useState } from 'react';

export default function useToggle(valorInicial = false) {
    const [valor, setValor] = useState(valorInicial);

    const toggle = () => setValor(!valor)

    return [valor, toggle];
}