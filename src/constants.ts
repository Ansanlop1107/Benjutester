export const TEST_STYLES = [
  {
    id: 'standard',
    name: 'Standard (Académico)',
    description: 'Estilo riguroso con comprobación de MRO, métodos públicos y atributos privados.',
    example: `import unittest
# unittesting_utils es un módulo local que se asume existente en el entorno del curso
# import unittesting_utils as ututils 

class Test010_ClaseBase_Definicion(unittest.TestCase):
    """Pruebas para comprobar la definición de la clase y herencia"""
    def setUp(self): self.maxDiff = None
    
    def test_010_mro(self):
        """Comprueba el Method Resolution Order (MRO)"""
        mro_especificado = ['MiClase', 'object']
        mro_definido = [c.__name__ for c in MiClase.mro()]
        self.assertEqual(mro_definido, mro_especificado, msg=f"MRO incorrecto: {mro_definido}")

    def test_020_metodos_publicos(self):
        """Comprueba que no se han añadido métodos públicos no permitidos"""
        permitidos = {'__init__', 'metodo_a', 'metodo_b'}
        definidos = {m for m in dir(MiClase) if not m.startswith('_')}
        self.assertTrue(definidos <= permitidos, msg=f"Métodos no permitidos detectados: {definidos - permitidos}")

class Test020_Funcionalidad_Basica(unittest.TestCase):
    """Pruebas de funcionalidad básica (mínimo 40 combinaciones)"""
    def test_030_calculo_repetido(self):
        obj = MiClase()
        for i in range(10): # Repetición para asegurar consistencia
            self.assertEqual(obj.metodo_a(i), i*2, msg=f"Fallo en iteración {i}")`
  },
  {
    id: 'pedagogic',
    name: 'Pedagógico (Extensivo)',
    description: 'Más estricto, con 40+ pruebas y mensajes educativos exhaustivos.',
    example: `import unittest

class TestPedagogico(unittest.TestCase):
    def test_inspeccion_privacidad(self):
        """Verifica que los atributos sigan la convención __NombreClase__atributo"""
        instancia = MiClase()
        attrs = vars(instancia)
        self.assertTrue(all(k.startswith('_MiClase__') for k in attrs), 
            msg="❌ ERROR DE DISEÑO: Los atributos deben ser privados (doble guión bajo).")

    def test_estres_logica(self):
        """Prueba repetida para detectar fallos intermitentes o efectos secundarios"""
        for i in range(40): # Exigencia de repetición y volumen
            # ... lógica de prueba aquí ...
            pass`
  },
  {
    id: 'robust',
    name: 'Robustez (40+ Tests)',
    description: 'Nivel Máximo. Pruebas de estrés, excepciones y validación de tipos ultra-estricta.',
    example: `import unittest

class TestRobustezExtrema(unittest.TestCase):
    def test_excepciones_y_tipos(self):
        """Validación de tipos en constructor y métodos"""
        with self.assertRaises(TypeError, msg="Debe rechazar strings en lugar de ints"):
            MiClase("texto")
        
    def test_volumen_datos(self):
        """Pruebas masivas para asegurar que no hay fugas de memoria o errores de lógica"""
        # Se generan 40+ tests dinámicos o repetidos aquí
        for val in range(-20, 20):
            res = MiClase(val).procesar()
            self.assertIsInstance(res, int, msg="El resultado debe ser siempre entero")`
  }
];
