/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { 
  Beaker, 
  Upload, 
  FileCode, 
  Download, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  Trash2,
  LayoutTemplate,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TEST_STYLES } from './constants';

const PROMPT_TEMPLATE = `Eres un profesor experto en Python. Tu única tarea es generar un script de pruebas unitarias usando la librería estándar \`unittest\` de Python.

Descripción del ejercicio:
{description}

SOLUCIÓN DEL PROFESOR (Nombre del archivo: {file_name}):
\`\`\`python
{solution_code}
\`\`\`

{example_section}

INSTRUCCIONES CRÍTICAS DE RIGOR ACADÉMICO:
1. El script DEBE seguir ESTRICTAMENTE la estructura del ejemplo académico proporcionado.
2. Cada método de prueba DEBE llevar el decorador \`@ututils.Timeout(ututils.DEF_TEST_TIMEOUT)\`.
3. Debes incluir una clase de prueba específica para la función \`main\` del ejercicio (ej: \`Test900Main\`), verificando la salida por pantalla usando \`ututils.IOCapture\`.
4. Debes importar el módulo de la solución usando el nombre detectado: \`import {module_name} as mod\`.
5. IMPORTANTE: El script DEBE contener al menos 40 métodos de prueba distribuidos en clases numeradas (Test010..., Test020...).
6. Debes probar cada funcionalidad en REPETIDAS OCASIONES con diferentes valores.
7. Si el código es una clase, incluye pruebas de introspección (MRO, métodos públicos, atributos privados).
8. OBLIGATORIO: cada aserción DEBE incluir el argumento \`msg=\` con un mensaje pedagógico.
9. PROHIBICIÓN: NO uses decoradores \`@unittest.skip\`, \`@unittest.skipIf\` ni lógica de saltado de pruebas. Cada prueba debe ejecutarse: o pasa (OK) o falla (Error).

INSTRUCCIONES DE FORMATO:
1. Devuelve ÚNICAMENTE el script Python, sin explicaciones ni bloques de markdown.
2. Usa \`import unittest\` y \`import unittesting_utils as ututils\`.
{style_instruction}
3. El bloque final DEBE ser exactamente:
   \`\`\`python
   def main():
       unittest.main(module=__name__, verbosity=2)

   if __name__ == "__main__":
       main()
   \`\`\`
`;

const MODEL_OPTIONS = [
  { id: 'llama3.1:8b', label: 'Llama 3.1 8B' },
  { id: 'qwen2.5-coder:7b', label: 'Qwen 2.5 Coder 7B' },
  { id: 'mistral:7b', label: 'Mistral 7B' },
];

