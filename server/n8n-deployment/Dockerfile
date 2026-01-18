# Use the official n8n image
FROM n8nio/n8n:latest

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Set environment variables
ENV PORT=7860
ENV N8N_PORT=7860
ENV N8N_PROTOCOL=https
ENV WEBHOOK_URL=https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME/

# Disable user management if you want a single user (or use basic auth)
# ENV N8N_USER_MANAGEMENT_DISABLED=true

# Encryption key (Should be set in HF Secrets, but here for reference)
# ENV N8N_ENCRYPTION_KEY="somereallylongrandomstring"

# Command to start n8n
CMD ["n8n", "start"]
