export interface SunatCalculationParams {
  year: number;
  monthlyIncome: number;
  additionalIncome: number;
  additionalMonth: number;
  calculationMonth: number;
  previousRetentions: number;
  roundingDecimals: number;
  deductibleExpenses?: DeductibleExpenses;
  // Nuevos campos para ingresos adicionales
  gratificaciones?: number;
  bonificaciones?: number;
  utilidades?: number;
  cts?: number;                    // Compensación por Tiempo de Servicios
  asignacionFamiliar?: number;     // Asignación Familiar
  gratificacionesMonth?: number;   // Mes de gratificaciones (Julio y Diciembre)
  bonificacionesMonth?: number;    // Mes de bonificaciones
  utilidadesMonth?: number;        // Mes de utilidades
  ctsMonth?: number;               // Mes de CTS (Mayo y Noviembre)
  asignacionFamiliarMonth?: number; // Mes de asignación familiar
  // Nuevos campos para cálculo de gratificaciones
  insuranceType?: 'essalud' | 'eps'; // Tipo de seguro de salud
  startWorkMonth?: number;         // Mes de inicio de trabajo (1-12)
  // Nuevos campos para configuración
  calculateGratificaciones?: boolean; // Si se deben calcular gratificaciones automáticamente
  calculateCTS?: boolean;          // Si se debe calcular CTS automáticamente
  calculateAsignacionFamiliar?: boolean; // Si se debe calcular asignación familiar
  // Campos para asignación familiar
  hasChildren?: boolean;           // Si tiene hijos menores de 18 años
  childrenCount?: number;          // Número de hijos
  childrenStudying?: boolean;      // Si tiene hijos estudiando después de 18 años
}

export interface DeductibleExpenses {
  restaurants: number;
  medicalServices: number;
  professionalServices: number;
  rentalProperties: number;
  essaludContributions: number;
}

export interface MonthlyCalculation {
  month: number;
  monthName: string;
  monthlyIncome: number;
  additionalIncome: number;
  // Nuevos campos para ingresos adicionales
  gratificaciones: number;
  bonificaciones: number;
  utilidades: number;
  cts: number;
  asignacionFamiliar: number;
  totalMonthlyIncome: number; // Ingreso total del mes (base + adicionales + gratificaciones + bonificaciones + utilidades + CTS + asignación familiar)
  projectedAccumulatedIncome: number;
  projectedNetIncome: number;
  projectedTax: number;
  expectedAccumulatedRetention: number;
  previousAccumulatedRetention: number;
  monthlyRetention: number;
  observations: string;
  // Nuevos campos para gratificaciones
  gratificacionBase?: number;      // Cálculo base de gratificación
  gratificacionBono?: number;      // Bono por tipo de seguro
  gratificacionTotal?: number;     // Total de gratificación
  mesesTrabajados?: number;        // Meses trabajados hasta el mes actual
  // Nuevos campos para CTS
  ctsBase?: number;                // Cálculo base de CTS
  ctsDias?: number;                // Cálculo por días de CTS
  ctsTotal?: number;               // Total de CTS
}

export interface SunatCalculationResult {
  parameters: SunatCalculationParams;
  monthlyCalculations: MonthlyCalculation[];
  summary: {
    totalAnnualIncome: number;
    totalAnnualTax: number;
    totalAnnualRetention: number;
    averageMonthlyRetention: number;
    deductibleExpenses: DeductibleExpensesSummary;
    // Nuevos campos para resumen de ingresos adicionales
    totalGratificaciones: number;
    totalBonificaciones: number;
    totalUtilidades: number;
    totalCTS: number;
    totalAsignacionFamiliar: number;
    totalAdditionalIncome: number; // Suma de todos los ingresos adicionales
    // Nuevos campos para gratificaciones
    gratificacionesCalculadas: {
      julio?: GratificacionDetail;
      diciembre?: GratificacionDetail;
    };
    // Nuevos campos para CTS
    ctsCalculadas: {
      mayo?: { base: number; dias: number; total: number };
      noviembre?: { base: number; dias: number; total: number };
    };
  };
}

