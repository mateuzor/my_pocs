# POC - Module Federation

Esta é uma Prova de Conceito (POC) utilizando **Module Federation** do Webpack 5 com **React** para demonstrar como dois aplicativos separados podem compartilhar código entre si em tempo de execução.

## Estrutura

- `host/` – aplicação principal que consome componentes remotos
- `remote/` – aplicação remota que expõe componentes

## Como rodar

1. Clone este repositório:
   ```bash
   git clone <url>
   cd poc-module-federation
   ```

2. Instale as dependências de ambas as aplicações:

   ```bash
   cd remote
   npm install
   npm start
   ```

   Em outro terminal:

   ```bash
   cd host
   npm install
   npm start
   ```

3. Acesse [http://localhost:3000](http://localhost:3000) para ver o App Host consumindo o botão do App Remoto.

## Tecnologias

- React
- Webpack 5
- Module Federation
