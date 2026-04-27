<img width="1536" height="1024" alt="benjutester" src="https://github.com/user-attachments/assets/814a2f37-520a-4497-9f27-4165a7693389" />

# 🧪 Benjutester

**Benjutester** es una aplicación web diseñada para generar scripts de **Pruebas Unitarias en Python** utilizando el módulo `unittest`.

Esta herramienta se enfoca en la creación de pruebas de **caja blanca** y está especialmente pensada para facilitar el trabajo del personal docente, permitiéndoles generar baterías de pruebas completas y robustas para evaluar el código de sus alumnos.

Para generar estas pruebas, Benjutester requiere los siguientes elementos:

- 📝 Un **prompt breve** descriptivo del ejercicio.
- 🐍 El **archivo Python** que contiene la solución del profesor (código de referencia).
- 📂 **Archivos adicionales** (opcional): En ejercicios que requieran herencia o dependencias, se pueden incluir los archivos con las definiciones de las clases base. Esto permite a la IA comprender el contexto y generar pruebas unitarias precisas. *Nota: Si no se adjuntan estos archivos en ejercicios de herencia, las pruebas generadas podrían ser inexactas*

## ⚙️ ¿Cómo funciona?

A partir de la información proporcionada, el programa estructura un prompt avanzado que incluye especificaciones estrictas de calidad y formato. Posteriormente, realiza una petición a un modelo de **IA Generativa**, el cual se encarga de redactar y devolver el script de pruebas unitarias listo para usarse.

> [!CAUTION]
> **Arquitectura de ramas:** Las ramas de desarrollo de este repositorio son independientes. Cada una está diseñada y optimizada para integrarse con un proveedor o modelo de IA generativa diferente.

> [!WARNING]
> **Supervisión humana requerida:** Recuerda que el código generado por Inteligencia Artificial puede contener alucinaciones o imprecisiones. Es imprescindible revisar y probar siempre el script generado antes de distribuirlo a los alumnos o integrarlo en un sistema de evaluación automática.

> [!NOTE]
> El prompt establecido se puede modificar a gusto del profesor, en funcion de sus preferencias.

> [!IMPORTANT]
> Este proyecto utiliza la librería `unittesting_utils`, cuya autoría no me pertenece.
> Actualmente se utiliza únicamente con fines educativos.
> 
> Estoy pendiente de confirmar con el autor (profesor) si se puede incluir o redistribuir públicamente.
> En caso necesario, esta dependencia será eliminada o sustituida.

## 🌿 Ramas del repositorio

Actualmente, el proyecto se divide en las siguientes ramas para soportar distintos modelos:

- **`main`**: Contiene la información general y la documentación base del proyecto.
- **`branch-local`**: Implementación configurada para ejecutar modelos de IA de forma **local** (ej. mediante Ollama). No requiere conexión a internet ni consumo de APIs de pago. *Requisito: Se recomienda disponer de un equipo con hardware potente y suficiente memoria RAM.*
- **`branch-gemini`**: Implementación que utiliza la API de **Google Gemini** para la generación de las pruebas.
- **`branch-openroute`**: Implementación que utiliza la API de **Openrouter** para la generación de las pruebas.

## 🎓 Contribuciones

Las contribuciones son bienvenidas.

Si quieres mejorar el proyecto, puedes:
- abrir una issue para proponer cambios o reportar problemas
- enviar un pull request con mejoras

Cualquier ayuda es apreciada, especialmente en:
- mejora de generación de tests
- optimización del código
- documentación

> Made with 💚 by [Ansanlop1107](https://github.com/Ansanlop1107) 
