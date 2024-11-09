import axios, { AxiosResponse } from "axios";

const driveUpload = async (arquivo: File, cliente: string): Promise<AxiosResponse<any>> => {
    const urlDrive = "https://script.google.com/macros/s/AKfycbw6F6ZxRr0JBz6nbUYlEz5PDEHnWOhXEAAkokGA3wnf7L1H5pqJgcS14l3uSLejpsao/exec";

    // Função que retorna uma promessa para a leitura do arquivo
    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Erro ao ler o arquivo'));
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    try {
        // Aguarda a leitura do arquivo
        const base64 = await readFileAsDataURL(arquivo);
        const nomeArquivo = arquivo.name;

        const file = {
            cliente: cliente,
            nome: nomeArquivo,
            base64: base64
        };

        // Envia a requisição POST
        const response = await axios.post(urlDrive, JSON.stringify(file), {
            headers: {
                "Content-type": "text/plain; charset=UTF-8"
            }
        });

        return response;
    } catch (error) {
        console.error('Erro ao fazer upload para o Drive:', error);
        throw error;
    }
};

export default driveUpload;