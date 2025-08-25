import { Calculator, TrendingUp, Shield, BookOpen, HelpCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const documentationSections = [
  {
    icon: Calculator,
    title: 'Cómo Usar la Calculadora',
    description: 'Guía paso a paso para utilizar la calculadora SUNAT con metodología oficial',
    content: [
      'Paso 1: Ingresa tu información básica (ingreso mensual, año fiscal, mes de inicio)',
      'Paso 2: Configura ingresos adicionales (gratificaciones, CTS, utilidades, asignación familiar)',
      'Paso 3: Define gastos deducibles (restaurantes, servicios médicos, profesionales, alquiler)',
      'Paso 4: Ingresa créditos fiscales (donaciones, créditos anteriores, pagos a cuenta)',
      'Haz clic en "Calcular Retenciones" para ver los resultados detallados'
    ]
  },
  {
    icon: TrendingUp,
    title: 'Metodología SUNAT - 5 Pasos',
    description: 'Algoritmo oficial de cálculo de impuestos según normativa peruana',
    content: [
      'Paso 1: Cálculo de Remuneración Bruta Anual (RBA) proyectada',
      'Paso 2: Deducción de 7 UIT y gastos deducibles (Artículo 46°)',
      'Paso 3: Aplicación de tasas progresivas del Artículo 53° para determinar el impuesto anual',
      'Paso 4: Fraccionamiento del impuesto anual en retenciones mensuales',
      'Paso 5: Cálculo de retenciones adicionales por ingresos extraordinarios'
    ]
  },
  {
    icon: Shield,
    title: 'Tramos Impositivos 2025',
    description: 'Estructura de tasas progresivas según Artículo 53° de la Ley',
    content: [
      'Hasta 5 UIT (S/ 26,750): 8%',
      'De 5 a 20 UIT (S/ 26,750 - S/ 107,000): 14%',
      'De 20 a 35 UIT (S/ 107,000 - S/ 187,250): 17%',
      'De 35 a 45 UIT (S/ 187,250 - S/ 240,750): 20%',
      'Más de 45 UIT (S/ 240,750): 30%'
    ]
  },
  {
    icon: BookOpen,
    title: 'Conceptos Clave SUNAT',
    description: 'Definiciones fundamentales de la metodología oficial',
    content: [
      'UIT: Unidad Impositiva Tributaria (S/ 5,350 en 2025)',
      'RBA: Remuneración Bruta Anual proyectada según metodología oficial',
      'Deducción 7 UIT: Exoneración estándar anual (S/ 37,450 en 2025)',
      'Gastos Deducibles: Máximo 3 UIT adicionales (restaurantes, médicos, etc.)',
      'Ajustes del Impuesto: Donaciones y créditos fiscales que modifican el impuesto anual final'
    ]
  }
];

const faqItems = [
  {
    question: '¿La calculadora implementa la metodología oficial de SUNAT?',
    answer: 'Sí, nuestra calculadora sigue exactamente los 5 pasos de la metodología oficial SUNAT para el cálculo de retenciones del impuesto a la renta de quinta categoría.'
  },
  {
    question: '¿Qué son los créditos fiscales del Artículo 88°?',
    answer: 'Son deducciones que incluyen pagos previos a cuenta del impuesto, créditos de declaraciones anteriores y saldos a favor reconocidos por SUNAT, aplicables solo para rentas de quinta categoría.'
  },
  {
    question: '¿Cómo se calculan las donaciones según el Artículo 49°?',
    answer: 'Las donaciones solo se pueden deducir en diciembre con motivo del ajuste final del impuesto, y únicamente aplican para trabajadores que perciben exclusivamente rentas de quinta categoría.'
  },
  {
    question: '¿Qué significa el fraccionamiento del impuesto anual?',
    answer: 'Es el proceso de distribuir progresivamente el impuesto anual en retenciones mensuales, considerando las retenciones previas acumuladas según la metodología oficial de SUNAT.'
  },
  {
    question: '¿La calculadora está actualizada para 2025?',
    answer: 'Sí, utilizamos las tasas impositivas del Artículo 53° y valores UIT vigentes para el año 2025, siguiendo la normativa peruana actualizada.'
  },
  {
    question: '¿Cómo se manejan los ingresos extraordinarios?',
    answer: 'Los ingresos extraordinarios como utilidades, bonificaciones especiales o CTS se calculan según el Paso 5 de la metodología SUNAT, aplicando retenciones adicionales proporcionales.'
  }
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-[#E3F2FD] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#004C97] mb-4">
            Documentación SUNAT
          </h1>
          <p className="text-xl text-[#666666] max-w-3xl mx-auto">
            Aprende cómo funciona nuestra calculadora y entiende los métodos de cálculo de impuestos peruanos
          </p>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {documentationSections.map((section) => (
            <Card key={section.title} className="h-full border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#E3F2FD] rounded-lg">
                    <section.icon className="h-6 w-6 text-[#004C97]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-[#004C97]">{section.title}</CardTitle>
                    <CardDescription className="text-base text-[#666666]">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-[#004C97] font-semibold">•</span>
                      <span className="text-[#333333]">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Metodología SUNAT Detallada */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">
              Metodología SUNAT Detallada
            </h2>
            <p className="text-lg text-[#666666]">
              Explicación completa de los 5 pasos oficiales para el cálculo de retenciones
            </p>
          </div>
          
          <div className="space-y-6">
            <Card className="border-[#E0E0E0] shadow-sm">
              <CardHeader className="bg-[#1976D2] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Paso 1: Remuneración Bruta Anual (RBA) Proyectada
                </CardTitle>
                <CardDescription className="text-[#E3F2FD]">
                  Cálculo de ingresos anuales según metodología oficial
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Se calcula la remuneración ordinaria mensual multiplicada por los meses restantes del ejercicio, 
                    incluyendo el mes de cálculo. Se suman las gratificaciones ordinarias y remuneraciones extraordinarias 
                    de meses anteriores del mismo ejercicio.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Fórmula:</h4>
                    <p className="text-blue-700 text-sm">
                      RBA = (Ingreso Mensual × Meses Restantes) + Gratificaciones + Ingresos Extraordinarios Previos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E0E0E0] shadow-sm">
              <CardHeader className="bg-[#4CAF50] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Paso 2: Deducción de 7 UIT y Gastos Deducibles
                </CardTitle>
                <CardDescription className="text-[#E8F5E8]">
                  Aplicación de deducciones según Artículo 46° de la Ley
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Al resultado del Paso 1 se le resta el monto fijo equivalente a 7 UIT (S/ 37,450 en 2025). 
                    Adicionalmente, se pueden deducir gastos deducibles hasta un máximo de 3 UIT adicionales 
                    para restaurantes, servicios médicos, profesionales, alquiler y contribuciones EsSalud.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Deducciones Aplicables:</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Deducción fija: 7 UIT (S/ 37,450)</li>
                      <li>• Gastos deducibles: Máximo 3 UIT adicionales (restaurantes, médicos, etc.)</li>
                      <li>• Base imponible: Ingreso neto después de deducciones</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E0E0E0] shadow-sm">
              <CardHeader className="bg-[#FF9800] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Paso 3: Aplicación de Tasas Progresivas (Artículo 53°)
                </CardTitle>
                <CardDescription className="text-[#FFF3E0]">
                  Determinación del impuesto anual aplicando tasas progresivas
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Se aplican las tasas progresivas del Artículo 53° al ingreso neto del Paso 2, determinándose 
                    el impuesto anual proyectado. Este impuesto se ajusta posteriormente con donaciones y créditos fiscales.
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Ajustes del Impuesto Anual:</h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• Donaciones: Solo en diciembre para rentas de quinta categoría (Artículo 49°)</li>
                      <li>• Créditos Fiscales: Pagos previos, créditos anteriores y saldos a favor (Artículo 88°)</li>
                      <li>• Impuesto Final: Resultado después de aplicar todos los ajustes</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E0E0E0] shadow-sm">
              <CardHeader className="bg-[#9C27B0] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Paso 4: Fraccionamiento del Impuesto Anual
                </CardTitle>
                <CardDescription className="text-[#F3E5F5]">
                  Distribución progresiva del impuesto en retenciones mensuales
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    El impuesto anual se fracciona progresivamente según el mes de cálculo: enero-marzo (÷12), 
                    abril (÷9), mayo-julio (÷8), agosto (÷5), septiembre-noviembre (÷4), diciembre (ajuste final).
                  </p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Distribución Mensual:</h4>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• Enero-Marzo: Impuesto anual ÷ 12</li>
                      <li>• Abril: (Impuesto - Retenciones Ene-Mar) ÷ 9</li>
                      <li>• Mayo-Julio: (Impuesto - Retenciones Ene-Abr) ÷ 8</li>
                      <li>• Agosto: (Impuesto - Retenciones Ene-Jul) ÷ 5</li>
                      <li>• Septiembre-Noviembre: (Impuesto - Retenciones Ene-Ago) ÷ 4</li>
                      <li>• Diciembre: Ajuste final</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#E0E0E0] shadow-sm">
              <CardHeader className="bg-[#F44336] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Paso 5: Retenciones por Ingresos Extraordinarios
                </CardTitle>
                <CardDescription className="text-[#FFEBEE]">
                  Cálculo de retenciones adicionales para ingresos extraordinarios
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Para meses con ingresos extraordinarios (utilidades, bonificaciones, CTS), se calcula una 
                    retención adicional aplicando la metodología de los Pasos 1-3 al ingreso extraordinario, 
                    considerando proporcionalmente los créditos aplicables.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Ingresos Extraordinarios:</h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Participación en utilidades</li>
                      <li>• Bonificaciones extraordinarias</li>
                      <li>• CTS (Compensación por Tiempo de Servicios)</li>
                      <li>• Reintegros por servicios</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-[#666666]">
              Resolvemos las dudas más comunes sobre el cálculo de impuestos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((item) => (
              <Card key={item.question} className="border-[#E0E0E0] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start space-x-2">
                    <HelpCircle className="h-5 w-5 text-[#004C97] mt-0.5 flex-shrink-0" />
                    <span className="text-[#333333]">{item.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#666666]">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-lg p-8 border-[#E0E0E0] shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#333333] mb-4">
              Recursos Adicionales
            </h2>
            <p className="text-lg text-[#666666]">
              Enlaces útiles para ampliar tu conocimiento sobre impuestos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-[#E0E0E0] shadow-sm">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-[#004C97] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-[#333333]">Portal SUNAT</h3>
                <p className="text-[#666666] mb-4">
                  Accede a la información oficial de la Superintendencia Nacional de Aduanas y de Administración Tributaria
                </p>
                <a 
                  href="https://www.sunat.gob.pe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#1976D2] hover:text-[#004C97] font-medium transition-colors duration-200"
                >
                  Visitar Portal →
                </a>
              </CardContent>
            </Card>
            
            <Card className="text-center border-[#E0E0E0] shadow-sm">
              <CardContent className="pt-6">
                <BookOpen className="h-12 w-12 text-[#4CAF50] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-[#333333]">Normativa Tributaria</h3>
                <p className="text-[#666666] mb-4">
                  Consulta la Ley del Impuesto a la Renta y sus reglamentos actualizados para 2025
                </p>
                <a 
                  href="https://www.sunat.gob.pe/legislacion/renta/ley/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#4CAF50] hover:text-[#388E3C] font-medium transition-colors duration-200"
                >
                  Ver Normativa →
                </a>
              </CardContent>
            </Card>

            <Card className="text-center border-[#E0E0E0] shadow-sm">
              <CardContent className="pt-6">
                <FileText className="h-12 w-12 text-[#FF6F00] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-[#333333]">Guía de Cálculo</h3>
                <p className="text-[#666666] mb-4">
                  Guía oficial de SUNAT para el cálculo del impuesto a la renta de quinta categoría
                </p>
                <a 
                  href="https://orientacion.sunat.gob.pe/3071-02-calculo-del-impuesto" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#FF6F00] hover:text-[#E65100] font-medium transition-colors duration-200"
                >
                  Ver Guía →
                </a>
              </CardContent>
            </Card>

            <Card className="text-center border-[#E0E0E0] shadow-sm">
              <CardContent className="pt-6">
                <Calculator className="h-12 w-12 text-[#9C27B0] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-[#333333]">Calculadora Oficial</h3>
                <p className="text-[#666666] mb-4">
                  Calculadora oficial de SUNAT para verificar cálculos y comparar resultados
                </p>
                <a 
                  href="https://personas.sunat.gob.pe/simuladores/quinta" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#9C27B0] hover:text-[#7B1FA2] font-medium transition-colors duration-200"
                >
                  Usar Calculadora →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
