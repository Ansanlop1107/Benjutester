# 🧪 Benjutester

**Benjutester** es una aplicación web diseñada para generar scripts de **tests unitarios en Python** (usando el módulo `unittest`). La herramienta toma la descripción de un ejercicio y el archivo `.py` con la solución del profesor, y genera automáticamente las pruebas usando **Inteligencia Artificial ejecutada en local**.

Esta herramienta está pensada para proteger la privacidad de los datos, ya que no envía tu código a APIs de terceros por defecto, sino que utiliza **Ollama** para ejecutar modelos de lenguaje de forma 100% local en tu propia máquina.

---

## 🦙 Guía Completa de Instalación y Uso de Ollama

Para que Benjutester funcione, es **imprescindible** tener Ollama instalado y ejecutándose en tu ordenador. A continuación se detallan los pasos para configurarlo, especialmente enfocado en sistemas Windows.

### 1. Descarga e Instalación
1. Visita la página oficial de Ollama: [https://ollama.com/download](https://ollama.com/download)
2. Descarga el instalador para tu sistema operativo (Windows, macOS o Linux).
3. **En Windows:** Ejecuta el archivo `.exe` descargado e instálalo de forma normal.

> [!TIP]
> **Usuarios de Linux / WSL / macOS:** Pueden instalarlo directamente abriendo la terminal y ejecutando:
> `curl -fsSL https://ollama.com/install.sh | sh`

### 2. Comprobación y Solución de Problemas (Windows)
Una vez instalado, abre tu terminal (PowerShell o Símbolo del Sistema) y escribe:
```bash
ollama --version
```
Si ves la versión instalada, ¡todo está correcto! Continúa con el paso 3.

> [!WARNING]
> **Problema común en Windows: "Command not found" o "El término 'ollama' no se reconoce"**
> Si recibes este error tras la instalación, significa que Ollama no se ha añadido correctamente a las variables de entorno de tu sistema (PATH).
> **Solución:**
> 1. Busca "Variables de entorno" en el menú de inicio de Windows y selecciona "Editar las variables de entorno del sistema".
> 2. Haz clic en el botón "Variables de entorno...".
> 3. En "Variables de usuario", busca la variable `Path`, selecciónala y dale a "Editar".
> 4. Añade la ruta donde se instaló Ollama, que suele ser: `C:\Users\<TuUsuario>\AppData\Local\Programs\Ollama`
> 5. Guarda los cambios, **cierra la terminal y vuelve a abrirla** para que detecte los cambios.

### 3. Descarga de un Modelo de IA
Ollama necesita descargar un modelo ("cerebro") para funcionar. Abre tu terminal y ejecuta el siguiente comando para descargar un modelo recomendado como `qwen3.6` (tardará un poco dependiendo de tu internet):

```bash
ollama pull qwen3.6
```

> [!IMPORTANT]
> **Consideraciones de Memoria RAM:**
> Los modelos de IA consumen mucha memoria RAM al ejecutarse. 
> - Si tu ordenador tiene **16 GB de RAM o más**: El modelo `qwen3.6` (aprox. 24GB) funcionará perfecto.
> - Si tienes **recursos limitados (ej. 16 GB disponibles)** y recibes errores del tipo *"model requires more system memory"*: Es mejor cancelar y usar un modelo más pequeño. Prueba a ejecutar `ollama pull qwen2.5:3b` o `ollama pull gemma2:2b`.

### 4. Levantar el Servidor de Ollama
Para que la aplicación web pueda comunicarse con la IA, Ollama debe estar en "modo servidor" escuchando peticiones. En tu terminal ejecuta:

```bash
ollama serve
```

*Nota: En Windows, si ves el icono de una alpaca de Ollama en la bandeja del sistema (junto al reloj abajo a la derecha), es posible que el servidor ya esté ejecutándose automáticamente en segundo plano. Si al hacer `ollama serve` te da un error de "port already in use", significa que ya está listo.*

---

## 🚀 Cómo usar Benjutester

Con Ollama listo y ejecutándose, ahora toca iniciar la aplicación web.

### Ejecutar la aplicación en local
Requisitos: Tener instalado **Node.js 20+** en tu equipo.

```bash
# 1. Instala las dependencias del proyecto
npm install

# 2. Levanta la aplicación web
npm run dev
```

La interfaz de Benjutester estará disponible en tu navegador accediendo a: `http://localhost:3000` (o el puerto que te indique la consola).

### Paso a paso en la Interfaz Web
1. **Configura Ollama:** En la barra lateral de la app, asegúrate de que la **URL** indique `http://localhost:11434` (el puerto estándar de Ollama). En la casilla **Modelo**, escribe exactamente el nombre del que descargaste (ej. `llama3.1:8b` o `qwen2.5:3b`).
2. **Contexto:** Escribe el enunciado del ejercicio en el área de texto grande.
3. **Código base:** Sube tu archivo Python (`.py`) con la solución.
4. **Opciones:** Selecciona los enfoques que desees que tome la IA (ej. plantillas de estilo académico, pedagógico o comprobación de robustez).
5. **Generar:** Pulsa el botón **"Generar pruebas unitarias"**.
6. **Resultado:** Una vez la IA termine de procesarlo (puede tardar unos segundos o minutos dependiendo de la velocidad de tu PC), podrás copiar el código de las pruebas generado o descargar directamente el script `test_ejercicio.py`.

---

## 🌐 Despliegue Online (Hosting)

Al ser una aplicación basada en Vite (React/Vue/etc), puedes subir fácilmente la interfaz de Benjutester a servicios gratuitos como Vercel, Netlify o Cloudflare Pages.

```bash
npm install
npm run build
```
Solo tienes que publicar la carpeta `dist/` resultante en tu plataforma de hosting preferida.

> [!NOTE]
> **Aviso importante sobre la versión alojada online:**
> Aunque subas esta página a internet, **no alojarás la Inteligencia Artificial en el servidor web**. Cada usuario que visite tu página web seguirá necesitando tener su propio Ollama local levantado en su ordenador, y la página (desde el navegador del usuario) se conectará a su `localhost:11434` para generar el código.