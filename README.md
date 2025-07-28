# Assistente Virtual Automotivo (Web App para GitHub Pages)

Bem-vindo ao seu **Assistente Virtual Automotivo**! Este é um aplicativo web completo, com inteligência artificial integrada e capacidade de se conectar a scanners ELM327 via Bluetooth (simulado para demonstração, mas com a estrutura pronta para conexão real em navegadores compatíveis).

Este projeto foi otimizado para ser facilmente hospedado no **GitHub Pages**, uma forma gratuita e simples de colocar seu aplicativo online, sem precisar de conhecimentos em programação ou servidores complexos.

## ✨ Funcionalidades Principais

*   **Dashboard Inteligente:** Visualize o status do seu veículo em tempo real, próximas manutenções e consumo médio.
*   **Chat com IA:** Converse com o assistente em linguagem natural para obter diagnósticos, dicas de manutenção e informações sobre seu veículo.
*   **Scanner ELM327 (Simulado/Real):** Leia e limpe códigos de erro (DTCs), e visualize dados em tempo real do seu veículo (RPM, velocidade, temperatura).
*   **Gestão de Manutenção:** Acompanhe o cronograma de manutenções, adicione novos registros e receba lembretes.
*   **Relatórios Detalhados:** Analise o consumo de combustível e os custos do seu veículo ao longo do tempo.
*   **Design Moderno e Responsivo:** Interface bonita e adaptável a qualquer dispositivo (celular, tablet, computador).
*   **PWA (Progressive Web App):** Instale o aplicativo diretamente no seu celular ou computador, funcionando como um aplicativo nativo.

## 🚀 Como Colocar Seu Assistente Online (Passo a Passo para Leigos)

Este guia foi feito para você, que não tem conhecimento em programação. Siga cada passo com atenção e seu Assistente Virtual Automotivo estará online em poucos minutos!

### Pré-requisitos (O que você precisa ter):