// Nueva interfaz para detalles de gratificación
export interface GratificacionDetail {
  mes: number;
  mesName: string;
  mesesTrabajados: number;
  sueldoBase: number;
  calculoBase: number;
  bonoSeguro: number;
  totalGratificacion: number;
  tipoSeguro: 'essalud' | 'eps';
  porcentajeSeguro: number;
}

export interface DeductibleExpensesSummary {
  totalExpenses: number;
  totalDeduction: number;
  maxDeduction: number;
  remainingDeduction: number;
  breakdown: {
    restaurants: { amount: number; deduction: number; percentage: number };
    medicalServices: { amount: number; deduction: number; percentage: number };
    professionalServices: { amount: number; deduction: number; percentage: number };
    rentalProperties: { amount: number; deduction: number; percentage: number };
    essaludContributions: { amount: number; deduction: number; percentage: number };
  };
}

export class SunatCalculator {
  private readonly UIT_2025 = 5350; // UIT 2025 - Actualizado por MEF (Decreto Supremo Nº 260-2024-EF)
  private readonly DEDUCTION_7_UIT = 7 * this.UIT_2025;
  private readonly MAX_ADDITIONAL_DEDUCTION = 3 * this.UIT_2025; // Máximo 3 UIT para gastos deducibles
  
  // Tax brackets for 2025 (simplified - should be updated with actual rates)
  private readonly TAX_BRACKETS = [
    { min: 0, max: 7 * this.UIT_2025, rate: 0.08 },
    { min: 7 * this.UIT_2025, max: 12 * this.UIT_2025, rate: 0.14 },
    { min: 12 * this.UIT_2025, max: 20 * this.UIT_2025, rate: 0.17 },
    { min: 20 * this.UIT_2025, max: 35 * this.UIT_2025, rate: 0.20 },
    { min: 35 * this.UIT_2025, max: Infinity, rate: 0.30 }
  ];

  // Deductible expenses percentages for 2025
  private readonly DEDUCTIBLE_PERCENTAGES = {
    restaurants: 0.15,        // 15% para restaurantes, bares y hoteles
    medicalServices: 0.30,    // 30% para servicios médicos y odontológicos
    professionalServices: 0.30, // 30% para servicios profesionales y oficios
    rentalProperties: 0.30,   // 30% para alquiler de inmuebles
    essaludContributions: 1.00 // 100% para aportaciones a EsSalud
  };

  // Porcentajes de bono por tipo de seguro para gratificaciones
  private readonly GRATIFICACION_BONO_PORCENTAJES = {
    essalud: 0.09,    // 9% para EsSalud
    eps: 0.0675       // 6.75% para EPS
  };

  private readonly MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  /**
   * Calcula la gratificación según la normativa peruana
   * Fórmula: (Sueldo × Meses Trabajados) ÷ 6 + Bono de Seguro
   */
  private calculateGratificacion(
    month: number, 
    monthlyIncome: number, 
    insuranceType: 'essalud' | 'eps' = 'essalud',
    startWorkMonth: number = 1
  ): { base: number; bono: number; total: number; mesesTrabajados: number } {
    // Meses trabajados desde el inicio hasta el mes actual
    const mesesTrabajados = Math.max(1, month - startWorkMonth + 1);
    
    // Cálculo base: (Sueldo × Meses Trabajados) ÷ 6
    const calculoBase = (monthlyIncome * mesesTrabajados) / 6;
    
    // Bono por tipo de seguro
    const porcentajeSeguro = this.GRATIFICACION_BONO_PORCENTAJES[insuranceType];
    const bonoSeguro = calculoBase * porcentajeSeguro;
    
    // Total de gratificación
    const totalGratificacion = calculoBase + bonoSeguro;
    
    return {
      base: this.round(calculoBase, 2),
      bono: this.round(bonoSeguro, 2),
      total: this.round(totalGratificacion, 2),
      mesesTrabajados
    };
  }

