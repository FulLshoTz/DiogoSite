# 🏎️ FulLshoT Hub - SimRacing Dashboard

Este projeto é um Dashboard centralizado para SimRacing, composto por um Backend (Python/Flask) e um Frontend (React/Vite).

## 📂 Estrutura do Projeto

* **`DiogoRodrigues_backend/`**: API que comunica com o YouTube e RSS Feeds.
* **`DiogoRodrigues_frontend/`**: O site visual (React) que o utilizador vê.

## 🚀 Instalação e Configuração (Passo a Passo)

### 1. Configuração do Servidor (Render ou Outro)
Para o site funcionar em produção, é necessário configurar as seguintes Variáveis de Ambiente (Environment Variables):

**Backend:**
| Variável | Descrição |
| :--- | :--- |
| `YOUTUBE_API_KEY` | Chave da Google Cloud (YouTube Data API v3). |
| `CHANNEL_HANDLE` | O Handle do canal principal (ex: `@fullshot`). |
| `CORS_ORIGIN` | O endereço do site Frontend (ex: `https://omeusite.com`). |
| `FLASK_ENV` | Define o modo (`production`). |

**Frontend:**
| Variável | Descrição |
| :--- | :--- |
| `VITE_API_BASE` | O endereço do Backend (ex: `https://meu-backend.onrender.com`). |
| `VITE_YOUTUBE_CHANNEL_ID` | ID do canal para links diretos. |

---

### 2. Segurança da API (Obrigatório) 🛡️

Para evitar roubo de quota da API do YouTube, é fundamental restringir a chave apenas ao IP do servidor Backend.

1.  **No Render (ou servidor):**
    * Vá à dashboard do serviço Backend.
    * Procure a secção "Connect" ou "Network" e copie os **Outbound IP Addresses** (ex: `74.220.48.0/24`).

2.  **Na Google Cloud Console:**
    * Aceda a **APIs & Services > Credentials**.
    * Edite a sua API Key.
    * Em **Application restrictions**, selecione **IP addresses**.
    * Cole os IPs que copiou do passo anterior.
    * Grave as alterações.

*Isto garante que apenas o seu Backend consegue comunicar com o YouTube, impedindo uso indevido da chave por terceiros.*

---

### 3. Como correr localmente (Dev Mode)

1.  **Backend:**
    ```bash
    cd DiogoRodrigues_backend
    pip install -r requirements.txt
    python src/main.py
    ```
2.  **Frontend:**
    ```bash
    cd DiogoRodrigues_frontend
    npm install
    npm run dev
    ```