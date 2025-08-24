import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <CardTitle className="text-2xl">Página no encontrada</CardTitle>
          <CardDescription>
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p>Puedes regresar a la página principal o usar la navegación.</p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/">
                Ir al inicio
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/sunat-calculator">
                Calculadora SUNAT
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/documentation">
                Documentación
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
