import { Calculator, TrendingUp, Shield, BookOpen, HelpCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const documentationSections = [
  {
    icon: Calculator,
    title: 'Cómo Usar la Calculadora',
    description: 'Guía paso a paso para utilizar la calculadora SUNAT',
    content: [
      'Ingresa tu ingreso mensual base',
      'Especifica si tienes ingresos adicionales y en qué mes',
      'Define el mes desde el cual quieres calcular',
      'Ingresa las retenciones previas acumuladas',
      'Configura los decimales de redondeo deseados',
      'Haz clic en "Calcular Retenciones" para ver los resultados'
    ]
  },
  {
    icon: TrendingUp,
    title: 'Método de Cálculo',
    description: 'Explicación del algoritmo de cálculo de impuestos',
    content: [
      'Se calcula el ingreso anual proyectado',
      'Se aplica la deducción de 7 UIT (S/ 37,450 para 2025)',
      'Se determina la base imponible neta',
      'Se aplican las tasas progresivas por tramos',
      'Se calculan las retenciones mensuales proporcionales',
      'Se consideran las retenciones previas para el cálculo'
    ]
  },
  {
    icon: Shield,
    title: 'Tramos Impositivos 2025',
    description: 'Estructura de tasas impositivas vigentes',
    content: [
      'Hasta 7 UIT (S/ 37450): 8%',
      'De 7 a 12 UIT (S/ 37450 - S/ 64,200): 14%',
      'De 12 a 20 UIT (S/ 64,200 - S/ 107,000): 17%',
      'De 20 a 35 UIT (S/ 107,000 - S/ 187,250): 20%',
      'Más de 35 UIT (S/ 187,250): 30%'
    ]
  },
  {
    icon: BookOpen,
    title: 'Conceptos Clave',
    description: 'Definiciones importantes para entender el cálculo',
    content: [
      'UIT: Unidad Impositiva Tributaria (S/ 5,350 en 2025)',
      'Base Imponible: Ingreso total menos deducciones',
      'Retención: Pago anticipado del impuesto a la renta',
      'Tasa Progresiva: Porcentaje que aumenta con el ingreso',
      'Deducción 7 UIT: Exoneración estándar anual (S/ 37450)'
    ]
  }
];

const faqItems = [
  {
    question: '¿La calculadora está actualizada para 2025?',
    answer: 'Sí, utilizamos las tasas impositivas y valores UIT vigentes para el año 2025.'
  },
  {
    question: '¿Puedo calcular retenciones para años anteriores?',
    answer: 'La calculadora está optimizada para el año actual, pero puedes ajustar los parámetros según sea necesario.'
  },
  {
    question: '¿Cómo se calcula la retención mensual?',
    answer: 'Se proyecta el impuesto anual total y se distribuye proporcionalmente por mes, considerando las retenciones previas.'
  },
  {
    question: '¿Qué pasa si tengo ingresos variables?',
    answer: 'Puedes usar el campo de ingreso adicional para bonificaciones extraordinarias en meses específicos.'
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
          </div>
        </div>
      </div>
    </div>
  );
}
