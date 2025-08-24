'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator, FileText, TrendingUp, Receipt, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


import { SunatCalculator, SunatCalculationResult, DeductibleExpenses } from '@/lib/sunat-calculator';

const formSchema = z.object({
  year: z.number().min(2020).max(2030),
  monthlyIncome: z.number().min(0).max(1000000),
  additionalIncome: z.number().min(0).max(1000000),
  additionalMonth: z.number().min(1).max(12),
  calculationMonth: z.number().min(1).max(12),
  previousRetentions: z.number().min(0).max(1000000),
  roundingDecimals: z.number().min(0).max(4),
  // Deductible expenses
  restaurants: z.number().min(0).max(1000000),
  medicalServices: z.number().min(0).max(1000000),
  professionalServices: z.number().min(0).max(1000000),
  rentalProperties: z.number().min(0).max(1000000),
  essaludContributions: z.number().min(0).max(1000000),
  // Nuevos campos para ingresos adicionales
  gratificaciones: z.number().min(0).max(1000000),
  bonificaciones: z.number().min(0).max(1000000),
  utilidades: z.number().min(0).max(1000000),
  cts: z.number().min(0).max(1000000),
  asignacionFamiliar: z.number().min(0).max(1000000),
  // Campos para configuración de meses
  gratificacionesMonth: z.number().min(1).max(12).optional(),
  bonificacionesMonth: z.number().min(1).max(12).optional(),
  utilidadesMonth: z.number().min(1).max(12).optional(),
  ctsMonth: z.number().min(1).max(12).optional(),
  // Campos para configuración de cálculos automáticos
  calculateGratificaciones: z.boolean(),
  calculateCTS: z.boolean(),
  calculateAsignacionFamiliar: z.boolean(),
  // Campos para gratificaciones
  insuranceType: z.enum(['essalud', 'eps']),
  startWorkMonth: z.number().min(1).max(12),
  // Campos para asignación familiar
  hasChildren: z.boolean(),
  childrenCount: z.number().min(0).max(10),
  childrenStudying: z.boolean()
});

type FormData = z.infer<typeof formSchema>;

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

