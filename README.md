# Benjutester

Aplicación web para generar scripts de **tests `unittest` en Python** a partir de:
- la descripción del ejercicio, y
- el archivo `.py` con la solución del profesor.

## ¿Qué hace el programa?

Benjutester envía un prompt a **Ollama local** y devuelve un archivo `test_ejercicio.py` listo para copiar o descargar.

Incluye:
- plantillas de estilo de test (académico, pedagógico, robustez),
- selector de modelo de IA,
- configuración de URL/modelo de Ollama desde la interfaz.

## Qué hay que hacer para usarlo

1. Escribe la descripción del ejercicio.
2. Sube el archivo Python de la solución (`.py`).
3. Asegúrate de tener Ollama levantado en tu máquina.
4. Indica la URL de Ollama y el modelo en la barra lateral.
5. Pulsa **Generar pruebas unitarias**.
6. Copia o descarga el script generado.

## Ejecutar en local

Requisitos: Node.js 20+.

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:3000`.

Además, necesitas Ollama en local:

```bash
ollama serve
ollama pull llama3.1:8b
```

## Despliegue online (hosting)

Al ser una app Vite, puedes desplegarla en Netlify, Vercel, Cloudflare Pages o similar:

```bash
npm install
npm run build
```

Publica la carpeta `dist/`.

### Importante sobre Ollama

- La app llama a la API HTTP de Ollama (por defecto `http://localhost:11434`).
- Debes tener descargado el modelo que pongas en el campo de modelo (por ejemplo, `llama3.1:8b`).
- Si usas otro host/puerto, ajusta la URL base en la barra lateral.
- Debes installar ollama previamente
```bash
curl -fsSL https://ollama.com/install.sh | sh
```