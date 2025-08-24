'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Calculator, Users, Gift, Calendar } from 'lucide-react';

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
  return (
    <div className="space-y-8">
      {/* Basic Information Card */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#E3F2FD] pb-4 -mt-6 -mx-6 px-6 pt-6">
          <CardTitle className="text-lg text-[#004C97] flex items-center gap-2">
            <Info className="h-5 w-5" />
            Información Básica
          </CardTitle>
          <CardDescription className="text-[#1976D2]">
            Datos principales para el cálculo de retenciones
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
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
              name="calculationMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">Mes de Inicio del Cálculo</FormLabel>
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
                    Mes desde el cual comenzar a calcular retenciones
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
          </div>
        </CardContent>
      </Card>

      {/* Configuration Options Card */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#FFEBEE] pb-4 -mt-6 -mx-6 px-6 pt-6">
          <CardTitle className="text-lg text-[#B71C1C] flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Configuración de Cálculos Automáticos
          </CardTitle>
          <CardDescription className="text-[#B71C1C]">
            Selecciona qué elementos calcular automáticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Gratificaciones */}
            <div className="border border-[#E0E0E0] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
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
                          className="w-4 h-4 text-[#B71C1C] bg-gray-100 border-gray-300 rounded focus:ring-[#B71C1C] focus:ring-2"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {form.watch('calculateGratificaciones') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
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

                  <FormField
                    control={form.control}
                    name="startWorkMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-[#666666]">Mes de Inicio de Trabajo</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger className="border-[#E0E0E0] focus:border-[#B71C1C] focus:ring-[#B71C1C] focus:ring-opacity-30">
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
                        <FormDescription className="text-xs text-[#666666]">
                          Mes en que comenzaste a trabajar
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* CTS */}
            <div className="border border-[#E0E0E0] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
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
                          className="w-4 h-4 text-[#1976D2] bg-gray-100 border-gray-300 rounded focus:ring-[#1976D2] focus:ring-2"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {form.watch('calculateCTS') && (
                <div className="ml-8">
                  <FormField
                    control={form.control}
                    name="startWorkMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-[#666666]">Mes de Inicio de Trabajo</FormLabel>
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
                        <FormDescription className="text-xs text-[#666666]">
                          Mes en que comenzaste a trabajar
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Asignación Familiar */}
            <div className="border border-[#E0E0E0] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
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
                          className="w-4 h-4 text-[#1976D2] bg-gray-100 border-gray-300 rounded focus:ring-[#1976D2] focus:ring-2"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {form.watch('calculateAsignacionFamiliar') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
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
                            className="w-4 h-4 text-[#1976D2] bg-gray-100 border-gray-300 rounded focus:ring-[#1976D2] focus:ring-2"
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
                            className="w-4 h-4 text-[#1976D2] bg-gray-100 border-gray-300 rounded focus:ring-[#1976D2] focus:ring-opacity-30"
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
                              className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30"
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
        </CardContent>
      </Card>

      {/* Calculation Parameters Card */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#FFEBEE] pb-4 -mt-6 -mx-6 px-6 pt-6">
          <CardTitle className="text-lg text-[#B71C1C] flex items-center gap-2">
            <Info className="h-5 w-5" />
            Parámetros de Cálculo
          </CardTitle>
          <CardDescription className="text-[#B71C1C]">
            Configuración para el cálculo de retenciones
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="roundingDecimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333] font-medium">Decimales de Redondeo</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30">
                        <SelectValue placeholder="Selecciona decimales" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">0 decimales</SelectItem>
                      <SelectItem value="1">1 decimal</SelectItem>
                      <SelectItem value="2">2 decimales</SelectItem>
                      <SelectItem value="3">3 decimales</SelectItem>
                      <SelectItem value="4">4 decimales</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[#666666]">
                    Precisión para los cálculos de retenciones
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
