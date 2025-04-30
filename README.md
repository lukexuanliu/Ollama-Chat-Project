# Ollama Chat App

A simple no-frills chat application using Ollama's **qwen3:0.6b** model, built using Ollama installed locally on a Mac laptop. This represents the first local Ollama installation and usage on this machine, different from running huggingface models on the cloud.

## Local Setup

To get started with Ollama on your Mac, follow these official setup steps:

1. Install Ollama:
   - Visit the official Ollama website: [https://ollama.ai/download](https://ollama.ai/download)
   - Follow the installation instructions for macOS
   - Start the Ollama daemon with `ollama serve`

2. Pull the qwen3:0.6b model:
   ```bash
   ollama pull qwen3:0.6b
   ```

3. Verify installation:
   - Check if the model is available: `ollama list`
   - Test the model: `ollama run qwen3:0.6b "Hello!"`

For detailed setup instructions and troubleshooting, visit the official Ollama documentation: [https://ollama.ai/docs](https://ollama.ai/docs)

## CORS Handling

This application implements a clean solution to bypass CORS issues when communicating with Ollama's API. Here's how it works:

1. **Single Origin Architecture**: The entire application (both frontend and backend) runs on the same origin (http://localhost:3000), eliminating CORS restrictions.
2. **Proxy Pattern**: Instead of making direct requests from the frontend to Ollama's API (which would trigger CORS), we use a proxy pattern:
   - Frontend makes requests to our Express server at `/api/chat`
   - Our server then forwards these requests to Ollama's API
   - Responses flow back through our server to the frontend

This approach provides several benefits:
- No CORS configuration needed
- Better security through API abstraction
- Easier to add additional processing or validation
- Cleaner code separation

## Prerequisites

- Node.js (v16+)
- Ollama installed and running
- The qwen3:0.6b model pulled:
  ```bash
  ollama pull qwen3:0.6b
  ```

## Installation

```bash
npm install
```

## Usage

1. Ensure Ollama daemon is running:
   ```bash
   ollama serve
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open your browser at [http://localhost:3000](http://localhost:3000)