export default function SunatCalculatorPage() {
  const [result, setResult] = useState<SunatCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showDeductibleExpenses, setShowDeductibleExpenses] = useState(false);
  const [showAdditionalIncome, setShowAdditionalIncome] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: 2025,
      monthlyIncome: 0,
      additionalIncome: 0,
      additionalMonth: 12,
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2,
      restaurants: 0,
      medicalServices: 0,
      professionalServices: 0,
      rentalProperties: 0,
      essaludContributions: 0,
      gratificaciones: 0,
      bonificaciones: 0,
      utilidades: 0,
      cts: 0,
      asignacionFamiliar: 0,
      gratificacionesMonth: 12,
      bonificacionesMonth: 12,
      utilidadesMonth: 12,
      ctsMonth: 12,
      calculateGratificaciones: true,
      calculateCTS: true,
      calculateAsignacionFamiliar: true,
      insuranceType: 'essalud',
      startWorkMonth: 1,
      hasChildren: false,
      childrenCount: 0,
      childrenStudying: false
    }
  });

  const onSubmit = (data: FormData) => {
    setIsCalculating(true);
    
    try {
      const calculator = new SunatCalculator();
      
      // Prepare deductible expenses if any are provided
      const deductibleExpenses: DeductibleExpenses = {
        restaurants: data.restaurants,
        medicalServices: data.medicalServices,
        professionalServices: data.professionalServices,
        rentalProperties: data.rentalProperties,
        essaludContributions: data.essaludContributions
      };

      // Validate deductible expenses
      const validation = calculator.validateDeductibleExpenses(deductibleExpenses);
      if (!validation.isValid) {
        alert('Errores en gastos deducibles:\n' + validation.errors.join('\n'));
        setIsCalculating(false);
        return;
      }

      const calculationResult = calculator.calculate({
        ...data,
        deductibleExpenses,
        // Nuevos campos para ingresos adicionales
        gratificaciones: data.gratificaciones,
        bonificaciones: data.bonificaciones,
        utilidades: data.utilidades,
        cts: data.cts,
        asignacionFamiliar: data.asignacionFamiliar,
        // Campos para configuración de meses
        gratificacionesMonth: data.gratificacionesMonth,
        bonificacionesMonth: data.bonificacionesMonth,
        utilidadesMonth: data.utilidadesMonth,
        ctsMonth: data.ctsMonth,
        // Campos para configuración de cálculos automáticos
        calculateGratificaciones: data.calculateGratificaciones,
        calculateCTS: data.calculateCTS,
        calculateAsignacionFamiliar: data.calculateAsignacionFamiliar,
        // Campos para gratificaciones
        insuranceType: data.insuranceType,
        startWorkMonth: data.startWorkMonth,
        // Campos para asignación familiar
        hasChildren: data.hasChildren,
        childrenCount: data.childrenCount,
        childrenStudying: data.childrenStudying
      });
      setResult(calculationResult);
    } catch (error) {
      console.error('Error calculating:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const totalDeductibleExpenses = form.watch('restaurants') + form.watch('medicalServices') + 
    form.watch('professionalServices') + form.watch('rentalProperties') + form.watch('essaludContributions');

  return (
    <div className="min-h-screen bg-[#E3F2FD] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[#004C97] mb-4">
            Calculadora SUNAT 2025
          </h1>
          <p className="text-xl text-[#666666]">
            Calcula tus retenciones de impuestos y gastos deducibles según la normativa peruana
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card className="border-[#E0E0E0] shadow-sm">
              <CardHeader className="bg-[#004C97] text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Parámetros de Cálculo
                </CardTitle>
                <CardDescription className="text-[#E3F2FD]">
                  Ingresa los datos para calcular tus retenciones
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#333333] font-medium">Año</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="2025" 
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
                            Ingreso mensual base
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="additionalIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#333333] font-medium">Ingreso Adicional (S/)</FormLabel>
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
                            Ingreso extraordinario o bonificación
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
                          <FormLabel className="text-[#333333] font-medium">Mes del Ingreso Adicional</FormLabel>
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
                            Retenciones acumuladas hasta el mes anterior
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="roundingDecimals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#333333] font-medium">Decimales de Redondeo</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="2" 
                              min="0" 
                              max="4" 
                              className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-[#1976D2] focus:ring-opacity-30"
                              {...field} 
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription className="text-[#666666]">
                            Número de decimales para redondear (0-4)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Deductible Expenses Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[#333333] font-medium">Gastos Deducibles 2025</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeductibleExpenses(!showDeductibleExpenses)}
                          className="text-[#1976D2] border-[#1976D2] hover:bg-[#1976D2] hover:text-white"
                        >
                          {showDeductibleExpenses ? 'Ocultar' : 'Mostrar'}
                        </Button>
                      </div>
                      
                      {showDeductibleExpenses && (
                        <div className="space-y-4 p-4 bg-[#F5F5F5] rounded-lg border border-[#E0E0E0]">
                          <div className="text-sm text-[#666666] mb-3">
                            <p className="font-medium mb-2">💡 Información importante:</p>
                            <ul className="space-y-1 text-xs">
                              <li>• Solo aplica si tus ingresos superan 7 UIT (S/ 37,450)</li>
                              <li>• Límite máximo: 3 UIT (S/ 16,050)</li>
                              <li>• Los gastos deben estar sustentados con comprobantes válidos</li>
                            </ul>
                          </div>

                          <FormField
                            control={form.control}
                            name="restaurants"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm text-[#333333]">Restaurantes, Bares y Hoteles (15%)</FormLabel>
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
                            name="medicalServices"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm text-[#333333]">Servicios Médicos y Odontológicos (30%)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    step="0.01" 
                                    className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-opacity-30"
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
                            name="professionalServices"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm text-[#333333]">Servicios Profesionales y Oficios (30%)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    step="0.01" 
                                    className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-opacity-30"
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
                            name="rentalProperties"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm text-[#333333]">Alquiler de Inmuebles (30%)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    step="0.01" 
                                    className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-opacity-30"
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
                            name="essaludContributions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm text-[#333333]">Aportaciones EsSalud (100%)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="0.00" 
                                    step="0.01" 
                                    className="border-[#E0E0E0] focus:border-[#1976D2] focus:ring-opacity-30"
                                    {...field} 
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {totalDeductibleExpenses > 0 && (
                            <div className="pt-3 border-t border-[#E0E0E0]">
                              <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-[#333333]">Total Gastos:</span>
                                <span className="font-semibold text-[#1976D2]">{formatCurrency(totalDeductibleExpenses)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Additional Income Types Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[#333333] font-medium">Tipos de Ingresos Adicionales</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAdditionalIncome(!showAdditionalIncome)}
                          className="text-[#1976D2] border-[#1976D2] hover:bg-[#1976D2] hover:text-white"
                        >
                          {showAdditionalIncome ? 'Ocultar' : 'Mostrar'}
                        </Button>
                      </div>
                      
                      {showAdditionalIncome && (
                        <div className="space-y-4 p-4 bg-[#F5F5F5] rounded-lg border border-[#E0E0E0]">
                          <div className="text-sm text-[#666666] mb-3">
                            <p className="font-medium mb-2">💡 Configuración de ingresos adicionales:</p>
                            <ul className="space-y-1 text-xs">
                              <li>• Gratificaciones: Julio y Diciembre por defecto (EsSalud 9%, EPS 6.75%)</li>
                              <li>• CTS: Mayo y Noviembre por defecto</li>
                              <li>• Asignación Familiar: S/ 75.00 mensual (si tiene hijos)</li>
                              <li>• Puedes personalizar los meses de pago</li>
                            </ul>
                          </div>

                          {/* Configuración de cálculos automáticos */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                          {/* Configuración de gratificaciones */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="insuranceType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm text-[#333333]">Tipo de Seguro</FormLabel>
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
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="startWorkMonth"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm text-[#333333]">Mes de Inicio de Trabajo</FormLabel>
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
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Configuración de asignación familiar */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                          {/* Ingresos adicionales manuales */}
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
                              name="bonificacionesMonth"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm text-[#333333]">Mes de Bonificaciones</FormLabel>
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
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            <FormField
                              control={form.control}
                              name="utilidadesMonth"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm text-[#333333]">Mes de Utilidades</FormLabel>
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
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full bg-[#B71C1C] hover:bg-[#C62828] border-0" disabled={isCalculating}>
                      {isCalculating ? 'Calculando...' : 'Calcular Retenciones'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-[#E0E0E0] shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-[#666666]">
                        Ingreso Anual Total
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#2E7D32]">
                        {formatCurrency(result.summary.totalAnnualIncome)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-[#E0E0E0] shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-[#666666]">
                        Impuesto Anual Total
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#B71C1C]">
                        {formatCurrency(result.summary.totalAnnualTax)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-[#E0E0E0] shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-[#666666]">
                        Retención Anual Total
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#004C97]">
                        {formatCurrency(result.summary.totalAnnualRetention)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-[#E0E0E0] shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-[#666666]">
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

                {/* Deductible Expenses Summary */}
                {result.summary.deductibleExpenses.totalExpenses > 0 && (
                  <Card className="border-[#E0E0E0] shadow-sm">
                    <CardHeader className="bg-[#E8F5E8]">
                      <CardTitle className="flex items-center gap-2 text-[#2E7D32]">
                        <Receipt className="h-5 w-5" />
                        Resumen de Gastos Deducibles
                      </CardTitle>
                      <CardDescription className="text-[#2E7D32]">
                        Deducción adicional de 3 UIT para el ejercicio 2025
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
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
                    </CardContent>
                  </Card>
                )}

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
                            <th className="text-right py-2 px-2 text-[#333333] font-medium">Ingreso</th>
                            <th className="text-right py-2 px-2 text-[#333333] font-medium">Adicional</th>
                            <th className="text-right py-2 px-2 text-[#333333] font-medium">Retención</th>
                            <th className="text-right py-2 px-2 text-[#333333] font-medium">Acumulado</th>
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
                              <td className="py-2 px-2 text-right font-semibold text-[#004C97]">
                                {formatCurrency(month.monthlyRetention)}
                              </td>
                              <td className="py-2 px-2 text-right text-[#666666]">
                                {formatCurrency(month.expectedAccumulatedRetention)}
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
            ) : (
              <Card className="h-96 flex items-center justify-center border-[#E0E0E0] shadow-sm">
                <CardContent className="text-center">
                  <Calculator className="h-16 w-16 text-[#E0E0E0] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#333333] mb-2">
                    Ingresa los parámetros
                  </h3>
                  <p className="text-[#666666]">
                    Completa el formulario y haz clic en &quot;Calcular Retenciones&quot; para ver los resultados
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