1.  **Uma conta no GitHub:** Se você não tem, crie uma gratuitamente em [github.com](https://github.com/).
2.  **Um navegador de internet:** Google Chrome, Mozilla Firefox, Microsoft Edge, etc.
3.  **Os arquivos deste projeto:** Você deve ter recebido um arquivo ZIP com todo o código. Descompacte-o em uma pasta no seu computador.

### Passo 1: Criar um Novo Repositório no GitHub

Um repositório é como uma pasta especial no GitHub onde você vai guardar os arquivos do seu projeto.

1.  **Faça login no GitHub:** Acesse [github.com](https://github.com/) e faça login com sua conta.
2.  No canto superior direito da tela, clique no ícone `+` (sinal de mais) e selecione **`New repository`** (Novo repositório).
    
    ![Criar Novo Repositório](https://docs.github.com/assets/images/help/repository/create-new-repository-button.png)

3.  Na página de criação do repositório:
    *   **`Repository name` (Nome do repositório):** Digite um nome para o seu projeto, por exemplo, `assistente-automotivo`. **É importante que este nome seja simples e sem espaços.**
    *   **`Description` (Descrição):** (Opcional) Digite uma breve descrição, como `Meu Assistente Virtual Automotivo com IA`.
    *   **`Public` (Público):** Selecione esta opção. Seu projeto precisa ser público para que o GitHub Pages funcione gratuitamente.
    *   **`Add a README file` (Adicionar um arquivo README):** **NÃO** marque esta opção. Você já tem um arquivo `README.md` neste projeto que vamos usar.
    *   **`Add .gitignore`:** Deixe como `None`.
    *   **`Choose a license`:** Deixe como `None`.
    
    ![Configurar Repositório](https://docs.github.com/assets/images/help/repository/create-repository-page-overview.png)

4.  Clique no botão verde **`Create repository`** (Criar repositório).

### Passo 2: Fazer Upload dos Arquivos do Projeto

Agora você vai colocar os arquivos que eu te entreguei dentro do seu novo repositório no GitHub.

1.  Após criar o repositório, você verá uma página com algumas opções. Clique no link **`uploading an existing file`** (enviando um arquivo existente).
    
    ![Upload de Arquivo Existente](https://docs.github.com/assets/images/help/repository/upload-existing-file-link.png)

2.  Na próxima tela, você verá uma área para arrastar e soltar arquivos. **Abra a pasta onde você descompactou os arquivos deste projeto no seu computador.**

3.  **Selecione TODOS os arquivos e pastas** que estão dentro da pasta principal do projeto (por exemplo, `index.html`, `app.js`, `ai-engine.js`, `elm327-service.js`, `sw.js`, `manifest.json`, `README.md`).

4.  **Arraste e solte** todos esses arquivos e pastas para a área indicada no GitHub (onde diz `Drag files here to add them to your repository`).
    
    ![Arrastar e Soltar Arquivos](https://docs.github.com/assets/images/help/repository/drag-and-drop-files.png)

5.  Aguarde o upload de todos os arquivos. Isso pode levar alguns segundos ou minutos, dependendo da sua internet.

6.  Após o upload, role a página para baixo e clique no botão verde **`Commit changes`** (Confirmar alterações).

### Passo 3: Ativar o GitHub Pages

Esta é a etapa final para colocar seu Assistente Virtual Automotivo online!

1.  No seu repositório (a página principal do seu projeto no GitHub), clique na aba **`Settings`** (Configurações).
    
    ![Aba Settings](https://docs.github.com/assets/images/help/repository/settings-tab.png)

2.  No menu lateral esquerdo, clique em **`Pages`**.
    
    ![Menu Pages](https://docs.github.com/assets/images/help/pages/pages-menu-item.png)

3.  Na seção **`Build and deployment`** (Construção e implantação):
    *   Em **`Source` (Fonte)**, selecione a opção **`Deploy from a branch`** (Implantar de um branch).
    *   Em **`Branch` (Ramo)**, certifique-se de que esteja selecionado **`main`** (ou `master`, se for o caso) e a pasta **`/ (root)`**.
    
    ![Configurar GitHub Pages](https://docs.github.com/assets/images/help/pages/pages-build-and-deployment-source.png)

4.  Clique no botão **`Save`** (Salvar).

5.  Aguarde alguns instantes. O GitHub Pages levará um ou dois minutos para construir e publicar seu site. Você verá uma mensagem como `Your site is ready to be published at...` (Seu site está pronto para ser publicado em...).

6.  Após alguns minutos, atualize a página. O link do seu site aparecerá na mesma seção `Pages`, com a mensagem `Your site is published at https://<seu-usuario>.github.io/<nome-do-repositorio>/`.
    
    ![Site Publicado](https://docs.github.com/assets/images/help/pages/pages-published-site.png)

7.  **Clique no link** para acessar seu Assistente Virtual Automotivo online!

## 📱 Como Instalar como Aplicativo (PWA)

Seu Assistente Virtual Automotivo é um PWA (Progressive Web App), o que significa que você pode instalá-lo no seu celular ou computador e ele funcionará como um aplicativo nativo, mesmo offline!

### No Celular (Android):

1.  Abra o Google Chrome (ou outro navegador compatível) e acesse o link do seu Assistente (o link que você obteve no Passo 3 do GitHub Pages).
2.  No menu do navegador (geralmente os três pontinhos no canto superior direito), procure por **`Adicionar à tela inicial`** ou **`Instalar aplicativo`**.
3.  Confirme a instalação.

### No Celular (iPhone/iOS):

1.  Abra o Safari e acesse o link do seu Assistente.
2.  Na barra inferior, toque no ícone de **`Compartilhar`** (um quadrado com uma seta para cima).
3.  Role para baixo e toque em **`Adicionar à Tela de Início`**.
4.  Confirme a adição.

### No Computador (Google Chrome):

1.  Abra o Google Chrome e acesse o link do seu Assistente.
2.  Na barra de endereço, no canto direito, você verá um pequeno ícone de **`+`** (sinal de mais) ou um ícone de **`computador com uma seta para baixo`**.
3.  Clique neste ícone e siga as instruções para instalar o aplicativo.

--- 

**Desenvolvido por Manus AI**

Espero que você aproveite muito seu novo Assistente Virtual Automotivo! Se tiver qualquer dúvida, estou à disposição. 😊


