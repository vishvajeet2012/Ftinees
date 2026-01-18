# n8n Setup & Deployment Guide

## 1. Local Development

1.  **Start n8n**:

    ```bash
    npx n8n
    ```

    This opens the editor at `http://localhost:5678`.

2.  **Webhook Setup**:

    - Create a **Webhook Node**.
    - Method: `POST`
    - Path: `generate-summary` (Complete URL: `http://localhost:5678/webhook/generate-summary`)
    - **Authentication**: Set to `Header Auth`.
    - Credentials: Create a new Header Auth credential with `Name: x-fitmetric-secret` and `Value: dev-secret-123` (matches your `.env`).

3.  **Process Data**:
    - Add a "Set" node to structure the incoming JSON.
    - Connect to a "Google Gemini" node (if available via community nodes) OR use an "HTTP Request" node to call the Gemini API manually using the prompt from the payload.

## 2. Production (Hugging Face Spaces)

1.  **Create Space**:

    - Go to Hugging Face -> New Space.
    - Select **Docker** as the SDK.

2.  **Upload Dockerfile**:

    - Upload the `n8n-deployment/Dockerfile` to the root of your Space.

3.  **Secrets (Environment Variables)**:

    - Go to "Settings" -> "Variables and secrets".
    - Add `N8N_ENCRYPTION_KEY`: Generate a random string.
    - Add `N8N_USER_MANAGEMENT_DISABLED`: `true` (if you don't want login screens).

4.  **Update FitMetric Server**:
    - In your Production Server (e.g., Render/Vercel), set:
      - `N8N_URL_PROD`: `https://YOUR-HF-SPACE-URL.hf.space`
      - `FITMETRIC_SECRET`: A strong secret key.
    - Also update the Header Credential in your live n8n instance to match this secret.

## 3. The "Always On" Trick

Hugging Face Spaces go to sleep after 48 hours of inactivity.

- **Solution**: Use a scheduled generic trigger (Cron) inside n8n itself!
- **Steps**:
  1. Add a **Schedule Trigger** node in n8n.
  2. Set it to run every **1 Hour**.
  3. Connect it to a simple **HTTP Request** node that pings _its own_ URL (e.g., `https://YOUR-SPACE.hf.space`).
  4. This self-ping keeps the container active 24/7.
