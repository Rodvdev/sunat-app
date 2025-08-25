export interface SunatCalculationParams {
  year: number;
  monthlyIncome: number;
  additionalIncomeByMonth?: { month: number; amount: number }[];
  additionalIncome: number;
  additionalMonth: number;
  calculationMonth: number;
  previousRetentions: number;
  roundingDecimals?: number;
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
  // Campos para contratos de duración limitada
  contractEndMonth?: number;       // Mes de terminación del contrato (1-12, opcional)
  isLimitedContract?: boolean;     // Si es un contrato de duración limitada
  // Campo para sector público
  isPublicSectorWorker?: boolean;  // Si es trabajador del sector público
  // Campo para bono por escolaridad del sector público
  receivesSchoolingBonus?: boolean; // Si recibe bono por escolaridad
  // Campos para bono extraordinario judicial
  isJudicialWorker?: boolean;      // Si es personal judicial
  judicialInstitution?: 'poder_judicial' | 'inpe' | 'ministerio_publico'; // Institución judicial
  isDirectivePosition?: boolean;   // Si tiene cargo directivo
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
  additionalMonthlyRetention: number; // Nueva propiedad para retención adicional
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
  // Campos para contratos de duración limitada
  isContractEndMonth?: boolean;    // Si es el mes de terminación del contrato
  finalAdjustment?: number;        // Ajuste final según SUNAT (si aplica)
  finalRetention?: number;         // Retención final del contrato
  // Campo para sector público
  aguinaldo?: number;              // Aguinaldo de S/ 300 para sector público
  // Campo para bono por escolaridad del sector público
  bonoEscolaridad?: number;        // Bono por escolaridad de S/ 400
  // Campo para bono judicial
  bonoJudicial?: number;           // Bono extraordinario judicial de S/ 1,000
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
    // Campos para contratos de duración limitada
    isLimitedContract?: boolean;
    contractEndMonth?: number;
    totalContractMonths?: number;
    finalAdjustmentApplied?: boolean;
    // Campo para sector público
    isPublicSectorWorker?: boolean;
    totalAguinaldo?: number;
    // Campo para bono por escolaridad del sector público
    receivesSchoolingBonus?: boolean;
    totalBonoEscolaridad?: number;
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
  private readonly ASIGNACION_FAMILIAR_2025 = 75.00; // Asignación familiar 2025 (10% de RMLV)
  private readonly AGUINALDO_PUBLICO = 300.00; // Aguinaldo para trabajadores del sector público
  private readonly BONO_ESCOLARIDAD_PUBLICO = 400.00; // Bono por escolaridad para sector público
  
  // Tax brackets for 2025 según escalas progresivas de SUNAT
  private readonly TAX_BRACKETS = [
    { min: 0, max: 5 * this.UIT_2025, rate: 0.08 },      // Hasta 5 UIT: 8%
    { min: 5 * this.UIT_2025, max: 20 * this.UIT_2025, rate: 0.14 },    // Más de 5 hasta 20 UIT: 14%
    { min: 20 * this.UIT_2025, max: 35 * this.UIT_2025, rate: 0.17 },   // Más de 20 hasta 35 UIT: 17%
    { min: 35 * this.UIT_2025, max: 45 * this.UIT_2025, rate: 0.20 },   // Más de 35 hasta 45 UIT: 20%
    { min: 45 * this.UIT_2025, max: Infinity, rate: 0.30 }               // Más de 45 UIT: 30%
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

  /**
   * Calcula el total de gratificaciones anuales
   */
  private calculateTotalGratificaciones(
    monthlyIncome: number, 
    insuranceType: 'essalud' | 'eps' = 'essalud',
    startWorkMonth: number = 1
  ): number {
    let total = 0;
    
    // Gratificación de Julio (mes 7)
    if (7 >= startWorkMonth) {
      const gratificacionJulio = this.calculateGratificacion(7, monthlyIncome, insuranceType, startWorkMonth);
      total += gratificacionJulio.total;
    }
    
    // Gratificación de Diciembre (mes 12)
    if (12 >= startWorkMonth) {
      const gratificacionDiciembre = this.calculateGratificacion(12, monthlyIncome, insuranceType, startWorkMonth);
      total += gratificacionDiciembre.total;
    }
    
    return total;
  }

  /**
   * Calcula el total de CTS anual
   */
  private calculateTotalCTS(
    monthlyIncome: number,
    startWorkMonth: number = 1
  ): number {
    let total = 0;
    
    // CTS de Mayo (mes 5)
    if (5 >= startWorkMonth) {
      const ctsMayo = this.calculateCTS(5, monthlyIncome, startWorkMonth);
      total += ctsMayo.total;
    }
    
    // CTS de Noviembre (mes 11)
    if (11 >= startWorkMonth) {
      const ctsNoviembre = this.calculateCTS(11, monthlyIncome, startWorkMonth);
      total += ctsNoviembre.total;
    }
    
    return total;
  }

  /**
   * Calcula el total de ingresos adicionales por mes
   */
  private calculateTotalAdditionalIncomeByMonth(additionalIncomeByMonth?: { month: number; amount: number }[]): number {
    if (!additionalIncomeByMonth || additionalIncomeByMonth.length === 0) {
      return 0;
    }
    
    // Create a Map to keep only the first entry for each month
    const monthMap = new Map<number, number>();
    
    for (const item of additionalIncomeByMonth) {
      if (!monthMap.has(item.month)) {
        monthMap.set(item.month, item.amount);
      }
    }
    
    // Sum all unique month entries
    let total = 0;
    for (const amount of monthMap.values()) {
      total += amount;
    }
    
    return total;
  }

  /**
   * Obtiene el ingreso adicional para un mes específico
   */
  private getAdditionalIncomeForMonth(month: number, additionalIncomeByMonth?: { month: number; amount: number }[]): number {
    if (!additionalIncomeByMonth || additionalIncomeByMonth.length === 0) {
      return 0;
    }

    const entry = additionalIncomeByMonth.find(item => item.month === month);
    return entry ? entry.amount : 0;
  }

  calculate(params: SunatCalculationParams): SunatCalculationResult {
    const monthlyCalculations: MonthlyCalculation[] = [];
    
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
    let asignacionFamiliar = 0;
    if (calculateAsignacionFamiliar && (hasChildren || childrenStudying)) {
      if (hasChildren && childrenCount > 0) {
        asignacionFamiliar = this.ASIGNACION_FAMILIAR_2025 * childrenCount;
      } else if (childrenStudying) {
        asignacionFamiliar = this.ASIGNACION_FAMILIAR_2025;
      }
    }
    
    // Calcular ingresos totales anuales proyectados para determinar si aplican gastos deducibles
      // Calcular ingresos totales anuales proyectados para determinar si aplican gastos deducibles
      // Según SUNAT: la remuneración mensual se multiplica por el número de meses que falta para terminar el ejercicio gravable
      let remainingMonths = 12 - startWorkMonth + 1; // Meses desde el inicio hasta diciembre
      
      // Si es un contrato de duración limitada, ajustar los meses
      const isLimitedContract = params.isLimitedContract || false;
      const contractEndMonth = params.contractEndMonth;
      let totalContractMonths = remainingMonths;
      
      if (isLimitedContract && contractEndMonth && contractEndMonth >= startWorkMonth && contractEndMonth <= 12) {
        remainingMonths = contractEndMonth - startWorkMonth + 1;
        totalContractMonths = remainingMonths;
      }
      
      // Calcular aguinaldo para sector público
      let totalAguinaldo = 0;
      let totalBonoEscolaridad = 0;
      const isPublicSectorWorker = params.isPublicSectorWorker || false;
      const receivesSchoolingBonus = params.receivesSchoolingBonus || false;
      
      if (isPublicSectorWorker && 7 >= startWorkMonth) { // Solo si está trabajando en julio
        totalAguinaldo = this.AGUINALDO_PUBLICO;
      }
      
      if (isPublicSectorWorker && receivesSchoolingBonus) {
        totalBonoEscolaridad = this.BONO_ESCOLARIDAD_PUBLICO;
      }
      
      // RBA para los meses que faltan para acabar el año - para cálculo del IAP y determinar si califica para gastos deducibles
      // IMPORTANTE: Según SUNAT, aun cuando el contrato sea por plazo inferior a un año, 
      // la proyección equivale a multiplicar la remuneración mensual por el número de meses que falte para acabar el año
      const rbaFullYear = (params.monthlyIncome * remainingMonths) + 
        this.calculateTotalAdditionalIncomeByMonth(params.additionalIncomeByMonth) +
        (calculateGratificaciones ? this.calculateTotalGratificaciones(params.monthlyIncome, insuranceType, startWorkMonth) : 0) +
        (calculateCTS ? this.calculateTotalCTS(params.monthlyIncome, startWorkMonth) : 0) +
        (calculateAsignacionFamiliar ? (asignacionFamiliar * remainingMonths) : 0) +
        totalAguinaldo +
        totalBonoEscolaridad;
      
      // RBA para los meses que realmente trabaja - para cálculos mensuales
      const totalProjectedAnnualIncome = (params.monthlyIncome * remainingMonths) + 
        this.calculateTotalAdditionalIncomeByMonth(params.additionalIncomeByMonth) +
        (calculateGratificaciones ? this.calculateTotalGratificaciones(params.monthlyIncome, insuranceType, startWorkMonth) : 0) +
        (calculateCTS ? this.calculateTotalCTS(params.monthlyIncome, startWorkMonth) : 0) +
        (calculateAsignacionFamiliar ? (asignacionFamiliar * remainingMonths) : 0) +
        totalAguinaldo +
        totalBonoEscolaridad;
      
      // Los gastos deducibles solo aplican si los ingresos anuales superan 7 UIT (S/ 37,450)
      // IMPORTANTE: Usar rbaFullYear para determinar si califica, no totalProjectedAnnualIncome
      const qualifiesForDeductibleExpenses = rbaFullYear > this.DEDUCTION_7_UIT;
      
      // Calcular gastos deducibles solo si califica
      const deductibleExpensesSummary = qualifiesForDeductibleExpenses 
        ? this.calculateDeductibleExpenses(params.deductibleExpenses)
        : this.getEmptyDeductibleExpensesSummary();
        
      // Calcular impuesto anual proyectado
      // IMPORTANTE: Usar rbaFullYear para calcular el IAP, no totalProjectedAnnualIncome
      const projectedNetIncome = Math.max(0, rbaFullYear - this.DEDUCTION_7_UIT - deductibleExpensesSummary.totalDeduction);
      
      // Calcular la tasa de impuesto aplicable según el tramo de la RNA
      const applicableTaxRate = this.calculateEffectiveTaxRateByTramo(projectedNetIncome);
      
      // Impuesto Anual Proyectado = RNA × Tasa Aplicada
      const projectedAnnualTax = projectedNetIncome * applicableTaxRate;
    
    // Inicializar retenciones acumuladas
    let accumulatedRetentions = params.previousRetentions;
    
    // Calculate for each month from calculation month to December (or contract end month if limited)
    const endMonth = (isLimitedContract && contractEndMonth) ? Math.min(contractEndMonth, 12) : 12;
    for (let month = params.calculationMonth; month <= endMonth; month++) {
      const monthIndex = month - 1;
      const monthName = this.MONTH_NAMES[monthIndex];
      
      // Calculate monthly income and additional income types
      const monthlyIncome = params.monthlyIncome;
      const additionalIncome = this.getAdditionalIncomeForMonth(month, params.additionalIncomeByMonth);
      
      // Calculate gratificaciones (Julio y Diciembre por defecto)
      let gratificaciones = 0;
      let gratificacionDetail: Partial<{
        gratificacionBase: number;
        gratificacionBono: number;
        gratificacionTotal: number;
        mesesTrabajados: number;
      }> | null = null;
      
      if (params.gratificacionesMonth && month === params.gratificacionesMonth && (params.gratificaciones || 0) > 0) {
        // Mes personalizado especificado Y con valor mayor a 0
        gratificaciones = params.gratificaciones || 0;
      } else if (calculateGratificaciones && (month === 7 || month === 12)) {
        // Calcular automáticamente si está marcado el checkbox
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
      
      if (params.ctsMonth && month === params.ctsMonth && (params.cts || 0) > 0) {
        // Mes personalizado especificado Y con valor mayor a 0
        cts = params.cts || 0;
      } else if (calculateCTS && (month === 5 || month === 11)) {
        // Calcular automáticamente si está marcado el checkbox
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
      let asignacionFamiliarMensual = 0;
      if (calculateAsignacionFamiliar) {
        if (params.asignacionFamiliar && params.asignacionFamiliar > 0) {
          // Valor personalizado especificado
          asignacionFamiliarMensual = params.asignacionFamiliar;
        } else {
          // Calcular automáticamente
          if (hasChildren && childrenCount > 0) {
            asignacionFamiliarMensual = this.ASIGNACION_FAMILIAR_2025 * childrenCount;
          } else if (childrenStudying && childrenCount > 0) {
            asignacionFamiliarMensual = this.ASIGNACION_FAMILIAR_2025 * childrenCount;
          }
        }
      }
      
      // Calcular aguinaldo para sector público (solo en julio)
      let aguinaldo = 0;
      if (isPublicSectorWorker && month === 7) {
        aguinaldo = this.AGUINALDO_PUBLICO;
      }
      
      // Calcular bono por escolaridad para sector público (mensual)
      let bonoEscolaridad = 0;
      if (isPublicSectorWorker && receivesSchoolingBonus) {
        bonoEscolaridad = this.BONO_ESCOLARIDAD_PUBLICO;
      }
      
      // Total monthly income
      const totalMonthlyIncome = monthlyIncome + additionalIncome + gratificaciones + bonificaciones + utilidades + cts + asignacionFamiliarMensual + aguinaldo + bonoEscolaridad;
      
      // Calcular retención mensual según metodología SUNAT
      const monthlyRetention = this.calculateMonthlyRetention(
        month,
        projectedAnnualTax,
        accumulatedRetentions,
        params.calculationMonth,
        monthlyCalculations
      );
      
      // Calcular retención adicional por ingresos extraordinarios (PASO 5 SUNAT)
      // Considerar TODOS los tipos de ingresos extraordinarios para el cálculo
      const extraordinaryIncome = additionalIncome + bonificaciones + utilidades + gratificaciones + cts + aguinaldo + bonoEscolaridad;
      const additionalMonthlyRetention = this.calculateAdditionalMonthlyRetention(
        month,
        projectedAnnualTax,
        extraordinaryIncome,
        totalProjectedAnnualIncome,
        projectedNetIncome,
        monthlyRetention // Pasar la retención ordinaria ya calculada
      );
      
      // IMPORTANTE: Las retenciones adicionales NO se suman a las ordinarias para el límite del impuesto anual
      // Solo se consideran las retenciones ordinarias para verificar si se alcanzó el límite
      const totalMonthlyRetention = monthlyRetention + additionalMonthlyRetention;
      
      // Actualizar retenciones acumuladas SOLO con la retención ordinaria para el límite del impuesto anual
      accumulatedRetentions += monthlyRetention;
      
      // Calcular total de retenciones adicionales acumuladas hasta el momento
      const totalAdditionalRetentions = monthlyCalculations.reduce((sum, calc) => sum + (calc.additionalMonthlyRetention || 0), 0) + additionalMonthlyRetention;

      // Build observations
      const observations = [];
      if (additionalIncome > 0) observations.push('Ingreso adicional');
      if (gratificaciones > 0) observations.push('Gratificación');
      if (bonificaciones > 0) observations.push('Bonificación');
      if (utilidades > 0) observations.push('Utilidades');
      if (cts > 0) observations.push('CTS');
      if (asignacionFamiliarMensual > 0) observations.push('Asignación Familiar');
      if (aguinaldo > 0) observations.push('Aguinaldo Sector Público');
      if (bonoEscolaridad > 0) observations.push('Bono por Escolaridad Sector Público');

      // Verificar si es el mes de terminación del contrato
      const isContractEndMonth = Boolean(isLimitedContract && contractEndMonth && month === contractEndMonth);
      
      const calculation: MonthlyCalculation = {
        month,
        monthName,
        monthlyIncome,
        additionalIncome,
        gratificaciones,
        bonificaciones,
        utilidades,
        cts,
        asignacionFamiliar: asignacionFamiliarMensual,
        totalMonthlyIncome,
        projectedAccumulatedIncome: totalProjectedAnnualIncome,
        projectedNetIncome,
        projectedTax: projectedAnnualTax,
        expectedAccumulatedRetention: accumulatedRetentions,
        previousAccumulatedRetention: accumulatedRetentions - totalMonthlyRetention,
        monthlyRetention: totalMonthlyRetention, // Ahora incluye retención básica + adicional
        additionalMonthlyRetention, // Nueva propiedad para retención adicional
        observations: observations.join(', ') || '',
        isContractEndMonth,
        finalAdjustment: undefined, // Se calculará después si es necesario
        finalRetention: undefined, // Se calculará después si es necesario
        aguinaldo,
        bonoEscolaridad,
        ...gratificacionDetail,
        ...ctsDetail
      };

      monthlyCalculations.push(calculation);
    }

    // Calculate summary
    const totalAnnualIncome = totalProjectedAnnualIncome; // Use the same calculation
    
    const totalAnnualTax = projectedAnnualTax;
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

    // Return the calculation result
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
        totalAsignacionFamiliar: params.asignacionFamiliar ? (params.asignacionFamiliar * 12) : (asignacionFamiliar * 12),
        totalAdditionalIncome: this.calculateTotalAdditionalIncomeByMonth(params.additionalIncomeByMonth) + totalGratificaciones + (params.bonificaciones || 0) + (params.utilidades || 0) + totalCTS + asignacionFamiliar,
        gratificacionesCalculadas,
        ctsCalculadas,
        // Campos para contratos de duración limitada
        isLimitedContract,
        contractEndMonth,
        totalContractMonths,
        finalAdjustmentApplied: false, // Por ahora, se implementará en futuras versiones
        // Campo para sector público
        isPublicSectorWorker,
        totalAguinaldo,
        // Campo para bono por escolaridad del sector público
        receivesSchoolingBonus: params.receivesSchoolingBonus,
        totalBonoEscolaridad
      }
    };
  }

  /**
   * Calcula la retención mensual según la metodología de SUNAT
   * Considera las retenciones previas y distribuye el impuesto anual de manera progresiva
   */
  private calculateMonthlyRetention(
    month: number,
    projectedAnnualTax: number,
    accumulatedRetentions: number,
    calculationMonth: number,
    monthlyCalculations: MonthlyCalculation[]
  ): number {
    let monthlyRetention = 0;
    
    // Si no hay impuesto anual proyectado, no hay retención mensual
    if (projectedAnnualTax <= 0) {
      return 0;
    }
    
    if (month < calculationMonth) {
      // Para meses anteriores al mes de cálculo, no hay retención
      return 0;
    }
    
    // Si las retenciones previas ya exceden el impuesto anual proyectado, no hay retención mensual
    if (accumulatedRetentions >= projectedAnnualTax) {
      return 0;
    }
    
    // Aplicar metodología SUNAT exacta según el mes
    if (month === 1 || month === 2 || month === 3) {
      // Enero, Febrero y Marzo: Impuesto Anual Proyectado(IAP) ÷ 12
      monthlyRetention = projectedAnnualTax / 12;
    } else if (month === 4) {
      // Abril: (IAP - Retenciones efectuadas de enero a marzo) ÷ 9
      // Calcular retenciones acumuladas hasta marzo
      const retentionsJanToMar = this.calculateAccumulatedRetentionsUpToMonth(monthlyCalculations, 3);
      const remainingTax = projectedAnnualTax - retentionsJanToMar;
      monthlyRetention = remainingTax / 9;
    } else if (month === 5 || month === 6 || month === 7) {
      // Mayo, Junio y Julio: (IAP - Retenciones efectuadas de enero a abril) ÷ 8
      // Calcular retenciones acumuladas hasta abril
      const retentionsJanToApr = this.calculateAccumulatedRetentionsUpToMonth(monthlyCalculations, 4);
      const remainingTax = projectedAnnualTax - retentionsJanToApr;
      monthlyRetention = remainingTax / 8;
    } else if (month === 8) {
      // Agosto: (IAP - Retenciones efectuadas de enero a julio) ÷ 5
      // Calcular retenciones acumuladas hasta julio
      const retentionsJanToJul = this.calculateAccumulatedRetentionsUpToMonth(monthlyCalculations, 7);
      const remainingTax = projectedAnnualTax - retentionsJanToJul;
      monthlyRetention = remainingTax / 5;
    } else if (month === 9 || month === 10 || month === 11) {
      // Setiembre, Octubre y Noviembre: (IAP - Retenciones efectuadas de enero a agosto) ÷ 4
      // Calcular retenciones acumuladas hasta agosto
      const retentionsJanToAug = this.calculateAccumulatedRetentionsUpToMonth(monthlyCalculations, 8);
      const remainingTax = projectedAnnualTax - retentionsJanToAug;
      monthlyRetention = remainingTax / 4;
    } else if (month === 12) {
      // Diciembre: (IAP - Retenciones efectuadas de enero a noviembre)
      // Calcular retenciones acumuladas hasta noviembre
      const retentionsJanToNov = this.calculateAccumulatedRetentionsUpToMonth(monthlyCalculations, 11);
      monthlyRetention = projectedAnnualTax - retentionsJanToNov;
    }
    
    // Asegurar que la retención no sea negativa
    return Math.max(0, this.round(monthlyRetention, 2));
  }

  /**
   * Calcula la retención adicional mensual para ingresos extraordinarios
   * Según el PASO 5 de la metodología SUNAT
   */
  private calculateAdditionalMonthlyRetention(
    month: number,
    projectedAnnualTax: number,
    monthlyExtraordinaryIncome: number,
    projectedAnnualIncome: number,
    projectedNetIncome: number,
    monthlyRetention: number // Retención ordinaria ya calculada en el Paso 4
  ): number {
    // Si no hay ingresos extraordinarios, no hay retención adicional
    if (monthlyExtraordinaryIncome <= 0) {
      return 0;
    }

    // Si no hay impuesto anual proyectado, no hay retención adicional
    if (projectedAnnualTax <= 0) {
      return 0;
    }

    // PASO 5.1: Identificar el importe adicional
    // Se toma el monto por pagos distintos a la remuneración o gratificación ordinaria
    
    // PASO 5.2: Multiplicar por la tasa de impuesto correspondiente
    // El importe adicional se multiplica por la tasa que corresponda según el tramo
    // en el que se ubique la remuneración neta anual proyectada
    const effectiveTaxRate = this.calculateEffectiveTaxRateByTramo(projectedNetIncome);
    const taxOnExtraordinaryIncome = monthlyExtraordinaryIncome * effectiveTaxRate;
    
    // PASO 5.3: La retención adicional es el impuesto total sobre el ingreso extraordinario
    // NO se resta la retención ordinaria, se suma a ella
    const additionalRetention = taxOnExtraordinaryIncome;
    
    // PASO 5.4: Obtener la Retención Adicional del mes
    // Esta se sumará a la retención ordinaria para obtener el total
    return this.round(additionalRetention, 2);
  }

  /**
   * Calcula la tasa efectiva de impuesto según el tramo correspondiente
   * Basado en la proyección de ingresos anuales (RNA)
   * Según las escalas progresivas de SUNAT
   */
  private calculateEffectiveTaxRateByTramo(projectedNetIncome: number): number {
    const uit = this.getUIT();
    const base5UIT = 5 * uit;      // S/ 26,750
    const base20UIT = 20 * uit;    // S/ 107,000
    const base35UIT = 35 * uit;    // S/ 187,250
    const base45UIT = 45 * uit;    // S/ 240,750

    // Aplicar escalas progresivas según SUNAT
    if (projectedNetIncome <= base5UIT) {
      return 0.08; // 8% hasta 5 UIT
    } else if (projectedNetIncome <= base20UIT) {
      return 0.14; // 14% más de 5 hasta 20 UIT
    } else if (projectedNetIncome <= base35UIT) {
      return 0.17; // 17% más de 20 hasta 35 UIT
    } else if (projectedNetIncome <= base45UIT) {
      return 0.20; // 20% más de 35 hasta 45 UIT
    } else {
      return 0.30; // 30% más de 45 UIT
    }
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
        const taxForBracket = taxableInBracket * bracket.rate;
        totalTax += taxForBracket;
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

  private calculateAccumulatedRetentionsUpToMonth(monthlyCalculations: MonthlyCalculation[], monthIndex: number): number {
    let accumulatedRetentions = 0;
    
    // Filtrar solo los cálculos hasta el mes especificado (1-based index)
    for (let i = 0; i < monthlyCalculations.length; i++) {
      const calc = monthlyCalculations[i];
      if (calc && calc.month <= monthIndex) {
        // Sumar solo la retención ordinaria (PASO 4), no la adicional
        accumulatedRetentions += calc.monthlyRetention - (calc.additionalMonthlyRetention || 0);
      }
    }
    
    return accumulatedRetentions;
  }
}
