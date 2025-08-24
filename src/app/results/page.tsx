'use client';

import { useSearchParams } from 'next/navigation';
import { SunatCalculatorResults } from '@/components/sunat-calculator-results';
import { SunatCalculationResult } from '@/lib/sunat-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<SunatCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get result data from URL params or localStorage
      const resultData = searchParams.get('data');
      if (resultData) {
        const parsedResult = JSON.parse(decodeURIComponent(resultData));
        setResult(parsedResult);
      } else {
        // Try to get from localStorage as fallback
        const storedResult = localStorage.getItem('sunat-calculation-result');
        if (storedResult) {
          setResult(JSON.parse(storedResult));
        } else {
          setError('No se encontraron resultados de cálculo');
        }
      }
    } catch (err) {
      setError('Error al cargar los resultados');
      console.error('Error parsing result data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Calculator className="h-12 w-12 text-[#004C97] mx-auto mb-4 animate-pulse" />
            <p className="text-lg text-[#666666]">Cargando resultados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-[#E0E0E0] shadow-sm max-w-2xl mx-auto">
          <CardHeader className="bg-[#FFEBEE] text-center">
            <CardTitle className="text-[#B71C1C] flex items-center justify-center gap-2">
              <Calculator className="h-5 w-5" />
              Error al cargar resultados
            </CardTitle>
            <CardDescription className="text-[#C62828]">
              {error || 'No se pudieron cargar los resultados del cálculo'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-[#666666] mb-6">
              Los resultados no están disponibles o han expirado.
            </p>
            <Link href="/sunat-calculator">
              <Button className="bg-[#004C97] hover:bg-[#1976D2]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Calculador
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#004C97] mb-2">
              Resultados del Cálculo SUNAT
            </h1>
            <p className="text-[#666666]">
              Año fiscal {result.parameters.year} - Cálculo de retenciones mensuales
            </p>
          </div>
          <Link href="/sunat-calculator">
            <Button variant="outline" className="border-[#004C97] text-[#004C97] hover:bg-[#004C97] hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nuevo Cálculo
            </Button>
          </Link>
        </div>
      </div>

      {/* Results */}
      <SunatCalculatorResults result={result} />

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/sunat-calculator">
          <Button className="bg-[#004C97] hover:bg-[#1976D2]">
            <Calculator className="h-4 w-4 mr-2" />
            Realizar Otro Cálculo
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white"
          onClick={() => window.print()}
        >
          Imprimir Resultados
        </Button>
      </div>
    </div>
  );
}
