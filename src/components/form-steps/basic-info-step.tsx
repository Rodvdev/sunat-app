'use client';

import { UseFormReturn } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Calculator, Users, Gift, Calendar, ChevronDown, ChevronRight } from 'lucide-react';
import { RemunerationDisplay } from '../remuneration-display';

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
};

interface BasicInfoStepProps {
  form: UseFormReturn<FormData>;
}

const monthOptions = [
  { value: '1', label: 'Enero' },
  { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' },
  { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' }
];

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const [isPublicSectorExpanded, setIsPublicSectorExpanded] = useState(false);
  const [isCalculationsExpanded, setIsCalculationsExpanded] = useState(false);
  
  // Sincronizar calculationMonth con startWorkMonth
  useEffect(() => {
    const startWorkMonth = form.watch('startWorkMonth');
    if (startWorkMonth) {
      form.setValue('calculationMonth', startWorkMonth);
    }
  }, [form.watch('startWorkMonth'), form]);

  return (
    <div className="space-y-8">
      {/* Display Remuneration Calculation */}
      <RemunerationDisplay watch={form.watch} currentStep={1} />
      
      {/* Basic Information Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">Año Fiscal</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="2025" 
                      className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30"
                      {...field} 
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-[#666666]">
                    Año para el cual se calculan las retenciones
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">Ingreso Mensual (S/)</FormLabel>
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
                    Ingreso mensual base antes de impuestos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />



            <FormField
              control={form.control}
              name="previousRetentions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">Retenciones Previas (S/)</FormLabel>
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
                    Retenciones ya pagadas en meses anteriores
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startWorkMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">Mes de Inicio de Trabajo</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30">
                        <SelectValue placeholder="Selecciona el mes" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {monthOptions.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[#666666]">
                    Mes en que comenzaste a trabajar. Se usa para calcular retenciones desde ese mes y para determinar pagos de gratificaciones, CTS y asignación familiar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />   
          </div>
          {/* Configuración para Sector Público - Collapsible */}
          <div className="border border-blue-200 rounded-lg bg-blue-50">
              <button
                type="button"
                onClick={() => setIsPublicSectorExpanded(!isPublicSectorExpanded)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-blue-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-[#1976D2] font-semibold underline decoration-2 underline-offset-2">
                    Configuración para Sector Público
                  </span>
                </div>
                {isPublicSectorExpanded ? (
                  <ChevronDown className="w-5 h-5 text-[#1976D2]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#1976D2]" />
                )}
              </button>
              
              {isPublicSectorExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-blue-200">
                  {/* Sector Público */}
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="isPublicSectorWorker"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="w-4 h-4 rounded focus:ring-2 text-[#2E7D32] bg-white border-2 border-[#2E7D32] focus:ring-[#2E7D32]"
                              />
                            </FormControl>
                            <FormLabel className="text-[#333333] font-medium">
                              Trabajador del Sector Público
                            </FormLabel>
                          </div>
                          <FormDescription className="text-[#666666] ml-6">
                            Marca si trabajas en el sector público. Recibirás un aguinaldo de S/ 300 en julio.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('isPublicSectorWorker') && (
                      <FormField
                        control={form.control}
                        name="receivesSchoolingBonus"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center space-x-2 ml-6">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="w-4 h-4 rounded focus:ring-2 text-[#2E7D32] bg-white border-2 border-[#2E7D32] focus:ring-[#2E7D32]"
                                />
                              </FormControl>
                              <FormLabel className="text-[#333333] font-medium">
                                Bono por Escolaridad
                              </FormLabel>
                            </div>
                            <FormDescription className="text-[#666666] ml-12">
                              Marca si recibes bono por escolaridad del sector público (hasta S/ 400).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Bono Extraordinario Judicial */}
                  <div className="space-y-3 pt-3 border-t border-blue-100">
                    <FormField
                      control={form.control}
                      name="isJudicialWorker"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="w-4 h-4 rounded focus:ring-2 text-[#7B1FA2] bg-white border-2 border-[#7B1FA2] focus:ring-[#7B1FA2]"
                              />
                            </FormControl>
                            <FormLabel className="text-[#333333] font-medium">
                              Bono Extraordinario Judicial
                            </FormLabel>
                          </div>
                          <FormDescription className="text-[#666666] ml-6">
                            Marca si eres personal del Poder Judicial, INPE o Ministerio Público. Aplica bono de S/ 1,000 con condiciones.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('isJudicialWorker') && (
                      <div className="space-y-3 ml-6">
                        <FormField
                          control={form.control}
                          name="judicialInstitution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#333333] font-medium">Institución Judicial</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-[#E0E0E0] focus:border-[#7B1FA2] focus:ring-[#7B1FA2] focus:ring-opacity-30">
                                    <SelectValue placeholder="Selecciona la institución" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="poder_judicial">Poder Judicial</SelectItem>
                                  <SelectItem value="inpe">Instituto Nacional Penitenciario (INPE)</SelectItem>
                                  <SelectItem value="ministerio_publico">Ministerio Público</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription className="text-[#666666]">
                                Selecciona la institución donde trabajas.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="isDirectivePosition"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center space-x-2">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="w-4 h-4 rounded focus:ring-2 text-[#7B1FA2] bg-white border-2 border-[#7B1FA2] focus:ring-[#7B1FA2]"
                                  />
                                </FormControl>
                                <FormLabel className="text-[#333333] font-medium">
                                  Cargo Directivo
                                </FormLabel>
                              </div>
                              <FormDescription className="text-[#666666] ml-6">
                                Marca si tienes un cargo directivo. Los cargos directivos NO reciben el bono extraordinario.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
        </div>

      {/* Configuración de Cálculos Automáticos - Collapsible */}
      <div className="border border-red-200 rounded-lg bg-red-50">
        <button
          type="button"
          onClick={() => setIsCalculationsExpanded(!isCalculationsExpanded)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-red-100 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-[#B71C1C] font-semibold underline decoration-2 underline-offset-2">
              Configurar cálculo de Gratificaciones, CTS y Asignación Familiar
            </span>
          </div>
          {isCalculationsExpanded ? (
            <ChevronDown className="w-5 h-5 text-[#B71C1C]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#B71C1C]" />
          )}
        </button>
        
        {isCalculationsExpanded && (
          <div className="px-4 pb-4 space-y-4 border-t border-red-200">
            <div className="space-y-4">
              {/* Gratificaciones */}
              <div className="py-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-[#B71C1C]" />
                    <div>
                      <h4 className="font-medium text-[#333333]">Gratificaciones</h4>
                      <p className="text-sm text-[#666666]">Calculadas automáticamente en Julio y Diciembre</p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="calculateGratificaciones"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className={`w-4 h-4 rounded focus:ring-2 ${
                              field.value 
                                ? 'text-[#B71C1C] bg-gray-100 border-gray-300 focus:ring-[#B71C1C]' 
                                : 'text-[#B71C1C] bg-white border-2 border-[#B71C1C] focus:ring-[#B71C1C]'
                            }`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                {form.watch('calculateGratificaciones') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
                    <FormField
                      control={form.control}
                      name="insuranceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-[#666666]">Tipo de Seguro</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-[#E0E0E0] focus:border-[#B71C1C] focus:ring-[#B71C1C] focus:ring-opacity-30">
                                <SelectValue placeholder="Selecciona el tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="essalud">EsSalud (9%)</SelectItem>
                              <SelectItem value="eps">EPS (6.75%)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs text-[#666666]">
                            Tipo de seguro para el cálculo del bono
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* CTS */}
              <div className="py-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#1976D2]" />
                    <div>
                      <h4 className="font-medium text-[#333333]">CTS (Compensación por Tiempo de Servicios)</h4>
                      <p className="text-sm text-[#666666]">Calculada automáticamente en Mayo y Noviembre</p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="calculateCTS"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className={`w-4 h-4 rounded focus:ring-2 ${
                              field.value 
                                ? 'text-[#1976D2] bg-gray-100 border-gray-300 focus:ring-[#1976D2]' 
                                : 'text-[#1976D2] bg-white border-2 border-[#1976D2] focus:ring-[#1976D2]'
                            }`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                {form.watch('calculateCTS') && (
                  <div className="ml-8">
                    <p className="text-sm text-[#666666]">
                      El mes de inicio de trabajo se configura en la sección de información básica.
                    </p>
                  </div>
                )}
              </div>

              {/* Asignación Familiar */}
              <div className="py-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-[#1976D2]" />
                    <div>
                      <h4 className="font-medium text-[#333333]">Asignación Familiar</h4>
                      <p className="text-sm text-[#666666]">S/ 75.00 por hijo menor de 18 años o estudiando</p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="calculateAsignacionFamiliar"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className={`w-4 h-4 rounded focus:ring-2 ${
                              field.value 
                                ? 'text-[#1976D2] bg-gray-100 border-gray-300 focus:ring-[#1976D2]' 
                                : 'text-[#1976D2] bg-white border-2 border-[#1976D2] focus:ring-[#1976D2]'
                            }`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                {form.watch('calculateAsignacionFamiliar') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
                    <FormField
                      control={form.control}
                      name="hasChildren"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className={`w-4 h-4 rounded focus:ring-2 ${
                                field.value 
                                  ? 'text-[#1976D2] bg-gray-100 border-gray-300 focus:ring-[#1976D2]' 
                                  : 'text-[#1976D2] bg-white border-2 border-[#1976D2] focus:ring-[#1976D2]'
                              }`}
                            />
                          </FormControl>
                          <FormLabel className="text-sm text-[#666666] ml-2">Tengo hijos menores de 18 años</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="childrenStudying"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className={`w-4 h-4 rounded focus:ring-2 ${
                                field.value 
                                  ? 'text-[#1976D2] bg-gray-100 border-gray-300 focus:ring-[#1976D2]' 
                                  : 'text-[#1976D2] bg-white border-2 border-[#1976D2] focus:ring-[#1976D2]'
                              }`}
                            />
                          </FormControl>
                          <FormLabel className="text-sm text-[#666666] ml-2">Tengo hijos estudiando después de 18 años</FormLabel>
                        </FormItem>
                      )}
                    />

                    {(form.watch('hasChildren') || form.watch('childrenStudying')) && (
                      <FormField
                        control={form.control}
                        name="childrenCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-[#666666]">Número de Hijos Elegibles</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                min="0"
                                max="10"
                                className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#B71C1C] focus:ring-opacity-30"
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-[#666666]">
                              Número de hijos que califican para la asignación
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
