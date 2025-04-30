# Ollama Chat App

A simple no-frills chat application using Ollama's **qwen3:0.6b** model, built using Ollama installed locally on a Mac laptop. This represents the first local Ollama installation and usage on this machine, showcasing the power of running LLMs locally without cloud dependencies.

## Local Setup

This application is designed to work with Ollama running locally on your Mac. The model (`qwen3:0.6b`) is downloaded and run directly on your machine, providing fast and private AI interactions without relying on external cloud services.

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
