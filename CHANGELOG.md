# Changelog

Todas as alterações notáveis a este projeto serão documentadas neste ficheiro.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Não Lançado]

### Adicionado
- **Limpeza Automática de Ficheiros:** Foi implementada uma tarefa de fundo no servidor que apaga automaticamente ficheiros de telemetria temporários com mais de 30 minutos. Isto previne que o disco do servidor encha. (`main.py`, `requirements.txt`)
- **Notificação no Frontend:** Adicionada uma nota na página de upload de telemetria para informar os utilizadores que os seus ficheiros são guardados temporariamente por 30 minutos. (`Telemetry.jsx`)
- **Script de Desenvolvimento:** Adicionado o `concurrently` e um script `dev:all` para correr o servidor de frontend e de backend com um único comando, facilitando o desenvolvimento local. (`package.json`)

### Alterado
- **Gestão de URLs da API:** O frontend agora usa dinamicamente `localhost` para desenvolvimento e a URL de produção para o site publicado, tornando os testes locais mais fiáveis. (`services/backend.js`)

### Corrigido
- **Arranque do Backend:** Corrigidas as terminações de linha no `main.py` para prevenir erros de execução em servidores Linux como o do Render.
- **Dependências do Backend:** Corrigido o `requirements.txt` para incluir todos os pacotes necessários (`duckdb`, `numpy`, `pandas`, `APScheduler`) para as funcionalidades de telemetria e para resolver problemas de terminação de linha.
- **Build do Frontend:** Corrigido um número de versão inválido do pacote `vite` no `package.json` que estava a impedir a construção do frontend.
