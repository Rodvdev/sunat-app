import { useMemo } from 'react';
import { UseFormWatch } from 'react-hook-form';

interface FormData {
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
}

interface RemunerationCalculation {
  RBA: number; // RBA
  rna: number; // Remuneración Neta Anual (RBA - 7 UIT)
  uit: number; // UIT actual
  deduction7UIT: number; // Deducción de 7 UIT
  remainingMonths: number; // Meses restantes desde el mes de inicio
}

export const useRemunerationCalculator = (watch: UseFormWatch<FormData>): RemunerationCalculation => {
  const values = watch();

  return useMemo(() => {
    const UIT_2025 = 5350; // UIT 2025
    const DEDUCTION_7_UIT = 7 * UIT_2025;
    
    // Calcular meses restantes desde el mes de inicio
    const startMonth = values.startWorkMonth || 1;
    let remainingMonths = 12 - startMonth + 1;
    
    // Ajustar para contratos de duración limitada
    if (values.isLimitedContract && values.contractEndMonth) {
      remainingMonths = values.contractEndMonth - startMonth + 1;
    }
    
    // Calcular ingresos básicos mensuales
    const monthlyIncome = values.monthlyIncome || 0;
    const basicAnnualIncome = monthlyIncome * remainingMonths;
    
    // Calcular ingresos adicionales por mes
    const additionalIncomeByMonth = values.additionalIncomeByMonth || [];
    const totalAdditionalIncomeByMonth = additionalIncomeByMonth.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    // Calcular ingresos adicionales generales
    const additionalIncome = values.additionalIncome || 0;
    
    // Calcular ingresos adicionales específicos (si se han configurado manualmente)
    const gratificaciones = values.gratificaciones || 0;
    const bonificaciones = values.bonificaciones || 0;
    const utilidades = values.utilidades || 0;
    const cts = values.cts || 0;
    const asignacionFamiliar = values.asignacionFamiliar || 0;
    
    // Calcular gratificaciones (si se activa)
    let totalGratificaciones = 0;
    if (values.calculateGratificaciones) {
      // Julio
      if (7 >= startMonth) {
        const julioGratificacion = monthlyIncome * 0.5; // 50% del sueldo
        const bonoSeguro = monthlyIncome * (values.insuranceType === 'essalud' ? 0.09 : 0.0675);
        totalGratificaciones += julioGratificacion + bonoSeguro;
      }
      // Diciembre
      if (12 >= startMonth) {
        const diciembreGratificacion = monthlyIncome * 0.5; // 50% del sueldo
        const bonoSeguro = monthlyIncome * (values.insuranceType === 'essalud' ? 0.09 : 0.0675);
        totalGratificaciones += diciembreGratificacion + bonoSeguro;
      }
    }
    
    // Calcular CTS (si se activa)
    let totalCTS = 0;
    if (values.calculateCTS) {
      // Mayo
      if (5 >= startMonth) {
        totalCTS += monthlyIncome * 0.5; // 50% del sueldo
      }
      // Noviembre
      if (11 >= startMonth) {
        totalCTS += monthlyIncome * 0.5; // 50% del sueldo
      }
    }
    
    // Calcular asignación familiar (si se activa)
    let totalAsignacionFamiliar = 0;
    if (values.calculateAsignacionFamiliar && values.hasChildren && values.childrenCount > 0) {
      const asignacionMensual = 75.00; // S/ 75 por hijo
      totalAsignacionFamiliar = asignacionMensual * values.childrenCount * remainingMonths;
    }
    
    // Calcular aguinaldo del sector público
    let totalAguinaldo = 0;
    if (values.isPublicSectorWorker && 7 >= startMonth) {
      totalAguinaldo = 300.00; // S/ 300 en julio
    }
    
    // Calcular bono por escolaridad del sector público
    let totalBonoEscolaridad = 0;
    if (values.isPublicSectorWorker && values.receivesSchoolingBonus) {
      totalBonoEscolaridad = 400.00; // S/ 400
    }
    
    // Calcular bono extraordinario judicial
    let totalBonoJudicial = 0;
    if (values.isJudicialWorker && 
        values.judicialInstitution && 
        !values.isDirectivePosition && 
        monthlyIncome < 2000) {
      totalBonoJudicial = 1000.00; // S/ 1,000
    }
    
    // Calcular RBA (RBA)
    const RBA = basicAnnualIncome + 
                totalAdditionalIncomeByMonth + 
                additionalIncome + 
                totalGratificaciones + 
                totalCTS + 
                totalAsignacionFamiliar + 
                totalAguinaldo + 
                totalBonoEscolaridad + 
                totalBonoJudicial;
    
    // Calcular Remuneración Neta Anual (RNA) = RBA - 7 UIT
    const rna = Math.max(0, RBA - DEDUCTION_7_UIT);
    
    return {
      RBA: Math.round(RBA * 100) / 100, // Redondear a 2 decimales
      rna: Math.round(rna * 100) / 100, // Redondear a 2 decimales
      uit: UIT_2025,
      deduction7UIT: DEDUCTION_7_UIT,
      remainingMonths
    };
  }, [
    values.monthlyIncome,
    values.startWorkMonth,
    values.additionalIncomeByMonth,
    values.additionalIncome,
    values.calculateGratificaciones,
    values.calculateCTS,
    values.calculateAsignacionFamiliar,
    values.hasChildren,
    values.childrenCount,
    values.insuranceType,
    values.isLimitedContract,
    values.contractEndMonth,
    values.isPublicSectorWorker,
    values.receivesSchoolingBonus,
    values.isJudicialWorker,
    values.judicialInstitution,
    values.isDirectivePosition
  ]);
};
