'use client';

import { SunatCalculationResult } from '@/lib/sunat-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileText, Receipt, Calculator, TrendingDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface SunatCalculatorResultsProps {
  result: SunatCalculationResult;
}

export function SunatCalculatorResults({ result }: SunatCalculatorResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const router = useRouter();

  // Debug: Log complete result object
  console.log('Complete result object received:', result);
  console.log('Summary data:', result.summary);
  console.log('First month calculation:', result.monthlyCalculations[0]);

  return (
    <div className="space-y-8">

      {/* UIT Information - Moved to top for better context */}
      <div className="border border-blue-200 rounded-lg bg-blue-50">
        <button
          type="button"
          className="w-full p-4 text-left flex items-center justify-between hover:bg-blue-100 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-[#004C97] font-semibold underline decoration-2 underline-offset-2">
              Información UIT 2025
            </span>
          </div>
        </button>
        <div className="px-4 pb-4">
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
        </div>
      </div>

      {/* Tax Rates and Projected Tax Information */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#B71C1C] text-white -mt-6 -mx-6 px-6 pt-6 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Tasas de Impuesto y Cálculo Proyectado
          </CardTitle>
          <CardDescription className="text-[#FFCDD2]">
            Escalas progresivas SUNAT 2025 y cálculo del impuesto anual
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tax Rates */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#333333] text-lg mb-4">📊 Escalas Progresivas de Impuesto</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Hasta 5 UIT (S/ 26,750)</span>
                  <span className="font-bold text-[#B71C1C]">8%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Más de 5 hasta 20 UIT (S/ 107,000)</span>
                  <span className="font-bold text-[#FF9800]">14%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Más de 20 hasta 35 UIT (S/ 187,250)</span>
                  <span className="font-bold text-[#F57C00]">17%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Más de 35 hasta 45 UIT (S/ 240,750)</span>
                  <span className="font-bold text-[#1976D2]">20%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Más de 45 UIT</span>
                  <span className="font-bold text-[#7B1FA2]">30%</span>
                </div>
              </div>
            </div>

            {/* Projected Tax Calculation */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#333333] text-lg mb-4">🧮 Cálculo del Impuesto Anual Proyectado</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Remuneración Bruta Anual (RBA)</span>
                  <span className="font-semibold text-[#2E7D32]">{formatCurrency(result.summary.totalAnnualIncome)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Menos: Deducción 7 UIT</span>
                  <span className="font-semibold text-red-600">- {formatCurrency(7 * 5350)}</span>
                </div>
                {result.summary.deductibleExpenses.totalDeduction > 0 && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-sm text-[#666666]">Menos: Gastos Deducibles</span>
                    <span className="font-semibold text-red-600">- {formatCurrency(result.summary.deductibleExpenses.totalDeduction)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm text-[#666666] font-semibold">= Base Imponible (RNA)</span>
                  <span className="font-bold text-[#1976D2]">{formatCurrency(result.summary.totalAnnualIncome - (7 * 5350) - result.summary.deductibleExpenses.totalDeduction)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#B71C1C] text-white rounded-lg">
                  <span className="text-sm font-semibold">Impuesto Anual Proyectado</span>
                  <span className="font-bold text-xl">{formatCurrency(result.summary.totalAnnualTax)}</span>
                </div>
              </div>
              
              {/* Tax Rate Applied */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm text-[#666666]">
                  <strong>Tasa de Impuesto Aplicada:</strong> 
                  <span className="ml-2 font-bold text-[#F57C00]">
                    {(() => {
                      const rna = result.summary.totalAnnualIncome - (7 * 5350) - result.summary.deductibleExpenses.totalDeduction;
                      if (rna <= 5 * 5350) return '8%';
                      if (rna <= 20 * 5350) return '14%';
                      if (rna <= 35 * 5350) return '17%';
                      if (rna <= 45 * 5350) return '20%';
                      return '30%';
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#666666] flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Remuneración Bruta Anual (RBA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2E7D32]">
              {formatCurrency(result.summary.totalAnnualIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#666666] flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Remuneración Neta Anual (RNA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1976D2]">
              {formatCurrency(result.summary.totalAnnualIncome - (7 * 5350) - result.summary.deductibleExpenses.totalDeduction)}
            </div>
            <div className="text-xs text-[#666666] mt-2">
              RBA - 7 UIT - Gastos Deducibles
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#666666] flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ingresos Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FF9800]">
              {formatCurrency(result.summary.totalAdditionalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#666666] flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Impuesto Anual Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#B71C1C]">
              {formatCurrency(result.summary.totalAnnualTax)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#666666] flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Retención Anual Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.summary.totalAnnualRetention > 0 ? (
              <div className="text-2xl font-bold text-[#004C97]">
                {formatCurrency(result.summary.totalAnnualRetention)}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-[#2E7D32]">
                  S/ 0.00
                </div>
                <div className="text-xs text-[#666666] bg-[#E8F5E8] p-2 rounded border border-[#C8E6C9]">
                  <strong>No sujeto a retenciones</strong><br/>
                  Ingresos anuales no superan 7 UIT (S/ 37,450)
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#666666] flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Retención Mensual Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.summary.averageMonthlyRetention > 0 ? (
              <div className="text-2xl font-bold text-[#1976D2]">
                {formatCurrency(result.summary.averageMonthlyRetention)}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold text-[#2E7D32]">
                  S/ 0.00
                </div>
                <div className="text-xs text-[#666666] bg-[#E8F5E8] p-2 rounded border border-[#C8E6C9]">
                  <strong>Sin retenciones mensuales</strong><br/>
                  Aplica cuando ingresos &lt; 7 UIT
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Income Details */}
      {(result.summary.totalGratificaciones > 0 || result.summary.totalCTS > 0 || result.summary.totalAsignacionFamiliar > 0) && (
        <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
          <CardHeader className="bg-[#FFF3E0] -mt-6 -mx-6 px-6 pt-6 pb-4">
            <CardTitle className="flex items-center gap-2 text-[#FF9800]">
              <TrendingUp className="h-5 w-5" />
              Resumen de Ingresos Adicionales
            </CardTitle>
            <CardDescription className="text-[#FF9800]">
              Desglose de gratificaciones, CTS y asignación familiar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gratificaciones */}
              {result.summary.totalGratificaciones > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#333333] mb-3">Gratificaciones</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666666]">Total Anual:</span>
                      <span className="font-semibold text-[#FF9800]">{formatCurrency(result.summary.totalGratificaciones)}</span>
                    </div>
                    {result.summary.gratificacionesCalculadas.julio && (
                      <div className="text-xs text-[#666666] pl-2">
                        Julio: {formatCurrency(result.summary.gratificacionesCalculadas.julio.totalGratificacion)}
                      </div>
                    )}
                    {result.summary.gratificacionesCalculadas.diciembre && (
                      <div className="text-xs text-[#666666] pl-2">
                        Diciembre: {formatCurrency(result.summary.gratificacionesCalculadas.diciembre.totalGratificacion)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CTS */}
              {result.summary.totalCTS > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#333333] mb-3">CTS</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666666]">Total Anual:</span>
                      <span className="font-semibold text-[#FF9800]">{formatCurrency(result.summary.totalCTS)}</span>
                    </div>
                    {result.summary.ctsCalculadas.mayo && (
                      <div className="text-xs text-[#666666] pl-2">
                        Mayo: {formatCurrency(result.summary.ctsCalculadas.mayo.total)}
                      </div>
                    )}
                    {result.summary.ctsCalculadas.noviembre && (
                      <div className="text-xs text-[#666666] pl-2">
                        Noviembre: {formatCurrency(result.summary.ctsCalculadas.noviembre.total)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Asignación Familiar */}
              {result.summary.totalAsignacionFamiliar > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#333333] mb-3">Asignación Familiar</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666666]">Total Anual:</span>
                      <span className="font-semibold text-[#FF9800]">{formatCurrency(result.summary.totalAsignacionFamiliar)}</span>
                    </div>
                    <div className="text-xs text-[#666666] pl-2">
                      Mensual: {formatCurrency(result.summary.totalAsignacionFamiliar / 12)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deductible Expenses Summary */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className={`${result.summary.deductibleExpenses.totalExpenses > 0 ? "bg-[#E8F5E8]" : "bg-[#FFF3E0]"} -mt-6 -mx-6 px-6 pt-6 pb-4`}>
          <CardTitle className={`flex items-center gap-2 ${result.summary.deductibleExpenses.totalExpenses > 0 ? "text-[#2E7D32]" : "text-[#E65100]"}`}>
            <Receipt className="h-5 w-5" />
            Gastos Deducibles - Aplicación Condicional
          </CardTitle>
          <CardDescription className={result.summary.deductibleExpenses.totalExpenses > 0 ? "text-[#2E7D32]" : "text-[#E65100]"}>
            {result.summary.deductibleExpenses.totalExpenses > 0 
              ? "Deducción adicional de 3 UIT aplicada para el ejercicio 2025"
              : "No aplican gastos deducibles - ingresos anuales no superan 7 UIT (S/ 37,450)"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {result.summary.deductibleExpenses.totalExpenses > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#666666]">Total Gastos:</span>
                  <span className="font-semibold">{formatCurrency(result.summary.deductibleExpenses.totalExpenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#666666]">Deducción Aplicada:</span>
                  <span className="font-semibold text-[#2E7D32]">{formatCurrency(result.summary.deductibleExpenses.totalDeduction)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#666666]">Máxima Deducción (3 UIT):</span>
                  <span className="font-semibold">{formatCurrency(result.summary.deductibleExpenses.maxDeduction)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#666666]">Deducción Restante:</span>
                  <span className="font-semibold text-[#FF9800]">{formatCurrency(result.summary.deductibleExpenses.remainingDeduction)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-[#333333] mb-3">Desglose por Categoría:</h4>
                {Object.entries(result.summary.deductibleExpenses.breakdown).map(([key, item]) => {
                  if (item.amount > 0) {
                    return (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-[#666666] capitalize">
                          {key === 'restaurants' && 'Restaurantes'}
                          {key === 'medicalServices' && 'Servicios Médicos'}
                          {key === 'professionalServices' && 'Servicios Profesionales'}
                          {key === 'rentalProperties' && 'Alquiler'}
                          {key === 'essaludContributions' && 'EsSalud'}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.deduction)} ({item.percentage}%)
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-[#F5F5F5] p-6 rounded-lg border border-[#E0E0E0]">
                <div className="text-[#666666] mb-4">
                  <p className="text-lg font-medium mb-2">Los gastos deducibles no aplican en este caso</p>
                  <p className="text-sm">
                    Según la ley 2025, los gastos deducibles solo se aplican cuando los ingresos anuales superan 7 UIT (S/ 37,450).
                  </p>
                </div>
                <div className="text-xs text-[#999999]">
                  <p>Ingresos anuales proyectados: <strong>{formatCurrency(result.summary.totalAnnualIncome)}</strong></p>
                  <p>Umbral requerido: <strong>{formatCurrency(7 * 5350)}</strong></p>
                </div>
              </div>
            </div>
          )}
          
          {/* Botón para configurar gastos deducibles cuando aplican */}
          {result.summary.totalAnnualIncome > (7 * 5350) && (
            <div className="mt-6 text-center">
              <Button
                onClick={() => {
                  const encodedData = encodeURIComponent(JSON.stringify(result));
                  router.push(`/results/deductibles?data=${encodedData}`);
                }}
                className="bg-[#004C97] hover:bg-[#1976D2] text-white"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Configurar Gastos Deducibles
              </Button>
              <p className="text-xs text-[#666666] mt-2">
                Personaliza tus gastos deducibles para optimizar las retenciones
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Details */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#004C97] text-white -mt-6 -mx-6 px-6 pt-6 pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalle Mensual
          </CardTitle>
          <CardDescription className="text-[#E3F2FD]">
            Desglose de retenciones por mes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {/* Debug: Log complete array structure */}
          {(() => { console.log('Complete monthlyCalculations array:', result.monthlyCalculations); return null; })()}
          
          {/* Explicación cuando no hay retenciones */}
          {result.summary.totalAnnualRetention === 0 && (
            <div className="mb-6 p-4 bg-[#E8F5E8] border border-[#C8E6C9] rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-[#2E7D32] mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-[#2E7D32]">
                  <h4 className="font-medium mb-1">¡Buenas noticias!</h4>
                  <p className="text-sm">
                    No estás sujeto a retenciones de impuestos porque tus ingresos anuales proyectados 
                    (<strong>{formatCurrency(result.summary.totalAnnualIncome)}</strong>) no superan el umbral de 7 UIT 
                    (<strong>{formatCurrency(7 * 5350)}</strong>).
                  </p>
                  <p className="text-xs mt-2 opacity-75">
                    Esto significa que recibirás tu remuneración completa sin descuentos por impuestos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Explicación de la metodología SUNAT */}
          {result.summary.totalAnnualRetention > 0 && (
            <div className="mb-6 p-4 bg-[#E3F2FD] border border-[#1976D2] rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-[#1976D2] mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-[#1976D2]">
                  <h4 className="font-medium mb-2">📋 Metodología SUNAT para Cálculo de Retenciones</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>PASO 4 - Retención Ordinaria:</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                      <li><strong>Enero, Febrero y Marzo:</strong> Impuesto Anual Proyectado ÷ 12</li>
                      <li><strong>Abril:</strong> (IAP - Retenciones enero-marzo) ÷ 9</li>
                      <li><strong>Mayo, Junio y Julio:</strong> (IAP - Retenciones enero-abril) ÷ 8</li>
                      <li><strong>Agosto:</strong> (IAP - Retenciones enero-julio) ÷ 5</li>
                      <li><strong>Setiembre, Octubre y Noviembre:</strong> (IAP - Retenciones enero-agosto) ÷ 4</li>
                      <li><strong>Diciembre:</strong> IAP - Retenciones enero-noviembre</li>
                    </ul>
                    <p className="mt-2"><strong>PASO 5 - Retención Adicional:</strong> Solo para ingresos extraordinarios (bonificaciones, utilidades, etc.)</p>
                    <p className="text-xs opacity-75">
                      <strong>Total Retención = Retención Ordinaria + Retención Adicional</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0E0E0]">
                  <th className="text-left py-2 px-2 text-[#333333] font-medium">Mes</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Ingreso Base</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Adicional</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Gratificaciones</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">CTS</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Asignación</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Total Mes</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Ret. Ordinaria</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Ret. Adicional</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Total Retención</th>
                </tr>
              </thead>
              <tbody>
                {result.monthlyCalculations.map((month, index) => {
                  // Debug logging for all months
                  console.log(`Mes ${month.month} (${month.monthName}) - Índice ${index}:`, {
                    gratificaciones: month.gratificaciones,
                    cts: month.cts,
                    asignacionFamiliar: month.asignacionFamiliar,
                    totalMonthlyIncome: month.totalMonthlyIncome,
                    monthlyIncome: month.monthlyIncome,
                    additionalIncome: month.additionalIncome,
                    monthlyRetention: month.monthlyRetention,
                    additionalMonthlyRetention: month.additionalMonthlyRetention
                  });
                  
                  // Calcular retención ordinaria (total - adicional)
                  const retencionOrdinaria = month.monthlyRetention - (month.additionalMonthlyRetention || 0);
                  
                  return (
                    <tr key={month.month} className="border-b border-[#E0E0E0] hover:bg-[#E3F2FD] transition-colors duration-200">
                      <td className="py-2 px-2 font-medium text-[#333333]">{month.monthName}</td>
                      <td className="py-2 px-2 text-right text-[#666666]">{formatCurrency(month.monthlyIncome)}</td>
                      <td className="py-2 px-2 text-right text-[#666666]">
                        {month.additionalIncome > 0 ? formatCurrency(month.additionalIncome) : '-'}
                      </td>
                      <td className="py-2 px-2 text-right text-[#FF9800]">
                        {month.gratificaciones > 0 ? formatCurrency(month.gratificaciones) : '-'}
                      </td>
                      <td className="py-2 px-2 text-right text-[#FF9800]">
                        {month.cts > 0 ? formatCurrency(month.cts) : '-'}
                      </td>
                      <td className="py-2 px-2 text-right text-[#FF9800]">
                        {month.asignacionFamiliar > 0 ? formatCurrency(month.asignacionFamiliar) : '-'}
                      </td>
                      <td className="py-2 px-2 text-right font-semibold text-[#2E7D32]">
                        {formatCurrency(month.totalMonthlyIncome)}
                      </td>
                      <td className="py-2 px-2 text-right font-semibold text-[#004C97]">
                        {formatCurrency(retencionOrdinaria)}
                      </td>
                      <td className="py-2 px-2 text-right font-semibold text-[#FF9800]">
                        {month.additionalMonthlyRetention > 0 ? formatCurrency(month.additionalMonthlyRetention) : '-'}
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-[#B71C1C]">
                        {formatCurrency(month.monthlyRetention)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Resumen de retenciones */}
          {result.summary.totalAnnualRetention > 0 && (
            <div className="mt-6 p-4 bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-[#666666] mb-1">Total Retenciones Ordinarias</div>
                  <div className="text-lg font-bold text-[#004C97]">
                    {formatCurrency(result.monthlyCalculations.reduce((sum, month) => {
                      const ordinaria = month.monthlyRetention - (month.additionalMonthlyRetention || 0);
                      return sum + ordinaria;
                    }, 0))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-[#666666] mb-1">Total Retenciones Adicionales</div>
                  <div className="text-lg font-bold text-[#FF9800]">
                    {formatCurrency(result.monthlyCalculations.reduce((sum, month) => {
                      return sum + (month.additionalMonthlyRetention || 0);
                    }, 0))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-[#666666] mb-1">Total Retenciones Anuales</div>
                  <div className="text-xl font-bold text-[#B71C1C]">
                    {formatCurrency(result.summary.totalAnnualRetention)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
