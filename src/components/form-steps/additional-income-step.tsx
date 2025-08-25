'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { TrendingUp, Calculator, ChevronDown, ChevronRight } from 'lucide-react';
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

interface AdditionalIncomeStepProps {
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

export function AdditionalIncomeStep({ form }: AdditionalIncomeStepProps) {
  const [isAdditionalIncomeExpanded, setIsAdditionalIncomeExpanded] = useState(false);
  // Observar los valores de los checkboxes para mostrar/ocultar secciones
  const calculateGratificaciones = form.watch('calculateGratificaciones');
  // const calculateCTS = form.watch('calculateCTS');
  const calculateAsignacionFamiliar = form.watch('calculateAsignacionFamiliar');

  return (
    <div className="space-y-8">
      {/* Display Remuneration Calculation */}
      <RemunerationDisplay watch={form.watch} currentStep={2} />
      
      {/* Ingresos Adicionales por Mes - Collapsible */}
      <div className="border border-blue-200 rounded-lg bg-blue-50">
        <button
          type="button"
          onClick={() => setIsAdditionalIncomeExpanded(!isAdditionalIncomeExpanded)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-blue-100 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-[#004C97] font-semibold underline decoration-2 underline-offset-2">
              Ingresos Adicionales por Mes
            </span>
          </div>
          {isAdditionalIncomeExpanded ? (
            <ChevronDown className="w-5 h-5 text-[#004C97]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#004C97]" />
          )}
        </button>
        
        {isAdditionalIncomeExpanded && (
          <div className="px-4 pb-4 space-y-4 border-t border-blue-200">
            <div className="space-y-4">
              <div className="text-sm text-[#666666] mb-4">
                <p className="font-medium mb-2">💡 Ingresos adicionales por mes:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Bonificaciones extraordinarias</li>
                  <li>• Comisiones especiales</li>
                  <li>• Pagos por proyectos específicos</li>
                  <li>• Otros ingresos no regulares</li>
                </ul>
              </div>
              
              {/* Grid de meses para ingresos adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {monthOptions.map((monthOption) => {
                  const monthData = form.watch('additionalIncomeByMonth') || [];
                  const existingEntry = monthData.find(item => item.month === Number(monthOption.value));
                  
                  return (
                    <div key={monthOption.value} className="space-y-2">
                      <FormLabel className="text-sm text-[#333333] font-medium">
                        {monthOption.label}
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="additionalIncomeByMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30 text-sm"
                                value={existingEntry?.amount || ''}
                                onChange={(e) => {
                                  const amount = Number(e.target.value);
                                  const currentArray = field.value || [];
                                  
                                  if (amount > 0) {
                                    // Si hay un monto, agregar o actualizar la entrada
                                    const newArray = currentArray.filter(item => item.month !== Number(monthOption.value));
                                    newArray.push({ month: Number(monthOption.value), amount });
                                    field.onChange(newArray);
                                  } else {
                                    // Si no hay monto, remover la entrada
                                    const newArray = currentArray.filter(item => item.month !== Number(monthOption.value));
                                    field.onChange(newArray);
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}
              </div>
              
              {/* Resumen de ingresos adicionales */}
              <div className="mt-6 p-4 bg-[#F5F5F5] rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#333333]">
                    Total Ingresos Adicionales:
                  </span>
                  <span className="text-lg font-bold text-[#1976D2]">
                    S/ {(() => {
                      const monthData = form.watch('additionalIncomeByMonth') || [];
                      const total = monthData.reduce((sum, item) => sum + item.amount, 0);
                      return total.toFixed(2);
                    })()}
                  </span>
                </div>
                <div className="mt-2 text-xs text-[#666666]">
                  {(() => {
                    const monthData = form.watch('additionalIncomeByMonth') || [];
                    const monthsWithIncome = monthData.filter(item => item.amount > 0);
                    if (monthsWithIncome.length === 0) {
                      return 'No hay ingresos adicionales configurados';
                    }
                    return `Configurado en ${monthsWithIncome.length} mes(es): ${monthsWithIncome.map(item => {
                      const monthName = monthOptions.find(m => m.value === item.month.toString())?.label;
                      return `${monthName} (S/ ${item.month.toString()})`;
                    }).join(', ')}`;
                  })()}
                </div>
              </div>
              
              {/* Nota sobre compatibilidad */}
              <div className="text-xs text-[#666666] italic">
                💡 Los ingresos adicionales se aplican automáticamente en los cálculos mensuales correspondientes.
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Automatic Calculation Configuration */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#E3F2FD] pb-4 -mt-6 -mx-6 px-6 pt-6">
          <CardTitle className="text-lg text-[#1976D2] flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Configuración de Cálculos Automáticos
          </CardTitle>
          <CardDescription className="text-[#1976D2]">
            Selecciona qué ingresos calcular automáticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="calculateGratificaciones"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 text-[#1976D2] focus:ring-[#1976D2] border-[#E0E0E0] rounded"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-[#333333]">
                      Calcular Gratificaciones
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="calculateCTS"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 text-[#1976D2] focus:ring-[#1976D2] border-[#E0E0E0] rounded"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-[#333333]">
                      Calcular CTS
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="calculateAsignacionFamiliar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 text-[#1976D2] focus:ring-[#1976D2] border-[#E0E0E0] rounded"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-[#333333]">
                      Calcular Asignación Familiar
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Gratificaciones Configuration - Solo mostrar si está marcado */}
      {calculateGratificaciones && (
        <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
          <CardHeader className="bg-[#B71C1C] text-white pb-4 -mt-6 -mx-6 px-6 pt-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Configuración de Gratificaciones
            </CardTitle>
            <CardDescription className="text-[#FFEBEE]">
              Tipo de seguro y mes de inicio de trabajo
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4 p-3 bg-[#E3F2FD] border border-[#1976D2] rounded-lg">
              <p className="text-sm text-[#1976D2]">
                <strong>Nota:</strong> El mes de inicio de trabajo se configura en el paso de información básica y se aplica a todos los cálculos automáticos (retenciones, gratificaciones, CTS y asignación familiar).
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="insuranceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#333333] font-medium">Tipo de Seguro</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30">
                          <SelectValue placeholder="Selecciona el tipo de seguro" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="essalud">EsSalud (9%)</SelectItem>
                        <SelectItem value="eps">EPS (6.75%)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-[#666666]">
                      Tipo de seguro que tienes contratado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asignación Familiar Configuration - Solo mostrar si está marcado */}
      {calculateAsignacionFamiliar && (
        <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
          <CardHeader className="bg-[#1976D2] text-white pb-4 -mt-6 -mx-6 px-6 pt-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Configuración de Asignación Familiar
            </CardTitle>
            <CardDescription className="text-[#E3F2FD]">
              Información sobre hijos para cálculo de asignación familiar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="hasChildren"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 text-[#1976D2] focus:ring-[#1976D2] border-[#E0E0E0] rounded"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-[#333333]">
                        Tiene Hijos menores de 18 años
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="childrenCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#333333]">Número de Hijos</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        max="10"
                        className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30"
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-[#666666]">
                      S/ 75.00 por hijo menor de 18 años o estudiando
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="childrenStudying"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 text-[#1976D2] focus:ring-[#1976D2] border-[#E0E0E0] rounded"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-[#333333]">
                        Hijos Estudiando mayores de 18 años
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      )}

      

      {/* Manual Income Configuration - Solo mostrar secciones relevantes */}
      {/* <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#B71C1C] text-white pb-4 -mt-6 -mx-6 px-6 pt-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ingresos Adicionales Manuales
          </CardTitle>
          <CardDescription className="text-[#FFEBEE]">
            Configuración de ingresos adicionales personalizados
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6"> */}
            {/* Gratificaciones - Solo mostrar si NO está marcado el cálculo automático */}
            {/* {!calculateGratificaciones && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gratificaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#333333]">Gratificaciones Manuales (S/)</FormLabel>
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
                      <FormDescription className="text-xs text-[#666666]">
                        Solo si no usas cálculo automático
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gratificacionesMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#333333]">Mes de Gratificaciones</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30">
                            <SelectValue placeholder="Mes personalizado (opcional)" />
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
                      <FormDescription className="text-xs text-[#666666]">
                        Solo si no usas cálculo automático
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )} */}

            {/* CTS - Solo mostrar si NO está marcado el cálculo automático */}
            {/* {!calculateCTS && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#333333]">CTS Manual (S/)</FormLabel>
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
                      <FormDescription className="text-xs text-[#666666]">
                        Solo si no usas cálculo automático
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctsMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#333333]">Mes de CTS</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30">
                            <SelectValue placeholder="Mes personalizado (opcional)" />
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
                      <FormDescription className="text-xs text-[#666666]">
                        Solo si no usas cálculo automático
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )} */}

            {/* Other Additional Income - Siempre mostrar */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bonificaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#333333]">Bonificaciones (S/)</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="utilidades"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#333333]">Utilidades (S/)</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}

            {/* Asignación Familiar Personalizada - Solo mostrar si NO está marcado el cálculo automático */}
            {/* {!calculateAsignacionFamiliar && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="asignacionFamiliar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#333333]">Asignación Familiar Personalizada (S/)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="75.00" 
                          step="0.01" 
                          className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30"
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-[#666666]">
                        Solo si no usas cálculo automático
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="asignacionFamiliarMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#333333]">Mes de Asignación Familiar</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30">
                            <SelectValue placeholder="Todos los meses (por defecto)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">Todos los meses</SelectItem>
                          {monthOptions.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs text-[#666666]">
                        Solo si no usas cálculo automático
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )} */}
          {/* </div>
        </CardContent>
      </Card>*/}
    </div> 
  );
}
