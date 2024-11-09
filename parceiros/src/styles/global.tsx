import { Global, css } from "@emotion/react";

const GlobalStyles = () => {
  return (
    <Global
      styles={css`
        :root {
          font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
          line-height: 1.5;
          font-weight: 400;
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          margin: 0;
        }
        
        *::-webkit-scrollbar {
          width: 12px;
          height: 5px;
        }
        
        *::-webkit-scrollbar-track {
          background-color: #f1f1f1;
        }
        
        *::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 10px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background-color: #555;
        }

        input[type=number]::-webkit-inner-spin-button { 
          -webkit-appearance: none;
          
        }
        
        input[type=number] { 
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}
    />
  );
};

export default GlobalStyles;
