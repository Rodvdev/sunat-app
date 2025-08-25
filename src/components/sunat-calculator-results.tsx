'use client';

import { SunatCalculationResult } from '@/lib/sunat-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileText, Receipt, Calculator, TrendingDown, Shield } from 'lucide-react';
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

      {/* PASO 2: Donaciones y PASO 3: Créditos Fiscales */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-gradient-to-r from-[#4CAF50] to-[#FF9800] text-white -mt-6 -mx-6 px-6 pt-6 pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Metodología SUNAT - Pasos 2 y 3
          </CardTitle>
          <CardDescription className="text-white opacity-90">
            Deducción de 7 UIT, donaciones y aplicación de créditos fiscales
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PASO 2: Donaciones */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#333333] text-lg mb-4 flex items-center gap-2">
                <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm">PASO 2</span>
                Donaciones (Artículo 49° de la Ley)
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Deducción 7 UIT</span>
                  <span className="font-bold text-[#4CAF50]">{formatCurrency(result.summary.deduction7UIT || 7 * 5350)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Monto de Donaciones</span>
                  <span className="font-semibold text-[#4CAF50]">
                    {formatCurrency(result.summary.donations || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Deducción por Donaciones</span>
                  <span className="font-semibold text-[#4CAF50]">
                    {formatCurrency(result.summary.donationsDeduction || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#4CAF50] text-white rounded-lg">
                  <span className="text-sm font-semibold">Ingreso Neto Final</span>
                  <span className="font-bold text-xl">
                    {formatCurrency(result.summary.finalNetIncome || result.summary.totalAnnualIncome - (7 * 5350) - result.summary.deductibleExpenses.totalDeduction)}
                  </span>
                </div>
              </div>
              
              {/* Información sobre donaciones */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-2">📋 Información Importante sobre Donaciones:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Solo se pueden deducir en diciembre con motivo del ajuste final del impuesto</li>
                    <li>• Solo aplica para trabajadores que perciben rentas de quinta categoría</li>
                    <li>• Las donaciones deben estar acreditadas con documentos según el Artículo 21°</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* PASO 3: Créditos Fiscales */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#333333] text-lg mb-4 flex items-center gap-2">
                <span className="bg-[#FF9800] text-white px-3 py-1 rounded-full text-sm">PASO 3</span>
                Créditos (Artículo 88° de la Ley)
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Impuesto Anual Proyectado</span>
                  <span className="font-bold text-[#FF9800]">
                    {formatCurrency(result.summary.projectedAnnualTax || result.summary.totalAnnualTax)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Total de Créditos Aplicables</span>
                  <span className="font-semibold text-[#FF9800]">
                    {formatCurrency(result.summary.totalTaxCredits || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#FF9800] text-white rounded-lg">
                  <span className="text-sm font-semibold">Impuesto Anual Final</span>
                  <span className="font-bold text-xl">
                    {formatCurrency(result.summary.finalAnnualTax || result.summary.totalAnnualTax)}
                  </span>
                </div>
              </div>

              {/* Desglose de créditos */}
              {result.summary.totalTaxCredits > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-[#333333] text-sm">Desglose de Créditos:</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#666666]">• Créditos Anteriores:</span>
                      <span className="font-medium">
                        {formatCurrency(result.summary.taxCreditsBreakdown?.previousCredits || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#666666]">• Pagos a Cuenta:</span>
                      <span className="font-medium">
                        {formatCurrency(result.summary.taxCreditsBreakdown?.previousPayments || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#666666]">• Saldos a Favor:</span>
                      <span className="font-medium">
                        {formatCurrency(result.summary.taxCreditsBreakdown?.previousRefunds || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Información sobre créditos */}
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                <div className="text-sm text-orange-700">
                  <p className="font-medium mb-2">💳 Información sobre Créditos:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Los créditos se deducen del impuesto anual proyectado</li>
                    <li>• Solo aplica para trabajadores que perciben rentas de quinta categoría</li>
                    <li>• Los saldos a favor deben estar reconocidos por SUNAT</li>
                    <li>• Solo Renta de Quinta Categoría: {result.summary.isOnlyFifthCategoryIncome ? 'Sí' : 'No'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <span className="text-sm font-semibold">Impuesto Anual Proyectado (Paso 3)</span>
                  <span className="font-bold text-xl">{formatCurrency(result.summary.projectedAnnualTax || result.summary.totalAnnualTax)}</span>
                </div>
                
                {/* PASO 3: Créditos Fiscales */}
                {result.summary.totalTaxCredits > 0 && (
                  <>
                    <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <span className="text-sm text-[#666666]">Menos: Total Créditos Aplicables</span>
                      <span className="font-semibold text-orange-600">- {formatCurrency(result.summary.totalTaxCredits)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-[#FF9800] text-white rounded-lg">
                      <span className="text-sm font-semibold">= Impuesto Anual Final</span>
                      <span className="font-bold text-xl">{formatCurrency(result.summary.finalAnnualTax || result.summary.totalAnnualTax)}</span>
                    </div>
                  </>
                )}
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

      {/* Sector Público Bonuses */}
      {((result.summary.totalAguinaldo || 0) > 0 || (result.summary.totalBonoEscolaridad || 0) > 0 || (result.summary.totalBonoJudicial || 0) > 0) && (
        <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
          <CardHeader className="bg-[#E3F2FD] -mt-6 -mx-6 px-6 pt-6 pb-4">
            <CardTitle className="flex items-center gap-2 text-[#1976D2]">
              <Shield className="h-5 w-5" />
              Bonos del Sector Público
            </CardTitle>
            <CardDescription className="text-[#1976D2]">
              Aguinaldo, bono por escolaridad y bono extraordinario judicial
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Aguinaldo */}
              {(result.summary.totalAguinaldo || 0) > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#333333] mb-3">Aguinaldo</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666666]">Total Anual:</span>
                      <span className="font-semibold text-[#1976D2]">{formatCurrency(result.summary.totalAguinaldo || 0)}</span>
                    </div>
                    <div className="text-xs text-[#666666] pl-2">
                      Julio: {formatCurrency(result.summary.totalAguinaldo || 0)}
                    </div>
                  </div>
                </div>
              )}

              {/* Bono por Escolaridad */}
              {(result.summary.totalBonoEscolaridad || 0) > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#333333] mb-3">Bono por Escolaridad</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666666]">Total Anual:</span>
                      <span className="font-semibold text-[#1976D2]">{formatCurrency(result.summary.totalBonoEscolaridad || 0)}</span>
                    </div>
                    <div className="text-xs text-[#666666] pl-2">
                      Mensual: {formatCurrency(result.summary.totalBonoEscolaridad || 0)}
                    </div>
                  </div>
                </div>
              )}

              {/* Bono Extraordinario Judicial */}
              {(result.summary.totalBonoJudicial || 0) > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#333333] mb-3">Bono Judicial</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666666]">Total Anual:</span>
                      <span className="font-semibold text-[#1976D2]">{formatCurrency(result.summary.totalBonoJudicial || 0)}</span>
                    </div>
                    <div className="text-xs text-[#666666] pl-2">
                      Enero: {formatCurrency(result.summary.totalBonoJudicial || 0)}
                    </div>
                    <div className="text-xs text-[#666666] pl-2 bg-blue-50 p-2 rounded border border-blue-200">
                      <strong>Requisitos:</strong> Personal judicial con ingresos &lt; S/ 2,000, excluyendo cargos directivos
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ajustes del Impuesto Anual: Donaciones y Créditos Fiscales */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-gradient-to-r from-[#4CAF50] to-[#FF9800] text-white -mt-6 -mx-6 px-6 pt-6 pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ajustes del Impuesto Anual Proyectado
          </CardTitle>
          <CardDescription className="text-white opacity-90">
            Deducción de 7 UIT, gastos deducibles, donaciones y aplicación de créditos fiscales
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Deducciones y Gastos Deducibles */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#333333] text-lg mb-4 flex items-center gap-2">
                <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm">DEDUCCIONES</span>
                Deducción de 7 UIT y Gastos Deducibles (Artículo 46°)
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Deducción 7 UIT</span>
                  <span className="font-bold text-[#4CAF50]">{formatCurrency(result.summary.deduction7UIT || 7 * 5350)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Gastos Deducibles Aplicados</span>
                  <span className="font-semibold text-[#4CAF50]">
                    {formatCurrency(result.summary.deductibleExpenses.totalDeduction)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Total Deducciones</span>
                  <span className="font-bold text-[#4CAF50]">
                    {formatCurrency((result.summary.deduction7UIT || 7 * 5350) + result.summary.deductibleExpenses.totalDeduction)}
                  </span>
                </div>
              </div>
            </div>

            {/* Donaciones y Créditos Fiscales */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#333333] text-lg mb-4 flex items-center gap-2">
                <span className="bg-[#FF9800] text-white px-3 py-1 rounded-full text-sm">AJUSTES</span>
                Donaciones y Créditos Fiscales
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Monto de Donaciones</span>
                  <span className="font-semibold text-[#FF9800]">
                    {formatCurrency(result.summary.donations || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Total Créditos Aplicables</span>
                  <span className="font-semibold text-[#FF9800]">
                    {formatCurrency(result.summary.totalTaxCredits || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-sm text-[#666666]">Impuesto Anual Final</span>
                  <span className="font-bold text-[#FF9800]">
                    {formatCurrency(result.summary.finalAnnualTax || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Información adicional sobre los ajustes */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h5 className="font-medium text-[#333333] mb-2">Información sobre los Ajustes:</h5>
            <div className="text-sm text-[#666666] space-y-1">
              <p>• <strong>Deducciones:</strong> Se aplican antes del cálculo del impuesto anual (Artículo 46° de la Ley)</p>
              <p>• <strong>Donaciones:</strong> Solo aplican en diciembre para rentas de quinta categoría (Artículo 49° de la Ley)</p>
              <p>• <strong>Créditos Fiscales:</strong> Se deducen del impuesto anual proyectado (Artículo 88° de la Ley)</p>
              <p>• <strong>Impuesto Final:</strong> Resultado después de aplicar todos los ajustes y créditos</p>
            </div>
          </div>
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
                  <h4 className="font-medium mb-2">📋 Metodología SUNAT Completa para Cálculo de Retenciones</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>PASO 1 - RBA Proyectada:</strong> Cálculo de remuneración bruta anual incluyendo ingresos adicionales</p>
                    <p><strong>PASO 2 - Deducción 7 UIT:</strong> Aplicación de deducción fija de 7 UIT y donaciones (solo en diciembre)</p>
                    <p><strong>PASO 3 - Impuesto y Créditos:</strong> Aplicación de tasas progresivas y deducción de créditos del Artículo 88°</p>
                    <p><strong>PASO 4 - Fraccionamiento:</strong> Distribución del impuesto anual en retenciones mensuales</p>
                    <p><strong>PASO 5 - Retenciones Adicionales:</strong> Cálculo de retenciones adicionales para ingresos extraordinarios</p>
                    
                    <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border border-[#1976D2]">
                      <p className="font-medium mb-2">PASO 4 - Retención Ordinaria:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1 text-xs">
                        <li><strong>Enero, Febrero y Marzo:</strong> Impuesto Anual Final ÷ 12</li>
                        <li><strong>Abril:</strong> (IAF - Retenciones enero-marzo) ÷ 9</li>
                        <li><strong>Mayo, Junio y Julio:</strong> (IAF - Retenciones enero-abril) ÷ 8</li>
                        <li><strong>Agosto:</strong> (IAF - Retenciones enero-julio) ÷ 5</li>
                        <li><strong>Setiembre, Octubre y Noviembre:</strong> (IAF - Retenciones enero-agosto) ÷ 4</li>
                        <li><strong>Diciembre:</strong> IAF - Retenciones enero-noviembre</li>
                      </ul>
                      <p className="mt-2 text-xs"><strong>PASO 5 - Retención Adicional:</strong> Solo para ingresos extraordinarios (bonificaciones, utilidades, etc.)</p>
                      <p className="text-xs opacity-75">
                        <strong>Total Retención = Retención Ordinaria + Retención Adicional</strong>
                      </p>
                    </div>
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
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Bonos Sector Público</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Total Mes</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Ret. Ordinaria</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Ret. Adicional</th>
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Total Retención</th>
                  <th className="text-left py-2 px-2 text-[#333333] font-medium">Metodología</th>
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
                  
                  // Determinar metodología aplicada según el mes
                  const getMetodologia = (monthNumber: number) => {
                    if (monthNumber >= 1 && monthNumber <= 3) return "Paso 4: ÷12";
                    if (monthNumber === 4) return "Paso 4: ÷9";
                    if (monthNumber >= 5 && monthNumber <= 7) return "Paso 4: ÷8";
                    if (monthNumber === 8) return "Paso 4: ÷5";
                    if (monthNumber >= 9 && monthNumber <= 11) return "Paso 4: ÷4";
                    if (monthNumber === 12) return "Paso 4: Ajuste";
                    return "";
                  };
                  
                  // Determinar si hay retención adicional (Paso 5)
                  const hasRetencionAdicional = month.additionalMonthlyRetention > 0;
                  const metodologiaCompleta = hasRetencionAdicional 
                    ? `${getMetodologia(month.month)} + Paso 5`
                    : getMetodologia(month.month);
                  
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
                      <td className="py-2 px-2 text-right text-[#FF9800]">
                        {(month.aguinaldo || 0) + (month.bonoEscolaridad || 0) + (month.bonoJudicial || 0) > 0 
                          ? formatCurrency((month.aguinaldo || 0) + (month.bonoEscolaridad || 0) + (month.bonoJudicial || 0)) 
                          : '-'}
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
                      <td className="py-2 px-2 text-left">
                        <div className="text-xs">
                          <div className={`font-medium ${hasRetencionAdicional ? 'text-[#F44336]' : 'text-[#9C27B0]'}`}>
                            {metodologiaCompleta}
                          </div>
                          {hasRetencionAdicional && (
                            <div className="text-[#FF9800] text-xs">
                              Ingresos extraordinarios
                            </div>
                          )}
                        </div>
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

      {/* Nota Final sobre Metodología SUNAT */}
      <Card className="border-[#E0E0E0] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#004C97] to-[#1976D2] text-white">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            📋 Información Legal y Metodología SUNAT
          </CardTitle>
          <CardDescription className="text-white opacity-90">
            Base legal y metodología completa para el cálculo de retenciones
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Base Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#333333] text-lg mb-3">⚖️ Base Legal</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-[#004C97] mb-2">Artículo 46° - Deducción de 7 UIT</h5>
                  <p className="text-[#666666]">
                    Los trabajadores pueden deducir un monto fijo equivalente a siete (7) UIT de su remuneración bruta anual.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h5 className="font-medium text-[#4CAF50] mb-2">Artículo 49° - Donaciones</h5>
                  <p className="text-[#666666]">
                    Las donaciones solo se pueden deducir en diciembre con motivo del ajuste final del impuesto, 
                    únicamente para trabajadores que perciben rentas de quinta categoría.
                  </p>
                </div>
                
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <h5 className="font-medium text-[#FF9800] mb-2">Artículo 53° - Tasas Progresivas</h5>
                  <p className="text-[#666666]">
                    Se aplican tasas progresivas del 8%, 14%, 17%, 20% y 30% según los tramos de ingresos netos anuales.
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h5 className="font-medium text-[#9C27B0] mb-2">Artículo 88° - Créditos Fiscales</h5>
                  <p className="text-[#666666]">
                    Los contribuyentes pueden deducir pagos a cuenta, créditos y saldos a favor reconocidos por SUNAT.
                  </p>
                </div>
              </div>
            </div>

            {/* Metodología Completa */}
            <div className="space-y-4">
              <h4 className="font-semibold text-[#333333] text-lg mb-3">🧮 Metodología SUNAT - 5 Pasos</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#004C97] text-white px-2 py-1 rounded text-xs font-bold">PASO 1</span>
                    <span className="font-medium">RBA Proyectada</span>
                  </div>
                  <p className="text-[#666666]">
                    Cálculo de remuneración bruta anual incluyendo ingresos adicionales, gratificaciones, CTS y asignación familiar.
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#4CAF50] text-white px-2 py-1 rounded text-xs font-bold">PASO 2</span>
                    <span className="font-medium">Deducción 7 UIT</span>
                  </div>
                  <p className="text-[#666666]">
                    Aplicación de deducción fija de 7 UIT, gastos deducibles adicionales (3 UIT) y donaciones.
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#FF9800] text-white px-2 py-1 rounded text-xs font-bold">PASO 3</span>
                    <span className="font-medium">Impuesto y Créditos</span>
                  </div>
                  <p className="text-[#666666]">
                    Aplicación de tasas progresivas del Artículo 53° y deducción de créditos del Artículo 88°.
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#9C27B0] text-white px-2 py-1 rounded text-xs font-bold">PASO 4</span>
                    <span className="font-medium">Fraccionamiento</span>
                  </div>
                  <p className="text-[#666666]">
                    Distribución progresiva del impuesto anual en retenciones mensuales según la metodología SUNAT.
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#F44336] text-white px-2 py-1 rounded text-xs font-bold">PASO 5</span>
                    <span className="font-medium">Retenciones Adicionales</span>
                  </div>
                  <p className="text-[#666666]">
                    Cálculo de retenciones adicionales para ingresos extraordinarios (bonificaciones, utilidades, etc.).
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Nota Importante */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-yellow-800">
                <h5 className="font-medium mb-2">⚠️ Nota Importante</h5>
                <p className="text-sm">
                  Este cálculo está basado en la metodología oficial de SUNAT para el ejercicio 2025. 
                  Los resultados son informativos y deben ser verificados por un contador o asesor fiscal. 
                  La aplicación de donaciones y créditos requiere documentación específica según la normativa vigente.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
