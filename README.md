<img width="1536" height="1024" alt="benjutester" src="https://github.com/user-attachments/assets/814a2f37-520a-4497-9f27-4165a7693389" />

# 🧪 Benjutester AI V2

**Benjutester** es una aplicación web de última generación diseñada para generar scripts de **Pruebas Unitarias en Python** de forma inteligente, utilizando el módulo estándar `unittest` y la potente API de **Google Gemini**. 

Esta herramienta está pensada para docentes y desarrolladores que buscan automatizar la creación de baterías de pruebas de **caja blanca** robustas y exhaustivas, garantizando un **100% de cobertura de código** (ramas, bucles, excepciones y líneas) sobre soluciones correctas.

---

### 🛠️ Tecnologías Utilizadas

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)

---

> [!WARNING]
> **Supervisión humana requerida:** Recuerda que el código generado por Inteligencia Artificial puede contener alucinaciones o imprecisiones. Es imprescindible revisar y probar siempre el script generado antes de distribuirlo a los alumnos o integrarlo en un sistema de evaluación automática.

> [!NOTE]
> El prompt establecido se puede modificar a gusto del profesor, en función de sus preferencias.

> [!IMPORTANT]
> Este proyecto utiliza la librería `unittesting_utils`, cuya autoría no me pertenece. Actualmente se utiliza únicamente con fines educativos.

---

## ⚡ Características Principales (Versión V2)

1.  **Entorno de Trabajo Drag & Drop:** Olvídate de copiar y pegar código. Arrastra y suelta tus archivos Python (`.py`) directamente sobre la interfaz para cargarlos al instante.
2.  **Editores de Código IDE:** Edita tus scripts en vivo con numeración de líneas vertical sincronizada.
3.  **Motor de Prompt 100% Personalizable:**
    *   **Edición en Vivo:** Modifica las instrucciones que recibe el modelo de IA desde la pestaña de "Plantilla Prompt".
    *   **Variables Personalizadas:** Agrega tus propios marcadores (ej: `{docente}`, `{curso}`) e inyéctalos dinámicamente en el prompt.
    *   **Previsualización Dinámica:** Revisa el prompt final compilado con todas las variables resueltas antes de realizar la petición.
4.  **Ajuste de Hiperparámetros de IA:** Elige entre modelos (`Gemini 2.5 Flash` y `Gemini 2.5 Pro`) y ajusta la Temperatura, Top P y Top K mediante controles visuales.
5.  **Analíticas Visuales del Script Generado:**
    *   **TDD Badges:** Detección y verificación automática de patrones recomendados en el script (`@ututils.Timeout`, `IOCapture`, `deepcopy` e `assertRaises`).
    *   **Explorador de Tests con Buscador:** Examina todos los métodos de pruebas generados en una tabla interactiva, filtrando por nombre o docstring en tiempo real.
6.  **Historial de Sesión Persistente:** Guarda automáticamente instantáneas completas de tu espacio de trabajo (descripción, solución, variables, plantilla y tests generados) en tu navegador para restaurar sesiones anteriores con un solo clic.
7.  **Estética de Alta Gama:** Interfaz oscura glassmorphic con cuatro temas personalizables en tiempo real: **Cosmic Nebula**, **Cyberpunk Emerald**, **Sunfire Crimson** y **Oceanic Sapphire**.

---

## ⚙️ Requisitos Previos e Instalación

Para ejecutar Benjutester localmente en tu ordenador, necesitas tener instalado:
*   [Node.js](https://nodejs.org/) (Versión 20 o superior).
*   Una API Key de Google Gemini (puedes conseguir una gratuita en [Google AI Studio](https://aistudio.google.com/)).

### Pasos para la instalación:

1.  **Clonar el repositorio** y acceder a la carpeta del proyecto.
2.  **Instalar las dependencias de NPM:**
    ```bash
    npm install
    ```
3.  **Configurar tu API Key de Gemini:**
    *   Crea un archivo llamado `.env.local` en la carpeta raíz del proyecto.
    *   Agrega la siguiente variable con tu clave de API:
        ```env
        GEMINI_API_KEY=tu_api_key_aqui
        ```

---

## 🚀 Guía de Uso Paso a Paso

1.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Abre tu navegador en la dirección que te indique la consola (ej: `http://localhost:3000`).
2.  **Ingresar al Workspace:**
    Introduce la contraseña de acceso por defecto: `tester123`.
3.  **Cargar el Ejercicio:**
    *   **Pestaña Descripción:** Escribe una breve explicación del ejercicio, restricciones o lo que consideres oportuno para guiar a la IA.
    *   **Pestaña Solución:** Arrastra tu archivo `.py` (con la solución correcta del profesor) o haz clic en el área para subirlo. Verás una tarjeta de previsualización con el tamaño en KB y cantidad de líneas.
    *   **Pestaña Contexto Base (Opcional):** Si tu código solución hereda de otra clase ubicada en otro archivo (como una interfaz o clase base), arrastra o sube dicho archivo aquí para que la IA comprenda la jerarquía completa.
4.  **Personalizar la generación (Opcional):**
    *   Edita la plantilla del prompt o añade variables si deseas afinar el comportamiento de la IA.
    *   Ajusta los parámetros del modelo en la pestaña de variables (temperatura, selección del modelo Gemini Pro para ejercicios complejos).
5.  **Generar y Exportar:**
    *   Haz clic en **"Ejecutar Generación TDD"**.
    *   Una vez generado, puedes inspeccionar los tests y su cobertura en las pestañas de **"Pruebas Generadas"** y **"Analíticas del Script"**.
    *   Copia los tests al portapapeles o descárgalos en un archivo `test_solucion.py` listo para usar en tu entorno de pruebas junto a la librería de utilidades `unittesting_utils.py`.

---

## 📦 Dependencias de Pruebas (`unittesting_utils.py`)

Las pruebas generadas de manera predeterminada por la IA hacen uso de utilidades avanzadas para evaluar el código del alumno. Asegúrate de incluir el archivo [unittesting_utils.py](file:///d:/Benjutester/unittesting_utils.py) en el mismo directorio donde se ejecuten los tests. Este módulo contiene clases y helpers indispensables como:
*   `Timeout` para limitar la ejecución de bucles infinitos.
*   `IOCapture` para capturar e inyectar de forma segura entradas y salidas de consola.
*   Funciones de normalización de textos, análisis estructural de clases y MRO.

---

> Made with 💚 by [Ansanlop1107](https://github.com/Ansanlop1107)