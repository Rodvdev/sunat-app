'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { SunatCalculator, DeductibleExpenses } from '@/lib/sunat-calculator';
import { BasicInfoStep } from './form-steps/basic-info-step';
import { DeductibleExpensesStep } from './form-steps/deductible-expenses-step';
import { AdditionalIncomeStep } from './form-steps/additional-income-step';
import { TaxCreditsStep } from './form-steps/tax-credits-step';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  year: z.number().min(2020).max(2030),
  monthlyIncome: z.number().min(0).max(1000000),
  // Cambiar de single additionalIncome a array por mes
  additionalIncomeByMonth: z.array(z.object({
    month: z.number().min(1).max(12),
    amount: z.number().min(0).max(1000000)
  })),
  // Mantener campos legacy para compatibilidad
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
  childrenStudying: z.boolean(),
  // Campos para contratos de duración limitada
  isLimitedContract: z.boolean(),
  contractEndMonth: z.number().min(1).max(12).optional(),
  // Campo para sector público
  isPublicSectorWorker: z.boolean(),
  // Campo para bono por escolaridad del sector público
  receivesSchoolingBonus: z.boolean(),
  // Campos para bono extraordinario judicial
  isJudicialWorker: z.boolean(),
  judicialInstitution: z.enum(['poder_judicial', 'inpe', 'ministerio_publico']).optional(),
  isDirectivePosition: z.boolean(),
  // PASO 2: Campo para donaciones según Artículo 49° de la Ley
  donations: z.number().min(0).max(1000000).optional(),
  // PASO 3: Campos para créditos según Artículo 88° de la Ley
  previousTaxCredits: z.number().min(0).max(1000000).optional(),
  previousTaxPayments: z.number().min(0).max(1000000).optional(),
  previousTaxRefunds: z.number().min(0).max(1000000).optional(),
  isOnlyFifthCategoryIncome: z.boolean().optional()
});

// Now derive FormData from the schema to ensure they match exactly
type FormData = z.infer<typeof formSchema>;

interface SunatCalculatorFormProps {
  onStepChange: (stepInfo: {
    title: string;
    description: string;
    stepNumber: number;
    totalSteps: number;
  }) => void;
}

