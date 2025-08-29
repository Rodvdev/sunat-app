'use client';

import { SunatCalculationResult } from '@/lib/sunat-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileText, Calculator, TrendingDown, Shield } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  // Función para generar el tooltip detallado de cada mes
  const generateMonthTooltip = (month: SunatCalculationResult['monthlyCalculations'][0], index: number, allMonths: SunatCalculationResult['monthlyCalculations']) => {
    const hasPreviousAdditionalIncome = allMonths.slice(0, index).some(m => m.additionalIncome > 0);
    const isFirstAdditionalIncomeMonth = month.additionalIncome > 0 && !hasPreviousAdditionalIncome;
    
    return (
      <div className="w-96 max-w-md bg-white border border-[#E0E0E0] rounded-lg shadow-xl p-6 mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E0E0E0]">
          <div className="w-3 h-3 bg-[#004C97] rounded-full"></div>
          <h3 className="text-lg font-semibold text-[#333333]">
            📅 {month.monthName} - Cálculo Detallado
          </h3>
        </div>

        {/* Ingresos del Mes */}
        <div className="mb-4">
          <h4 className="font-medium text-[#333333] mb-2 text-sm">💰 Ingresos del Mes</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-[#666666]">Sueldo Base:</span>
              <span className="font-medium text-[#2E7D32]">{formatCurrency(month.monthlyIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Ingreso Adicional:</span>
              <span className="font-medium text-[#FF9800]">
                {month.additionalIncome > 0 ? formatCurrency(month.additionalIncome) : 'S/ 0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Gratificaciones:</span>
              <span className="font-medium text-[#FF9800]">
                {month.gratificaciones > 0 ? formatCurrency(month.gratificaciones) : 'S/ 0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">CTS:</span>
              <span className="font-medium text-[#FF9800]">
                {month.cts > 0 ? formatCurrency(month.cts) : 'S/ 0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666]">Asignación Familiar:</span>
              <span className="font-medium text-[#FF9800]">
                {month.asignacionFamiliar > 0 ? formatCurrency(month.asignacionFamiliar) : 'S/ 0.00'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#E0E0E0]">
              <span className="font-medium text-[#333333]">Total del Mes:</span>
              <span className="font-bold text-[#2E7D32] text-lg">{formatCurrency(month.totalMonthlyIncome)}</span>
            </div>
          </div>
        </div>

        {/* Explicación del Cálculo */}
        <div className="mb-4">
          {month.additionalIncome > 0 ? (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-[#004C97] mb-2 text-sm">🔄 Recálculo por Ingreso Adicional</h4>
                <div className="space-y-1 text-xs text-[#666666]">
                  <div>• RBA Original: {formatCurrency(month.monthlyIncome * 12)}</div>
                  <div>• RBA + Ingreso Adicional: {formatCurrency(month.monthlyIncome * 12 + month.additionalIncome)}</div>
                  <div>• Impuesto Anual Recalculado: {formatCurrency(month.monthlyRetention * (13 - month.month))}</div>
                  <div>• Meses Restantes: {13 - month.month}</div>
                  <div>• Retención Mensual: {formatCurrency(month.monthlyRetention)}</div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-[#4CAF50] mb-2 text-sm">📊 Distribución del Impuesto Adicional</h4>
                <div className="space-y-1 text-xs text-[#666666]">
                  <div>• Se distribuye la diferencia de impuesto desde este mes en adelante</div>
                  <div>• Retención Ordinaria: {formatCurrency(month.monthlyRetention)}</div>
                  <div>• Retención Adicional: {formatCurrency(month.additionalMonthlyRetention || 0)}</div>
                  <div>• Total: {formatCurrency(month.monthlyRetention)}</div>
                </div>
              </div>
            </div>
          ) : hasPreviousAdditionalIncome ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-[#4CAF50] mb-2 text-sm">📈 Continuación con Impuesto Recalculado</h4>
              <div className="space-y-1 text-xs text-[#666666]">
                <div>• Ya se recibió ingreso adicional en mes anterior</div>
                <div>• Se mantiene la retención recalculada</div>
                <div>• Retención Mensual: {formatCurrency(month.monthlyRetention)}</div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-[#4CAF50] mb-2 text-sm">📋 Cálculo Base (Sin Ingresos Adicionales)</h4>
              <div className="space-y-1 text-xs text-[#666666]">
                <div>• RBA Base: {formatCurrency(month.monthlyIncome * 12)}</div>
                <div>• Impuesto Anual Base: {formatCurrency(month.monthlyRetention * 12)}</div>
                <div>• Retención Mensual: {formatCurrency(month.monthlyRetention)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Retención Adicional */}
        {month.additionalMonthlyRetention > 0 && (
          <div className="mb-4">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-[#FF9800] mb-2 text-sm">💰 Retención Adicional (PASO 5 SUNAT)</h4>
              <div className="space-y-1 text-xs text-[#666666]">
                <div>• Ingreso Extraordinario: {formatCurrency(month.additionalIncome)}</div>
                <div>• Diferencia de Impuesto: {formatCurrency(month.additionalMonthlyRetention)}</div>
                <div>• Se aplica solo en este mes</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#E0E0E0]">
          <div className="text-xs text-[#666666] bg-blue-50 p-2 rounded border border-blue-200">
            <span className="font-medium text-[#004C97]">💡 Metodología SUNAT:</span>{' '}
            {isFirstAdditionalIncomeMonth 
              ? 'Recálculo progresivo desde este mes' 
              : hasPreviousAdditionalIncome 
                ? 'Continuación con impuesto recalculado' 
                : 'Cálculo base sin ajustes'
            }
          </div>
        </div>
      </div>
    );
  };


  // Debug: Log complete result object
  console.log('Complete result object received:', result);
  console.log('Summary data:', result.summary);
  console.log('First month calculation:', result.monthlyCalculations[0]);


  return (
    <TooltipProvider>
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
              {(result.summary.totalAguinaldo ?? 0) > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#333333] mb-3">Aguinaldo</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666666]">Total Anual:</span>
                      <span className="font-semibold text-[#1976D2]">{formatCurrency(result.summary.totalAguinaldo ?? 0)}</span>
                    </div>
                    <div className="text-xs text-[#666666] pl-2">
                      Julio: {formatCurrency(result.summary.totalAguinaldo ?? 0)}
                    </div>
                  </div>
                </div>
              )}

              {/* Bono por Escolaridad */}
              {(result.summary.totalBonoEscolaridad ?? 0) > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#333333] mb-3">Bono por Escolaridad</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666666]">Total Anual:</span>
                      <span className="font-semibold text-[#1976D2]">{formatCurrency(result.summary.totalBonoEscolaridad ?? 0)}</span>
                    </div>
                    <div className="text-xs text-[#666666] pl-2">
                      Mensual: {formatCurrency(result.summary.totalBonoEscolaridad ?? 0)}
                    </div>
                  </div>
                </div>
              )}

              {/* Bono Extraordinario Judicial */}
              {(result.summary.totalBonoJudicial ?? 0) > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-[#333333] mb-3">Bono Judicial</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666666]">Total Anual:</span>
                      <span className="font-semibold text-[#1976D2]">{formatCurrency(result.summary.totalBonoJudicial ?? 0)}</span>
                    </div>
                    <div className="text-xs text-[#666666] pl-2">
                      Enero: {formatCurrency(result.summary.totalBonoJudicial ?? 0)}
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

      {/* Ajustes del Impuesto Anual: Donaciones y Créditos Fiscales - Solo mostrar si hay ajustes aplicables */}
      {(() => {
        const shouldShow = (result.summary.deductibleExpenses.totalDeduction > 0) || 
                          (result.summary.donations && result.summary.donations > 0) || 
                          (result.summary.totalTaxCredits && result.summary.totalTaxCredits > 0);
        
        return shouldShow ? true : null;
      })() && (
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
                      {result.summary.donations && result.summary.donations > 0 ? formatCurrency(result.summary.donations) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <span className="text-sm text-[#666666]">Total Créditos Aplicables</span>
                    <span className="font-semibold text-[#FF9800]">
                      {result.summary.totalTaxCredits && result.summary.totalTaxCredits > 0 ? formatCurrency(result.summary.totalTaxCredits) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <span className="text-sm text-[#666666]">Impuesto Anual Final</span>
                    <span className="font-bold text-[#FF9800]">
                      {result.summary.finalAnnualTax && result.summary.finalAnnualTax > 0 ? formatCurrency(result.summary.finalAnnualTax) : '-'}
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
      )}


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
              <h4 className="font-semibold text-[#333333] text-lg mb-4">Escalas Progresivas de Impuesto</h4>
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
              <h4 className="font-semibold text-[#333333] text-lg mb-4">Cálculo del Impuesto Anual Proyectado</h4>
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

      {/* Monthly Details */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#004C97] text-white -mt-6 -mx-6 px-6 pt-6 pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalle Mensual
          </CardTitle>
          <CardDescription className="text-[#E3F2FD]">
            Desglose de retenciones por mes • Hover sobre cada fila para ver el cálculo detallado
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {/* Explicación de la nueva lógica de recálculo */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-blue-800">
                <h4 className="font-medium mb-2">🔄 Nueva Lógica de Recálculo SUNAT</h4>
                <p className="text-sm mb-2">
                  <strong>Haz hover sobre cualquier fila de la tabla para ver el cálculo detallado del mes.</strong>
                </p>
                <div className="text-xs space-y-1">
                  <p>• <strong>Meses Base:</strong> Retención uniforme del impuesto anual proyectado</p>
                  <p>• <strong>Mes con Ingreso Adicional:</strong> Se recalcula la retención para distribuir la diferencia de impuesto</p>
                  <p>• <strong>Meses Posteriores:</strong> Continúan con la retención recalculada</p>
                  <p>• <strong>Retención Adicional:</strong> Se aplica solo en el mes del ingreso extraordinario (PASO 5 SUNAT)</p>
                </div>
              </div>
            </div>
          </div>

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

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E0E0E0]">
                  <th className="text-left py-2 px-2 text-[#333333] font-medium">
                    Mes
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-blue-600 font-normal">(hover para detalles)</span>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                  </th>
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
                </tr>
              </thead>
              <tbody>
                {result.monthlyCalculations.map((month, index) => {
                  const retencionOrdinaria = month.monthlyRetention - (month.additionalMonthlyRetention || 0);
                  
                  return (
                    <Tooltip key={month.month}>
                      <TooltipTrigger asChild>
                        <tr className="border-b border-[#E0E0E0] hover:bg-[#E3F2FD] hover:shadow-sm transition-all duration-200 cursor-help group">
                                                      <td className="py-2 px-2 font-medium text-[#333333] group-hover:text-[#004C97] transition-colors duration-200">
                              {month.monthName}
                            </td>
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
                        </tr>
                      </TooltipTrigger>
                      <TooltipContent 
                        className="max-w-md p-0" 
                        side="top"
                        align="center"
                        sideOffset={10}
                        alignOffset={0}
                      >
                        {generateMonthTooltip(month, index, result.monthlyCalculations)}
                      </TooltipContent>
                    </Tooltip>
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
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-gradient-to-r from-[#004C97] to-[#1976D2] text-white -mt-6 -mx-6 px-6 pt-6 pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información Legal y Metodología SUNAT
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
              <h4 className="font-semibold text-[#333333] text-lg mb-3">Metodología SUNAT - 5 Pasos (Actualizada)</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#004C97] text-white px-2 py-1 rounded text-xs font-bold">PASO 1</span>
                    <span className="font-medium">RBA Proyectada (Solo Ingresos Ordinarios)</span>
                  </div>
                  <p className="text-[#666666]">
                    <strong>CORRECCIÓN:</strong> RBA solo incluye sueldo + gratificaciones + asignación familiar. 
                    <strong>NO incluye:</strong> CTS (no gravada), ingresos adicionales (van por Paso 5), conceptos extraordinarios.
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
                    <span className="font-medium">Impuesto Progresivo por Tramos</span>
                  </div>
                  <p className="text-[#666666]">
                    <strong>CORRECCIÓN:</strong> Uso de cálculo progresivo por tramos (8%, 14%, 17%, 20%, 30%) 
                    en lugar de tasa plana. Aplicación de créditos del Artículo 88°.
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#9C27B0] text-white px-2 py-1 rounded text-xs font-bold">PASO 4</span>
                    <span className="font-medium">Fraccionamiento Inteligente</span>
                  </div>
                  <p className="text-[#666666]">
                    <strong>CORRECCIÓN:</strong> Distribución progresiva del impuesto anual. 
                    <strong>Meses base:</strong> Retención uniforme. 
                    <strong>Mes con ingreso adicional:</strong> Recalculo para distribuir diferencia. 
                    <strong>Meses posteriores:</strong> Continúan con retención recalculada.
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#F44336] text-white px-2 py-1 rounded text-xs font-bold">PASO 5</span>
                    <span className="font-medium">Retenciones Adicionales (Sin Tope 30%)</span>
                  </div>
                  <p className="text-[#666666]">
                    <strong>CORRECCIÓN:</strong> Cálculo de retenciones adicionales para ingresos extraordinarios 
                    (bonificaciones, utilidades, etc.) sin tope artificial del 30%. 
                    Se aplica solo en el mes del ingreso extraordinario.
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
                <h5 className="font-medium mb-2">Nota Importante</h5>
                <p className="text-sm">
                  Este cálculo está basado en la metodología oficial de SUNAT para el ejercicio 2025. 
                  Los resultados son informativos y deben ser verificados por un contador o asesor fiscal. 
                  La aplicación de donaciones y créditos requiere documentación específica según la normativa vigente.
                </p>
              </div>
            </div>
          </div>

          {/* Resumen de Correcciones Implementadas */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-green-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-green-800">
                <h5 className="font-medium mb-2">✅ Correcciones Implementadas</h5>
                <div className="text-sm space-y-1">
                  <p>• <strong>Impuesto Progresivo:</strong> Reemplazado tasa plana por cálculo progresivo por tramos</p>
                  <p>• <strong>RBA Limpia:</strong> Excluidos ingresos extraordinarios y CTS de la base imponible</p>
                  <p>• <strong>Recálculo Inteligente:</strong> Retenciones se ajustan solo desde el mes del ingreso adicional</p>
                  <p>• <strong>Sin Tope 30%:</strong> Eliminado límite artificial en retenciones adicionales</p>
                  <p>• <strong>Metodología SUNAT:</strong> Implementada lógica correcta de fraccionamiento progresivo</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </TooltipProvider>
  );
}
