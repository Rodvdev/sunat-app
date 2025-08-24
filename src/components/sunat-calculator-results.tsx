'use client';

import { SunatCalculationResult } from '@/lib/sunat-calculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileText, Receipt, Calculator, TrendingDown } from 'lucide-react';
import { Label } from '@/components/ui/label';

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

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-[#E0E0E0] shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#666666] flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ingreso Anual Total
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
            <div className="text-2xl font-bold text-[#004C97]">
              {formatCurrency(result.summary.totalAnnualRetention)}
            </div>
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
            <div className="text-2xl font-bold text-[#1976D2]">
              {formatCurrency(result.summary.averageMonthlyRetention)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Income Details */}
      {(result.summary.totalGratificaciones > 0 || result.summary.totalCTS > 0 || result.summary.totalAsignacionFamiliar > 0) && (
        <Card className="border-[#E0E0E0] shadow-sm">
          <CardHeader className="bg-[#FFF3E0]">
            <CardTitle className="flex items-center gap-2 text-[#FF9800]">
              <TrendingUp className="h-5 w-5" />
              Resumen de Ingresos Adicionales
            </CardTitle>
            <CardDescription className="text-[#FF9800]">
              Desglose de gratificaciones, CTS y asignación familiar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
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
      <Card className="border-[#E0E0E0] shadow-sm">
        <CardHeader className={result.summary.deductibleExpenses.totalExpenses > 0 ? "bg-[#E8F5E8]" : "bg-[#FFF3E0]"}>
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
        <CardContent className="p-6">
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
                  <span className="text-sm text-[#666666]">Límite Máximo (3 UIT):</span>
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
        </CardContent>
      </Card>

      {/* Monthly Details */}
      <Card className="border-[#E0E0E0] shadow-sm">
        <CardHeader className="bg-[#004C97] text-white">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalle Mensual
          </CardTitle>
          <CardDescription className="text-[#E3F2FD]">
            Desglose de retenciones por mes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
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
                  <th className="text-right py-2 px-2 text-[#333333] font-medium">Retención</th>
                </tr>
              </thead>
              <tbody>
                {result.monthlyCalculations.map((month) => (
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
                      {formatCurrency(month.monthlyRetention)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* UIT Information */}
      <Card className="border-[#E0E0E0] shadow-sm">
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
    </div>
  );
}
