import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434';

const readRequestBody = async (request: NodeJS.ReadableStream): Promise<string> => {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString('utf8');
};

const ollamaRelayPlugin = (): Plugin => ({
  name: 'ollama-secure-relay',
  configureServer(server) {
    server.middlewares.use('/api/ollama/generate', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({error: 'Method Not Allowed'}));
        return;
      }

      try {
        const headerValue = req.headers['x-ollama-base-url'];
        const requestedBaseUrl = (Array.isArray(headerValue) ? headerValue[0] : headerValue)?.trim();
        const baseUrl = requestedBaseUrl || DEFAULT_OLLAMA_BASE_URL;
        const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
        const targetUrl = `${normalizedBaseUrl}/api/generate`;

        const rawBody = await readRequestBody(req);
        const upstreamResponse = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: rawBody,
        });

        const responseText = await upstreamResponse.text();
        const responseContentType = upstreamResponse.headers.get('content-type') || 'application/json';

        res.statusCode = upstreamResponse.status;
        res.setHeader('Content-Type', responseContentType);
        res.end(responseText);
      } catch (error) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            error: `No se pudo contactar con Ollama desde el relay del servidor: ${
              error instanceof Error ? error.message : 'Error desconocido'
            }`,
          }),
        );
      }
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), ollamaRelayPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