  /**
   * Calcula la CTS según la normativa peruana
   * Fórmula: [(Remuneración computable / 12) × N° de meses] + [(Remuneración computable / 360) × N° de días]
   * Se paga en MAYO y NOVIEMBRE por defecto
   */
  private calculateCTS(
    month: number,
    monthlyIncome: number,
    startWorkMonth: number = 1
  ): { base: number; dias: number; total: number } {
    // Meses trabajados desde el inicio hasta el mes actual
    const mesesTrabajados = Math.max(1, month - startWorkMonth + 1);
    
    // Días trabajados en el mes actual (aproximado a 30 días por mes)
    const diasTrabajados = 30;
    
    // Cálculo base: (Remuneración computable / 12) × N° de meses
    const calculoBase = (monthlyIncome * mesesTrabajados) / 12;
    
    // Cálculo por días: (Remuneración computable / 360) × N° de días
    const calculoDias = (monthlyIncome * diasTrabajados) / 360;
    
    // Total de CTS
    const totalCTS = calculoBase + calculoDias;
    
    return {
      base: this.round(calculoBase, 2),
      dias: this.round(calculoDias, 2),
      total: this.round(totalCTS, 2)
    };
  }

  calculate(params: SunatCalculationParams): SunatCalculationResult {
    const monthlyCalculations: MonthlyCalculation[] = [];
    let accumulatedRetention = params.previousRetentions;
    
    // Valores por defecto para parámetros opcionales
    const insuranceType = params.insuranceType || 'essalud';
    const startWorkMonth = params.startWorkMonth || 1;
    const calculateGratificaciones = params.calculateGratificaciones !== false; // Por defecto true
    const calculateCTS = params.calculateCTS !== false; // Por defecto true
    const calculateAsignacionFamiliar = params.calculateAsignacionFamiliar !== false; // Por defecto true
    const hasChildren = params.hasChildren || false;
    const childrenCount = params.childrenCount || 0;
    const childrenStudying = params.childrenStudying || false;

    // Calcular asignación familiar si corresponde
    let asignacionFamiliarMensual = 0;
    if (calculateAsignacionFamiliar && (hasChildren || childrenStudying)) {
      // Asignación familiar: S/ 75.00 por hijo (10% de la RMLV)
      // Se considera el número de hijos menores de 18 años o estudiando
      const hijosElegibles = Math.max(childrenCount, hasChildren ? 1 : 0);
      asignacionFamiliarMensual = 75.00 * hijosElegibles;
    }

    // Calculate total projected annual income including all additional income types
    let totalProjectedAnnualIncome = params.monthlyIncome * 12;
    
    // Add additional income (single month)
    totalProjectedAnnualIncome += params.additionalIncome || 0;
    
    // Add gratificaciones (July and December by default, or custom month)
    if (params.gratificacionesMonth) {
      totalProjectedAnnualIncome += params.gratificaciones || 0;
    } else if (calculateGratificaciones) {
      // Calcular gratificaciones reales para julio y diciembre
      // Solo si el trabajador ya estaba trabajando en esos meses
      let gratificacionJulio = 0;
      let gratificacionDiciembre = 0;
      
      if (7 >= startWorkMonth) {
        const gratificacionJulioCalc = this.calculateGratificacion(7, params.monthlyIncome, insuranceType, startWorkMonth);
        gratificacionJulio = gratificacionJulioCalc.total;
      }
      
      if (12 >= startWorkMonth) {
        const gratificacionDiciembreCalc = this.calculateGratificacion(12, params.monthlyIncome, insuranceType, startWorkMonth);
        gratificacionDiciembre = gratificacionDiciembreCalc.total;
      }
      
      totalProjectedAnnualIncome += gratificacionJulio + gratificacionDiciembre;
    }
    
    // Add bonificaciones (custom month)
    totalProjectedAnnualIncome += params.bonificaciones || 0;
    
    // Add utilidades (custom month)
    totalProjectedAnnualIncome += params.utilidades || 0;
    
    // Add CTS (May and November by default, or custom month)
    if (params.ctsMonth) {
      totalProjectedAnnualIncome += params.cts || 0;
    } else if (calculateCTS) {
      // Calcular CTS real para mayo y noviembre
      let ctsMayo = 0;
      let ctsNoviembre = 0;
      
      if (5 >= startWorkMonth) {
        const ctsMayoCalc = this.calculateCTS(5, params.monthlyIncome, startWorkMonth);
        ctsMayo = ctsMayoCalc.total;
      }
      
      if (11 >= startWorkMonth) {
        const ctsNoviembreCalc = this.calculateCTS(11, params.monthlyIncome, startWorkMonth);
        ctsNoviembre = ctsNoviembreCalc.total;
      }
      
      totalProjectedAnnualIncome += ctsMayo + ctsNoviembre;
    }
    
    // Add asignación familiar (monthly)
    // Si se especifica un valor personalizado, usarlo; si no, usar el valor por defecto
    const asignacionFamiliarAnual = calculateAsignacionFamiliar ? (params.asignacionFamiliar || asignacionFamiliarMensual) * 12 : 0;
    totalProjectedAnnualIncome += asignacionFamiliarAnual;

    // Calculate deductible expenses if provided
    const deductibleExpensesSummary = this.calculateDeductibleExpenses(params.deductibleExpenses);

    // Calculate for each month from calculation month to December
    for (let month = params.calculationMonth; month <= 12; month++) {
      const monthIndex = month - 1;
      const monthName = this.MONTH_NAMES[monthIndex];
      
      // Calculate monthly income and additional income types
      const monthlyIncome = params.monthlyIncome;
      const additionalIncome = month === params.additionalMonth ? (params.additionalIncome || 0) : 0;
      
      // Calculate gratificaciones (Julio y Diciembre por defecto)
      let gratificaciones = 0;
      let gratificacionDetail: Partial<{
        gratificacionBase: number;
        gratificacionBono: number;
        gratificacionTotal: number;
        mesesTrabajados: number;
      }> | null = null;
      
      if (params.gratificacionesMonth && month === params.gratificacionesMonth) {
        // Mes personalizado especificado
        gratificaciones = params.gratificaciones || 0;
      } else if (!params.gratificacionesMonth && (month === 7 || month === 12)) {
        // Meses por defecto solo si no se especifica mes personalizado
        // Y solo si el trabajador ya estaba trabajando en ese mes
        if (month >= startWorkMonth) {
          const gratificacionCalc = this.calculateGratificacion(month, params.monthlyIncome, insuranceType, startWorkMonth);
          gratificaciones = gratificacionCalc.total;
          gratificacionDetail = {
            gratificacionBase: gratificacionCalc.base,
            gratificacionBono: gratificacionCalc.bono,
            gratificacionTotal: gratificacionCalc.total,
            mesesTrabajados: gratificacionCalc.mesesTrabajados
          };
        }
      }
      
      // Calculate bonificaciones
      const bonificaciones = month === params.bonificacionesMonth ? (params.bonificaciones || 0) : 0;
      
      // Calculate utilidades
      const utilidades = month === params.utilidadesMonth ? (params.utilidades || 0) : 0;
      
      // Calculate CTS (Mayo y Noviembre por defecto)
      let cts = 0;
      let ctsDetail: Partial<{
        ctsBase: number;
        ctsDias: number;
        ctsTotal: number;
      }> | null = null;
      
      if (params.ctsMonth && month === params.ctsMonth) {
        // Mes personalizado especificado
        cts = params.cts || 0;
      } else if (!params.ctsMonth && calculateCTS && (month === 5 || month === 11)) {
        // Meses por defecto solo si no se especifica mes personalizado y se debe calcular automáticamente
        // Y solo si el trabajador ya estaba trabajando en ese mes
        if (month >= startWorkMonth) {
          const ctsCalc = this.calculateCTS(month, params.monthlyIncome, startWorkMonth);
          cts = ctsCalc.total;
          ctsDetail = {
            ctsBase: ctsCalc.base,
            ctsDias: ctsCalc.dias,
            ctsTotal: ctsCalc.total
          };
        }
      }
      
      // Calculate Asignación Familiar (mensual)
      // Si se especifica un valor personalizado, usarlo; si no, usar el valor por defecto
      const asignacionFamiliar = calculateAsignacionFamiliar ? (params.asignacionFamiliar || asignacionFamiliarMensual) : 0;
      
      // Total monthly income
      const totalMonthlyIncome = monthlyIncome + additionalIncome + gratificaciones + bonificaciones + utilidades + cts + asignacionFamiliar;
      
      // Projected net income (after 7 UIT deduction and deductible expenses)
      const projectedNetIncome = Math.max(0, totalProjectedAnnualIncome - this.DEDUCTION_7_UIT - deductibleExpensesSummary.totalDeduction);
      
      // Calculate projected tax using progressive brackets
      const projectedTax = this.calculateProgressiveTax(projectedNetIncome);
      
      // Calculate expected accumulated retention
      const expectedAccumulatedRetention = this.round(projectedTax * (month / 12), params.roundingDecimals);
      
      // Calculate monthly retention
      const monthlyRetention = Math.max(0, expectedAccumulatedRetention - accumulatedRetention);
      
      // Update accumulated retention
      accumulatedRetention += monthlyRetention;

      // Build observations
      const observations = [];
      if (additionalIncome > 0) observations.push('Ingreso adicional');
      if (gratificaciones > 0) observations.push('Gratificación');
      if (bonificaciones > 0) observations.push('Bonificación');
      if (utilidades > 0) observations.push('Utilidades');
      if (cts > 0) observations.push('CTS');
      if (asignacionFamiliar > 0) observations.push('Asignación Familiar');

      const calculation: MonthlyCalculation = {
        month,
        monthName,
        monthlyIncome,
        additionalIncome,
        gratificaciones,
        bonificaciones,
        utilidades,
        cts,
        asignacionFamiliar,
        totalMonthlyIncome,
        projectedAccumulatedIncome: totalProjectedAnnualIncome,
        projectedNetIncome,
        projectedTax,
        expectedAccumulatedRetention,
        previousAccumulatedRetention: accumulatedRetention - monthlyRetention,
        monthlyRetention,
        observations: observations.join(', ') || '',
        ...gratificacionDetail,
        ...ctsDetail
      };

      monthlyCalculations.push(calculation);
    }

    // Calculate summary
    const totalAnnualIncome = totalProjectedAnnualIncome; // Use the same calculation
    
    const totalAnnualTax = this.calculateProgressiveTax(Math.max(0, totalAnnualIncome - this.DEDUCTION_7_UIT - deductibleExpensesSummary.totalDeduction));
    const totalAnnualRetention = monthlyCalculations.reduce((sum, calc) => sum + calc.monthlyRetention, 0);
    const averageMonthlyRetention = monthlyCalculations.length > 0 ? totalAnnualRetention / monthlyCalculations.length : 0;

    // Calculate totals for each income type
    let totalGratificaciones = 0;
    let totalCTS = 0;
    let gratificacionesCalculadas: {
      julio?: GratificacionDetail;
      diciembre?: GratificacionDetail;
    } = {};
    let ctsCalculadas: {
      mayo?: { base: number; dias: number; total: number };
      noviembre?: { base: number; dias: number; total: number };
    } = {};
    
    if (params.gratificacionesMonth) {
      totalGratificaciones = params.gratificaciones || 0;
    } else if (calculateGratificaciones) {
      // Calcular gratificaciones reales para julio y diciembre
      // Solo si el trabajador ya estaba trabajando en esos meses
      let gratificacionJulio = 0;
      let gratificacionDiciembre = 0;
      let gratificacionJulioCalc: { base: number; bono: number; total: number; mesesTrabajados: number } | null = null;
      let gratificacionDiciembreCalc: { base: number; bono: number; total: number; mesesTrabajados: number } | null = null;
      
      if (7 >= startWorkMonth) {
        gratificacionJulioCalc = this.calculateGratificacion(7, params.monthlyIncome, insuranceType, startWorkMonth);
        gratificacionJulio = gratificacionJulioCalc.total;
      }
      
      if (12 >= startWorkMonth) {
        gratificacionDiciembreCalc = this.calculateGratificacion(12, params.monthlyIncome, insuranceType, startWorkMonth);
        gratificacionDiciembre = gratificacionDiciembreCalc.total;
      }
      
      totalGratificaciones = gratificacionJulio + gratificacionDiciembre;
      
      gratificacionesCalculadas = {
        julio: 7 >= startWorkMonth && gratificacionJulioCalc ? {
          mes: 7,
          mesName: 'Julio',
          mesesTrabajados: gratificacionJulioCalc.mesesTrabajados,
          sueldoBase: params.monthlyIncome,
          calculoBase: gratificacionJulioCalc.base,
          bonoSeguro: gratificacionJulioCalc.bono,
          totalGratificacion: gratificacionJulioCalc.total,
          tipoSeguro: insuranceType,
          porcentajeSeguro: this.GRATIFICACION_BONO_PORCENTAJES[insuranceType] * 100
        } : undefined,
        diciembre: 12 >= startWorkMonth && gratificacionDiciembreCalc ? {
          mes: 12,
          mesName: 'Diciembre',
          mesesTrabajados: gratificacionDiciembreCalc.mesesTrabajados,
          sueldoBase: params.monthlyIncome,
          calculoBase: gratificacionDiciembreCalc.base,
          bonoSeguro: gratificacionDiciembreCalc.bono,
          totalGratificacion: gratificacionDiciembreCalc.total,
          tipoSeguro: insuranceType,
          porcentajeSeguro: this.GRATIFICACION_BONO_PORCENTAJES[insuranceType] * 100
        } : undefined
      };
    }
    
    if (params.ctsMonth) {
      totalCTS = params.cts || 0;
    } else if (calculateCTS) {
      // Calcular CTS real para mayo y noviembre
      let ctsMayo = 0;
      let ctsNoviembre = 0;
      let ctsMayoCalc: { base: number; dias: number; total: number } | null = null;
      let ctsNoviembreCalc: { base: number; dias: number; total: number } | null = null;
      
      if (5 >= startWorkMonth) {
        ctsMayoCalc = this.calculateCTS(5, params.monthlyIncome, startWorkMonth);
        ctsMayo = ctsMayoCalc.total;
      }
      
      if (11 >= startWorkMonth) {
        ctsNoviembreCalc = this.calculateCTS(11, params.monthlyIncome, startWorkMonth);
        ctsNoviembre = ctsNoviembreCalc.total;
      }
      
      totalCTS = ctsMayo + ctsNoviembre;
      
      ctsCalculadas = {
        mayo: 5 >= startWorkMonth && ctsMayoCalc ? ctsMayoCalc : undefined,
        noviembre: 11 >= startWorkMonth && ctsNoviembreCalc ? ctsNoviembreCalc : undefined
      };
    }

    return {
      parameters: params,
      monthlyCalculations,
      summary: {
        totalAnnualIncome,
        totalAnnualTax,
        totalAnnualRetention,
        averageMonthlyRetention,
        deductibleExpenses: deductibleExpensesSummary,
        totalGratificaciones,
        totalBonificaciones: params.bonificaciones || 0,
        totalUtilidades: params.utilidades || 0,
        totalCTS,
        totalAsignacionFamiliar: asignacionFamiliarAnual,
        totalAdditionalIncome: (params.additionalIncome || 0) + totalGratificaciones + (params.bonificaciones || 0) + (params.utilidades || 0) + totalCTS + asignacionFamiliarAnual,
        gratificacionesCalculadas,
        ctsCalculadas
      }
    };
  }

