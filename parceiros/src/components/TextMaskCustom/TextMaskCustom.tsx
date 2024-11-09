import React from 'react';
import { IMaskInput } from 'react-imask';
import tipoDoPix from '../../utils/pixUtils';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, name, ...other }: any = props;

        // Função para determinar a máscara com base no número de caracteres getMask(this.value)
        const getMask = (name: string, value: string) => {
            if (name == 'documento') {
                return value && value.length > 14 ? "00.000.000/0000-00" : "000.000.000-00900";
            } else if (name == 'tel1' || name == 'tel2') {
                return value && value.length > 14 ? "(00) 00000-0000" : "(00) 0000-00000";
            } else if (name == 'endereco.cep') {
                return "00000-000";
            } else if (name == 'pix') {
                // Verifica o tipo do pix e retorna a mascara correspondente
                return tipoDoPix(value, true);
            } else if (name == 'agencia') {
                // Max 4 digitos
                return "####";
            } else if (name == 'conta') {
                // Max 14 digitos
                return "##############"
            } else {
                return null;
            }
        };

        return (
            <IMaskInput
                {...other}
                mask={getMask(name, other.value)}
                definitions={{
                    '#': /[0-9]/,
                    '@': /[a-zA-Z\d@.]+/,
                    '*': /./gs

                }}
                inputRef={ref}
                onAccept={(value: any) => onChange({ target: { name, value } })}
                overwrite
            />
        );
    },
);

export default TextMaskCustom;