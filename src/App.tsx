import React, { useState, useRef } from 'react';
import { 
  FileCode, 
  Upload, 
  Play, 
  Copy, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Terminal,
  LogIn,
  LogOut,
  Trash2,
  ChevronRight,
  Layers
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Prompt template optimized for high-quality test generation
const PROMPT_TEMPLATE = `Actúa como un Ingeniero QA de Software Senior especializado en Python y TDD. Tu objetivo es generar un script de pruebas unitarias extremadamente exhaustivo y pedagógico usando el módulo \`unittest\` para un código fuente que te proporcionaré al final.

El código que te proporcionaré es la **SOLUCIÓN CORRECTA**. Por lo tanto, todas las pruebas deben pasar con un 100% de éxito y alcanzar un **100% de cobertura de código**.

### REQUISITOS TÉCNICOS Y VOLUMEN (¡OBLIGATORIO!):

1.  **Volumen Crítico:** Debes generar **AL MENOS 40 MÉTODOS DE PRUEBA individuales** (\`test_...\`). No escatimes en variaciones. Si la lógica es simple, crea múltiples tests con diferentes datos de entrada (fuzzing masivo, casos límite, variaciones de strings).
2.  **Cobertura del 100%:** Analiza cada rama (\`if\`, \`else\`), cada bucle (\`for\`, \`while\`) y cada bloque de excepciones (\`try/except\`) del código proporcionado. Crea los escenarios específicos para pasar por todas las líneas.
3.  **Uso de ututils:**
    * Cada test DEBE llevar el decorador \`@ututils.Timeout(ututils.DEF_TEST_TIMEOUT)\`.
    * El módulo de la solución se debe importar dinámicamente o asumiendo el nombre del archivo (usa \`import {module_name} as modsol\`). 
    * El módulo de utilidades se importa como \`import unittesting_utils as ututils\`.
    * Usa \`ututils.get_mro_nms(Clase)\` y \`ututils.get_pubmths_nms(Clase)\` para tests estructurales.
    * **REGLA DE ORO PARA I/O:** Para capturar la salida de \`print\`, usa SIEMPRE \`iocapture.get_stdout_value()\`. Prohibido cualquier otro método como \`get_stdout\`.
    * **MENSAJES DE ERROR:** Utiliza \`ututils.crear_mensaje_error(actual, esperado, str2repr=False)\` para construir mensajes de error detallados en comparaciones de hileras largas o colecciones.

### ARQUITECTURA Y ROBUSTEZ:

1.  **Clases de Prueba:** Organiza en clases numeradas (ej: \`Test01010_...\`). Cada clase debe tener un \`setUp\` que inicialice \`self.maxDiff = None\`.
2.  **Patrón de Pruebas de Lectura (I/O) - ¡ESTILO PEDAGÓGICO OBLIGATORIO!:**
    * Para funciones que leen datos de consola (ej. \`leer_viviendas()\`), debes simular la entrada y comprobar que el **valor retornado** es correcto.
    * Ejemplo de estructura para lectura:
      \`\`\`python
      def test_010_leer_datos(self):
          """Deps: funcion_lectura()"""
          texto_entrada = ("Dato1\\n" "Dato2\\n" "Dato3\\n" "\\n" "\\n\\n\\n\\n") 
          with ututils.IOCapture(texto_entrada) as iocapture:
              resultado = modsol.funcion_lectura()
          self.assertEqual(resultado, valor_esperado, msg="...")
      \`\`\`
    * Ejemplo de estructura para capturar prints (IGUAL QUE ESTE PATRÓN):
      \`\`\`python
      def test_020_mostrar_datos(self):
          """Deps: funcion_mostrar( <contexto> )"""
          texto_entrada = ("\\n\\n\\n\\n\\n")
          datos = copy.deepcopy(VALOR_ORIGINAL)
          with ututils.IOCapture(texto_entrada) as iocapture:
              modsol.funcion_mostrar(datos)
          salida_pantalla = iocapture.get_stdout_value()
          salida_esperada = ("Texto exacto esperado...")
          
          salida_pantalla_tkascii = ututils.str2tkascii(salida_pantalla)
          salida_esperada_tkascii = ututils.str2tkascii(salida_esperada)
          
          msg_error = f"\\n-------------\\nError en salida de [NOMBRE_FUNCION]"
          msg_error += ututils.crear_mensaje_error(salida_pantalla, salida_esperada, str2repr=False)
          self.assertTrue(salida_pantalla_tkascii == salida_esperada_tkascii, msg=msg_error)
          
          # Verificar inmutabilidad
          self.assertEqual(datos, VALOR_ORIGINAL, msg="Esta función no debe modificar el valor de los parámetros")
      \`\`\`
3.  **Pruebas del Main (Normalización de prompts):**
    * Para el main, usa \`ututils.norm_input_msg\` para limpiar los mensajes de "Introduce dato:" y que el diff del error sea legible.
    * Estructura obligatoria:
      \`\`\`python
      def test_030_main(self):
          """Deps: main()"""
          texto_entrada = ("input1\\ninput2\\n\\n\\n\\n\\n")
          with ututils.IOCapture(texto_entrada) as iocapture:
              modsol.main()
          salida_pantalla = iocapture.get_stdout_value()
          salida_esperada = ("Salida completa con prompts...")
          
          # 1. Comparación normalizada para el éxito
          self.assertEqual(ututils.str2tkascii(salida_pantalla), ututils.str2tkascii(salida_esperada), 
                           msg=ututils.crear_mensaje_error(
                               ututils.norm_input_msg(salida_pantalla, ["Introduce..."]), 
                               ututils.norm_input_msg(salida_esperada, ["Introduce..."]), 
                               str2repr=False))
      \`\`\`
4.  **Jerarquía (MRO):** Al comprobar el MRO, asegúrate de buscar en la clase correcta. Si el ejercicio pide que una EXCEPCIÓN herede de otra cosa, comprueba el MRO de esa clase de excepción, no de la clase principal del ejercicio.
5.  **Funciones de Verificación Internas:**
    * Si las comparaciones son complejas (ej: diccionarios de listas), define funciones auxiliares (ej: \`_check_resultado(self, actual, esperado, msg)\`) fuera de los métodos de test para reutilizar lógica de comprobación iterativa.
6.  **Validación de Pantalla (print):**
    * Aunque se compare la hilera completa normalizada (tkascii), en tests de cobertura secundaria puedes usar \`assertIn\` con fragmentos si el test principal ya cubre la exactitud.
7.  **Inmutabilidad:** Comprueba que las funciones no degradan los parámetros de entrada usando \`copy.deepcopy()\` como referencia.
8.  **No uses logic de saltado:** Prohibido \`@unittest.skip\`.
9.  **Docstrings:** Cada método debe tener un docstring descriptivo con sus dependencias (ej: \`'''Deps: XError, MetodoY'''\`).

### CONTEXTO DEL EJERCICIO:

Descripción: {description}

{base_class_context}

CÓDIGO DE LA SOLUCIÓN:
\`\`\`python
{solution_code}
\`\`\`

Genera el script de pruebas completo (mínimo 40 tests) que garantice el 100% de éxito y cobertura.

INSTRUCCIONES DE FORMATO:
1. Devuelve ÚNICAMENTE el script Python, sin explicaciones ni markdown extra.
2. El bloque final DEBE ser exactamente:
   \`\`\`python

   if __name__ == "__main__":
        unittest.main(module=__name__, verbosity=2)
   \`\`\`
\`;
`;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [baseClassCode, setBaseClassCode] = useState('');
  const [generatedTests, setGeneratedTests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [baseFileName, setBaseFileName] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseFileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'tester123') {
      setIsLoggedIn(true);
      setError(null);
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    setGeneratedTests('');
    setDescription('');
    setSolutionCode('');
    setBaseClassCode('');
    setFileName(null);
    setBaseFileName(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isBase: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.py')) {
      setError('Por favor, sube un archivo .py válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (isBase) {
        setBaseClassCode(content);
        setBaseFileName(file.name);
      } else {
        setSolutionCode(content);
        setFileName(file.name);
      }
      setError(null);
    };
    reader.readAsText(file);
  };

  const generateTests = async () => {
    if (!description || !solutionCode) {
      setError('Por favor, completa la descripción y sube el código de solución.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const module_name = fileName ? fileName.replace('.py', '') : 'solucion';
      const baseClassContext = baseClassCode 
        ? `CÓDIGO DE LA CLASE BASE O CONTEXTO ADICIONAL (Para tener en cuenta en la herencia o importaciones):\n\`\`\`python\n${baseClassCode}\n\`\`\``
        : "";

      const prompt = PROMPT_TEMPLATE
        .replace(/{description}/g, description)
        .replace(/{solution_code}/g, solutionCode)
        .replace(/{base_class_context}/g, baseClassContext)
        .replace(/{module_name}/g, module_name);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.1,
          topP: 0.95,
          topK: 40,
        }
      });

      let text = response.text || '';
      
      // Clean up markdown fences if present
      text = text.replace(/^```python[\s\S]*?\n/, '');
      text = text.replace(/\n```$/, '');
      text = text.trim();
      
      setGeneratedTests(text);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('quota')) {
        setError('Límite de cuota excedido: La versión gratuita de Gemini tiene un límite de peticiones. Por favor, espera un minuto e inténtalo de nuevo.');
      } else {
        setError('Ocurrió un error al generar las pruebas. Por favor, intenta de nuevo o verifica tu conexión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedTests);
  };

  const downloadFile = () => {
    const element = document.createElement("a");
    const testFileName = fileName ? `test_${fileName}` : 'test_solucion.py';
    const file = new Blob([generatedTests], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = testFileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <Terminal className="text-white w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-white mt-4">Benjutester AI</h1>
              <p className="text-slate-400 text-sm">Ingreso al sistema de generación</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Contraseña</label>
                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                    <LogIn className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold py-3 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-white/5"
              >
                Acceder
              </button>
            </form>

            {error && (
              <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-sm animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="pt-4 border-t border-slate-800/50 flex flex-col space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">⚙️ Configuración</h3>
              <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">Gemini 2.5 Pro</p>
                    <p className="text-[10px] text-slate-500 text-nowrap">Conexión activa</p>
                  </div>
                </div>
                <div className="px-2 py-1 rounded bg-slate-800">
                   <p className="text-[10px] items-center flex font-mono text-slate-400">V. 2.4.1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group animate-in fade-in slide-in-from-left-4">
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-6 transition-transform">
              <Terminal className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">🧪 Benjutester</h1>
            <span className="bg-indigo-500/20 text-indigo-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-indigo-500/30">PRO</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-slate-400 hover:text-white hover:bg-slate-900 px-3 py-2 rounded-lg transition-all active:scale-95"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Salir</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-12 gap-8">
        {/* Input Sidebar */}
        <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Generador</h2>
            <p className="text-slate-400 text-sm">
              Sube la solución y el contexto adicional para generar pruebas unitarias pedagógicas automáticamente.
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-2xl border border-slate-900 p-6 space-y-6">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Entradas</h3>
              <button 
                onClick={() => {
                  setDescription('');
                  setSolutionCode('');
                  setBaseClassCode('');
                  setFileName(null);
                  setBaseFileName(null);
                  setError(null);
                }}
                className="text-[10px] text-slate-500 hover:text-white transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Limpiar todo
              </button>
            </div>
            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Descripción del ejercicio
                </label>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Clase JarraConReserva que hereda de Jarra y gestiona un depósito extra..."
                className="w-full bg-slate-950 border border-slate-800 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all min-h-[100px] resize-none placeholder:text-slate-700"
              />
            </div>

            {/* Base Class Code (NEW) */}
            <div className="space-y-4 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Contexto Base (Opcional)
                </label>
                {baseClassCode && (
                  <button 
                    onClick={() => {setBaseClassCode(''); setBaseFileName(null);}}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div 
                onClick={() => baseFileInputRef.current?.click()}
                className={`group border-2 border-dashed ${baseFileName ? 'border-indigo-500/50 bg-indigo-500/5 text-indigo-400' : 'border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-slate-500'} transition-all cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center gap-2`}
              >
                <div className={`p-2 rounded-xl bg-slate-900 ${baseFileName ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-800'} transition-colors`}>
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold">{baseFileName || 'Subir Clase Base / Contexto'}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">Para herencia (Jarra &rarr; JarraReserva)</p>
                </div>
                <input
                  type="file"
                  ref={baseFileInputRef}
                  onChange={(e) => handleFileUpload(e, true)}
                  accept=".py"
                  className="hidden"
                />
              </div>
            </div>

            {/* Solution Upload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  Solución del Profesor
                </label>
                {solutionCode && (
                  <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">
                    {solutionCode.split('\n').length} líneas
                  </span>
                )}
              </div>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group border-2 border-dashed ${fileName ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200' : 'border-slate-800 hover:border-indigo-500 hover:bg-slate-900 text-slate-400'} transition-all cursor-pointer rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 relative overflow-hidden`}
              >
                {fileName ? (
                  <>
                    <div className="bg-indigo-500 p-3 rounded-xl shadow-lg shadow-indigo-500/20">
                      <CheckCircle2 className="text-white w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold tracking-tight">{fileName}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSolutionCode('');
                        setFileName(null);
                      }}
                      className="text-xs text-indigo-400 hover:text-white transition-colors"
                    >
                      Cambiar archivo
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">Haz clic para subir .py</p>
                      <p className="text-xs text-slate-500 mt-1">El código fuente solución</p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e, false)}
                  accept=".py"
                  className="hidden"
                />
              </div>
            </div>

            <button
              onClick={generateTests}
              disabled={isLoading || !description || !solutionCode}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all active:scale-[0.98] ${
                isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/20'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin" />
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Generar pruebas unitarias</span>
                </>
              )}
            </button>
            
            {error && (
              <div className="flex items-center space-x-3 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-sm animate-in zoom-in-95">
                <AlertCircle className="w-5 h-5 grow-0 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7 space-y-4 animate-in fade-in slide-in-from-right-4 duration-1000">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-2">
              <ChevronRight className="w-5 h-5 text-indigo-500" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Resultado</h2>
            </div>
            
            {generatedTests && (
              <div className="flex items-center space-x-2 animate-in fade-in zoom-in-95">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-colors border border-slate-800"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar</span>
                </button>
                <button
                  onClick={downloadFile}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm transition-colors border border-indigo-500 shadow-lg shadow-indigo-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-focus-within:opacity-50"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl min-h-[500px] overflow-hidden flex flex-col">
              {!generatedTests && !isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-4">
                  <div className="w-16 h-16 rounded-full border-2 border-slate-800 border-dashed animate-[spin_10s_linear_infinite] flex items-center justify-center">
                    <Terminal className="w-6 h-6 opacity-40" />
                  </div>
                  <p className="text-slate-500 font-medium text-sm">Las pruebas generadas aparecerán aquí.</p>
                </div>
              ) : isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <p className="text-indigo-300/60 font-medium text-sm">Analizando solución...</p>
                </div>
              ) : (
                <pre className="flex-1 overflow-auto p-6 font-mono text-sm text-indigo-50 leading-relaxed CustomScrollbar">
                  <code>{generatedTests}</code>
                </pre>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest px-2 font-bold">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
              Status: {generatedTests ? 'Listo para descargar' : 'Esperando generación'}
            </div>
            <div>
              Format: Python unittest
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .CustomScrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .CustomScrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .CustomScrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 99px;
        }
        .CustomScrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}} />
    </div>
  );
}