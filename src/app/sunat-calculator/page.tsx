'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator, FileText, TrendingUp, DollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { SunatCalculator, SunatCalculationParams, SunatCalculationResult } from '@/lib/sunat-calculator';

const formSchema = z.object({
  year: z.coerce.number().min(2020).max(2030),
  monthlyIncome: z.coerce.number().min(0).max(1000000),
  additionalIncome: z.coerce.number().min(0).max(1000000),
  additionalMonth: z.coerce.number().min(1).max(12),
  calculationMonth: z.coerce.number().min(1).max(12),
  previousRetentions: z.coerce.number().min(0).max(1000000),
  roundingDecimals: z.coerce.number().min(0).max(4)
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: 2024,
      monthlyIncome: 0,
      additionalIncome: 0,
      additionalMonth: 12,
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2
    }
  });

  const onSubmit = (data: FormData) => {
    setIsCalculating(true);
    
    try {
      const calculator = new SunatCalculator();
      const calculationResult = calculator.calculate(data);
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

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Calculadora SUNAT
        </h1>
        <p className="text-xl text-gray-600">
          Calcula tus retenciones de impuestos según la normativa peruana
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Parámetros de Cálculo
              </CardTitle>
              <CardDescription>
                Ingresa los datos para calcular tus retenciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Año</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2024" {...field} />
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
                        <FormLabel>Ingreso Mensual (S/)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>
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
                        <FormLabel>Ingreso Adicional (S/)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>
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
                        <FormLabel>Mes del Ingreso Adicional</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
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
                        <FormLabel>Mes de Inicio del Cálculo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
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
                        <FormLabel>Retenciones Previas (S/)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" step="0.01" {...field} />
                        </FormControl>
                        <FormDescription>
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
                        <FormLabel>Decimales de Redondeo</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2" min="0" max="4" {...field} />
                        </FormControl>
                        <FormDescription>
                          Número de decimales para redondear (0-4)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isCalculating}>
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
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Ingreso Anual Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(result.summary.totalAnnualIncome)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Impuesto Anual Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(result.summary.totalAnnualTax)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Retención Anual Total
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(result.summary.totalAnnualRetention)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Retención Mensual Promedio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(result.summary.averageMonthlyRetention)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Detalle Mensual
                  </CardTitle>
                  <CardDescription>
                    Desglose de retenciones por mes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">Mes</th>
                          <th className="text-right py-2 px-2">Ingreso</th>
                          <th className="text-right py-2 px-2">Adicional</th>
                          <th className="text-right py-2 px-2">Retención</th>
                          <th className="text-right py-2 px-2">Acumulado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.monthlyCalculations.map((month) => (
                          <tr key={month.month} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-2 font-medium">{month.monthName}</td>
                            <td className="py-2 px-2 text-right">{formatCurrency(month.monthlyIncome)}</td>
                            <td className="py-2 px-2 text-right">
                              {month.additionalIncome > 0 ? formatCurrency(month.additionalIncome) : '-'}
                            </td>
                            <td className="py-2 px-2 text-right font-semibold text-blue-600">
                              {formatCurrency(month.monthlyRetention)}
                            </td>
                            <td className="py-2 px-2 text-right text-gray-600">
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Información UIT
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">UIT 2024</Label>
                      <p className="text-lg font-semibold">{formatCurrency(5500)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Deducción 7 UIT</Label>
                      <p className="text-lg font-semibold">{formatCurrency(7 * 5500)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <CardContent className="text-center">
                <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ingresa los parámetros
                </h3>
                <p className="text-gray-500">
                  Completa el formulario y haz clic en "Calcular Retenciones" para ver los resultados
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
