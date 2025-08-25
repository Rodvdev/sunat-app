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

  console.log('🚀 COMPONENTE INICIALIZADO');
  console.log('  • Estado inicial - currentStep:', currentStep);
  console.log('  • Estado inicial - isCalculating:', isCalculating);

  // Logging adicional para detectar cambios de estado
  useEffect(() => {
    console.log('🔄 ESTADO CAMBIADO - currentStep:', currentStep);
  }, [currentStep]);

  useEffect(() => {
    console.log('🔄 ESTADO CAMBIADO - isCalculating:', isCalculating);
  }, [isCalculating]);

  // Update step information when step changes
  useEffect(() => {
    console.log('🔄 ACTUALIZANDO INFORMACIÓN DEL PASO:', currentStep);
    
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
    console.log('  • Información del paso:', currentStepInfo);
    
    onStepChange(currentStepInfo);
    
    // Scroll to top whenever step changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('✅ INFORMACIÓN DEL PASO ACTUALIZADA');
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
    console.log('🚀 FORMULARIO ENVIADO - PASO ACTUAL:', currentStep);
    console.log('  • ¿Se debería enviar en este paso?', currentStep === 4 ? 'SÍ' : 'NO');
    console.log('  • Datos del formulario:', data);
    
    if (currentStep !== 4) {
      console.error('❌ ERROR: El formulario se está enviando en el paso', currentStep, 'en lugar del paso 4');
      console.error('  • Esto NO debería suceder. Verificando la causa...');
      
      // Prevenir el envío y mostrar error
      alert(`Error: El formulario se está enviando en el paso ${currentStep} en lugar del paso 4. Por favor, completa todos los pasos.`);
      
      // Forzar el paso correcto
      setCurrentStep(4);
      return;
    }
    
    console.log('✅ FORMULARIO ENVIADO CORRECTAMENTE en el paso 4');
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
      
      console.log('\n🏠 GASTOS DEDUCIBLES:');
      console.log('  • Restaurantes:', data.restaurants);
      console.log('  • Servicios Médicos:', data.medicalServices);
      console.log('  • Servicios Profesionales:', data.professionalServices);
      console.log('  • Propiedades de Alquiler:', data.rentalProperties);
      console.log('  • Contribuciones EsSalud:', data.essaludContributions);
      
      // PASO 2: Logging para donaciones
      console.log('\n🎁 PASO 2 - DONACIONES (Artículo 49° de la Ley):');
      console.log('  • Monto de Donaciones:', data.donations);
      console.log('  • Nota: Las donaciones solo se pueden deducir en diciembre con motivo del ajuste final');
      console.log('  • Solo aplica para trabajadores que perciben rentas de quinta categoría');
      
      // PASO 3: Logging para créditos
      console.log('\n💳 PASO 3 - CRÉDITOS (Artículo 88° de la Ley):');
      console.log('  • Créditos de Declaraciones Anteriores:', data.previousTaxCredits);
      console.log('  • Pagos a Cuenta del Impuesto:', data.previousTaxPayments);
      console.log('  • Saldos a Favor Reconocidos:', data.previousTaxRefunds);
      console.log('  • Solo Renta de Quinta Categoría:', data.isOnlyFifthCategoryIncome);
      console.log('  • Nota: Los créditos se deducen del impuesto anual proyectado');
      
      console.log('\n🎯 RESUMEN DE TODOS LOS PASOS:');
      console.log('  • PASO 1: RBA proyectada y ingresos adicionales');
      console.log('  • PASO 2: Deducción de 7 UIT y donaciones');
      console.log('  • PASO 3: Aplicación de tasas del Artículo 53° y créditos del Artículo 88°');
      console.log('  • PASO 4: Fraccionamiento del impuesto anual en retenciones mensuales');
      console.log('  • PASO 5: Retenciones adicionales por ingresos extraordinarios');
      
      const calculator = new SunatCalculator();
      
      // Prepare deductible expenses if any are provided
      const deductibleExpenses: DeductibleExpenses = {
        restaurants: data.restaurants,
        medicalServices: data.medicalServices,
        professionalServices: data.professionalServices,
        rentalProperties: data.rentalProperties,
        essaludContributions: data.essaludContributions
      };

      console.log('\n🔍 VALIDANDO GASTOS DEDUCIBLES...');
      // Validate deductible expenses
      const validation = calculator.validateDeductibleExpenses(deductibleExpenses);
      if (!validation.isValid) {
        console.error('❌ ERRORES EN GASTOS DEDUCIBLES:', validation.errors);
        console.error('⚠️ ADVERTENCIAS:', validation.warnings);
        alert('Errores en gastos deducibles:\n' + validation.errors.join('\n'));
        setIsCalculating(false);
        return;
      }
      
      console.log('✅ GASTOS DEDUCIBLES VÁLIDOS');
      if (validation.warnings.length > 0) {
        console.warn('⚠️ ADVERTENCIAS:', validation.warnings);
      }

      console.log('\n⚡ VALIDACIONES ADICIONALES...');
      // Validaciones adicionales
      if (data.calculateGratificaciones && data.startWorkMonth > 7) {
        console.error('❌ ERROR: Mes de inicio debe ser antes de Julio para gratificaciones');
        alert('Si calculas gratificaciones automáticamente, el mes de inicio debe ser antes de Julio para recibir gratificaciones en Julio.');
        setIsCalculating(false);
        return;
      }

      if (data.calculateCTS && data.startWorkMonth > 5) {
        console.error('❌ ERROR: Mes de inicio debe ser antes de Mayo para CTS');
        alert('Si calculas CTS automáticamente, el mes de inicio debe ser antes de Mayo para recibir CTS en Mayo.');
        setIsCalculating(false);
        return;
      }

      if (data.calculateAsignacionFamiliar && !data.hasChildren && !data.childrenStudying) {
        console.error('❌ ERROR: Debe tener hijos para asignación familiar');
        alert('Para calcular asignación familiar automáticamente, debes tener hijos menores de 18 años o hijos estudiando.');
        setIsCalculating(false);
        return;
      }

      if (data.calculateAsignacionFamiliar && data.hasChildren && data.childrenCount === 0) {
        console.error('❌ ERROR: Debe especificar número de hijos');
        alert('Si tienes hijos menores de 18 años, debes especificar el número de hijos.');
        setIsCalculating(false);
        return;
      }

      // Validaciones para contratos de duración limitada
      if (data.isLimitedContract && data.contractEndMonth) {
        if (data.contractEndMonth < data.startWorkMonth) {
          console.error('❌ ERROR: El mes de terminación debe ser posterior al mes de inicio');
          alert('El mes de terminación del contrato debe ser posterior al mes de inicio de trabajo.');
          setIsCalculating(false);
          return;
        }
        
        if (data.contractEndMonth > 12) {
          console.error('❌ ERROR: El mes de terminación no puede ser mayor a 12');
          alert('El mes de terminación del contrato no puede ser mayor a diciembre (12).');
          setIsCalculating(false);
          return;
        }
      }

      // Validaciones para bono extraordinario judicial
      if (data.isJudicialWorker) {
        if (!data.judicialInstitution) {
          console.error('❌ ERROR: Debe seleccionar la institución judicial');
          alert('Si marca bono judicial, debe seleccionar la institución donde trabaja.');
          setIsCalculating(false);
          return;
        }
        
        if (data.isDirectivePosition) {
          console.error('❌ ERROR: Los cargos directivos no reciben bono extraordinario');
          alert('Los cargos directivos del Poder Judicial, INPE y Ministerio Público NO reciben el bono extraordinario de S/ 1,000.');
          setIsCalculating(false);
          return;
        }
        
        if (data.monthlyIncome >= 2000) {
          console.error('❌ ERROR: El bono judicial solo aplica para ingresos menores a S/ 2,000');
          alert('El bono extraordinario judicial de S/ 1,000 solo aplica para personal con ingresos menores a S/ 2,000.');
          setIsCalculating(false);
          return;
        }
      }
      
      console.log('✅ TODAS LAS VALIDACIONES PASARON');

      console.log('\n🧮 EJECUTANDO CÁLCULO SUNAT...');
      console.log('='.repeat(80));
      
      const calculationResult = calculator.calculate({
        ...data,
        deductibleExpenses,
      });
      
      console.log('🎯 RESULTADO DEL CÁLCULO COMPLETO:');
      console.log('='.repeat(80));
      console.log('📊 RESUMEN ANUAL:');
      console.log('  • RBA:', calculationResult.summary.totalAnnualIncome);
      console.log('  • Ingresos Adicionales:', calculationResult.summary.totalAdditionalIncome);
      console.log('  • Impuesto Anual Total:', calculationResult.summary.totalAnnualTax);
      console.log('  • Retención Anual Total:', calculationResult.summary.totalAnnualRetention);
      console.log('  • Retención Mensual Promedio:', calculationResult.summary.averageMonthlyRetention);
      
      console.log('\n💰 DESGLOSE DE INGRESOS ADICIONALES:');
      console.log('  • Total Gratificaciones:', calculationResult.summary.totalGratificaciones);
      console.log('  • Total Bonificaciones:', calculationResult.summary.totalBonificaciones);
      console.log('  • Total Utilidades:', calculationResult.summary.totalUtilidades);
      console.log('  • Total CTS:', calculationResult.summary.totalCTS);
      console.log('  • Total Asignación Familiar:', calculationResult.summary.totalAsignacionFamiliar);
      
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
        if (calculationResult.summary.receivesSchoolingBonus) {
          console.log('  • Recibe Bono por Escolaridad:', calculationResult.summary.receivesSchoolingBonus);
          console.log('  • Total Bono por Escolaridad:', calculationResult.summary.totalBonoEscolaridad);
        }
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
    console.log('🔄 NAVEGACIÓN: Intentando ir al siguiente paso');
    console.log('  • Paso actual:', currentStep);
    console.log('  • Total de pasos:', 4);
    
    if (currentStep < 4) {
      const nextStepNumber = currentStep + 1;
      console.log('  • Siguiente paso:', nextStepNumber);
      setCurrentStep(nextStepNumber);
      
      // Additional scroll to top for immediate feedback
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      console.log('✅ NAVEGACIÓN: Paso actualizado exitosamente');
    } else {
      console.log('⚠️ NAVEGACIÓN: Ya estás en el último paso');
    }
  };

  const prevStep = () => {
    console.log('🔄 NAVEGACIÓN: Intentando ir al paso anterior');
    console.log('  • Paso actual:', currentStep);
    
    if (currentStep > 1) {
      const prevStepNumber = currentStep - 1;
      console.log('  • Paso anterior:', prevStepNumber);
      setCurrentStep(prevStepNumber);
      
      console.log('✅ NAVEGACIÓN: Paso anterior establecido exitosamente');
    } else {
      console.log('⚠️ NAVEGACIÓN: Ya estás en el primer paso');
    }
  };

  const renderStep = () => {
    console.log('🎭 RENDERIZANDO PASO:', currentStep);
    
    switch (currentStep) {
      case 1:
        console.log('  • Renderizando: BasicInfoStep');
        return <BasicInfoStep form={form} />;
      case 2:
        console.log('  • Renderizando: AdditionalIncomeStep');
        return <AdditionalIncomeStep form={form} />;
      case 3:
        console.log('  • Renderizando: DeductibleExpensesStep');
        return <DeductibleExpensesStep form={form} />;
      case 4:
        console.log('  • Renderizando: TaxCreditsStep');
        return <TaxCreditsStep form={form} />;
      default:
        console.log('  • Renderizando: BasicInfoStep (default)');
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
            console.log('🚫 FORMULARIO PREVENIDO - Envío automático bloqueado');
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
                      console.log('🔘 BOTÓN CALCULAR PRESIONADO MANUALMENTE');
                      console.log('  • Paso actual:', currentStep);
                      console.log('  • Ejecutando onSubmit...');
                      form.handleSubmit(onSubmit)();
                    }}
                    className="bg-[#B71C1C] hover:bg-[#C62828] border-0" 
                    disabled={isCalculating}
                  >
                    {isCalculating ? 'Calculando...' : 'Calcular Retenciones'}
                  </Button>
                )}
                
                {/* Debug Button - Temporal */}
                {process.env.NODE_ENV === 'development' && (
                  <Button
                    type="button"
                    onClick={() => {
                      console.log('🔧 DEBUG: Forzando navegación al paso 4');
                      setCurrentStep(4);
                    }}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
                  >
                    Debug: Paso 4
                  </Button>
                )}
                
                {/* Debug Button - Estado del Formulario */}
                {process.env.NODE_ENV === 'development' && (
                  <Button
                    type="button"
                    onClick={() => {
                      console.log('🔍 DEBUG: Estado del formulario');
                      console.log('  • currentStep:', currentStep);
                      console.log('  • isCalculating:', isCalculating);
                      console.log('  • Form values:', form.getValues());
                      console.log('  • Form state:', form.formState);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                  >
                    Debug: Estado
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