export default function App() {
  const [description, setDescription] = useState('');
  const [exampleStyle, setExampleStyle] = useState('');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [ollamaBaseUrl, setOllamaBaseUrl] = useState('http://localhost:11434');
  const [modelName, setModelName] = useState(MODEL_OPTIONS[0].id);

  useEffect(() => {
    const savedBaseUrl = localStorage.getItem('benjutester_ollama_base_url');
    const savedModel = localStorage.getItem('benjutester_model_name');

    if (savedBaseUrl) setOllamaBaseUrl(savedBaseUrl);
    const trimmedModel = savedModel?.trim();
    if (trimmedModel) {
      setModelName(trimmedModel);
    }
  }, []);

  const handleStyleSelect = (id: string) => {
    setSelectedStyleId(id);
    const style = TEST_STYLES.find(s => s.id === id);
    if (style) {
      setExampleStyle(style.example);
    } else {
      setExampleStyle('');
    }
  };
  const [solutionCode, setSolutionCode] = useState<string | null>(null);
  const [generatedTests, setGeneratedTests] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.py')) {
      setError('Por favor, sube un archivo .py válido.');
      return;
    }

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSolutionCode(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleGenerateTests = async () => {
    if (!description.trim() || !solutionCode) {
      setError('Por favor, completa la descripción y sube el código de solución.');
      return;
    }

    const configuredBaseUrl = ollamaBaseUrl.trim().replace(/\/+$/, '');
    if (!configuredBaseUrl) {
      setError('Debes configurar la URL base de Ollama.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedTests(null);

    try {
      const example_section = exampleStyle.trim() 
        ? `AQUÍ TIENES UN EJEMPLO DEL ESTILO DE PRUEBAS QUE PREFIERO (úsalo como guía de estilo):\n\`\`\`python\n${exampleStyle}\n\`\`\``
        : "";
      
      const style_instruction = exampleStyle.trim()
        ? "IMPORTANTE: Sigue el estilo del ejemplo proporcionado arriba para la estructura y redacción de los mensajes."
        : "";

      const module_name = fileName ? fileName.replace(/\.py$/, '') : 'solucion';

      const prompt = PROMPT_TEMPLATE
        .replace('{description}', description)
        .replace('{solution_code}', solutionCode)
        .replace(/{file_name}/g, fileName || 'solucion.py')
        .replace(/{module_name}/g, module_name)
        .replace('{example_section}', example_section)
        .replace('{style_instruction}', style_instruction);

      const response = await fetch(`${configuredBaseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama respondió con estado ${response.status}`);
      }

      const data: { response?: string; error?: string } = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      let text = data.response || '';
      
      // Clean up markdown fences if present
      text = text.replace(/^```python\n?/, '').replace(/\n?```$/, '');
      
      setGeneratedTests(text);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al generar pruebas con Ollama. Verifica que esté activo y que el modelo exista.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = () => {
    if (!generatedTests) return;
    const blob = new Blob([generatedTests], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test_ejercicio.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setDescription('');
    setExampleStyle('');
    setSelectedStyleId('');
    setFileName(null);
    setSolutionCode(null);
    setGeneratedTests(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-800/50 border-r border-slate-700 p-6 flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Beaker size={24} strokeWidth={1.5} />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Benjutester</h1>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">⚙️ Configuración</h3>
              <div className="space-y-1">
                <label className="text-sm text-slate-300">URL base de Ollama</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={ollamaBaseUrl}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setOllamaBaseUrl(nextValue);
                      localStorage.setItem('benjutester_ollama_base_url', nextValue);
                    }}
                    placeholder="http://localhost:11434"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Ejemplo local: http://localhost:11434</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-slate-300">Modelo de IA</label>
                <input
                  type="text"
                  list="ollama-models"
                  value={modelName}
                  onChange={(e) => {
                    setModelName(e.target.value);
                    localStorage.setItem('benjutester_model_name', e.target.value);
                  }}
                  placeholder="llama3.1:8b"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                />
                <datalist id="ollama-models">
                  {MODEL_OPTIONS.map((modelOption) => (
                    <option key={modelOption.id} value={modelOption.id}>
                      {modelOption.label}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <LayoutTemplate size={14} className="text-indigo-400" />
                <span>Plantillas de Estilo</span>
              </div>
              <div className="space-y-2">
                {TEST_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleStyleSelect(style.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all group ${
                      selectedStyleId === style.id 
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white' 
                      : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <p className="text-sm font-semibold">{style.name}</p>
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors mt-1 leading-tight">
                      {style.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={reset}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium px-2 py-1"
        >
          <Trash2 size={16} />
          Limpiar formulario
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-8 flex flex-col gap-6 overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-white tracking-tight">🧪 Benjutester</h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Sube la solución de un ejercicio en Python y genera pruebas unitarias pedagógicas automáticamente.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium h-fit whitespace-nowrap">
              {modelName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 h-full overflow-hidden">
          {/* Left Column: Inputs */}
          <div className="space-y-6 flex flex-col overflow-y-auto pr-2 custom-scrollbar pb-8">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-slate-300">Descripción del ejercicio</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Función que recibe una lista de enteros y devuelve su suma..."
                className="w-full h-32 p-4 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none transition-all flex-shrink-0"
              />
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <label className="block text-sm font-medium text-slate-300">Solución del Profesor</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer group ${fileName ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-700'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".py"
                  className="hidden" 
                />
                
                {fileName ? (
                  <CheckCircle2 size={40} className="text-emerald-400" strokeWidth={1.5} />
                ) : (
                  <Upload size={40} className="text-slate-500 group-hover:text-slate-400 transition-colors" strokeWidth={1.5} />
                )}
                
                <div className="text-center">
                  <p className="text-sm text-slate-300 font-medium">
                    {fileName || 'Seleccionar archivo .py'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {fileName ? 'Archivo cargado correctamente' : 'Solo archivos de Python'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGenerateTests}
                disabled={isLoading || !description || !solutionCode}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isLoading || !description || !solutionCode
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Sparkles size={20} />
                    </motion.div>
                    Generando pruebas...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    🚀 Generar pruebas unitarias
                  </>
                )}
              </button>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3 text-xs font-medium"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col bg-slate-950 rounded-xl border border-slate-700 overflow-hidden code-glow relative">
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700 flex justify-between items-center z-10">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <FileCode size={14} className="text-indigo-400" />
                <span>test_ejercicio.py</span>
              </div>
              {generatedTests && (
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedTests);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Copiar código
                </button>
              )}
            </div>

            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {!generatedTests && !isLoading && (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center gap-4"
                  >
                    <div className="w-16 h-16 bg-slate-800/40 rounded-full flex items-center justify-center text-slate-700">
                      <FileCode size={32} strokeWidth={1} />
                    </div>
                    <p className="text-slate-500 text-sm max-w-[200px]">
                      Las pruebas generadas aparecerán aquí.
                    </p>
                  </motion.div>
                )}

                {isLoading && (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center gap-4 bg-slate-950/50 backdrop-blur-sm"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center"
                    >
                      <Sparkles size={40} className="text-indigo-400" />
                    </motion.div>
                    <p className="text-indigo-300/60 font-medium text-sm">Analizando solución...</p>
                  </motion.div>
                )}

                {generatedTests && (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full w-full overflow-auto p-4 custom-scrollbar"
                  >
                    <pre className="font-mono text-sm leading-relaxed text-indigo-300 selection:bg-indigo-500/40 selection:text-white">
                      {generatedTests}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center mt-auto">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-colors ${generatedTests ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                <span className="text-xs text-slate-400">
                  {generatedTests ? 'Listo para descargar' : 'Esperando generación'}
                </span>
              </div>
              
              <button 
                onClick={downloadFile}
                disabled={!generatedTests}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                  generatedTests 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Download size={14} />
                Descargar script
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
