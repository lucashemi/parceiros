import axios from "axios";
import Endereco from "../interfaces/Endereco";

const buscarCep = async (event: any): Promise<Endereco | undefined> => {
    let numero = event.target.value.replace(/\-/g, '');
    
    if (numero.toString().length < 8) {
        return undefined;
    }
    
    try {
        const response = await axios.get('https://viacep.com.br/ws/' + numero + '/json');
        const { logradouro = '', bairro = '', localidade: municipio = '', uf = '' } = response.data;
    
        const endereco = { logradouro, bairro, municipio, uf };
        
        return endereco
    } catch (error) {
        console.error(error);
    }
}

export default buscarCep;