# Aplicação *Unused Code Finder*

![Static Badge](https://img.shields.io/badge/status-finished-green) ![Static Badge](https://img.shields.io/badge/release-v2.0.8-blue)

Este projeto é uma aplicação desktop em **Node.js**, usando o framework **Electron.js**, desenvolvida para o setor de engenharia da empresa [Metaro Indústria e Comércio LTDA](https://www.metaro.com.br). Ela realiza uma varredura em um arquivo Excel e extrai códigos cujo os quais podem ou não apresentar revisões, tornando obsoleto as verções mais antigas.

## Pré-requisitos

Para executar a aplicação, certifique-se de que o seguinte esteja instalado:

- [Node.js](https://nodejs.org/en/download/current) (versão 12 ou superior)
- [Git](https://git-scm.com/download/win) (sistema de controle de versões)

## Instalação

1. Clone este repositório para o seu ambiente local:

    ```bash
    git clone git@github.com:dan1el074/unused-code-finder.git
    ```

2. Navegue até o diretório do projeto:

    ```bash
    cd unused-code-finder
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

## Configuração

1. Rode o seguinte comando no terminal:

    ```bash
    npm run build              
    ```

2. Na pasta `dist/unused-code-finder`, apague os seguintes arquivos:

    - `LICENSE`
    - `LICENSES.chromium.html`
    - `resources/app/example/`
    - `resources/app/installation/`
    - `resources/app/.gitignore`
    - `resources/app/readme.md`

3. Se quiser usar o aplicativo, basta iniciar `unused-code-finder.exe`. Mas se quiser criar um instaldor, siga os proximos passos: 

4. Instale o aplicativo [Install Forge](https://installforge.net/download/);

5. Com o aplicativo aberto, clique em *open*, e depois selecione o arquivo em `unused-code-finder/installation/install-forge.ifp`;

6. Configure as demais opções como desejar;

## Uso

- Inicie o instalador com nome de `unused-code-finder-win32-x64.exe`

- Ou se quiser iniciar o projeto em ambiente de desenvolvimento, execute o seguinte comando no console:

```bash
npm start
```
