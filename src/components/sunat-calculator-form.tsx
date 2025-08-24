'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { SunatCalculator, SunatCalculationResult, DeductibleExpenses } from '@/lib/sunat-calculator';
import { BasicInfoStep } from './form-steps/basic-info-step';
import { DeductibleExpensesStep } from './form-steps/deductible-expenses-step';
import { AdditionalIncomeStep } from './form-steps/additional-income-step';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  asignacionFamiliarMonth: z.number().min(0).max(12).optional(),
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

export function SunatCalculatorForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

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
      asignacionFamiliarMonth: 0,
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

  const onSubmit = async (data: FormData) => {
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

      // Validaciones adicionales
      if (data.calculateGratificaciones && data.startWorkMonth > 7) {
        alert('Si calculas gratificaciones automáticamente, el mes de inicio debe ser antes de Julio para recibir gratificaciones en Julio.');
        setIsCalculating(false);
        return;
      }

      if (data.calculateCTS && data.startWorkMonth > 5) {
        alert('Si calculas CTS automáticamente, el mes de inicio debe ser antes de Mayo para recibir CTS en Mayo.');
        setIsCalculating(false);
        return;
      }

      if (data.calculateAsignacionFamiliar && !data.hasChildren && !data.childrenStudying) {
        alert('Para calcular asignación familiar automáticamente, debes tener hijos menores de 18 años o hijos estudiando.');
        setIsCalculating(false);
        return;
      }

      if (data.calculateAsignacionFamiliar && data.hasChildren && data.childrenCount === 0) {
        alert('Si tienes hijos menores de 18 años, debes especificar el número de hijos.');
        setIsCalculating(false);
        return;
      }

      const calculationResult = calculator.calculate({
        ...data,
        deductibleExpenses,
      });
      
      // Store result in localStorage as backup
      localStorage.setItem('sunat-calculation-result', JSON.stringify(calculationResult));
      
      // Redirect to results page with data
      const encodedData = encodeURIComponent(JSON.stringify(calculationResult));
      
      // Small delay to ensure data is stored
      setTimeout(() => {
        router.push(`/results?data=${encodedData}`);
      }, 100);
      
    } catch (error) {
      console.error('Error calculating:', error);
      alert('Error al realizar el cálculo. Por favor, verifica los datos ingresados.');
    } finally {
      setIsCalculating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      // Additional scroll to top for immediate feedback
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep form={form} />;
      case 2:
        return <AdditionalIncomeStep form={form} />;
      case 3:
        return <DeductibleExpensesStep form={form} />;
      default:
        return <BasicInfoStep form={form} />;
    }
  };

  return (
    <Card className="border-[#E0E0E0] shadow-sm overflow-hidden px-6">
      <CardHeader className="bg-[#004C97] text-white -mt-6 -mx-6 px-6 pt-6 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Parámetros de Cálculo
        </CardTitle>
        <CardDescription className="text-[#E3F2FD]">
          Completa los datos paso a paso para calcular tus retenciones
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[
                  { number: 1, label: 'Información Básica' },
                  { number: 2, label: 'Ingresos Adicionales' },
                  { number: 3, label: 'Gastos Deducibles' }
                ].map((step) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step.number === currentStep 
                        ? 'bg-[#B71C1C] text-white' 
                        : step.number < currentStep 
                          ? 'bg-[#2E7D32] text-white' 
                          : 'bg-[#E0E0E0] text-[#666666]'
                    }`}>
                      {step.number < currentStep ? '✓' : step.number}
                    </div>
                    {step.number < 3 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step.number < currentStep ? 'bg-[#2E7D32]' : 'bg-[#E0E0E0]'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Step Labels */}
            <div className="flex justify-center mb-6">
              <div className="text-sm text-[#666666] font-medium">
                {currentStep === 1 && 'Información Básica'}
                {currentStep === 2 && 'Ingresos Adicionales'}
                {currentStep === 3 && 'Gastos Deducibles'}
              </div>
            </div>

            {/* Step Content */}
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-[#004C97] text-[#004C97] hover:bg-[#004C97] hover:text-white"
              >
                Anterior
              </Button>
              
              <div className="flex gap-4">
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#004C97] hover:bg-[#1976D2]"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="bg-[#B71C1C] hover:bg-[#C62828] border-0" 
                    disabled={isCalculating}
                  >
                    {isCalculating ? 'Calculando...' : 'Calcular Retenciones'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
