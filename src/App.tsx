import React, { useState, useRef, useEffect } from 'react';
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
  Layers,
  Settings,
  Sparkles,
  Eye,
  History,
  Check,
  Code,
  Palette,
  Maximize2,
  Plus,
  RotateCcw,
  Sliders,
  BarChart2,
  Info,
  ExternalLink,
  Minimize2,
  Search
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Standard prompt template provided by the user
const DEFAULT_PROMPT_TEMPLATE = `Actúa como un Ingeniero QA de Software Senior especializado en Python y TDD. Tu objetivo es generar un script de pruebas unitarias extremadamente exhaustivo usando el módulo \`unittest\` para un código fuente que te proporcionaré.

El código que te proporcionaré es la **SOLUCIÓN CORRECTA**. Por lo tanto, todas las pruebas que generes deben pasar con un 100% de éxito y alcanzar un **100% de cobertura de código**. 

### PRIORIDAD ABSOLUTA: SIMPLICIDAD Y FUNCIONALIDAD
Prefiero un test simple, directo y que FUNCIONE, antes que un test complejo que pueda fallar por detalles mínimos de formato. Usa lógica de aserción directa. Asegúrate SIEMPRE de que las pruebas sean compatibles con el código proporcionado.

### REQUISITOS TÉCNICOS Y VOLUMEN (¡OBLIGATORIO!):

1.  **Volumen Crítico:** Debes generar **AL MENOS 40 MÉTODOS DE PRUEBA individuales** (\`test_...\`). Para alcanzar este número sin complicar la lógica, crea variaciones simples de los datos de entrada: casos base, límites (0, vacíos, negativos), tipos inesperados y colecciones grandes.
2.  **Cobertura del 100%:** Analiza cada rama (\`if/elif/else\`), cada bucle y cada bloque \`try/except\` del código. Crea los escenarios específicos para ejecutar todas las líneas.
3.  **Uso de ututils:**
    * Cada test DEBE llevar el decorador \`@ututils.Timeout(ututils.DEF_TEST_TIMEOUT)\`.
    * El módulo de la solución se debe importar asumiendo el nombre del archivo: \`import {module_name} as modsol\`. 
    * El módulo de utilidades se importa como: \`import unittesting_utils as ututils\`.
    * **REGLA DE ORO PARA I/O:** Para capturar la salida de \`print\` o inyectar inputs, usa SIEMPRE el context manager \`ututils.IOCapture\`. Extrae el resultado con \`iocapture.get_stdout_value()\`.
    * **TRATAMIENTO DE EXCEPCIONES:** Si la solución lanza una excepción (ej: \`raise ValueError(...)\`), el test DEBE capturarla con \`with self.assertRaises(modsol.NombreError):\` o el error nativo correspondiente.

### ARQUITECTURA DE LAS PRUEBAS:

1.  **Nomenclatura:** Organiza en clases numeradas (ej: \`Test01010_...\`). Cada test debe llamarse \`test_010_...\`, \`test_020_...\`, etc.
2.  **Docstrings:** Cada test debe tener un docstring indicando sus dependencias. Ejemplo: \`"""Deps: funcion_x | caso limite"""\`.
3.  **Inmutabilidad:** En funciones que reciban colecciones, usa \`copy.deepcopy(datos)\` antes de llamar a la función y verifica con \`self.assertEqual\` que la función no ha modificado los datos originales.

### PATRONES DE I/O Y MAIN (SIMPLIFICADOS Y ROBUSTOS):

Para leer entradas o verificar prints, usa una estructura directa. Si la salida esperada es compleja o impredecible en sus saltos de línea, prefiere comprobar subcadenas clave con \`assertIn\` para garantizar que el test funcione.

**Ejemplo para validación estándar / main():**
\`\`\`python
    @ututils.Timeout(ututils.DEF_TEST_TIMEOUT)
    def test_030_main_ejecucion_basica(self):
        """Deps: main()"""
        # Inyectamos todos los inputs necesarios seguidos de varios saltos de línea por seguridad
        texto_entrada = "input1\\ninput2\\n\\n\\n\\n" 
        
        with ututils.IOCapture(texto_entrada) as iocapture:
            modsol.main()
            
        salida_pantalla = iocapture.get_stdout_value()
        salida_esperada = "El resultado exacto esperado"
        
        # Opción A (Prioritaria): Comparación exacta si estás 100% seguro de la salida
        self.assertEqual(salida_pantalla, salida_esperada, 
                         msg=ututils.crear_mensaje_error(salida_pantalla, salida_esperada, str2repr=False))
        
        # Opción B (Fallback de seguridad): Si el string es muy complejo, verifica la presencia de datos clave
        # self.assertIn("resultado clave", salida_pantalla)
\`\`\`

### CONTEXTO DEL EJERCICIO:

Descripción: {description}

{base_class_context}

CÓDIGO DE LA SOLUCIÓN CORRECTA:
\`\`\`python
{solution_code}
\`\`\`

Genera el script de pruebas completo (mínimo 40 tests) que garantice el 100% de éxito y cobertura. 

INSTRUCCIONES DE FORMATO FINAL:
1. Devuelve ÚNICAMENTE el código en Python, sin explicaciones, sin introducciones y sin markdown fuera del bloque de código.
2. El archivo debe terminar EXACTAMENTE con:
\`\`\`python
if __name__ == "__main__":
    unittest.main(module=__name__, verbosity=2)
\`\`\`
`;

interface CustomVar {
  key: string;
  value: string;
}

interface ParsedClass {
  name: string;
  inherits: string;
  line: number;
}

interface ParsedMethod {
  name: string;
  docstring: string;
  line: number;
}

interface TestAnalytics {
  classes: ParsedClass[];
  methods: ParsedMethod[];
  hasTimeout: boolean;
  hasIOCapture: boolean;
  hasDeepcopy: boolean;
  hasAssertRaises: boolean;
}

interface SavedSession {
  id: string;
  timestamp: string;
  sessionName: string;
  description: string;
  solutionCode: string;
  baseClassCode: string;
  baseFileName?: string | null;
  baseFiles?: { name: string; content: string; size: string }[];
  promptTemplate: string;
  fileName: string;
  customVars: CustomVar[];
  generatedTests: string;
}

// Synced vertical line gutter code editor layout (HIGH FIDELITY!)
interface IDEEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  className?: string;
  isMono?: boolean;
}