  private calculateDeductibleExpenses(expenses?: DeductibleExpenses): DeductibleExpensesSummary {
    if (!expenses) {
      return this.getEmptyDeductibleExpensesSummary();
    }

    const breakdown = {
      restaurants: {
        amount: expenses.restaurants,
        deduction: this.round(expenses.restaurants * this.DEDUCTIBLE_PERCENTAGES.restaurants, 2),
        percentage: this.DEDUCTIBLE_PERCENTAGES.restaurants * 100
      },
      medicalServices: {
        amount: expenses.medicalServices,
        deduction: this.round(expenses.medicalServices * this.DEDUCTIBLE_PERCENTAGES.medicalServices, 2),
        percentage: this.DEDUCTIBLE_PERCENTAGES.medicalServices * 100
      },
      professionalServices: {
        amount: expenses.professionalServices,
        deduction: this.round(expenses.professionalServices * this.DEDUCTIBLE_PERCENTAGES.professionalServices, 2),
        percentage: this.DEDUCTIBLE_PERCENTAGES.professionalServices * 100
      },
      rentalProperties: {
        amount: expenses.rentalProperties,
        deduction: this.round(expenses.rentalProperties * this.DEDUCTIBLE_PERCENTAGES.rentalProperties, 2),
        percentage: this.DEDUCTIBLE_PERCENTAGES.rentalProperties * 100
      },
      essaludContributions: {
        amount: expenses.essaludContributions,
        deduction: this.round(expenses.essaludContributions * this.DEDUCTIBLE_PERCENTAGES.essaludContributions, 2),
        percentage: this.DEDUCTIBLE_PERCENTAGES.essaludContributions * 100
      }
    };

    const totalExpenses = Object.values(expenses).reduce((sum, amount) => sum + amount, 0);
    const totalDeduction = Object.values(breakdown).reduce((sum, item) => sum + item.deduction, 0);
    
    // Apply 3 UIT maximum limit
    const maxDeduction = this.MAX_ADDITIONAL_DEDUCTION;
    const finalDeduction = Math.min(totalDeduction, maxDeduction);
    const remainingDeduction = Math.max(0, maxDeduction - finalDeduction);

    return {
      totalExpenses,
      totalDeduction: finalDeduction,
      maxDeduction,
      remainingDeduction,
      breakdown
    };
  }