export function SunatCalculatorForm({ onStepChange }: SunatCalculatorFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();

  // Update step information when step changes
  useEffect(() => {
    const stepInfo = {
      1: {
        title: 'Información Básica',
        description: 'Configura tu año fiscal, ingreso mensual, mes de inicio de trabajo y otros datos principales para el cálculo de retenciones',
        stepNumber: 1,
        totalSteps: 4
      },
      2: {
        title: 'Ingresos Adicionales',
        description: 'Configura gratificaciones, CTS, asignación familiar y otros ingresos adicionales que recibirás durante el año',
        stepNumber: 2,
        totalSteps: 4
      },
      3: {
        title: 'Gastos Deducibles',
        description: 'Ingresa tus gastos deducibles según categoría. Solo aplican si tus ingresos anuales superan 7 UIT (S/ 37,450)',
        stepNumber: 3,
        totalSteps: 4
      },
      4: {
        title: 'Créditos Fiscales',
        description: 'Ingresa tus créditos fiscales de declaraciones anteriores, pagos a cuenta y saldos a favor para ajustar el impuesto anual.',
        stepNumber: 4,
        totalSteps: 4
      }
    };

    const currentStepInfo = stepInfo[currentStep as keyof typeof stepInfo];
    onStepChange(currentStepInfo);
    
    // Scroll to top whenever step changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, onStepChange]);

  // Initialize step information on component mount
  useEffect(() => {
    onStepChange({
      title: 'Información Básica',
      description: 'Configura tu año fiscal, ingreso mensual, mes de inicio de trabajo y otros datos principales para el cálculo de retenciones',
      stepNumber: 1,
      totalSteps: 4
    });
  }, [onStepChange]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: 2025,
      monthlyIncome: 0,
      additionalIncomeByMonth: [],
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
      calculateGratificaciones: false,
      calculateCTS: false,
      calculateAsignacionFamiliar: false,
      insuranceType: 'essalud',
      startWorkMonth: 1,
      hasChildren: false,
      childrenCount: 0,
      childrenStudying: false,
      isLimitedContract: false,
      contractEndMonth: undefined,
      isPublicSectorWorker: false,
      receivesSchoolingBonus: false,
      isJudicialWorker: false,
      judicialInstitution: undefined,
      isDirectivePosition: false,
      // PASO 2: Valores por defecto para donaciones
      donations: 0,
      // PASO 3: Valores por defecto para créditos
      previousTaxCredits: 0,
      previousTaxPayments: 0,
      previousTaxRefunds: 0,
      isOnlyFifthCategoryIncome: false
    }
  });

  const onSubmit = async (data: FormData) => {
    if (currentStep !== 4) {
      alert(`Error: El formulario se está enviando en el paso ${currentStep} en lugar del paso 4. Por favor, completa todos los pasos.`);
      setCurrentStep(4);
      return;
    }
    
    setIsCalculating(true);
    
    try {
      console.log('🚀 INICIANDO CÁLCULO SUNAT - DATOS DEL FORMULARIO');
      console.log('='.repeat(80));
      console.log('📋 DATOS BÁSICOS:');
      console.log('  • Año Fiscal:', data.year);
      console.log('  • Ingreso Mensual:', data.monthlyIncome);
      console.log('  • Ingresos Adicionales por Mes:', data.additionalIncomeByMonth);
      console.log('  • Ingreso Adicional (Legacy):', data.additionalIncome);
      console.log('  • Mes de Ingreso Adicional (Legacy):', data.additionalMonth);
      console.log('  • Mes de Cálculo:', data.calculationMonth);
      console.log('  • Retenciones Previas:', data.previousRetentions);
      console.log('  • Decimales de Redondeo:', data.roundingDecimals);
      console.log('  • Mes de Inicio de Trabajo:', data.startWorkMonth);
      console.log('  • Contrato de Duración Limitada:', data.isLimitedContract);
      if (data.isLimitedContract && data.contractEndMonth) {
        console.log('  • Mes de Terminación del Contrato:', data.contractEndMonth);
        console.log('  • Duración del Contrato:', data.contractEndMonth - data.startWorkMonth + 1, 'meses');
      }
      
      console.log('  • Sector Público:', data.isPublicSectorWorker);
      if (data.isPublicSectorWorker) {
        console.log('  • Aguinaldo Julio: S/ 300');
        console.log('  • Bono por Escolaridad:', data.receivesSchoolingBonus);
        if (data.receivesSchoolingBonus) {
          console.log('  • Bono Escolaridad: S/ 400');
        }
      }
      
      console.log('  • Bono Judicial:', data.isJudicialWorker);
      if (data.isJudicialWorker) {
        console.log('  • Institución Judicial:', data.judicialInstitution);
        console.log('  • Cargo Directivo:', data.isDirectivePosition);
        if (data.judicialInstitution && !data.isDirectivePosition) {
          console.log('  • Bono Extraordinario: S/ 1,000 (si cumple condiciones)');
        }
      }
      
      console.log('\n🔧 CONFIGURACIÓN DE CÁLCULOS AUTOMÁTICOS:');
      console.log('  • Calcular Gratificaciones:', data.calculateGratificaciones);
      console.log('  • Calcular CTS:', data.calculateCTS);
      console.log('  • Calcular Asignación Familiar:', data.calculateAsignacionFamiliar);
      
      if (data.calculateGratificaciones) {
        console.log('  • Tipo de Seguro:', data.insuranceType);
        console.log('  • Mes de Inicio de Trabajo:', data.startWorkMonth);
      }
      
      if (data.calculateCTS) {
        console.log('  • Mes de Inicio de Trabajo para CTS:', data.startWorkMonth);
      }
      
      if (data.calculateAsignacionFamiliar) {
        console.log('  • Tiene Hijos:', data.hasChildren);
        console.log('  • Número de Hijos:', data.childrenCount);
        console.log('  • Hijos Estudiando:', data.childrenStudying);
      }
      
      // Debug: Log complete form data object
      console.log('\n🔍 DATOS COMPLETOS DEL FORMULARIO:');
      console.log('Form data object:', JSON.stringify(data, null, 2));
      
      console.log('\n💰 INGRESOS ADICIONALES MANUALES:');
      console.log('  • Gratificaciones Manuales:', data.gratificaciones);
      console.log('  • Mes de Gratificaciones:', data.gratificacionesMonth);
      console.log('  • CTS Manual:', data.cts);
      console.log('  • Mes de CTS:', data.ctsMonth);
      console.log('  • Bonificaciones:', data.bonificaciones);
      console.log('  • Utilidades:', data.utilidades);
      console.log('  • Asignación Familiar Personalizada:', data.asignacionFamiliar);
      console.log('  • Mes de Asignación Familiar:', data.asignacionFamiliarMonth);
      
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

      // Validaciones para contratos de duración limitada
      if (data.isLimitedContract && data.contractEndMonth) {
        if (data.contractEndMonth < data.startWorkMonth) {
          alert('El mes de terminación del contrato debe ser posterior al mes de inicio de trabajo.');
          setIsCalculating(false);
          return;
        }
        
        if (data.contractEndMonth > 12) {
          alert('El mes de terminación del contrato no puede ser mayor a diciembre (12).');
          setIsCalculating(false);
          return;
        }
      }

      // Validaciones para bono extraordinario judicial
      if (data.isJudicialWorker) {
        if (!data.judicialInstitution) {
          alert('Si marca bono judicial, debe seleccionar la institución donde trabaja.');
          setIsCalculating(false);
          return;
        }
        
        if (data.isDirectivePosition) {
          alert('Los cargos directivos del Poder Judicial, INPE y Ministerio Público NO reciben el bono extraordinario de S/ 1,000.');
          setIsCalculating(false);
          return;
        }
        
        if (data.monthlyIncome >= 2000) {
          alert('El bono extraordinario judicial de S/ 1,000 solo aplica para personal con ingresos menores a S/ 2,000.');
          setIsCalculating(false);
          return;
        }
      }
      
      const calculationResult = calculator.calculate({
        ...data,
        deductibleExpenses,
      });
      
      console.log('\n🏠 GASTOS DEDUCIBLES:');
      console.log('  • Total Gastos:', calculationResult.summary.deductibleExpenses.totalExpenses);
      console.log('  • Total Deducción:', calculationResult.summary.deductibleExpenses.totalDeduction);
      console.log('  • Máxima Deducción (3 UIT):', calculationResult.summary.deductibleExpenses.maxDeduction);
      
      // PASO 2: Logging de resultados para donaciones
      console.log('\n🎁 PASO 2 - RESULTADOS DE DONACIONES:');
      console.log('  • Deducción 7 UIT:', calculationResult.summary.deduction7UIT);
      console.log('  • Monto de Donaciones:', calculationResult.summary.donations);
      console.log('  • Deducción por Donaciones:', calculationResult.summary.donationsDeduction);
      console.log('  • Ingreso Neto Final:', calculationResult.summary.finalNetIncome);
      
      // PASO 3: Logging de resultados para créditos
      console.log('\n💳 PASO 3 - RESULTADOS DE CRÉDITOS:');
      console.log('  • Impuesto Anual Proyectado:', calculationResult.summary.projectedAnnualTax);
      console.log('  • Total de Créditos Aplicables:', calculationResult.summary.totalTaxCredits);
      console.log('  • Impuesto Anual Final:', calculationResult.summary.finalAnnualTax);
      console.log('  • Desglose de Créditos:');
      console.log('    - Créditos Anteriores:', calculationResult.summary.taxCreditsBreakdown.previousCredits);
      console.log('    - Pagos a Cuenta:', calculationResult.summary.taxCreditsBreakdown.previousPayments);
      console.log('    - Saldos a Favor:', calculationResult.summary.taxCreditsBreakdown.previousRefunds);
      console.log('  • Solo Renta de Quinta Categoría:', calculationResult.summary.isOnlyFifthCategoryIncome);
      
      console.log('\n📅 CÁLCULOS MENSUALES:');
      calculationResult.monthlyCalculations.forEach((month, index) => {
        console.log(`  📍 ${month.monthName} (Mes ${month.month}):`);
        console.log(`    • Ingreso Mensual: ${month.monthlyIncome}`);
        console.log(`    • Ingreso Adicional: ${month.additionalIncome}`);
        console.log(`    • Gratificaciones: ${month.gratificaciones}`);
        console.log(`    • Bonificaciones: ${month.bonificaciones}`);
        console.log(`    • Utilidades: ${month.utilidades}`);
        console.log(`    • CTS: ${month.cts}`);
        console.log(`    • Asignación Familiar: ${month.asignacionFamiliar}`);
        if (month.aguinaldo && month.aguinaldo > 0) {
          console.log(`    • Aguinaldo Sector Público: ${month.aguinaldo}`);
        }
        if (month.bonoEscolaridad && month.bonoEscolaridad > 0) {
          console.log(`    • Bono por Escolaridad Sector Público: ${month.bonoEscolaridad}`);
        }
        console.log(`    • Total Mensual: ${month.totalMonthlyIncome}`);
        console.log(`    • Retención Mensual: ${month.monthlyRetention}`);
        console.log(`    • Retenciones Acumuladas: ${month.expectedAccumulatedRetention}`);
        if (month.observations) {
          console.log(`    • Observaciones: ${month.observations}`);
        }
        if (index < calculationResult.monthlyCalculations.length - 1) {
          console.log('    ──────────────────────────────────────────');
        }
      });
      
      console.log('\n🔧 PARÁMETROS DEL CÁLCULO:');
      console.log('  • UIT 2025:', calculator.getUIT());
      console.log('  • Deducción 7 UIT:', calculator.getDeduction7UIT());
      console.log('  • Máxima Deducción Adicional (3 UIT):', calculator.getMaxAdditionalDeduction());
      
      if (calculationResult.summary.isLimitedContract) {
        console.log('\n📋 INFORMACIÓN DEL CONTRATO LIMITADO:');
        console.log('  • Es Contrato Limitado:', calculationResult.summary.isLimitedContract);
        console.log('  • Mes de Terminación:', calculationResult.summary.contractEndMonth);
        console.log('  • Total de Meses del Contrato:', calculationResult.summary.totalContractMonths);
        console.log('  • Ajuste Final Aplicado:', calculationResult.summary.finalAdjustmentApplied);
      }
      
      if (calculationResult.summary.isPublicSectorWorker) {
        console.log('\n🏛️ INFORMACIÓN DEL SECTOR PÚBLICO:');
        console.log('  • Es Sector Público:', calculationResult.summary.isPublicSectorWorker);
        console.log('  • Total Aguinaldo:', calculationResult.summary.totalAguinaldo);
        console.log('  • Total Bono por Escolaridad:', calculationResult.summary.totalBonoEscolaridad);
        console.log('  • Total Bono Judicial:', calculationResult.summary.totalBonoJudicial);
      }
      
      console.log('='.repeat(80));
      console.log('✅ CÁLCULO COMPLETADO EXITOSAMENTE');
      console.log('='.repeat(80));
      
      // Store result in localStorage as backup
      localStorage.setItem('sunat-calculation-result', JSON.stringify(calculationResult));
      
      // Redirect to results page with data
      const encodedData = encodeURIComponent(JSON.stringify(calculationResult));
      
      // Small delay to ensure data is stored
      setTimeout(() => {
        router.push(`/results?data=${encodedData}`);
      }, 100);
      
    } catch (error) {
      console.error('❌ ERROR DURANTE EL CÁLCULO:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      alert('Error al realizar el cálculo. Por favor, verifica los datos ingresados.');
    } finally {
      setIsCalculating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      const nextStepNumber = currentStep + 1;
      setCurrentStep(nextStepNumber);
      
      // Additional scroll to top for immediate feedback
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const prevStepNumber = currentStep - 1;
      setCurrentStep(prevStepNumber);
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
      case 4:
        return <TaxCreditsStep form={form} />;
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
          <form className="space-y-8" onSubmit={(e) => {
            e.preventDefault(); // Prevenir envío automático
          }}>
            {/* Step Indicator */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progreso del Formulario</span>
                <span className="text-sm text-gray-500">Paso {currentStep} de 4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#004C97] h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>1. Básico</span>
                <span>2. Ingresos</span>
                <span>3. Gastos</span>
                <span>4. Créditos</span>
              </div>
            </div>

            {/* Step Content */}
            <div className="pt-4">
              {renderStep()}
            </div>

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
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#004C97] hover:bg-[#1976D2]"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={() => {
                      form.handleSubmit(onSubmit)();
                    }}
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