function IDEEditor({ value, onChange, placeholder, className = "h-[250px]", isMono = true }: IDEEditorProps) {
  const lineCount = value.split('\n').length || 1;
  const linesArr = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);
  const gutterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className={`relative flex border border-slate-800 bg-[#02050b]/95 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#6366f1]/25 focus-within:border-[#6366f1]/60 transition-all ${className}`}>
      {/* Line Numbers Gutter */}
      <div 
        ref={gutterRef}
        className="w-10 select-none bg-[#050912] text-right pr-2.5 py-4 text-[10px] font-mono text-slate-600 border-r border-slate-900/60 overflow-hidden leading-relaxed shrink-0 CustomScrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {linesArr.map(num => (
          <div key={num} className="h-5 flex items-center justify-end">{num}</div>
        ))}
      </div>
      
      {/* Editor Content Area */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder={placeholder}
        className={`flex-1 bg-transparent px-4 py-4 text-xs ${isMono ? 'font-mono text-slate-200' : 'font-sans text-slate-300'} outline-none resize-none leading-relaxed overflow-auto CustomScrollbar h-full placeholder:text-slate-800`}
      />
    </div>
  );
}

// Basic syntax helper highlighting keywords in CSS styled lines
function highlightPython(code: string): React.ReactNode[] {
  if (!code) return [];
  const lines = code.split('\n');
  return lines.map((line, idx) => {
    const elements: React.ReactNode[] = [];
    const keywords = /\b(def|class|import|from|as|return|if|else|elif|with|self|try|except|raise|pass|in|is|not|and|or|for|while|typing|NamedTuple|Protocol)\b/g;
    const comments = /(#.*)$/g;
    const strings = /("[^"]*"|'[^']*')/g;

    const commentMatch = line.match(comments);
    if (commentMatch) {
      const commentIndex = line.indexOf(commentMatch[0]);
      const beforeComment = line.substring(0, commentIndex);
      elements.push(<span key="b_cmt">{beforeComment}</span>);
      elements.push(<span key="cmt" className="text-emerald-500 italic">{commentMatch[0]}</span>);
    } else {
      const tokens = line.split(/(\s+)/);
      tokens.forEach((token, tokenIdx) => {
        if (token.match(keywords)) {
          elements.push(<span key={tokenIdx} className="text-pink-400 font-bold">{token}</span>);
        } else if (token.startsWith('@')) {
          elements.push(<span key={tokenIdx} className="text-yellow-400 font-semibold">{token}</span>);
        } else if (token.match(strings)) {
          elements.push(<span key={tokenIdx} className="text-amber-300">{token}</span>);
        } else if (token.includes('self.')) {
          const parts = token.split('self.');
          elements.push(<span key={tokenIdx}>
            <span>{parts[0]}</span>
            <span className="text-cyan-400">self</span>
            <span>.</span>
            <span className="text-indigo-200">{parts.slice(1).join('self.')}</span>
          </span>);
        } else if (token.match(/\b\d+\b/)) {
          elements.push(<span key={tokenIdx} className="text-purple-400">{token}</span>);
        } else {
          elements.push(<span key={tokenIdx}>{token}</span>);
        }
      });
    }

    return (
      <div key={idx} className="hover:bg-slate-800/40 px-4 py-0.5 rounded transition-colors flex font-mono text-xs leading-relaxed">
        <span className="w-8 shrink-0 text-slate-600 text-right select-none pr-3 border-r border-slate-800/80 mr-3">{idx + 1}</span>
        <span className="whitespace-pre overflow-x-auto">{elements}</span>
      </div>
    );
  });
}

// Parser to extract TDD architecture statistics dynamically
function parseGeneratedTests(code: string): TestAnalytics {
  const classes: ParsedClass[] = [];
  const methods: ParsedMethod[] = [];
  
  if (!code) {
    return { classes, methods, hasTimeout: false, hasIOCapture: false, hasDeepcopy: false, hasAssertRaises: false };
  }

  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const classMatch = lines[i].match(/^\s*class\s+(\w+)\s*(?:\(([^)]+)\))?:/);
    if (classMatch) {
      classes.push({
        name: classMatch[1],
        inherits: classMatch[2] || 'object',
        line: i + 1
      });
    }
    const methodMatch = lines[i].match(/^\s*def\s+(test_\w+)\s*\((self[^)]*)\):/);
    if (methodMatch) {
      let docstring = "";
      for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
        const docMatch = lines[j].match(/^\s*("""|'''|'|")\s*([\s\S]+?)\s*\1/);
        const rawDocMatch = lines[j].match(/^\s*("""|''')\s*([\s\S]*)$/);
        if (docMatch) {
          docstring = docMatch[2].trim();
          break;
        } else if (rawDocMatch) {
          let acc = rawDocMatch[2];
          for (let k = j + 1; k < Math.min(j + 6, lines.length); k++) {
            if (lines[k].includes('"""') || lines[k].includes("'''")) {
              acc += " " + lines[k].replace(/"""|'''/g, "").trim();
              break;
            }
            acc += " " + lines[k].trim();
          }
          docstring = acc.trim();
          break;
        }
      }
      methods.push({
        name: methodMatch[1],
        docstring: docstring || "Sin docstring especificado",
        line: i + 1
      });
    }
  }

  const hasTimeout = code.includes('Timeout(') || code.includes('Timeout');
  const hasIOCapture = code.includes('IOCapture(') || code.includes('IOCapture');
  const hasDeepcopy = code.includes('copy.deepcopy(') || code.includes('deepcopy');
  const hasAssertRaises = code.includes('assertRaises(');

  return { classes, methods, hasTimeout, hasIOCapture, hasDeepcopy, hasAssertRaises };
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  
  // Custom workspace parameters & template
  const [description, setDescription] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [baseFiles, setBaseFiles] = useState<{ name: string; content: string; size: string }[]>([]);
  const [activeBaseFileIdx, setActiveBaseFileIdx] = useState(0);
  const [promptTemplate, setPromptTemplate] = useState(DEFAULT_PROMPT_TEMPLATE);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // Drag & drop state managers
  const [isDraggingSolution, setIsDraggingSolution] = useState(false);
  const [isDraggingBase, setIsDraggingBase] = useState(false);
  const [solutionFileSize, setSolutionFileSize] = useState<string | null>(null);

  // Custom Prompt Variables state
  const [customVars, setCustomVars] = useState<CustomVar[]>([
    { key: 'min_tests', value: '40' }
  ]);
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarVal, setNewVarVal] = useState('');
  
  // Model hyperparameters
  const [modelChoice, setModelChoice] = useState<'gemini-2.5-flash' | 'gemini-2.5-pro'>('gemini-2.5-flash');
  const [temperature, setTemperature] = useState(0.1);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);
  
  // Generation & error states
  const [generatedTests, setGeneratedTests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI Tabs & settings
  const [activeInputTab, setActiveInputTab] = useState<'desc' | 'solution' | 'base' | 'prompt' | 'vars'>('desc');
  const [activeOutputTab, setActiveOutputTab] = useState<'tests' | 'analytics' | 'history'>('tests');
  const [activeTheme, setActiveTheme] = useState<'nebula' | 'cyberpunk' | 'crimson' | 'oceanic'>('nebula');
  
  // Maximize panel view state (IDE-mode)
  const [maximizedPanel, setMaximizedPanel] = useState<'none' | 'inputs' | 'outputs'>('none');
  
  // Toggle for dynamic prompt preview
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  // Search filter for tests list directory
  const [searchQuery, setSearchQuery] = useState('');
  
  // Persistent localStorage History Snapshots
  const [history, setHistory] = useState<SavedSession[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseFileInputRef = useRef<HTMLInputElement>(null);

  // Load persistence configurations
  useEffect(() => {
    try {
      const saved = localStorage.getItem('benjutester_v2_sessions');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveSessionSnapshot = (testCode: string) => {
    const sessionName = fileName ? fileName : 'solucion.py';
    const newSession: SavedSession = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleString(),
      sessionName,
      description,
      solutionCode,
      baseClassCode: baseFiles[0]?.content || '',
      baseFileName: baseFiles[0]?.name || null,
      baseFiles: baseFiles,
      promptTemplate,
      fileName: sessionName,
      customVars,
      generatedTests: testCode
    };

    const updated = [newSession, ...history.slice(0, 19)];
    setHistory(updated);
    try {
      localStorage.setItem('benjutester_v2_sessions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(s => s.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem('benjutester_v2_sessions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const loadSession = (s: SavedSession) => {
    setDescription(s.description || '');
    setSolutionCode(s.solutionCode || '');
    if (s.baseFiles && s.baseFiles.length > 0) {
      setBaseFiles(s.baseFiles);
    } else if (s.baseClassCode) {
      setBaseFiles([{
        name: s.baseFileName || 'clase_base.py',
        content: s.baseClassCode,
        size: ''
      }]);
    } else {
      setBaseFiles([]);
    }
    setActiveBaseFileIdx(0);
    setPromptTemplate(s.promptTemplate || DEFAULT_PROMPT_TEMPLATE);
    setFileName(s.fileName);
    setCustomVars(s.customVars || []);
    setGeneratedTests(s.generatedTests || '');
    setActiveOutputTab('tests');
    setError(null);
  };

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
    setBaseFiles([]);
    setActiveBaseFileIdx(0);
    setFileName(null);
    setSolutionFileSize(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isBase: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.py')) {
      setError('Sube un archivo Python .py válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const sizeStr = (file.size / 1024).toFixed(1) + " KB";
      if (isBase) {
        if (baseFiles.length >= 2) {
          setError('Se permite subir un máximo de 2 archivos base.');
          return;
        }
        const updated = [...baseFiles, { name: file.name, content, size: sizeStr }];
        setBaseFiles(updated);
        setActiveBaseFileIdx(updated.length - 1);
      } else {
        setSolutionCode(content);
        setFileName(file.name);
        setSolutionFileSize(sizeStr);
      }
      setError(null);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Drag & drop event triggers
  const handleDragOver = (e: React.DragEvent, isBase: boolean) => {
    e.preventDefault();
    if (isBase) {
      setIsDraggingBase(true);
    } else {
      setIsDraggingSolution(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent, isBase: boolean) => {
    e.preventDefault();
    if (isBase) {
      setIsDraggingBase(false);
    } else {
      setIsDraggingSolution(false);
    }
  };

  const handleDrop = (e: React.DragEvent, isBase: boolean) => {
    e.preventDefault();
    if (isBase) {
      setIsDraggingBase(false);
    } else {
      setIsDraggingSolution(false);
    }

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.py')) {
      setError('Sube un archivo Python .py de solución válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const sizeStr = (file.size / 1024).toFixed(1) + " KB";
      if (isBase) {
        if (baseFiles.length >= 2) {
          setError('Se permite subir un máximo de 2 archivos base.');
          return;
        }
        const updated = [...baseFiles, { name: file.name, content, size: sizeStr }];
        setBaseFiles(updated);
        setActiveBaseFileIdx(updated.length - 1);
      } else {
        setSolutionCode(content);
        setFileName(file.name);
        setSolutionFileSize(sizeStr);
      }
      setError(null);
    };
    reader.readAsText(file);
  };

  const addCustomVar = () => {
    if (!newVarKey.trim()) return;
    const key = newVarKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (customVars.some(v => v.key === key)) {
      setError('La variable ya existe');
      return;
    }
    setCustomVars([...customVars, { key, value: newVarVal }]);
    setNewVarKey('');
    setNewVarVal('');
    setError(null);
  };

  const removeCustomVar = (key: string) => {
    setCustomVars(customVars.filter(v => v.key !== key));
  };

  const resolvedPrompt = () => {
    let text = promptTemplate;
    const moduleName = fileName ? fileName.replace('.py', '') : 'solucion';
    const baseClassContext = baseFiles.length > 0 
      ? `CÓDIGO DE LAS CLASES BASE O CONTEXTO ADICIONAL:\n` + baseFiles.map((bf, idx) => `--- ARCHIVO ${idx + 1}: ${bf.name} ---\n\`\`\`python\n${bf.content}\n\`\`\``).join('\n\n')
      : "";

    text = text.replace(/{description}/g, description || '');
    text = text.replace(/{solution_code}/g, solutionCode || '');
    text = text.replace(/{base_class_context}/g, baseClassContext || '');
    text = text.replace(/{module_name}/g, moduleName);

    customVars.forEach(v => {
      if (v.key) {
        const regex = new RegExp(`{${v.key}}`, 'g');
        text = text.replace(regex, v.value || '');
      }
    });

    return text;
  };

  const handleGenerateTests = async () => {
    if (!description || !solutionCode) {
      setError('Por favor, ingresa la descripción del ejercicio y la solución correcta en Python.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = resolvedPrompt();

      const response = await ai.models.generateContent({
        model: modelChoice,
        contents: prompt,
        config: {
          temperature: temperature,
          topP: topP,
          topK: topK,
        }
      });

      let text = response.text || '';
      
      text = text.replace(/^```python[\s\S]*?\n/, '');
      text = text.replace(/\n```$/, '');
      text = text.trim();
      
      setGeneratedTests(text);
      saveSessionSnapshot(text);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('quota')) {
        setError('Límite de cuota excedido de la API de Gemini. Espera un minuto e inténtalo de nuevo.');
      } else {
        setError('Error al generar las pruebas unitarias. Verifica tu conexión o API Key.');
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

  const analytics = parseGeneratedTests(generatedTests);

  const filteredMethods = analytics.methods.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.docstring.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const themes = {
    nebula: {
      primary: "from-[#a855f7] via-[#6366f1] to-[#3b82f6]",
      glowColor: "shadow-purple-500/25",
      accentText: "text-purple-400",
      borderAccent: "border-purple-500/30",
      bgAccent: "bg-purple-500/10",
      activeTab: "bg-purple-600/30 border-purple-500/30 text-purple-200",
      badge: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
      glowBg: "bg-purple-500 animate-pulse"
    },
    cyberpunk: {
      primary: "from-[#10b981] via-[#14b8a6] to-[#06b6d4]",
      glowColor: "shadow-emerald-500/25",
      accentText: "text-emerald-400",
      borderAccent: "border-emerald-500/30",
      bgAccent: "bg-emerald-500/10",
      activeTab: "bg-emerald-600/30 border-emerald-500/30 text-emerald-200",
      badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      glowBg: "bg-emerald-500 animate-pulse"
    },
    crimson: {
      primary: "from-[#f43f5e] via-[#f97316] to-[#eab308]",
      glowColor: "shadow-rose-500/25",
      accentText: "text-rose-400",
      borderAccent: "border-rose-500/30",
      bgAccent: "bg-rose-500/10",
      activeTab: "bg-rose-600/30 border-rose-500/30 text-rose-200",
      badge: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
      glowBg: "bg-rose-500 animate-pulse"
    },
    oceanic: {
      primary: "from-[#06b6d4] via-[#3b82f6] to-[#6366f1]",
      glowColor: "shadow-cyan-500/25",
      accentText: "text-cyan-400",
      borderAccent: "border-cyan-500/30",
      bgAccent: "bg-cyan-500/10",
      activeTab: "bg-cyan-600/30 border-cyan-500/30 text-cyan-200",
      badge: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
      glowBg: "bg-cyan-500 animate-pulse"
    }
  };

  const themeConfig = themes[activeTheme];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#020408] flex items-center justify-center p-4 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
        {/* Dynamic theme background radial glow */}
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="relative overflow-hidden bg-slate-950/40 backdrop-blur-3xl border border-white/5 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500`} />
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-bl from-white/20 to-transparent"></div>
                <Terminal className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black text-white mt-4 tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Benjutester V2</h1>
              <p className="text-slate-500 text-[10px] tracking-widest uppercase font-bold">TDD Custom Generation System</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contraseña</label>
                  <span className="text-[9px] text-slate-600 font-mono">Default: tester123</span>
                </div>
                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#02050b] border border-slate-800 text-white px-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none transition-all placeholder:text-slate-700 font-mono text-center tracking-widest text-lg"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-650 group-focus-within:text-purple-400 transition-colors">
                    <LogIn className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-purple-650/25 tracking-wide text-sm"
              >
                Ingresar al Workspace
              </button>
            </form>

            {error && (
              <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/10 p-3.5 rounded-2xl border border-rose-500/25 text-xs animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="pt-4 border-t border-slate-900 flex flex-col space-y-3">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">⚙️ Engine Status</h3>
              <div className="flex items-center justify-between p-3.5 bg-[#02050b]/60 rounded-2xl border border-slate-900">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Gemini models configured</p>
                    <p className="text-[10px] text-slate-500">API key active</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                   <p className="text-[9px] font-mono text-slate-400 font-bold">V 2.0.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 font-sans selection:bg-[#6366f1]/30 overflow-x-hidden relative pb-12">
      {/* Floating dynamic backdrop glow lights */}
      <div className={`absolute top-0 right-1/4 w-[650px] h-[650px] rounded-full blur-[140px] opacity-[0.06] pointer-events-none transition-all duration-1000 ${themeConfig.glowBg}`} />
      <div className={`absolute bottom-0 left-1/4 w-[650px] h-[650px] rounded-full blur-[140px] opacity-[0.04] pointer-events-none transition-all duration-1000 ${themeConfig.glowBg}`} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#020408]/80 backdrop-blur-xl border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 animate-in fade-in slide-in-from-left-4">
            <div className={`bg-gradient-to-tr ${themeConfig.primary} p-2.5 rounded-xl shadow-lg ${themeConfig.glowColor}`}>
              <Terminal className="text-white w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-white tracking-tight">🧪 Benjutester</h1>
                <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest ${themeConfig.badge}`}>
                  v2.0 PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">TDD Custom Generation System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-5">
            {/* Multi-theme Selector */}
            <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-900 gap-2">
              <button 
                onClick={() => setActiveTheme('nebula')}
                className={`w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 border border-purple-400/20 flex items-center justify-center transition-all ${activeTheme === 'nebula' ? 'scale-115 ring-2 ring-purple-500/30' : 'opacity-40 hover:opacity-100'}`}
                title="Cosmic Nebula (Purple)"
              >
                {activeTheme === 'nebula' && <Check className="w-3 h-3 text-white" />}
              </button>
              <button 
                onClick={() => setActiveTheme('cyberpunk')}
                className={`w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 border border-emerald-400/20 flex items-center justify-center transition-all ${activeTheme === 'cyberpunk' ? 'scale-115 ring-2 ring-emerald-500/30' : 'opacity-40 hover:opacity-100'}`}
                title="Hacker Cyberpunk (Green)"
              >
                {activeTheme === 'cyberpunk' && <Check className="w-3 h-3 text-white" />}
              </button>
              <button 
                onClick={() => setActiveTheme('crimson')}
                className={`w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-500 to-orange-500 border border-rose-400/20 flex items-center justify-center transition-all ${activeTheme === 'crimson' ? 'scale-115 ring-2 ring-rose-500/30' : 'opacity-40 hover:opacity-100'}`}
                title="Sunfire Crimson (Red)"
              >
                {activeTheme === 'crimson' && <Check className="w-3 h-3 text-white" />}
              </button>
              <button 
                onClick={() => setActiveTheme('oceanic')}
                className={`w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 border border-cyan-400/20 flex items-center justify-center transition-all ${activeTheme === 'oceanic' ? 'scale-115 ring-2 ring-cyan-500/30' : 'opacity-40 hover:opacity-100'}`}
                title="Oceanic Sapphire (Blue)"
              >
                {activeTheme === 'oceanic' && <Check className="w-3 h-3 text-white" />}
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-slate-400 hover:text-white bg-slate-955/60 hover:bg-slate-900 border border-slate-900 px-3.5 py-2 rounded-xl transition-all active:scale-95 text-xs font-bold"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Config Workspace */}
        <div className={`space-y-6 duration-300 transition-all ${maximizedPanel === 'inputs' ? 'lg:col-span-12' : maximizedPanel === 'outputs' ? 'hidden' : 'lg:col-span-5'}`}>
          <div className="relative overflow-hidden bg-slate-950/35 border border-white/5 rounded-3xl p-6 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${themeConfig.primary}`} />
            
            {/* Header controls for Inputs */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <div className="flex items-center space-x-2">
                <Code className={`w-4.5 h-4.5 ${themeConfig.accentText}`} />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                  Workspace de Configuración
                </h3>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setDescription('');
                    setSolutionCode('');
                    setBaseFiles([]);
                    setActiveBaseFileIdx(0);
                    setFileName(null);
                    setPromptTemplate(DEFAULT_PROMPT_TEMPLATE);
                    setCustomVars([{ key: 'min_tests', value: '40' }]);
                    setError(null);
                  }}
                  className="text-[10px] text-slate-500 hover:text-rose-400 font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                  title="Reiniciar todo el espacio de trabajo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  onClick={() => setMaximizedPanel(maximizedPanel === 'inputs' ? 'none' : 'inputs')}
                  className="text-slate-500 hover:text-white transition-colors"
                  title={maximizedPanel === 'inputs' ? 'Restaurar tamaño' : 'Maximizar panel'}
                >
                  {maximizedPanel === 'inputs' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Input Selection Tabs */}
            <div className="flex bg-[#02050b] p-1.5 rounded-2xl border border-slate-900 gap-1 text-[11px] font-extrabold scrollbar-none overflow-x-auto">
              <button
                onClick={() => setActiveInputTab('desc')}
                className={`flex-1 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${activeInputTab === 'desc' ? themeConfig.activeTab : 'text-slate-500 hover:text-slate-400'}`}
              >
                <FileText className="w-3.5 h-3.5" />
                Descripción
              </button>
              
              <button
                onClick={() => setActiveInputTab('solution')}
                className={`flex-1 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${activeInputTab === 'solution' ? themeConfig.activeTab : 'text-slate-500 hover:text-slate-400'}`}
              >
                <FileCode className="w-3.5 h-3.5" />
                Solución {fileName && <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded text-emerald-400 font-mono">.py</span>}
              </button>

              <button
                onClick={() => setActiveInputTab('base')}
                className={`flex-1 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${activeInputTab === 'base' ? themeConfig.activeTab : 'text-slate-500 hover:text-slate-400'}`}
              >
                <Layers className="w-3.5 h-3.5" />
                Contexto Base
              </button>

              <button
                onClick={() => setActiveInputTab('prompt')}
                className={`flex-1 py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${activeInputTab === 'prompt' ? themeConfig.activeTab : 'text-slate-500 hover:text-slate-400'}`}
              >
                <Settings className="w-3.5 h-3.5" />
                Plantilla Prompt
              </button>

              <button
                onClick={() => setActiveInputTab('vars')}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-all ${activeInputTab === 'vars' ? themeConfig.activeTab : 'text-slate-500 hover:text-slate-400'}`}
                title="Variables del Prompt"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* DESCRIPTION TAB */}
            {activeInputTab === 'desc' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-455 font-bold uppercase tracking-wider">1. Describe la consigna o descripción del ejercicio:</span>
                </div>
                <IDEEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Ej: Clase Jarra que gestiona una cantidad y capacidad de agua. El constructor valida datos..."
                  className="h-[240px]"
                  isMono={false}
                />
              </div>
            )}

            {/* SOLUTION CODE TAB (DRAG & DROP INTEGRATION) */}
            {activeInputTab === 'solution' && (
              <div 
                className="space-y-3 animate-in fade-in duration-200 relative"
                onDragOver={(e) => handleDragOver(e, false)}
                onDragLeave={(e) => handleDragLeave(e, false)}
                onDrop={(e) => handleDrop(e, false)}
              >
                {/* Drag and Drop Frost Overlay */}
                {isDraggingSolution && (
                  <div className="absolute inset-0 bg-[#02050b]/90 backdrop-blur-md border-2 border-dashed border-[#818cf8]/50 rounded-2xl z-30 flex flex-col items-center justify-center space-y-3 pointer-events-none animate-in zoom-in-95 duration-200">
                    <div className="bg-purple-500/10 p-4 rounded-full border border-purple-500/30 animate-bounce">
                      <Upload className="w-8 h-8 text-purple-405" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black uppercase text-white tracking-widest">Soltar archivo aquí</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold">Cargar script solución de Python (.py)</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-455 font-bold uppercase tracking-wider">2. Solución correcta en Python:</span>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`text-[11px] ${themeConfig.accentText} hover:underline font-bold flex items-center gap-1`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Buscar Script
                  </button>
                </div>
                
                {/* Visual File Snapshot Card */}
                {fileName ? (
                  <div className="flex items-center justify-between bg-[#02050b]/60 border border-slate-850 p-4 rounded-2xl relative group">
                    <div className="flex items-center space-x-3.5">
                      <div className="bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20 text-purple-400">
                        <FileCode className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white font-mono">{fileName}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 font-semibold">
                          <span>{solutionFileSize || 'Calculando...'}</span>
                          <span>•</span>
                          <span>{solutionCode.split('\n').length} líneas</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSolutionCode('');
                        setFileName(null);
                        setSolutionFileSize(null);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-2 hover:bg-rose-500/10 rounded-xl transition-all"
                      title="Eliminar archivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Drag and Drop Zone Placeholder */
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-850 hover:border-purple-500/35 bg-[#02050b]/40 hover:bg-[#030814]/80 p-8 rounded-2xl flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all group shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]"
                  >
                    <div className="bg-slate-900 border border-slate-850 p-3 rounded-xl group-hover:scale-105 transition-transform text-slate-500 group-hover:text-purple-400 shadow-md">
                      <Upload className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-350 uppercase tracking-widest">Arrastra tu archivo .py aquí</p>
                      <p className="text-[10px] text-slate-600 mt-1 font-semibold">o haz clic para explorar tu ordenador</p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e, false)}
                  accept=".py"
                  className="hidden"
                />
                
                {solutionCode && (
                  <div className="space-y-2 pt-1 animate-in fade-in duration-300">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Vista de Código / Edición rápida</p>
                    <IDEEditor
                      value={solutionCode}
                      onChange={setSolutionCode}
                      placeholder="Código de la solución..."
                      className="h-[180px]"
                      isMono={true}
                    />
                  </div>
                )}
              </div>
            )}

            {/* BASE CLASS TAB (DRAG & DROP INTEGRATION) */}
            {activeInputTab === 'base' && (
              <div 
                className="space-y-4 animate-in fade-in duration-200 relative"
                onDragOver={(e) => handleDragOver(e, true)}
                onDragLeave={(e) => handleDragLeave(e, true)}
                onDrop={(e) => handleDrop(e, true)}
              >
                {/* Drag and Drop Frost Overlay */}
                {isDraggingBase && (
                  <div className="absolute inset-0 bg-[#02050b]/90 backdrop-blur-md border-2 border-dashed border-[#818cf8]/50 rounded-2xl z-30 flex flex-col items-center justify-center space-y-3 pointer-events-none animate-in zoom-in-95 duration-200">
                    <div className="bg-indigo-500/10 p-4 rounded-full border border-indigo-500/30 animate-bounce">
                      <Upload className="w-8 h-8 text-indigo-405" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black uppercase text-white tracking-widest">Soltar archivo aquí</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold">Cargar clase base / contexto (.py)</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-455 font-bold uppercase tracking-wider">3. Contexto base o clases base (Hasta 2 archivos):</span>
                  {baseFiles.length < 2 && (
                    <button 
                      onClick={() => baseFileInputRef.current?.click()}
                      className={`text-[11px] ${themeConfig.accentText} hover:underline font-bold flex items-center gap-1`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Añadir Script ({baseFiles.length}/2)
                    </button>
                  )}
                </div>

                {/* List of uploaded Base Files */}
                {baseFiles.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {baseFiles.map((bf, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setActiveBaseFileIdx(idx)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl relative cursor-pointer border transition-all ${
                          activeBaseFileIdx === idx 
                            ? 'bg-[#060b13] border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30' 
                            : 'bg-[#02050b]/60 border-slate-855 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-xl text-indigo-400 ${activeBaseFileIdx === idx ? 'bg-indigo-500/20' : 'bg-[#02050b]'}`}>
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-white font-mono break-all">{bf.name}</p>
                            <p className="text-[9px] text-slate-500 mt-0.5 font-semibold">
                              {bf.size} • {bf.content.split('\n').length} líneas
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = baseFiles.filter((_, i) => i !== idx);
                            setBaseFiles(updated);
                            setActiveBaseFileIdx(Math.max(0, idx - 1));
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-xl transition-all"
                          title="Eliminar archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Drag and Drop Zone Placeholder for additional files */}
                {baseFiles.length < 2 && (
                  <div 
                    onClick={() => baseFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-855 hover:border-[#6366f1]/35 bg-[#02050b]/40 hover:bg-[#030814]/80 p-6 rounded-2xl flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all group shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]"
                  >
                    <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl group-hover:scale-105 transition-transform text-slate-500 group-hover:text-indigo-400 shadow-md">
                      <Upload className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-350 uppercase tracking-widest">Arrastra tu archivo base aquí</p>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-semibold">o haz clic para explorar (.py)</p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={baseFileInputRef}
                  onChange={(e) => handleFileUpload(e, true)}
                  accept=".py"
                  className="hidden"
                />
                
                {baseFiles[activeBaseFileIdx] && (
                  <div className="space-y-2 pt-1 animate-in fade-in duration-300">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      Vista de Código / Edición rápida: <span className="font-mono text-indigo-400">{baseFiles[activeBaseFileIdx].name}</span>
                    </p>
                    <IDEEditor
                      value={baseFiles[activeBaseFileIdx].content}
                      onChange={(newVal) => {
                        const updated = [...baseFiles];
                        updated[activeBaseFileIdx].content = newVal;
                        setBaseFiles(updated);
                      }}
                      placeholder="Código base..."
                      className="h-[180px]"
                      isMono={true}
                    />
                  </div>
                )}
              </div>
            )}

            {/* SYSTEM PROMPT TEMPLATE TAB (HIGH CUSTOMIZABILITY) */}
            {activeInputTab === 'prompt' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-455 font-bold uppercase tracking-wider">Modifica la estructura del Prompt del sistema:</span>
                  <button 
                    onClick={() => setPromptTemplate(DEFAULT_PROMPT_TEMPLATE)}
                    className="text-[11px] text-slate-500 hover:text-indigo-400 font-bold flex items-center gap-1"
                    title="Restaurar plantilla predeterminada"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Predeterminado
                  </button>
                </div>
                
                <div className="text-[10px] text-slate-400 p-3 bg-slate-955/80 rounded-xl leading-relaxed flex flex-col gap-1 border border-slate-900">
                  <span className="font-extrabold text-slate-450 uppercase tracking-widest flex items-center gap-1"><Info className="w-3.5 h-3.5 text-[#6366f1]" /> Marcadores Dinámicos:</span>
                  <span className="text-slate-500 leading-normal">Use <code className="bg-slate-900 border border-slate-800 px-1 rounded text-pink-400">&#123;description&#125;</code>, <code className="bg-slate-900 border border-slate-800 px-1 rounded text-pink-400">&#123;solution_code&#125;</code>, <code className="bg-slate-900 border border-slate-800 px-1 rounded text-pink-400">&#123;base_class_context&#125;</code> y <code className="bg-slate-900 border border-slate-800 px-1 rounded text-pink-400">&#123;module_name&#125;</code> en el prompt.</span>
                </div>
                
                <IDEEditor
                  value={promptTemplate}
                  onChange={setPromptTemplate}
                  placeholder="Escribe la plantilla del prompt aquí..."
                  className="h-[240px]"
                  isMono={true}
                />
              </div>
            )}

            {/* CUSTOM VARIABLES & HYPERPARAMETERS TAB */}
            {activeInputTab === 'vars' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-455 uppercase tracking-widest flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    Hiperparámetros de Gemini
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Modelo AI</label>
                      <select 
                        value={modelChoice} 
                        onChange={(e) => setModelChoice(e.target.value as any)}
                        className="w-full bg-[#02050b] border border-slate-850 text-xs text-white p-3 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all cursor-pointer font-bold"
                      >
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                      </select>
                    </div>

                    <div className="bg-[#02050b] border border-slate-855 p-3.5 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Temperatura</label>
                        <span className="font-mono text-xs text-purple-400 font-bold">{temperature}</span>
                      </div>
                      <input 
                        type="range" min="0" max="1" step="0.05" value={temperature} 
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500 mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-slate-455 uppercase tracking-widest flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-purple-400" />
                      Variables Personalizadas
                    </h4>
                    <span className="text-[9px] text-slate-650 font-bold uppercase tracking-wider">Dynamic placeholders</span>
                  </div>

                  <div className="flex gap-2.5 bg-[#02050b] border border-slate-855 p-2 rounded-xl">
                    <input 
                      type="text" placeholder="Variable (ej: docente)" value={newVarKey}
                      onChange={(e) => setNewVarKey(e.target.value)}
                      className="flex-1 bg-[#010307] border border-slate-850 text-xs px-3.5 py-2.5 rounded-lg text-white outline-none focus:border-purple-500 transition-colors font-mono"
                    />
                    <input 
                      type="text" placeholder="Valor" value={newVarVal}
                      onChange={(e) => setNewVarVal(e.target.value)}
                      className="flex-1 bg-[#010307] border border-slate-850 text-xs px-3.5 py-2.5 rounded-lg text-white outline-none focus:border-purple-500 transition-colors"
                    />
                    <button 
                      onClick={addCustomVar}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2.5 rounded-lg active:scale-95 transition-all flex items-center justify-center shrink-0 font-bold text-xs"
                      title="Agregar variable"
                    >
                      Sumar
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1 max-h-[140px] overflow-y-auto CustomScrollbar pr-1">
                    {customVars.map((v, i) => (
                      <div key={i} className="flex items-center gap-2 bg-[#02050b] border border-slate-850 px-3 py-1.5 rounded-full text-xs hover:border-purple-500/30 transition-colors group">
                        <span className="font-mono text-pink-400 font-bold">&#123;{v.key}&#125;</span>
                        <span className="text-slate-400 max-w-[120px] truncate text-[11px]">{v.value}</span>
                        <button 
                          onClick={() => removeCustomVar(v.key)}
                          className="text-slate-500 hover:text-rose-455 text-xs font-bold leading-none shrink-0"
                          title="Eliminar variable"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Execute generation action */}
            <div className="pt-3 border-t border-slate-905 space-y-3">
              <button
                onClick={handleGenerateTests}
                disabled={isLoading || !description || !solutionCode}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all active:scale-[0.98] ${
                  isLoading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : `bg-gradient-to-r ${themeConfig.primary} text-white shadow-xl ${themeConfig.glowColor}`
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Ejecutar Generación TDD</span>
                  </>
                )}
              </button>

              {/* Toggle Live Prompt Preview */}
              <div className="flex bg-[#02050b] p-1 rounded-xl border border-slate-900 text-[10px] font-bold tracking-widest text-slate-550">
                <button
                  onClick={() => setShowPromptPreview(!showPromptPreview)}
                  className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${showPromptPreview ? 'bg-slate-900 text-white' : 'hover:bg-slate-900/60'}`}
                >
                  <Eye className="w-4 h-4 text-indigo-400" />
                  {showPromptPreview ? 'Ocultar Preview del Prompt' : 'Ver Prompt a Enviar'}
                </button>
              </div>
            </div>

            {/* Live Prompt Preview Modal/Segment */}
            {showPromptPreview && (
              <div className="p-4 bg-[#050b16]/75 border border-indigo-500/20 rounded-2xl space-y-2.5 animate-in slide-in-from-top-3 duration-300">
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Prompt Procesado (Dinámico)
                  </h4>
                  <span className="text-[8px] text-slate-600 font-mono">Dynamic Compile</span>
                </div>
                <pre className="text-[9px] font-mono bg-[#02050b] p-3.5 rounded-xl max-h-[200px] overflow-y-auto CustomScrollbar text-slate-400 whitespace-pre-wrap leading-relaxed select-all">
                  {resolvedPrompt()}
                </pre>
              </div>
            )}

            {error && (
              <div className="flex items-center space-x-3 text-rose-400 bg-rose-500/10 p-4 rounded-2xl border border-rose-500/25 text-xs animate-in zoom-in-95 leading-normal">
                <AlertCircle className="w-4.5 h-4.5 grow-0 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Output and Analytics */}
        <div className={`space-y-4 duration-300 transition-all ${maximizedPanel === 'outputs' ? 'lg:col-span-12' : maximizedPanel === 'inputs' ? 'hidden' : 'lg:col-span-7'}`}>
          
          {/* Outputs Panel Navigation */}
          <div className="flex items-center justify-between px-2">
            <div className="flex bg-[#02050b] p-1.5 rounded-2xl border border-slate-900 gap-1 text-[11px] font-extrabold scrollbar-none overflow-x-auto">
              <button
                onClick={() => setActiveOutputTab('tests')}
                className={`py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${activeOutputTab === 'tests' ? themeConfig.activeTab : 'text-slate-500 hover:text-slate-400'}`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Pruebas Generadas
              </button>
              
              <button
                onClick={() => setActiveOutputTab('analytics')}
                disabled={!generatedTests}
                className={`py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${!generatedTests ? 'opacity-30 cursor-not-allowed' : activeOutputTab === 'analytics' ? themeConfig.activeTab : 'text-slate-500 hover:text-slate-400'}`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Analíticas del Script
              </button>

              <button
                onClick={() => setActiveOutputTab('history')}
                className={`py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${activeOutputTab === 'history' ? themeConfig.activeTab : 'text-slate-500 hover:text-slate-400'}`}
              >
                <History className="w-3.5 h-3.5" />
                Historial ({history.length})
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              {activeOutputTab === 'tests' && generatedTests && (
                <div className="flex items-center space-x-2 animate-in fade-in zoom-in-95">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1.5 bg-[#0f172a]/70 hover:bg-[#19243d] text-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-slate-800"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </button>
                  <button
                    onClick={downloadFile}
                    className={`flex items-center space-x-1.5 bg-gradient-to-r ${themeConfig.primary} text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-indigo-500/10 shadow-lg ${themeConfig.glowColor}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </button>
                </div>
              )}
              <button
                onClick={() => setMaximizedPanel(maximizedPanel === 'outputs' ? 'none' : 'outputs')}
                className="text-slate-500 hover:text-white transition-colors p-2"
                title={maximizedPanel === 'outputs' ? 'Restaurar tamaño' : 'Maximizar panel'}
              >
                {maximizedPanel === 'outputs' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* MAIN OUTPUT AREA */}
          {activeOutputTab === 'tests' ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-3xl blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
              
              <div className="relative overflow-hidden bg-slate-950/35 border border-white/5 rounded-3xl min-h-[530px] max-h-[740px] overflow-hidden flex flex-col backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)]">
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${themeConfig.primary}`} />
                
                {!generatedTests && !isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-650 space-y-4 p-8 text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-slate-900 border-dashed animate-[spin_25s_linear_infinite] flex items-center justify-center">
                      <Terminal className="w-6 h-6 opacity-25 text-purple-400" />
                    </div>
                    <div className="max-w-xs space-y-1">
                      <p className="text-slate-400 font-extrabold text-xs uppercase tracking-widest">Esperando Generación</p>
                      <p className="text-[11px] leading-relaxed">
                        Completa los campos a la izquierda y pulsa "Ejecutar Generación TDD" para ver la batería de tests.
                      </p>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-purple-500/25 border-t-purple-500 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-purple-400 font-extrabold text-xs uppercase tracking-widest">Generando batería unitaria (Gemini)</p>
                      <p className="text-[10px] text-slate-500">Diseñando cobertura exhaustiva al 100% de ramas y líneas...</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-[#030712] px-4 py-3 border-b border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span>{fileName ? `test_${fileName}` : 'test_solucion.py'}</span>
                      <span className="bg-slate-950 border border-slate-850 px-2.5 py-0.5 rounded-full text-slate-400 font-semibold">{generatedTests.split('\n').length} líneas generadas</span>
                    </div>
                    <div className="flex-1 overflow-auto p-2 bg-[#030712] CustomScrollbar">
                      {highlightPython(generatedTests)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeOutputTab === 'analytics' ? (
            /* ANALYTICS TAB (TDD ARCHITECTURE ANALYSER) */
            <div className="relative overflow-hidden bg-slate-950/35 border border-white/5 rounded-3xl p-6 min-h-[530px] space-y-6 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] animate-in fade-in duration-200">
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${themeConfig.primary}`} />
              
              <div className="space-y-1 border-b border-slate-900 pb-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                  <BarChart2 className={`w-4.5 h-4.5 ${themeConfig.accentText}`} />
                  Analítica de Arquitectura del Script Generado
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Análisis semántico del script Python devuelto</p>
              </div>

              {/* Pulsing Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className={`p-4 rounded-2xl border transition-colors flex flex-col justify-between h-[85px] ${analytics.hasTimeout ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-slate-900/30 border-slate-850/60 text-slate-650'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest">Timeout Decorator</p>
                  <p className="text-xs font-bold font-mono">{analytics.hasTimeout ? 'Activo (@Timeout)' : 'No Detectado'}</p>
                </div>
                <div className={`p-4 rounded-2xl border transition-colors flex flex-col justify-between h-[85px] ${analytics.hasIOCapture ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-900/30 border-slate-850/60 text-slate-650'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest">Consola / I/O Capture</p>
                  <p className="text-xs font-bold font-mono">{analytics.hasIOCapture ? 'Activo (IOCapture)' : 'No Detectado'}</p>
                </div>
                <div className={`p-4 rounded-2xl border transition-colors flex flex-col justify-between h-[85px] ${analytics.hasDeepcopy ? 'bg-pink-500/10 border-pink-500/30 text-pink-300' : 'bg-slate-900/30 border-slate-850/60 text-slate-650'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest">deepcopy Inmutabilidad</p>
                  <p className="text-xs font-bold font-mono">{analytics.hasDeepcopy ? 'Activo (deepcopy)' : 'No Detectado'}</p>
                </div>
                <div className={`p-4 rounded-2xl border transition-colors flex flex-col justify-between h-[85px] ${analytics.hasAssertRaises ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-slate-900/30 border-slate-850/60 text-slate-650'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest">assertRaises Exceptions</p>
                  <p className="text-xs font-bold font-mono">{analytics.hasAssertRaises ? 'Activo' : 'No Detectado'}</p>
                </div>
              </div>

              {/* Counters */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#02050b] p-5 border border-slate-855 rounded-2xl text-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Clases de Test</span>
                  <span className="text-4xl font-black text-white mt-1 block">{analytics.classes.length}</span>
                  <span className="text-[9px] font-mono text-slate-600 block mt-1">Numéricas secuenciales</span>
                </div>
                <div className="bg-[#02050b] p-5 border border-slate-855 rounded-2xl text-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Métodos Individuales</span>
                  <span className="text-4xl font-black text-white mt-1 block">{analytics.methods.length}</span>
                  <span className="text-[9px] font-mono text-slate-650 block mt-1">Meta recomendada: &ge;40</span>
                </div>
              </div>

              {/* Visual Test Case Explorer with Live Search (WOW!) */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Índice Visual de Pruebas Unitarias ({filteredMethods.length})</h4>
                  
                  <div className="relative group min-w-[200px]">
                    <input 
                      type="text" 
                      placeholder="Filtrar tests..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#02050b] border border-slate-850 rounded-full px-3 py-1.5 pl-8 text-xs text-white outline-none focus:border-[#6366f1]/65 transition-colors placeholder:text-slate-700 font-bold"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-650 absolute left-3 top-2.5 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-[#02050b] border border-slate-855 rounded-2xl divide-y divide-slate-855 max-h-[220px] overflow-y-auto CustomScrollbar">
                  {filteredMethods.length === 0 ? (
                    <div className="p-8 text-center text-slate-650 text-xs font-semibold">
                      No se encontraron métodos que coincidan con la búsqueda
                    </div>
                  ) : (
                    filteredMethods.map((m, idx) => (
                      <div key={idx} className="p-3.5 flex items-start justify-between text-xs hover:bg-[#060b13] transition-colors leading-relaxed">
                        <div className="space-y-1 pr-4">
                          <p className="font-mono text-white font-extrabold">{m.name}</p>
                          <p className="text-[10px] text-slate-500 leading-normal">{m.docstring}</p>
                        </div>
                        <span className="text-[9px] bg-[#030712] border border-slate-850 text-slate-500 px-2 py-0.5 rounded font-mono shrink-0">
                          Lín {m.line}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* PERSISTENT LOCAL SNAPSHOTS HISTORY */
            <div className="relative overflow-hidden bg-slate-950/35 border border-white/5 rounded-3xl p-6 min-h-[530px] space-y-4 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] animate-in fade-in duration-200">
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${themeConfig.primary}`} />
              
              <div className="space-y-1 border-b border-slate-900 pb-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                  <History className={`w-4.5 h-4.5 ${themeConfig.accentText}`} />
                  Snapshots Completos de Sesión
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Carga el estado completo de tus ejecuciones anteriores</p>
              </div>

              {history.length === 0 ? (
                <div className="h-[380px] flex flex-col items-center justify-center text-slate-650">
                  <History className="w-10 h-10 opacity-20 mb-3" />
                  <p className="text-xs font-bold uppercase tracking-wider">Historial de Sesión Vacío</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[420px] overflow-y-auto CustomScrollbar pr-1">
                  {history.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => loadSession(s)}
                      className="p-4 bg-[#02050b] hover:bg-[#060b13] border border-slate-855 hover:border-purple-500/20 rounded-2xl transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-white group-hover:text-purple-400 transition-colors">
                            {s.sessionName}
                          </span>
                          <span className="text-[9px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded-full border border-slate-900">
                            {s.generatedTests.split('\n').length} lín
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 max-w-lg">
                          {s.description}
                        </p>
                        <p className="text-[8px] text-slate-600 font-semibold font-mono">
                          Snapshot: {s.timestamp}
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteSession(s.id, e)}
                        className="text-slate-600 hover:text-rose-455 p-2 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 shrink-0"
                        title="Eliminar snapshot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status Bar */}
          <div className="flex items-center justify-between text-[9px] text-slate-650 uppercase tracking-widest px-2 font-bold">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Active model: {modelChoice}
            </div>
            <div>
              Format: Python unittest + ututils
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .CustomScrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .CustomScrollbar::-webkit-scrollbar-track {
          background: #030712;
        }
        .CustomScrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 99px;
        }
        .CustomScrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          background: #030712;
          border-radius: 99px;
          border: 1px border #1e293b;
        }
      `}} />
    </div>
  );
} 