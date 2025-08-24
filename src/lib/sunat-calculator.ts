export interface SunatCalculationParams {
  year: number;
  monthlyIncome: number;
  additionalIncome: number;
  additionalMonth: number;
  calculationMonth: number;
  previousRetentions: number;
  roundingDecimals: number;
  deductibleExpenses?: DeductibleExpenses;
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
  projectedAccumulatedIncome: number;
  projectedNetIncome: number;
  projectedTax: number;
  expectedAccumulatedRetention: number;
  previousAccumulatedRetention: number;
  monthlyRetention: number;
  observations: string;
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
  };
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

  private readonly MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  calculate(params: SunatCalculationParams): SunatCalculationResult {
    const monthlyCalculations: MonthlyCalculation[] = [];
    let accumulatedRetention = params.previousRetentions;

    // Calculate total projected annual income including additional income
    const totalProjectedAnnualIncome = (params.monthlyIncome * 12) + params.additionalIncome;

    // Calculate deductible expenses if provided
    const deductibleExpensesSummary = this.calculateDeductibleExpenses(params.deductibleExpenses);

    // Calculate for each month from calculation month to December
    for (let month = params.calculationMonth; month <= 12; month++) {
      const monthIndex = month - 1;
      const monthName = this.MONTH_NAMES[monthIndex];
      
      // Calculate monthly income (including additional if applicable)
      const monthlyIncome = params.monthlyIncome;
      const additionalIncome = month === params.additionalMonth ? params.additionalIncome : 0;
      
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

      const calculation: MonthlyCalculation = {
        month,
        monthName,
        monthlyIncome,
        additionalIncome,
        projectedAccumulatedIncome: totalProjectedAnnualIncome,
        projectedNetIncome,
        projectedTax,
        expectedAccumulatedRetention,
        previousAccumulatedRetention: accumulatedRetention - monthlyRetention,
        monthlyRetention,
        observations: additionalIncome > 0 ? 'Mes con adicional' : ''
      };

      monthlyCalculations.push(calculation);
    }

    // Calculate summary
    const totalAnnualIncome = params.monthlyIncome * 12 + params.additionalIncome;
    const totalAnnualTax = this.calculateProgressiveTax(Math.max(0, totalAnnualIncome - this.DEDUCTION_7_UIT - deductibleExpensesSummary.totalDeduction));
    const totalAnnualRetention = monthlyCalculations.reduce((sum, calc) => sum + calc.monthlyRetention, 0);
    const averageMonthlyRetention = monthlyCalculations.length > 0 ? totalAnnualRetention / monthlyCalculations.length : 0;

    return {
      parameters: params,
      monthlyCalculations,
      summary: {
        totalAnnualIncome,
        totalAnnualTax,
        totalAnnualRetention,
        averageMonthlyRetention,
        deductibleExpenses: deductibleExpensesSummary
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
