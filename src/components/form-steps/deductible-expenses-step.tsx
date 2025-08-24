'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Info, AlertTriangle } from 'lucide-react';

// Import the form data type from the parent component
type FormData = {
  year: number;
  monthlyIncome: number;
  additionalIncome: number;
  additionalMonth: number;
  calculationMonth: number;
  previousRetentions: number;
  roundingDecimals: number;
  restaurants: number;
  medicalServices: number;
  professionalServices: number;
  rentalProperties: number;
  essaludContributions: number;
  gratificaciones: number;
  bonificaciones: number;
  utilidades: number;
  cts: number;
  asignacionFamiliar: number;
  gratificacionesMonth?: number;
  bonificacionesMonth?: number;
  utilidadesMonth?: number;
  ctsMonth?: number;
  asignacionFamiliarMonth?: number;
  calculateGratificaciones: boolean;
  calculateCTS: boolean;
  calculateAsignacionFamiliar: boolean;
  insuranceType: 'essalud' | 'eps';
  startWorkMonth: number;
  hasChildren: boolean;
  childrenCount: number;
  childrenStudying: boolean;
};

interface DeductibleExpensesStepProps {
  form: UseFormReturn<FormData>;
}

export function DeductibleExpensesStep({ form }: DeductibleExpensesStepProps) {
  const totalDeductibleExpenses = form.watch('restaurants') + form.watch('medicalServices') + 
    form.watch('professionalServices') + form.watch('rentalProperties') + form.watch('essaludContributions');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Information Card */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#E3F2FD] pb-4 -mt-6 -mx-6 px-6 pt-6">
          <CardTitle className="text-lg text-[#004C97] flex items-center gap-2">
            <Info className="h-5 w-5" />
            Gastos Deducibles 2025 - Aplicación Condicional
          </CardTitle>
          <CardDescription className="text-[#1976D2]">
            Deducción adicional de 3 UIT solo si los ingresos anuales superan 7 UIT (S/ 37,450)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-[#E3F2FD] p-4 rounded-lg border border-[#1976D2]">
            <h4 className="font-semibold text-[#004C97] mb-2">💡 Aplicación Condicional según Ley 2025:</h4>
            <ul className="space-y-1 text-sm text-[#1976D2]">
              <li>• <strong>Condición principal:</strong> Solo aplica si tus ingresos anuales superan 7 UIT (S/ 37,450)</li>
              <li>• <strong>Límite máximo:</strong> 3 UIT (S/ 16,050) para el año 2025</li>
              <li>• <strong>Porcentajes por tipo:</strong> Restaurantes (15%), Médicos (30%), Profesionales (30%), Alquiler (30%), EsSalud (100%)</li>
              <li>• <strong>Requisitos:</strong> Comprobantes válidos con tu DNI/RUC y negocio habido</li>
              <li>• <strong>Medios de pago:</strong> Electrónicos obligatorios para montos ≥ S/ 2,000</li>
            </ul>
          </div>
          
          <div className="bg-[#FFEBEE] p-4 rounded-lg border border-[#B71C1C] mt-4">
            <h4 className="font-semibold text-[#B71C1C] mb-2">⚠️ Importante:</h4>
            <p className="text-sm text-[#B71C1C]">
              Los gastos deducibles se aplicarán <strong>automáticamente</strong> solo si tus ingresos anuales proyectados superan S/ 37,450. 
              Si no calificas, estos gastos no afectarán tu cálculo de impuestos.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Deductible Expenses Form */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#004C97] text-white pb-4 -mt-6 -mx-6 px-6 pt-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Configuración de Gastos Deducibles
          </CardTitle>
          <CardDescription className="text-[#E3F2FD]">
            Ingresa los montos de tus gastos deducibles según categoría
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="restaurants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">Restaurantes, Bares y Hoteles (15%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01" 
                      className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30"
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-[#666666]">
                    Gastos en restaurantes, hoteles y establecimientos similares
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="medicalServices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">Servicios Médicos y Odontológicos (30%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01" 
                      className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30"
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-[#666666]">
                    Consultas médicas, odontológicas y servicios de salud
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professionalServices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">Servicios Profesionales y Oficios (30%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01" 
                      className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30"
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-[#666666]">
                    Servicios de abogados, contadores, arquitectos, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rentalProperties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">Alquiler de Inmuebles (30%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01" 
                      className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30"
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-[#666666]">
                    Alquiler de vivienda no destinada a actividades empresariales
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="essaludContributions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">Aportaciones EsSalud (100%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01" 
                      className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30"
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-[#666666]">
                    Aportaciones para trabajadores del hogar (9% de remuneración)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Total Summary */}
          {totalDeductibleExpenses > 0 && (
            <div className="mt-6 pt-4 border-t border-[#E0E0E0]">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-[#333333]">Total Gastos Deducibles:</span>
                <span className="text-xl font-semibold text-[#004C97]">{formatCurrency(totalDeductibleExpenses)}</span>
              </div>
              <div className="mt-2 text-sm text-[#666666]">
                Límite máximo: {formatCurrency(16050)} (3 UIT)
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warning Card */}
      <Card className="border-[#B71C1C] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#FFEBEE] pb-4 -mt-6 -mx-6 px-6 pt-6">
          <CardTitle className="text-lg text-[#B71C1C] flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Requisitos Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 text-sm text-[#B71C1C]">
            <div className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Los comprobantes deben identificar tu DNI o RUC</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>El negocio debe estar activo en RUC y habido</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Para montos ≥ S/ 2,000: usar medios de pago electrónicos</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Los gastos deben estar sustentados con comprobantes válidos</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
