'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SunatCalculator, SunatCalculationResult, DeductibleExpenses } from '@/lib/sunat-calculator';
import { Calculator, ArrowLeft, TrendingUp, Receipt } from 'lucide-react';

function DeductiblesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [originalResult, setOriginalResult] = useState<SunatCalculationResult | null>(null);
  const [deductibleExpenses, setDeductibleExpenses] = useState<DeductibleExpenses>({
    restaurants: 0,
    medicalServices: 0,
    professionalServices: 0,
    rentalProperties: 0,
    essaludContributions: 0
  });
  const [recalculatedResult, setRecalculatedResult] = useState<SunatCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    // Get the original calculation result from URL params
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const result = JSON.parse(decodeURIComponent(dataParam));
        setOriginalResult(result);
        // Pre-fill deductible expenses if they exist
        if (result.parameters.deductibleExpenses) {
          setDeductibleExpenses(result.parameters.deductibleExpenses);
        }
      } catch (error) {
        console.error('Error parsing calculation data:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  const handleInputChange = (field: keyof DeductibleExpenses, value: string) => {
    const numValue = parseFloat(value) || 0;
    setDeductibleExpenses(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const recalculateWithDeductibles = async () => {
    if (!originalResult) return;

    setIsCalculating(true);
    try {
      const calculator = new SunatCalculator();
      
      // Validate deductible expenses
      const validation = calculator.validateDeductibleExpenses(deductibleExpenses);
      if (!validation.isValid) {
        alert('Errores en gastos deducibles:\n' + validation.errors.join('\n'));
        setIsCalculating(false);
        return;
      }

      // Recalculate with new deductible expenses
      const newResult = calculator.calculate({
        ...originalResult.parameters,
        deductibleExpenses
      });

      setRecalculatedResult(newResult);
    } catch (error) {
      console.error('Error recalculating:', error);
      alert('Error al recalcular. Por favor, verifica los datos.');
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (!originalResult) {
    return <div>Cargando...</div>;
  }

  const totalExpenses = Object.values(deductibleExpenses).reduce((sum, value) => sum + value, 0);
  const maxDeduction = 3 * 5350; // 3 UIT
  const canApplyDeductibles = originalResult.summary.totalAnnualIncome > (7 * 5350);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#004C97]">Configurar Gastos Deducibles</h1>
          <p className="text-[#666666] mt-2">
            Configura tus gastos deducibles para recalcular las retenciones
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-[#004C97] text-[#004C97] hover:bg-[#004C97] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      {/* UIT Information */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#E3F2FD]">
          <CardTitle className="flex items-center gap-2 text-[#004C97]">
            <TrendingUp className="h-5 w-5" />
            Información UIT 2025
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-[#666666]">UIT 2025</Label>
              <p className="text-lg font-semibold text-[#333333]">{formatCurrency(5350)}</p>
              <p className="text-xs text-[#666666] mt-1">Actualizado por MEF (DS Nº 260-2024-EF)</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-[#666666]">Deducción 7 UIT</Label>
              <p className="text-lg font-semibold text-[#333333]">{formatCurrency(7 * 5350)}</p>
              <p className="text-xs text-[#666666] mt-1">S/ 37,450 anual</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-[#666666]">Deducción Adicional 3 UIT</Label>
              <p className="text-lg font-semibold text-[#333333]">{formatCurrency(3 * 5350)}</p>
              <p className="text-xs text-[#666666] mt-1">S/ 16,050 máximo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#E8F5E8]">
          <CardTitle className="flex items-center gap-2 text-[#2E7D32]">
            <Calculator className="h-5 w-5" />
            Estado Actual del Cálculo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[#666666]">RBA:</span>
                <span className="font-semibold text-[#2E7D32]">
                  {formatCurrency(originalResult.summary.totalAnnualIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#666666]">Umbral 7 UIT:</span>
                <span className="font-semibold">{formatCurrency(7 * 5350)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#666666]">Impuesto Anual Actual:</span>
                <span className="font-semibold text-[#B71C1C]">
                  {formatCurrency(originalResult.summary.totalAnnualTax)}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[#666666]">Gastos Deducibles Actuales:</span>
                <span className="font-semibold">
                  {formatCurrency(originalResult.summary.deductibleExpenses.totalExpenses)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#666666]">Deducción Aplicada:</span>
                <span className="font-semibold text-[#2E7D32]">
                  {formatCurrency(originalResult.summary.deductibleExpenses.totalDeduction)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#666666]">Máxima Deducción (3 UIT):</span>
                <span className="font-semibold">{formatCurrency(maxDeduction)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deductible Expenses Form */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#FFF3E0]">
          <CardTitle className="flex items-center gap-2 text-[#FF9800]">
            <Receipt className="h-5 w-5" />
            Configurar Gastos Deducibles
          </CardTitle>
          <CardDescription className="text-[#FF9800]">
            Ingresa tus gastos deducibles según categoría. Solo aplican si tus ingresos anuales superan 7 UIT.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!canApplyDeductibles ? (
            <div className="text-center py-8">
              <div className="bg-[#F5F5F5] p-6 rounded-lg border border-[#E0E0E0]">
                <div className="text-[#666666] mb-4">
                  <p className="text-lg font-medium mb-2">Los gastos deducibles no aplican en este caso</p>
                  <p className="text-sm">
                    Según la ley 2025, los gastos deducibles solo se aplican cuando los ingresos anuales superan 7 UIT (S/ 37,450).
                  </p>
                </div>
                <div className="text-xs text-[#999999]">
                  <p>Ingresos anuales proyectados: <strong>{formatCurrency(originalResult.summary.totalAnnualIncome)}</strong></p>
                  <p>Umbral requerido: <strong>{formatCurrency(7 * 5350)}</strong></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="restaurants" className="text-sm font-medium text-[#333333]">
                    Restaurantes, Bares y Hoteles (15%)
                  </Label>
                  <Input
                    id="restaurants"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={deductibleExpenses.restaurants || ''}
                    onChange={(e) => handleInputChange('restaurants', e.target.value)}
                    className="border-[#E0E0E0]"
                  />
                  <p className="text-xs text-[#666666]">
                    Deducción: {formatCurrency(deductibleExpenses.restaurants * 0.15)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalServices" className="text-sm font-medium text-[#333333]">
                    Servicios Médicos y Odontológicos (30%)
                  </Label>
                  <Input
                    id="medicalServices"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={deductibleExpenses.medicalServices || ''}
                    onChange={(e) => handleInputChange('medicalServices', e.target.value)}
                    className="border-[#E0E0E0]"
                  />
                  <p className="text-xs text-[#666666]">
                    Deducción: {formatCurrency(deductibleExpenses.medicalServices * 0.30)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalServices" className="text-sm font-medium text-[#333333]">
                    Servicios Profesionales y Oficios (30%)
                  </Label>
                  <Input
                    id="professionalServices"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={deductibleExpenses.professionalServices || ''}
                    onChange={(e) => handleInputChange('professionalServices', e.target.value)}
                    className="border-[#E0E0E0]"
                  />
                  <p className="text-xs text-[#666666]">
                    Deducción: {formatCurrency(deductibleExpenses.professionalServices * 0.30)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rentalProperties" className="text-sm font-medium text-[#333333]">
                    Propiedades de Alquiler (20%)
                  </Label>
                  <Input
                    id="rentalProperties"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={deductibleExpenses.rentalProperties || ''}
                    onChange={(e) => handleInputChange('rentalProperties', e.target.value)}
                    className="border-[#E0E0E0]"
                  />
                  <p className="text-xs text-[#666666]">
                    Deducción: {formatCurrency(deductibleExpenses.rentalProperties * 0.20)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="essaludContributions" className="text-sm font-medium text-[#333333]">
                    Contribuciones EsSalud (100%)
                  </Label>
                  <Input
                    id="essaludContributions"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={deductibleExpenses.essaludContributions || ''}
                    onChange={(e) => handleInputChange('essaludContributions', e.target.value)}
                    className="border-[#E0E0E0]"
                  />
                  <p className="text-xs text-[#666666]">
                    Deducción: {formatCurrency(deductibleExpenses.essaludContributions)}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#F5F5F5] p-4 rounded-lg border border-[#E0E0E0]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <Label className="text-sm font-medium text-[#666666]">Total Gastos</Label>
                    <p className="text-lg font-semibold text-[#333333]">
                      {formatCurrency(totalExpenses)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#666666]">Deducción Calculada</Label>
                    <p className="text-lg font-semibold text-[#2E7D32]">
                      {formatCurrency(Math.min(totalExpenses, maxDeduction))}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-[#666666]">Límite Restante</Label>
                    <p className="text-lg font-semibold text-[#FF9800]">
                      {formatCurrency(Math.max(0, maxDeduction - totalExpenses))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <Button
                  onClick={recalculateWithDeductibles}
                  disabled={isCalculating || totalExpenses === 0}
                  className="bg-[#004C97] hover:bg-[#1976D2] text-white px-8 py-3"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {isCalculating ? 'Recalculando...' : 'Recalcular Retenciones'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recalculated Results */}
      {recalculatedResult && (
        <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
          <CardHeader className="bg-[#E8F5E8]">
            <CardTitle className="flex items-center gap-2 text-[#2E7D32]">
              <Calculator className="h-5 w-5" />
              Resultados Recalculados con Gastos Deducibles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-[#333333] mb-3">Comparación de Impuestos</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#666666]">Impuesto Original:</span>
                    <span className="font-semibold text-[#B71C1C]">
                      {formatCurrency(originalResult.summary.totalAnnualTax)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#666666]">Impuesto Recalculado:</span>
                    <span className="font-semibold text-[#2E7D32]">
                      {formatCurrency(recalculatedResult.summary.totalAnnualTax)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium text-[#333333]">Ahorro en Impuestos:</span>
                    <span className="font-bold text-[#2E7D32]">
                      {formatCurrency(originalResult.summary.totalAnnualTax - recalculatedResult.summary.totalAnnualTax)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-[#333333] mb-3">Impacto en Retenciones</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#666666]">Retención Anual Original:</span>
                    <span className="font-semibold text-[#B71C1C]">
                      {formatCurrency(originalResult.summary.totalAnnualRetention)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#666666]">Retención Anual Nueva:</span>
                    <span className="font-semibold text-[#2E7D32]">
                      {formatCurrency(recalculatedResult.summary.totalAnnualRetention)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm text-[#333333]">Reducción Mensual Promedio:</span>
                    <span className="font-bold text-[#2E7D32]">
                      {formatCurrency((originalResult.summary.averageMonthlyRetention - recalculatedResult.summary.averageMonthlyRetention))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* View Full Results Button */}
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => {
                  const encodedData = encodeURIComponent(JSON.stringify(recalculatedResult));
                  router.push(`/results?data=${encodedData}`);
                }}
                className="bg-[#004C97] hover:bg-[#1976D2] text-white"
              >
                Ver Resultados Completos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function DeductiblesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Cargando...</div>}>
      <DeductiblesContent />
    </Suspense>
  );
}