  private getEmptyDeductibleExpensesSummary(): DeductibleExpensesSummary {
    const emptyBreakdown = {
      restaurants: { amount: 0, deduction: 0, percentage: 0 },
      medicalServices: { amount: 0, deduction: 0, percentage: 0 },
      professionalServices: { amount: 0, deduction: 0, percentage: 0 },
      rentalProperties: { amount: 0, deduction: 0, percentage: 0 },
      essaludContributions: { amount: 0, deduction: 0, percentage: 0 }
    };

    return {
      totalExpenses: 0,
      totalDeduction: 0,
      maxDeduction: this.MAX_ADDITIONAL_DEDUCTION,
      remainingDeduction: this.MAX_ADDITIONAL_DEDUCTION,
      breakdown: emptyBreakdown
    };
  }

  private calculateProgressiveTax(netIncome: number): number {
    let totalTax = 0;
    let remainingIncome = netIncome;

    for (const bracket of this.TAX_BRACKETS) {
      if (remainingIncome <= 0) break;
      
      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      if (taxableInBracket > 0) {
        totalTax += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
      }
    }

    return this.round(totalTax, 2);
  }

  private round(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  // Getter for UIT value
  getUIT(): number {
    return this.UIT_2025;
  }

  // Getter for 7 UIT deduction
  getDeduction7UIT(): number {
    return this.DEDUCTION_7_UIT;
  }

  // Getter for maximum additional deduction (3 UIT)
  getMaxAdditionalDeduction(): number {
    return this.MAX_ADDITIONAL_DEDUCTION;
  }

  // Getter for deductible percentages
  getDeductiblePercentages() {
    return { ...this.DEDUCTIBLE_PERCENTAGES };
  }

  // Validate deductible expenses according to SUNAT rules
  validateDeductibleExpenses(expenses: DeductibleExpenses): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if total expenses exceed reasonable limits
    const totalExpenses = Object.values(expenses).reduce((sum, amount) => sum + amount, 0);
    if (totalExpenses > 100000) {
      warnings.push('El monto total de gastos parece muy alto. Verifica que todos los gastos sean correctos.');
    }

    // Check individual expense limits
    if (expenses.restaurants > 50000) {
      warnings.push('Los gastos en restaurantes parecen muy altos. Verifica que correspondan a gastos personales.');
    }

    if (expenses.medicalServices > 30000) {
      warnings.push('Los gastos médicos parecen muy altos. Verifica que correspondan a servicios personales.');
    }

    if (expenses.rentalProperties > 60000) {
      warnings.push('Los gastos de alquiler parecen muy altos. Verifica que correspondan a vivienda personal.');
    }

    // Check for negative values
    Object.entries(expenses).forEach(([key, value]) => {
      if (value < 0) {
        errors.push(`Los gastos en ${key} no pueden ser negativos.`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
