# 🧪 Benjutester

**Benjutester** es una aplicación web diseñada para generar scripts de **Pruebas Unitarias en Python** utilizando el módulo `unittest`.

Esta herramienta se enfoca en la creación de pruebas de **caja blanca** y está especialmente pensada para facilitar el trabajo del personal docente, permitiéndoles generar baterías de pruebas completas y robustas para evaluar el código de sus alumnos.

Para generar estas pruebas de forma inteligente, Benjutester hace uso de la potente IA generativa de Google a través de la API de **Gemini**.

---

## 🔑 Configuración de la API Key de Gemini

Para que la aplicación funcione correctamente y pueda generar las pruebas, es **estrictamente necesario** configurar una clave de acceso (API Key) de Google Gemini.

### 1. Conseguir tu API Key

1. Dirígete a la consola de [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Inicia sesión con tu cuenta de Google.
3. Haz clic en el botón **"Create API Key"** (Crear clave de API).
4. Copia la clave generada (es una cadena larga de texto).

> [!CAUTION]
> ¡Mantén esta clave en secreto! No la compartas públicamente ni la subas a repositorios de GitHub. Si alguien más usa tu clave, podría consumir los límites de tu cuenta de Google.

### 2. Configurar la clave en el proyecto

Para que Benjutester pueda usar tu clave de forma segura, debes guardarla en un archivo de variables de entorno local:

1. En la carpeta principal del proyecto, busca un archivo llamado `.env.local`. Si no existe, **créalo**.
2. Abre el archivo `.env.local` con cualquier editor de texto.
3. Añade la siguiente línea, sustituyendo `TU_CLAVE_AQUI` por la API Key que copiaste de Google AI Studio:
   ```env
   GEMINI_API_KEY=TU_CLAVE_AQUI
   ```
4. Guarda el archivo. (Nota: el proyecto debería estar configurado para ignorar este archivo en Git, de forma que no se suba a la nube por accidente).

---

## 🚀 Cómo ejecutar Benjutester

Una vez que tienes configurada tu API Key, levantar la aplicación en tu propio ordenador es muy sencillo.

### Requisitos previos

- Necesitas tener instalado **Node.js** (versión 20 o superior) en tu ordenador.

### Instalación y ejecución paso a paso

Abre tu terminal en la carpeta raíz del proyecto y ejecuta los siguientes comandos:

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Levantar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

3. **Abrir la aplicación:**
   La terminal te indicará una dirección (normalmente `http://localhost:3000` o `http://localhost:5173`). Pulsa `Ctrl + Clic` en ella o cópiala manualmente en la barra de direcciones de tu navegador web.

---

## ⚙️ Uso de la aplicación

Una vez dentro de la web de Benjutester, los pasos a seguir son:

1. **Contexto:** Escribe un breve prompt o descripción del ejercicio que deben resolver los alumnos.
2. **Código base:** Adjunta o pega el archivo Python (`.py`) que contiene la _solución del profesor_.
3. **Archivos adicionales (Opcional):** Si el ejercicio requiere herencia y tiene clases base definidas en otros archivos, inclúyelos aquí para que Gemini entienda todo el contexto.
4. **Generar:** Pulsa el botón de generar para enviar la petición a la API de Gemini.
5. **Resultado:** En unos segundos, la IA devolverá el script de prueba unitaria completo, listo para copiar o descargar.

> [!WARNING]
> **Supervisión humana requerida:** Recuerda que la información proporcionada por la IA generativa no siempre es 100% infalible. Es muy recomendable revisar el código generado, ejecutarlo para comprobar que funciona correctamente y corregir posibles "alucinaciones" antes de entregarlo a los alumnos.

> [!TIP]
> Recuerda que la cuota gratis de gemini no es muy amplia, por lo que es recomendable mejorar la prueba unitaria personalmente una vez generada por la IA antes que volverle a pedir otra para el mismo ejercicio.
