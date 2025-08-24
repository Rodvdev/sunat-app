import Link from 'next/link';
import { Calculator, FileText, TrendingUp, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Calculator,
    title: 'Calculadora SUNAT',
    description: 'Calcula tus retenciones de impuestos de forma precisa según la normativa peruana vigente.',
    href: '/sunat-calculator'
  },
  {
    icon: TrendingUp,
    title: 'Análisis de Impuestos',
    description: 'Visualiza el desglose mensual de tus retenciones y proyecciones anuales.',
    href: '/sunat-calculator'
  },
  {
    icon: Shield,
    title: 'Cumplimiento Normativo',
    description: 'Asegúrate de cumplir con todas las obligaciones fiscales de SUNAT.',
    href: '/documentation'
  },
  {
    icon: FileText,
    title: 'Reportes Detallados',
    description: 'Genera reportes completos para tu contabilidad y auditoría.',
    href: '/documentation'
  }
];

const stats = [
  { label: 'UIT 2024', value: 'S/ 5,500', description: 'Unidad Impositiva Tributaria' },
  { label: 'Deducción 7 UIT', value: 'S/ 38,500', description: 'Deducción anual estándar' },
  { label: 'Tramo Máximo', value: '30%', description: 'Tasa impositiva máxima' },
  { label: 'Tramo Mínimo', value: '8%', description: 'Tasa impositiva mínima' }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl mb-6">
              Calculadora SUNAT
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Calcula tus retenciones de impuestos de forma precisa y confiable según la normativa peruana. 
              Optimiza tu planificación fiscal con nuestra herramienta especializada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sunat-calculator">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Calculator className="mr-2 h-5 w-5" />
                  Calcular Ahora
                </Button>
              </Link>
              <Link href="/documentation">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  <FileText className="mr-2 h-5 w-5" />
                  Ver Documentación
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestra calculadora SUNAT ofrece todas las herramientas necesarias para una gestión fiscal eficiente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                  <Link href={feature.href} className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-4 font-medium">
                    Saber más <Zap className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para optimizar tus impuestos?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya confían en nuestra calculadora SUNAT para gestionar sus obligaciones fiscales
          </p>
          <Link href="/sunat-calculator">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Calculator className="mr-2 h-5 w-5" />
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">SUNAT App</span>
              </div>
              <p className="text-gray-400">
                Herramienta especializada para el cálculo de impuestos según la normativa peruana.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Útiles</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/sunat-calculator" className="hover:text-white">Calculadora</Link></li>
                <li><Link href="/documentation" className="hover:text-white">Documentación</Link></li>
                <li><Link href="/settings" className="hover:text-white">Configuración</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <p className="text-gray-400">
                Para consultas técnicas o soporte, contacta a nuestro equipo especializado.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SUNAT App. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
