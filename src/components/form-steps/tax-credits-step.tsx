'use client';

import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Info, Gift, CreditCard, FileText, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

// Import the form data type from the parent component
type FormData = {
  year: number;
  monthlyIncome: number;
  additionalIncomeByMonth: { month: number; amount: number }[];
  additionalIncome: number;
  additionalMonth: number;
  calculationMonth: number;
  previousRetentions: number;
  roundingDecimals: number;
  // Deductible expenses
  restaurants: number;
  medicalServices: number;
  professionalServices: number;
  rentalProperties: number;
  essaludContributions: number;
  // Nuevos campos para ingresos adicionales
  gratificaciones: number;
  bonificaciones: number;
  utilidades: number;
  cts: number;
  asignacionFamiliar: number;
  // Campos para configuración de meses
  gratificacionesMonth?: number;
  bonificacionesMonth?: number;
  utilidadesMonth?: number;
  ctsMonth?: number;
  asignacionFamiliarMonth?: number;
  // Campos para configuración de cálculos automáticos
  calculateGratificaciones: boolean;
  calculateCTS: boolean;
  calculateAsignacionFamiliar: boolean;
  // Campos para gratificaciones
  insuranceType: 'essalud' | 'eps';
  startWorkMonth: number;
  // Campos para asignación familiar
  hasChildren: boolean;
  childrenCount: number;
  childrenStudying: boolean;
  // Campos para contratos de duración limitada
  isLimitedContract: boolean;
  contractEndMonth?: number;
  // Campo para sector público
  isPublicSectorWorker: boolean;
  // Campo para bono por escolaridad del sector público
  receivesSchoolingBonus: boolean;
  // Campos para bono extraordinario judicial
  isJudicialWorker: boolean;
  judicialInstitution?: 'poder_judicial' | 'inpe' | 'ministerio_publico';
  isDirectivePosition: boolean;
  // PASO 2: Campo para donaciones según Artículo 49° de la Ley
  donations?: number;
  // PASO 3: Campos para créditos según Artículo 88° de la Ley
  previousTaxCredits?: number;
  previousTaxPayments?: number;
  previousTaxRefunds?: number;
  isOnlyFifthCategoryIncome?: boolean;
};

interface TaxCreditsStepProps {
  form: UseFormReturn<FormData>;
}

export function TaxCreditsStep({ form }: TaxCreditsStepProps) {
  console.log('🎭 TaxCreditsStep renderizado');
  console.log('  • Form data:', form.getValues());
  console.log('  • Form state:', form.formState);
  
  // Verificar que no haya eventos automáticos
  useEffect(() => {
    console.log('🔍 TaxCreditsStep: useEffect ejecutado');
    console.log('  • Verificando que no haya eventos automáticos...');
    
    // Verificar el estado del formulario
    const subscription = form.watch((value, { name, type }) => {
      console.log('👀 TaxCreditsStep: Form field changed', { name, type, value });
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
        <h3 className="font-bold text-blue-800 mb-2">🔧 DEBUG: TaxCreditsStep Renderizado</h3>
        <p className="text-blue-700 text-sm">
          Este es el Paso 4 del formulario. Si puedes ver esto, el componente se está renderizando correctamente.
        </p>
        <p className="text-blue-700 text-sm mt-2">
          Paso actual: 4 | Total pasos: 4
        </p>
        <div className="mt-3 p-2 bg-blue-200 rounded text-xs">
          <p><strong>Estado del formulario:</strong></p>
          <p>• isValid: {form.formState.isValid ? 'Sí' : 'No'}</p>
          <p>• isDirty: {form.formState.isDirty ? 'Sí' : 'No'}</p>
          <p>• isSubmitting: {form.formState.isSubmitting ? 'Sí' : 'No'}</p>
          <p>• isSubmitted: {form.formState.isSubmitted ? 'Sí' : 'No'}</p>
        </div>
      </div>

      {/* Paso 2: Donaciones */}
      <Card className="border-[#E0E0E0] shadow-sm">
        <CardHeader className="bg-[#4CAF50] text-white">
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Paso 2: Donaciones (Artículo 49° de la Ley)
          </CardTitle>
          <CardDescription className="text-[#E8F5E8]">
            Configura las donaciones que se pueden deducir en diciembre con motivo del ajuste final del impuesto
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-400 mr-2" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Información Importante:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Las donaciones solo se pueden deducir en diciembre con motivo del ajuste final del impuesto</li>
                  <li>• Solo aplica para trabajadores que perciben rentas de quinta categoría</li>
                  <li>• Las donaciones deben estar acreditadas con documentos según el Artículo 21° de la Ley</li>
                </ul>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="donations"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Monto de Donaciones del Año (S/)
                </FormLabel>
                <FormDescription>
                  Ingresa el monto total de donaciones efectuadas durante el año fiscal
                </FormDescription>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className="max-w-xs"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <div className="h-px bg-gray-200 my-6" />

      {/* Paso 3: Créditos */}
      <Card className="border-[#E0E0E0] shadow-sm">
        <CardHeader className="bg-[#FF9800] text-white">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paso 3: Créditos (Artículo 88° de la Ley)
          </CardTitle>
          <CardDescription className="text-[#FFF3E0]">
            Configura los créditos que se pueden deducir del impuesto anual proyectado
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-orange-400 mr-2" />
              <div className="text-sm text-orange-700">
                <p className="font-medium">Información sobre Créditos:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Los créditos se deducen del impuesto anual proyectado</li>
                  <li>• Solo aplica para trabajadores que perciben rentas de quinta categoría</li>
                  <li>• Los saldos a favor deben estar reconocidos por SUNAT o en declaraciones anteriores no impugnadas</li>
                </ul>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="isOnlyFifthCategoryIncome"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-base font-semibold">
                    Solo percibo rentas de quinta categoría
                  </FormLabel>
                  <FormDescription>
                    Marca esta casilla si solo percibes rentas de quinta categoría (Artículo 79° de la Ley)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="previousTaxCredits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Créditos de Declaraciones Anteriores (S/)
                  </FormLabel>
                  <FormDescription>
                    Créditos contra el tributo de declaraciones anteriores
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previousTaxPayments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Pagos a Cuenta del Impuesto (S/)
                  </FormLabel>
                  <FormDescription>
                    Pagos efectuados a cuenta del impuesto liquidado
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="previousTaxRefunds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Saldos a Favor Reconocidos (S/)
                  </FormLabel>
                  <FormDescription>
                    Saldos a favor reconocidos por SUNAT o establecidos en declaraciones anteriores
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-800">Documentación Requerida:</p>
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li>• Los créditos deben estar documentados y justificados</li>
                  <li>• Los saldos a favor deben estar reconocidos por SUNAT</li>
                  <li>• Las declaraciones anteriores no deben estar impugnadas</li>
                  <li>• Solo aplica para rentas de quinta categoría según el Artículo 79°</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
