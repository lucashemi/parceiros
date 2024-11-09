import * as React from 'react';
import AlertType from '../enums/AlertType';
import SnackbarAlert from '../components/SnackbarAlert/SnackbarAlert';

// Interface do snackbar
interface Snackbar {
    id: number;
    mensagem: string;
    tipo: AlertType;
  }

// Definir tipos para os estados
interface SnackbarContextProps {
    abrirSnackbar: (tipo: AlertType, mensagem: string) => void;
    removerSnackbar: (id: number) => void;
}

// Criar o contexto
const snackbarContext = React.createContext<SnackbarContextProps | undefined>(undefined);

// Criar um hook personalizado para utilizar o contexto
export const useSnackbarContext = () => {
    const context = React.useContext(snackbarContext);
    if (context === undefined) {
        throw new Error('useSnackbarContext deve ser usado dentro de um snackbarContextProvider');
    }
    return context;
};

// Criar o provedor do contexto
export const SnackbarContextProvider = ({ children }: any) => {
    const [snackbars, setSnackbars] = React.useState<Snackbar[]>([]);

    const abrirSnackbar = (tipo: AlertType, mensagem: string) => {
        setSnackbars((prevSnackbars) => ([
            ...prevSnackbars,
            { mensagem, tipo, id: Date.now() }
        ] as Snackbar[]));
    };

    const removerSnackbar = (id: number) => {
        setSnackbars(snackbars.filter((snackbar: Snackbar) => snackbar.id !== id));
    };

    return (
        <snackbarContext.Provider
            value={{
                abrirSnackbar,
                removerSnackbar
            }}
        >
            {children}
            <div>
                {snackbars.map((snackbar, index) => (
                    <SnackbarAlert 
                        key={snackbar.id}
                        id={snackbar.id}
                        tipo={snackbar.tipo}
                        mensagem={snackbar.mensagem}
                        index={index}
                    />
                ))}
            </div>
        </snackbarContext.Provider>
    );
};
