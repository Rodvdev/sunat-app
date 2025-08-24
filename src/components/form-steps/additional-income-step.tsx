'use client';

import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Info, Calculator } from 'lucide-react';

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
  return (
    <div className="space-y-8">
      {/* Information Card */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
        <CardHeader className="bg-[#FFEBEE] pb-4 -mt-6 -mx-6 px-6 pt-6">
          <CardTitle className="text-lg text-[#B71C1C] flex items-center gap-2">
            <Info className="h-5 w-5" />
            Tipos de Ingresos Adicionales
          </CardTitle>
          <CardDescription className="text-[#B71C1C]">
            Configuración de gratificaciones, CTS y asignación familiar
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-[#E3F2FD] p-4 rounded-lg border border-[#1976D2]">
            <h4 className="font-semibold text-[#004C97] mb-2">💡 Configuración de ingresos adicionales:</h4>
            <ul className="space-y-1 text-sm text-[#1976D2]">
              <li>• Gratificaciones: Julio y Diciembre por defecto (EsSalud 9%, EPS 6.75%)</li>
              <li>• CTS: Mayo y Noviembre por defecto</li>
              <li>• Asignación Familiar: S/ 75.00 por hijo menor de 18 años o estudiando</li>
              <li>• Puedes personalizar los meses de pago</li>
            </ul>
          </div>
        </CardContent>
      </Card>

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

      {/* Gratificaciones Configuration */}
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
                    Mes en que comenzaste a trabajar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Asignación Familiar Configuration */}
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

      {/* Ingresos Adicionales Personalizados por Mes */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden">
        <CardHeader className="bg-[#004C97] text-white pb-4 -mt-6 -mx-6 px-6 pt-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ingresos Adicionales Personalizados por Mes
          </CardTitle>
          <CardDescription className="text-[#E3F2FD]">
            Configura ingresos adicionales específicos para cada mes del año
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="additionalIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#333333]">Ingreso Adicional (S/)</FormLabel>
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
                      Monto del ingreso adicional
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-[#333333]">Mes del Ingreso Adicional</FormLabel>
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
                      Mes en que recibirás el ingreso adicional
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Income Configuration */}
      <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
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
          <div className="space-y-6">
            {/* Gratificaciones */}
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
                      Dejar en 0 para cálculo automático
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
                      Dejar vacío para Julio y Diciembre
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* CTS */}
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
                      Dejar en 0 para cálculo automático
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
                      Dejar vacío para Mayo y Noviembre
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Other Additional Income */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Asignación Familiar Personalizada */}
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
                      Dejar en 0 para usar valor por defecto (S/ 75.00)
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
                      Por defecto se paga todos los meses
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
