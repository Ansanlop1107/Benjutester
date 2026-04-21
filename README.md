# Benjutester

Aplicación web para generar scripts de **tests `unittest` en Python** a partir de:
- la descripción del ejercicio, y
- el archivo `.py` con la solución del profesor.

## ¿Qué hace el programa?

Benjutester envía un prompt a Gemini y devuelve un archivo `test_ejercicio.py` listo para copiar o descargar.

Incluye:
- plantillas de estilo de test (académico, pedagógico, robustez),
- selector de modelo de IA,
- configuración de API Key desde la interfaz.

## Qué hay que hacer para usarlo

1. Escribe la descripción del ejercicio.
2. Sube el archivo Python de la solución (`.py`).
3. Pega tu API Key de Gemini en la barra lateral.
4. Elige el modelo.
5. Pulsa **Generar pruebas unitarias**.
6. Copia o descarga el script generado.

## Ejecutar en local

Requisitos: Node.js 20+.

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:3000`.

## Despliegue online (hosting)

Al ser una app Vite, puedes desplegarla en Netlify, Vercel, Cloudflare Pages o similar:

```bash
npm install
npm run build
```

Publica la carpeta `dist/`.

### Importante sobre la API Key

- La app permite introducir la API Key desde el navegador y la guarda en `sessionStorage` (persiste tras recargas en la misma pestaña y se borra al cerrar la pestaña/ventana).
- Para uso público real (muchos usuarios), lo recomendable es mover la llamada a Gemini a un backend/proxy para no exponer claves de servidor.

## IA recomendada para este caso

### Opción más interesante (calidad)
- **Gemini 2.5 Pro**: mejor razonamiento para generar tests complejos y más consistentes.

### Opción más rentable (coste/rendimiento)
- **Gemini 2.5 Flash**: más rápido y barato, ideal para uso continuo.

## ¿Tiene sentido incluir IA aquí?

Sí, porque el valor del producto depende directamente de generar tests automáticamente.

Si quieres minimizar coste:
- usa **Gemini 2.5 Flash** como modelo por defecto,
- limita longitud de prompts/código,
- y aplica caché o reintentos controlados.

Sin pagar nada de forma indefinida no suele ser viable en producción: normalmente dependes de cuotas gratuitas limitadas o de infraestructura propia.
