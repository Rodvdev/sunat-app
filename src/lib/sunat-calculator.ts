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
  // PASO 2: Campo para donaciones según Artículo 49° de la Ley
  donations?: number;               // Monto de donaciones efectuadas durante el año
  // PASO 3: Campos para créditos según Artículo 88° de la Ley
  previousTaxCredits?: number;      // Créditos contra el tributo de declaraciones anteriores
  previousTaxPayments?: number;     // Pagos efectuados a cuenta del impuesto liquidado
  previousTaxRefunds?: number;      // Saldos a favor reconocidos por SUNAT o establecidos por el contribuyente
  isOnlyFifthCategoryIncome?: boolean; // Si solo percibe rentas de quinta categoría (Artículo 79°)
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
    // PASO 2: Información sobre donaciones y deducción de 7 UIT
    deduction7UIT: number;         // Monto de la deducción de 7 UIT
    donations: number;              // Monto total de donaciones
    donationsDeduction: number;     // Deducción por donaciones (solo en diciembre)
    finalNetIncome: number;         // Ingreso neto final después de todas las deducciones
    // PASO 3: Información sobre impuesto anual y créditos del Artículo 88°
    projectedAnnualTax: number;     // Impuesto anual proyectado antes de créditos
    totalTaxCredits: number;        // Total de créditos aplicables
    finalAnnualTax: number;         // Impuesto anual final después de créditos
    taxCreditsBreakdown: {          // Desglose de créditos aplicados
      previousCredits: number;      // Créditos de declaraciones anteriores
      previousPayments: number;     // Pagos a cuenta del impuesto
      previousRefunds: number;      // Saldos a favor reconocidos
    };
    isOnlyFifthCategoryIncome: boolean; // Si solo percibe rentas de quinta categoría
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
    // CORRECCIÓN: startWorkMonth ahora representa el mes de cálculo
    // Los meses trabajados deben ser desde el mes de cálculo hasta el mes actual
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
    // CORRECCIÓN: startWorkMonth ahora representa el mes de cálculo
    // Los meses trabajados deben ser desde el mes de cálculo hasta el mes actual
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
    
    // CORRECCIÓN: Solo calcular gratificaciones si el trabajador ya está trabajando en esos meses
    // y si esos meses están dentro del período de cálculo
    const calculationMonth = startWorkMonth; // startWorkMonth ahora representa el mes de cálculo
    
    // Gratificación de Julio (mes 7)
    if (7 >= calculationMonth) {
      const gratificacionJulio = this.calculateGratificacion(7, monthlyIncome, insuranceType, calculationMonth);
      total += gratificacionJulio.total;
    }
    
    // Gratificación de Diciembre (mes 12)
    if (12 >= calculationMonth) {
      const gratificacionDiciembre = this.calculateGratificacion(12, monthlyIncome, insuranceType, calculationMonth);
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
    
    // CORRECCIÓN: Solo calcular CTS si el trabajador ya está trabajando en esos meses
    // y si esos meses están dentro del período de cálculo
    const calculationMonth = startWorkMonth; // startWorkMonth ahora representa el mes de cálculo
    
    // CTS de Mayo (mes 5)
    if (5 >= calculationMonth) {
      const ctsMayo = this.calculateCTS(5, monthlyIncome, calculationMonth);
      total += ctsMayo.total;
    }
    
    // CTS de Noviembre (mes 11)
    if (11 >= calculationMonth) {
      const ctsNoviembre = this.calculateCTS(11, monthlyIncome, calculationMonth);
      total += ctsNoviembre.total;
    }
    
    return total;
  }

  /**
   * Calcula el total de ingresos adicionales por mes
   * CORRECCIÓN: Solo considerar ingresos desde el mes de cálculo hasta diciembre
   */
  private calculateTotalAdditionalIncomeByMonth(
    additionalIncomeByMonth?: { month: number; amount: number }[],
    calculationMonth: number = 1
  ): number {
    if (!additionalIncomeByMonth || additionalIncomeByMonth.length === 0) {
      return 0;
    }
    
    // Create a Map to keep only the first entry for each month
    const monthMap = new Map<number, number>();
    
    for (const item of additionalIncomeByMonth) {
      // CORRECCIÓN: Solo considerar meses desde el mes de cálculo hasta diciembre
      if (item.month >= calculationMonth && item.month <= 12 && !monthMap.has(item.month)) {
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
   * CORRECCIÓN: Solo considerar si el mes está dentro del período de cálculo
   */
  private getAdditionalIncomeForMonth(
    month: number, 
    additionalIncomeByMonth?: { month: number; amount: number }[],
    calculationMonth: number = 1
  ): number {
    if (!additionalIncomeByMonth || additionalIncomeByMonth.length === 0) {
      return 0;
    }

    // CORRECCIÓN: Solo considerar ingresos si el mes está dentro del período de cálculo
    if (month < calculationMonth || month > 12) {
      return 0;
    }

    const entry = additionalIncomeByMonth.find(item => item.month === month);
    return entry ? entry.amount : 0;
  }

  calculate(params: SunatCalculationParams): SunatCalculationResult {
    const monthlyCalculations: MonthlyCalculation[] = [];
    
    // IMPLEMENTACIÓN DEL PASO 1 DE LA METODOLOGÍA SUNAT
    // ==================================================
    // Según la metodología SUNAT, el Paso 1 consiste en:
    // 1. Multiplicar la remuneración ordinaria mensual por el número de meses que falte para terminar el ejercicio
    // 2. Incluir el mes al que corresponde la retención
    // 3. Sumar las gratificaciones ordinarias que correspondan al ejercicio
    // 4. Sumar remuneraciones ordinarias y demás conceptos de meses anteriores del mismo ejercicio
    // 5. El resultado es la Remuneración Bruta Anual (RBA) proyectada
    
    // IMPLEMENTACIÓN DEL PASO 2 DE LA METODOLOGÍA SUNAT
    // ==================================================
    // Según la metodología SUNAT, el Paso 2 consiste en:
    // 1. Restar el monto fijo equivalente a las siete (7) UIT del Artículo 46° de la Ley
    // 2. Las donaciones del Artículo 49° solo se pueden deducir en diciembre con motivo del ajuste final
    // 3. Solo aplica para trabajadores que solo perciben rentas de quinta categoría
    // 4. Las donaciones se acreditan con documentos específicos según el Artículo 21°
    
    // IMPLEMENTACIÓN DEL PASO 3 DE LA METODOLOGÍA SUNAT
    // ==================================================
    // Según la metodología SUNAT, el Paso 3 consiste en:
    // 1. Aplicar las tasas previstas en el Artículo 53° de la Ley al ingreso neto
    // 2. Determinar el impuesto anual usando las escalas progresivas
    // 3. Deducir los créditos del Artículo 88° (pagos a cuenta, créditos anteriores, saldos a favor)
    // 4. Aplicar excepciones del Artículo 79° para rentas de quinta categoría
    
    // IMPLEMENTACIÓN DEL PASO 4 DE LA METODOLOGÍA SUNAT
    // ==================================================
    // Según la metodología SUNAT, el Paso 4 consiste en:
    // 1. Fraccionar el impuesto anual determinado en cada mes
    // 2. Enero-Marzo: IAF ÷ 12
    // 3. Abril: (IAF - Retenciones enero-marzo) ÷ 9
    // 4. Mayo-Julio: (IAF - Retenciones enero-abril) ÷ 8
    // 5. Agosto: (IAF - Retenciones enero-julio) ÷ 5
    // 6. Septiembre-Noviembre: (IAF - Retenciones enero-agosto) ÷ 4
    // 7. Diciembre: Ajuste final (IAF - Retenciones enero-noviembre)
    
    // IMPLEMENTACIÓN DEL PASO 5 DE LA METODOLOGÍA SUNAT
    // ==================================================
    // Según la metodología SUNAT, el Paso 5 consiste en:
    // 1. Aplicar los Pasos a) al d) para determinar el impuesto sobre remuneraciones ordinarias
    // 2. Sumar el monto adicional obtenido del siguiente procedimiento:
    //    i) Al resultado de aplicar los Pasos a) y b) se suma el monto adicional del mes
    //    ii) Se aplican las tasas del Artículo 53° a la suma obtenida
    //    iii) Se deduce el monto calculado en el Paso c) (créditos)
    //    iv) El resultado es la retención adicional del mes
    // 3. Los ingresos extraordinarios incluyen: participaciones, reintegros, gratificaciones
    //    extraordinarias, bonificaciones, utilidades, CTS, aguinaldo, bono escolaridad, etc.
    
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
    
    // PASO 1 SUNAT: Calcular la Remuneración Bruta Anual (RBA) proyectada
    // La remuneración ordinaria mensual se multiplica por el número de meses que falte para terminar el ejercicio,
    // incluyendo el mes al que corresponda la retención. Al resultado se le suman las gratificaciones ordinarias
    // que correspondan al ejercicio y las remuneraciones ordinarias y demás conceptos que hubieran sido puestas
    // a disposición del trabajador en los meses anteriores del mismo ejercicio.
    
    // CORRECCIÓN: remainingMonths debe ser desde el mes de cálculo hasta diciembre
    // (no desde el mes de inicio de trabajo)
    let remainingMonths = 12 - params.calculationMonth + 1; // Meses desde el mes de cálculo hasta diciembre
    
    // Si es un contrato de duración limitada, ajustar los meses
    const isLimitedContract = params.isLimitedContract || false;
    const contractEndMonth = params.contractEndMonth;
    let totalContractMonths = remainingMonths;
    
    if (isLimitedContract && contractEndMonth && contractEndMonth >= params.calculationMonth && contractEndMonth <= 12) {
      remainingMonths = contractEndMonth - params.calculationMonth + 1;
      totalContractMonths = remainingMonths;
    }
    
    // Calcular aguinaldo para sector público
    let totalAguinaldo = 0;
    let totalBonoEscolaridad = 0;
    const isPublicSectorWorker = params.isPublicSectorWorker || false;
    const receivesSchoolingBonus = params.receivesSchoolingBonus || false;
    
    if (isPublicSectorWorker && 7 >= params.calculationMonth) { // Solo si está trabajando en julio
      totalAguinaldo = this.AGUINALDO_PUBLICO;
    }
    
    if (isPublicSectorWorker && receivesSchoolingBonus) {
      totalBonoEscolaridad = this.BONO_ESCOLARIDAD_PUBLICO;
    }
    
    // PASO 1.1: Calcular remuneración ordinaria proyectada
    // Remuneración mensual × meses que faltan para terminar el ejercicio
    const projectedOrdinaryIncome = params.monthlyIncome * remainingMonths;
    
    // PASO 1.2: Sumar gratificaciones ordinarias del ejercicio
    // Solo considerar gratificaciones desde el mes de cálculo hasta diciembre
    const projectedGratificaciones = calculateGratificaciones ? 
      this.calculateTotalGratificaciones(params.monthlyIncome, insuranceType, params.calculationMonth) : 0;
    
    // PASO 1.3: Sumar CTS del ejercicio
    // Solo considerar CTS desde el mes de cálculo hasta diciembre
    const projectedCTS = calculateCTS ? 
      this.calculateTotalCTS(params.monthlyIncome, params.calculationMonth) : 0;
    
    // PASO 1.4: Sumar asignación familiar proyectada
    // Solo considerar asignación familiar desde el mes de cálculo hasta diciembre
    const projectedAsignacionFamiliar = calculateAsignacionFamiliar ? 
      (asignacionFamiliar * remainingMonths) : 0;
    
    // PASO 1.5: Sumar ingresos adicionales por mes (participaciones, reintegros, etc.)
    // Solo considerar ingresos adicionales desde el mes de cálculo hasta diciembre
    const projectedAdditionalIncome = this.calculateTotalAdditionalIncomeByMonth(params.additionalIncomeByMonth, params.calculationMonth);
    
    // PASO 1.6: Sumar otros conceptos extraordinarios (bonificaciones, utilidades, aguinaldo, bono escolaridad)
    // Estos conceptos se consideran una sola vez al año, no se multiplican por meses
    const projectedExtraordinaryIncome = (params.bonificaciones || 0) + 
      (params.utilidades || 0) + 
      totalAguinaldo + 
      totalBonoEscolaridad;
    
    // PASO 1.7: Calcular RBA total proyectada
    // RBA = Remuneración ordinaria proyectada + Gratificaciones + CTS + Asignación familiar + 
    //        Ingresos adicionales + Conceptos extraordinarios
    const rbaFullYear = projectedOrdinaryIncome + 
      projectedGratificaciones + 
      projectedCTS + 
      projectedAsignacionFamiliar + 
      projectedAdditionalIncome + 
      projectedExtraordinaryIncome;
    
    // RBA para los meses que realmente trabaja - para cálculos mensuales
    // (mantener compatibilidad con código existente)
    const totalProjectedAnnualIncome = rbaFullYear;
    
    // PASO 2 SUNAT: Aplicar deducción de 7 UIT y donaciones
    // ========================================================
    // Según el Artículo 46° de la Ley: Se resta el monto fijo equivalente a las siete (7) UIT
    // Según el Artículo 49° de la Ley: Las donaciones solo se pueden deducir en diciembre
    // con motivo del ajuste final del impuesto (solo para rentas de quinta categoría)
    
    // PASO 2.1: Aplicar deducción de 7 UIT
    // La deducción de 7 UIT es un monto fijo que se aplica a todos los trabajadores
    // independientemente de su nivel de ingresos
    const deduction7UIT = this.DEDUCTION_7_UIT; // S/ 37,450 (7 × S/ 5,350)
    
    // PASO 2.2: Calcular ingreso neto después de la deducción de 7 UIT
    // Este es el ingreso sobre el cual se pueden aplicar gastos deducibles
    const incomeAfter7UITDeduction = Math.max(0, rbaFullYear - deduction7UIT);
    
    // PASO 2.3: Determinar si califica para gastos deducibles
    // Los gastos deducibles solo aplican si los ingresos anuales superan 7 UIT (S/ 37,450)
    // Esto es importante porque determina si se pueden considerar gastos adicionales
    const qualifiesForDeductibleExpenses = rbaFullYear > deduction7UIT;
    
    // PASO 2.4: Calcular gastos deducibles solo si califica
    // Los gastos deducibles incluyen restaurantes, servicios médicos, profesionales, etc.
    // con un límite máximo de 3 UIT adicionales
    const deductibleExpensesSummary = qualifiesForDeductibleExpenses 
      ? this.calculateDeductibleExpenses(params.deductibleExpenses)
      : this.getEmptyDeductibleExpensesSummary();
    
    // PASO 2.5: Calcular ingreso neto después de gastos deducibles
    // Este es el ingreso final sobre el cual se calcula el impuesto
    const incomeAfterDeductibleExpenses = Math.max(0, incomeAfter7UITDeduction - deductibleExpensesSummary.totalDeduction);
    
    // PASO 2.6: Calcular ingreso neto final (antes de impuestos)
    // NOTA: Las donaciones se consideran en el cálculo final, pero solo se aplican en diciembre
    // con motivo del ajuste final del impuesto según el Artículo 49° de la Ley
    const finalNetIncome = incomeAfterDeductibleExpenses;
    
    // PASO 2.7: Calcular impuesto anual proyectado
    // El impuesto se calcula sobre el ingreso neto final usando las escalas progresivas de SUNAT
    const applicableTaxRate = this.calculateEffectiveTaxRateByTramo(finalNetIncome);
    const projectedAnnualTax = finalNetIncome * applicableTaxRate;
    
    // PASO 3 SUNAT: Aplicar tasas del Artículo 53° y créditos del Artículo 88°
    // ============================================================================
    // Según el Artículo 53° de la Ley: Se aplican las tasas progresivas al ingreso neto
    // Según el Artículo 88° de la Ley: Se deducen los créditos a que tenga derecho el trabajador
    
    // PASO 3.1: Verificar si solo percibe rentas de quinta categoría (Artículo 79°)
    // Los contribuyentes que solo perciban rentas de quinta categoría no presentan declaración jurada
    // excepto en casos específicos (Artículo 46° penúltimo párrafo o solicitud de devolución)
    const isOnlyFifthCategoryIncome = params.isOnlyFifthCategoryIncome || false;
    
    // PASO 3.2: Calcular créditos aplicables según Artículo 88°
    // Inciso b): Pagos efectuados a cuenta del impuesto liquidado y créditos contra dicho tributo
    // Estos créditos incluyen pagos voluntarios, retenciones de ejercicios anteriores, etc.
    const previousTaxPayments = params.previousTaxPayments || 0;
    const previousTaxCredits = params.previousTaxCredits || 0;
    
    // Inciso c): Saldos a favor reconocidos por SUNAT o establecidos por el contribuyente
    // en declaraciones juradas anteriores, siempre que no hayan sido impugnadas
    // Estos saldos pueden provenir de devoluciones, compensaciones o ajustes de ejercicios anteriores
    const previousTaxRefunds = params.previousTaxRefunds || 0;
    
    // PASO 3.3: Calcular total de créditos aplicables
    // Los créditos se suman para determinar la reducción total del impuesto a pagar
    const totalTaxCredits = previousTaxPayments + previousTaxCredits + previousTaxRefunds;
    
    // PASO 3.4: Calcular impuesto anual final después de créditos
    // El impuesto final no puede ser negativo, si los créditos exceden el impuesto se genera saldo a favor
    const finalAnnualTax = Math.max(0, projectedAnnualTax - totalTaxCredits);
    
    // PASO 3.5: Validar que los créditos no excedan el impuesto proyectado
    if (totalTaxCredits > projectedAnnualTax) {
      // Si los créditos exceden el impuesto, se genera un saldo a favor
      // Este saldo se puede aplicar en futuros ejercicios o solicitar devolución
      // según lo establecido en el Artículo 88° de la Ley
      console.warn(`Los créditos (S/ ${totalTaxCredits}) exceden el impuesto proyectado (S/ ${projectedAnnualTax}). Se genera un saldo a favor de S/ ${totalTaxCredits - projectedAnnualTax}.`);
    }
    
    // Inicializar retenciones acumuladas
    let accumulatedRetentions = params.previousRetentions;
    
    // PASO 4: Calcular retenciones mensuales según metodología SUNAT
    // ==============================================================
    // Se calculan las retenciones para cada mes desde el mes de cálculo hasta diciembre
    // siguiendo la metodología de fraccionamiento progresivo establecida por SUNAT
    
    // Calculate for each month from calculation month to December (or contract end month if limited)
    const endMonth = (isLimitedContract && contractEndMonth) ? Math.min(contractEndMonth, 12) : 12;
    for (let month = params.calculationMonth; month <= endMonth; month++) {
      const monthIndex = month - 1;
      const monthName = this.MONTH_NAMES[monthIndex];
      
      // Calculate monthly income and additional income types
      const monthlyIncome = params.monthlyIncome;
      const additionalIncome = this.getAdditionalIncomeForMonth(month, params.additionalIncomeByMonth, params.calculationMonth);
      
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
        // CORRECCIÓN: Solo considerar si el mes está dentro del período de cálculo
        if (month >= params.calculationMonth) {
          gratificaciones = params.gratificaciones || 0;
        }
      } else if (calculateGratificaciones && (month === 7 || month === 12)) {
        // Calcular automáticamente si está marcado el checkbox
        // CORRECCIÓN: Solo calcular si el mes está dentro del período de cálculo
        if (month >= params.calculationMonth) {
          const gratificacionCalc = this.calculateGratificacion(month, params.monthlyIncome, insuranceType, params.calculationMonth);
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
      // CORRECCIÓN: Solo calcular si el mes está dentro del período de cálculo
      const bonificaciones = (month === params.bonificacionesMonth && month >= params.calculationMonth) ? (params.bonificaciones || 0) : 0;
      
      // Calculate utilidades
      // CORRECCIÓN: Solo calcular si el mes está dentro del período de cálculo
      const utilidades = (month === params.utilidadesMonth && month >= params.calculationMonth) ? (params.utilidades || 0) : 0;
      
      // Calculate CTS (Mayo y Noviembre por defecto)
      let cts = 0;
      let ctsDetail: Partial<{
        ctsBase: number;
        dias: number;
        total: number;
      }> | null = null;
      
      if (params.ctsMonth && month === params.ctsMonth && (params.cts || 0) > 0) {
        // Mes personalizado especificado Y con valor mayor a 0
        // CORRECCIÓN: Solo considerar si el mes está dentro del período de cálculo
        if (month >= params.calculationMonth) {
          cts = params.cts || 0;
        }
      } else if (calculateCTS && (month === 5 || month === 11)) {
        // Calcular automáticamente si está marcado el checkbox
        // CORRECCIÓN: Solo calcular si el mes está dentro del período de cálculo
        if (month >= params.calculationMonth) {
          const ctsCalc = this.calculateCTS(month, params.monthlyIncome, params.calculationMonth);
          cts = ctsCalc.total;
          ctsDetail = {
            ctsBase: ctsCalc.base,
            dias: ctsCalc.dias,
            total: ctsCalc.total
          };
        }
      }
      
      // Calculate Asignación Familiar (mensual)
      // Si se especifica un valor personalizado, usarlo; si no, usar el valor por defecto
      let asignacionFamiliarMensual = 0;
      if (calculateAsignacionFamiliar) {
        if (params.asignacionFamiliar && params.asignacionFamiliar > 0) {
          // Valor personalizado especificado
          // CORRECCIÓN: Solo considerar si el mes está dentro del período de cálculo
          if (month >= params.calculationMonth) {
            asignacionFamiliarMensual = params.asignacionFamiliar;
          }
        } else {
          // Calcular automáticamente
          // CORRECCIÓN: Solo calcular si el mes está dentro del período de cálculo
          if (month >= params.calculationMonth) {
            if (hasChildren && childrenCount > 0) {
              asignacionFamiliarMensual = this.ASIGNACION_FAMILIAR_2025 * childrenCount;
            } else if (childrenStudying && childrenCount > 0) {
              asignacionFamiliarMensual = this.ASIGNACION_FAMILIAR_2025 * childrenCount;
            }
          }
        }
      }
      
      // Calcular aguinaldo para sector público (solo en julio)
      let aguinaldo = 0;
      // CORRECCIÓN: Solo calcular si el mes está dentro del período de cálculo
      if (isPublicSectorWorker && month === 7 && month >= params.calculationMonth) {
        aguinaldo = this.AGUINALDO_PUBLICO;
      }
      
      // Calcular bono por escolaridad para sector público (mensual)
      let bonoEscolaridad = 0;
      // CORRECCIÓN: Solo calcular si el mes está dentro del período de cálculo
      if (isPublicSectorWorker && receivesSchoolingBonus && month >= params.calculationMonth) {
        bonoEscolaridad = this.BONO_ESCOLARIDAD_PUBLICO;
      }
      
      // Total monthly income
      const totalMonthlyIncome = monthlyIncome + additionalIncome + gratificaciones + bonificaciones + utilidades + cts + asignacionFamiliarMensual + aguinaldo + bonoEscolaridad;
      
      // Calcular retención mensual según metodología SUNAT
      const monthlyRetention = this.calculateMonthlyRetention(
        month,
        finalAnnualTax, // Pass finalAnnualTax
        accumulatedRetentions,
        params.calculationMonth,
        monthlyCalculations
      );
      
      // Calcular retención adicional por ingresos extraordinarios (PASO 5 SUNAT)
      // Considerar TODOS los tipos de ingresos extraordinarios para el cálculo
      // Según SUNAT: participaciones, reintegros, gratificaciones extraordinarias, bonificaciones, utilidades, CTS, etc.
      const extraordinaryIncome = additionalIncome + bonificaciones + utilidades + gratificaciones + cts + aguinaldo + bonoEscolaridad;
      
      // PASO 5: Calcular retención adicional por ingresos extraordinarios
      // ===================================================================
      // Se aplica la metodología SUNAT para determinar el impuesto adicional sobre ingresos extraordinarios
      // siguiendo el procedimiento establecido en la normativa
      const additionalMonthlyRetention = this.calculateAdditionalMonthlyRetention(
        month,
        finalAnnualTax, // Impuesto anual final después de créditos (Paso 3)
        extraordinaryIncome, // Ingresos extraordinarios del mes
        totalProjectedAnnualIncome, // RBA total proyectada (Paso 1)
        finalNetIncome, // Ingreso neto final después de deducciones (Paso 2)
        monthlyRetention, // Retención ordinaria ya calculada (Paso 4)
        rbaFullYear, // RBA del Paso 1
        deduction7UIT, // Deducción de 7 UIT del Paso 2
        totalTaxCredits // Total de créditos del Paso 3
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
        projectedNetIncome: finalNetIncome, // Usar finalNetIncome aquí
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
        totalAdditionalIncome: this.calculateTotalAdditionalIncomeByMonth(params.additionalIncomeByMonth, params.calculationMonth) + totalGratificaciones + (params.bonificaciones || 0) + (params.utilidades || 0) + totalCTS + asignacionFamiliar,
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
        totalBonoEscolaridad,
        // PASO 2: Información sobre donaciones y deducción de 7 UIT
        deduction7UIT: this.DEDUCTION_7_UIT,
        donations: params.donations || 0,
        donationsDeduction: 0, // No se calcula aquí, se hace en el cálculo final
        finalNetIncome: finalNetIncome, // Usar la variable calculada en el Paso 2
        // PASO 3: Información sobre impuesto anual y créditos del Artículo 88°
        projectedAnnualTax: projectedAnnualTax,
        totalTaxCredits: totalTaxCredits, // Ahora se calcula aquí
        finalAnnualTax: finalAnnualTax, // Ahora se calcula aquí
        taxCreditsBreakdown: {
          previousCredits: params.previousTaxCredits || 0,
          previousPayments: params.previousTaxPayments || 0,
          previousRefunds: params.previousTaxRefunds || 0
        },
        isOnlyFifthCategoryIncome: params.isOnlyFifthCategoryIncome || false
      }
    };
  }

  /**
   * Calcula la retención mensual según la metodología de SUNAT
   * PASO 4: Fraccionamiento del impuesto anual en retenciones mensuales
   * Considera las retenciones previas y distribuye el impuesto anual de manera progresiva
   * según la metodología establecida por SUNAT
   */
  private calculateMonthlyRetention(
    month: number,
    finalAnnualTax: number, // Cambiar a finalAnnualTax (después de créditos)
    accumulatedRetentions: number,
    calculationMonth: number,
    monthlyCalculations: MonthlyCalculation[]
  ): number {
    let monthlyRetention = 0;
    
    // Si no hay impuesto anual final, no hay retención mensual
    if (finalAnnualTax <= 0) {
      return 0;
    }
    
    if (month < calculationMonth) {
      // Para meses anteriores al mes de cálculo, no hay retención
      return 0;
    }
    
    // Si las retenciones previas ya exceden el impuesto anual final, no hay retención mensual
    if (accumulatedRetentions >= finalAnnualTax) {
      return 0;
    }
    
    // PASO 4: Aplicar metodología SUNAT exacta según el mes
    // El fraccionamiento se hace de manera progresiva para distribuir la carga tributaria
    
    if (month === 1 || month === 2 || month === 3) {
      // 1. Enero, Febrero y Marzo: Impuesto Anual Final ÷ 12
      // Se distribuye uniformemente en los primeros tres meses
      monthlyRetention = finalAnnualTax / 12;
    } else if (month === 4) {
      // 2. Abril: (IAF - Retenciones enero-marzo) ÷ 9
      // Se deducen las retenciones ya efectuadas y se distribuye el resto en 9 meses
      const retentionsJanToMar = this.calculateAccumulatedRetentionsUpToMonth(monthlyCalculations, 3);
      const remainingTax = finalAnnualTax - retentionsJanToMar;
      monthlyRetention = remainingTax / 9;
    } else if (month === 5 || month === 6 || month === 7) {
      // 3. Mayo, Junio y Julio: (IAF - Retenciones enero-abril) ÷ 8
      // Se deducen las retenciones ya efectuadas y se distribuye el resto en 8 meses
      const retentionsJanToApr = this.calculateAccumulatedRetentionsUpToMonth(monthlyCalculations, 4);
      const remainingTax = finalAnnualTax - retentionsJanToApr;
      monthlyRetention = remainingTax / 8;
    } else if (month === 8) {
      // 4. Agosto: (IAF - Retenciones enero-julio) ÷ 5
      // Se deducen las retenciones ya efectuadas y se distribuye el resto en 5 meses
      const retentionsJanToJul = this.calculateAccumulatedRetentionsUpToMonth(monthlyCalculations, 7);
      const remainingTax = finalAnnualTax - retentionsJanToJul;
      monthlyRetention = remainingTax / 5;
    } else if (month === 9 || month === 10 || month === 11) {
      // 5. Setiembre, Octubre y Noviembre: (IAF - Retenciones enero-agosto) ÷ 4
      // Se deducen las retenciones ya efectuadas y se distribuye el resto en 4 meses
      const retentionsJanToAug = this.calculateAccumulatedRetentionsUpToMonth(monthlyCalculations, 8);
      const remainingTax = finalAnnualTax - retentionsJanToAug;
      monthlyRetention = remainingTax / 4;
    } else if (month === 12) {
      // 6. Diciembre: Ajuste final del Impuesto
      // Se deducen las retenciones efectuadas de enero a noviembre
      // El resultado es la retención final para completar el impuesto anual
      const retentionsJanToNov = this.calculateAccumulatedRetentionsUpToMonth(monthlyCalculations, 11);
      monthlyRetention = finalAnnualTax - retentionsJanToNov;
    }
    
    // Asegurar que la retención no sea negativa
    // Si las retenciones previas exceden el impuesto, no hay retención adicional
    return Math.max(0, this.round(monthlyRetention, 2));
  }

  /**
   * Calcula la retención adicional mensual para ingresos extraordinarios
   * PASO 5 SUNAT: Retenciones por ingresos extraordinarios según metodología establecida
   * 
   * Procedimiento según SUNAT:
   * 1. Se aplican los Pasos a) al d) para determinar el impuesto sobre remuneraciones ordinarias
   * 2. Se suma el monto adicional obtenido del siguiente procedimiento:
   *    i) Al resultado de aplicar los Pasos a) y b) se suma el monto adicional del mes
   *    ii) Se aplican las tasas del Artículo 53° a la suma obtenida
   *    iii) Se deduce el monto calculado en el Paso c) (créditos)
   *    iv) El resultado es la retención adicional del mes
   */
  private calculateAdditionalMonthlyRetention(
    month: number,
    finalAnnualTax: number, // Impuesto anual final después de créditos
    monthlyExtraordinaryIncome: number,
    projectedAnnualIncome: number,
    finalNetIncome: number, // Ingreso neto final después de deducciones
    monthlyRetention: number, // Retención ordinaria ya calculada en el Paso 4
    rbaFullYear: number, // RBA del Paso 1
    deduction7UIT: number, // Deducción de 7 UIT del Paso 2
    totalTaxCredits: number // Total de créditos del Paso 3
  ): number {
    // Si no hay ingresos extraordinarios, no hay retención adicional
    if (monthlyExtraordinaryIncome <= 0) {
      return 0;
    }

    // Si no hay impuesto anual final, no hay retención adicional
    if (finalAnnualTax <= 0) {
      return 0;
    }

    // PASO 5: Aplicar metodología SUNAT para ingresos extraordinarios
    
    // PASO 5.1: Aplicar los Pasos a) al d) para remuneraciones ordinarias
    // Esto ya se hizo en el cálculo de monthlyRetention (Paso 4)
    
    // PASO 5.2: Calcular retención adicional siguiendo el procedimiento SUNAT
    
    // PASO 5.2.i: Al resultado de aplicar los Pasos a) y b) se suma el monto adicional del mes
    // Paso a) = RBA del Paso 1
    // Paso b) = Deducción de 7 UIT del Paso 2
    // Se suma el ingreso extraordinario del mes
    const incomeWithExtraordinary = rbaFullYear + monthlyExtraordinaryIncome;
    
    // PASO 5.2.ii: A la suma obtenida se le aplican las tasas del Artículo 53°
    // Primero se resta la deducción de 7 UIT para obtener el ingreso neto
    const netIncomeWithExtraordinary = Math.max(0, incomeWithExtraordinary - deduction7UIT);
    
    // Se aplican las tasas progresivas del Artículo 53°
    const effectiveTaxRate = this.calculateEffectiveTaxRateByTramo(netIncomeWithExtraordinary);
    const taxOnIncomeWithExtraordinary = netIncomeWithExtraordinary * effectiveTaxRate;
    
    // PASO 5.2.iii: Del resultado se deduce el monto calculado en el Paso c) (créditos)
    // Los créditos se aplican proporcionalmente al ingreso extraordinario
    const proportionalCredits = totalTaxCredits > 0 ? 
      (monthlyExtraordinaryIncome / rbaFullYear) * totalTaxCredits : 0;
    
    const taxAfterCredits = Math.max(0, taxOnIncomeWithExtraordinary - proportionalCredits);
    
    // PASO 5.2.iv: El resultado es la retención adicional del mes
    // Esta retención se suma a la ordinaria para obtener el total
    const additionalRetention = taxAfterCredits;
    
    return this.round(additionalRetention, 2);
  }

  /**
   * Calcula la tasa efectiva de impuesto según el tramo correspondiente
   * Basado en la proyección de ingresos anuales (RNA)
   * Según las escalas progresivas de SUNAT del Artículo 53° de la Ley
   * 
   * Este método se utiliza en:
   * - PASO 3: Para calcular el impuesto anual proyectado
   * - PASO 5: Para calcular la retención adicional por ingresos extraordinarios
   * 
   * Escalas de impuesto para el ejercicio 2025:
   * - Hasta 5 UIT (S/ 26,750): 8%
   * - Más de 5 UIT hasta 20 UIT (S/ 107,000): 14%
   * - Más de 20 UIT hasta 35 UIT (S/ 187,250): 17%
   * - Más de 35 UIT hasta 45 UIT (S/ 240,750): 20%
   * - Más de 45 UIT: 30%
   */
  private calculateEffectiveTaxRateByTramo(projectedNetIncome: number): number {
    const uit = this.getUIT();
    const base5UIT = 5 * uit;      // S/ 26,750
    const base20UIT = 20 * uit;    // S/ 107,000
    const base35UIT = 35 * uit;    // S/ 187,250
    const base45UIT = 45 * uit;    // S/ 240,750

    // Aplicar escalas progresivas según SUNAT del Artículo 53°
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

  /**
   * Valida las donaciones según la normativa SUNAT del Artículo 49°
   * Las donaciones solo se pueden deducir en diciembre con motivo del ajuste final del impuesto
   * Solo aplica para trabajadores que solo perciben rentas de quinta categoría
   */
  validateDonations(donations: number, calculationMonth: number): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    canDeduct: boolean;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let canDeduct = false;

    // Verificar que las donaciones no sean negativas
    if (donations < 0) {
      errors.push('Las donaciones no pueden ser negativas.');
    }

    // Verificar que las donaciones no excedan límites razonables
    if (donations > 100000) {
      warnings.push('El monto de donaciones parece muy alto. Verifica que corresponda a donaciones reales.');
    }

    // Según SUNAT: Las donaciones solo se pueden deducir en diciembre
    // con motivo del ajuste final del impuesto
    if (calculationMonth === 12) {
      canDeduct = true;
    } else {
      warnings.push('Las donaciones solo se pueden deducir en diciembre con motivo del ajuste final del impuesto.');
      canDeduct = false;
    }

    // Verificar que las donaciones estén documentadas
    if (donations > 0) {
      warnings.push('Las donaciones deben estar acreditadas con los documentos señalados en el Artículo 21° de la Ley.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canDeduct
    };
  }

  /**
   * Valida los créditos según la normativa SUNAT del Artículo 88°
   * Los contribuyentes pueden deducir de su impuesto los conceptos siguientes:
   * b) Pagos efectuados a cuenta del impuesto liquidado y créditos contra dicho tributo
   * c) Saldos a favor reconocidos por SUNAT o establecidos por el contribuyente
   */
  validateTaxCredits(
    previousTaxCredits: number,
    previousTaxPayments: number,
    previousTaxRefunds: number,
    projectedAnnualTax: number
  ): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    totalCredits: number;
    excessCredits: number;
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Verificar que los créditos no sean negativos
    if (previousTaxCredits < 0) {
      errors.push('Los créditos de declaraciones anteriores no pueden ser negativos.');
    }

    if (previousTaxPayments < 0) {
      errors.push('Los pagos a cuenta del impuesto no pueden ser negativos.');
    }

    if (previousTaxRefunds < 0) {
      errors.push('Los saldos a favor no pueden ser negativos.');
    }

    // Verificar límites razonables
    if (previousTaxCredits > 100000) {
      warnings.push('Los créditos de declaraciones anteriores parecen muy altos. Verifica la documentación.');
    }

    if (previousTaxPayments > 100000) {
      warnings.push('Los pagos a cuenta del impuesto parecen muy altos. Verifica la documentación.');
    }

    if (previousTaxRefunds > 50000) {
      warnings.push('Los saldos a favor parecen muy altos. Verifica que estén reconocidos por SUNAT.');
    }

    // Calcular total de créditos
    const totalCredits = previousTaxCredits + previousTaxPayments + previousTaxRefunds;

    // Verificar si los créditos exceden el impuesto proyectado
    const excessCredits = Math.max(0, totalCredits - projectedAnnualTax);
    if (excessCredits > 0) {
      warnings.push(`Los créditos totales (S/ ${totalCredits}) exceden el impuesto proyectado (S/ ${projectedAnnualTax}). Se genera un saldo a favor de S/ ${excessCredits}.`);
    }

    // Verificar que los saldos a favor estén documentados
    if (previousTaxRefunds > 0) {
      warnings.push('Los saldos a favor deben estar reconocidos por SUNAT o establecidos en declaraciones juradas anteriores no impugnadas.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      totalCredits,
      excessCredits
    };
  }

  /**
   * Calcula las retenciones acumuladas hasta un mes específico
   * PASO 4: Método auxiliar para el fraccionamiento del impuesto anual
   * Se utiliza para calcular las retenciones ya efectuadas en períodos anteriores
   * y determinar la retención mensual correspondiente según la metodología SUNAT
   * 
   * @param monthlyCalculations Array de cálculos mensuales ya procesados
   * @param monthIndex Mes hasta el cual calcular las retenciones acumuladas (1-based index)
   * @returns Total de retenciones acumuladas hasta el mes especificado
   */
  private calculateAccumulatedRetentionsUpToMonth(monthlyCalculations: MonthlyCalculation[], monthIndex: number): number {
    let accumulatedRetentions = 0;
    
    // Filtrar solo los cálculos hasta el mes especificado (1-based index)
    for (let i = 0; i < monthlyCalculations.length; i++) {
      const calc = monthlyCalculations[i];
      if (calc && calc.month <= monthIndex) {
        // Sumar solo la retención ordinaria (PASO 4), no la adicional (PASO 5)
        // Esto es importante porque el fraccionamiento se basa en retenciones ordinarias
        accumulatedRetentions += calc.monthlyRetention - (calc.additionalMonthlyRetention || 0);
      }
    }
    
    return accumulatedRetentions;
  }
}
