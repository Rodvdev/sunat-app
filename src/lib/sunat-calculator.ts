export interface SunatCalculationParams {
  year: number;
  monthlyIncome: number;
  additionalIncome: number;
  additionalMonth: number;
  calculationMonth: number;
  previousRetentions: number;
  roundingDecimals: number;
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
  };
}

export class SunatCalculator {
  private readonly UIT_2024 = 5500; // UIT 2024
  private readonly DEDUCTION_7_UIT = 7 * this.UIT_2024;
  
  // Tax brackets for 2024 (simplified - should be updated with actual rates)
  private readonly TAX_BRACKETS = [
    { min: 0, max: 7 * this.UIT_2024, rate: 0.08 },
    { min: 7 * this.UIT_2024, max: 12 * this.UIT_2024, rate: 0.14 },
    { min: 12 * this.UIT_2024, max: 20 * this.UIT_2024, rate: 0.17 },
    { min: 20 * this.UIT_2024, max: 35 * this.UIT_2024, rate: 0.20 },
    { min: 35 * this.UIT_2024, max: Infinity, rate: 0.30 }
  ];

  private readonly MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  calculate(params: SunatCalculationParams): SunatCalculationResult {
    const monthlyCalculations: MonthlyCalculation[] = [];
    let accumulatedIncome = 0;
    let accumulatedRetention = params.previousRetentions;

    // Calculate for each month from calculation month to December
    for (let month = params.calculationMonth; month <= 12; month++) {
      const monthIndex = month - 1;
      const monthName = this.MONTH_NAMES[monthIndex];
      
      // Calculate monthly income (including additional if applicable)
      const monthlyIncome = params.monthlyIncome;
      const additionalIncome = month === params.additionalMonth ? params.additionalIncome : 0;
      
      // Project annual income based on remaining months
      const remainingMonths = 12 - month + 1;
      const projectedAnnualIncome = (monthlyIncome * 12) + additionalIncome;
      
      // Calculate projected net income (after 7 UIT deduction)
      const projectedNetIncome = Math.max(0, projectedAnnualIncome - this.DEDUCTION_7_UIT);
      
      // Calculate projected tax using progressive brackets
      const projectedTax = this.calculateProgressiveTax(projectedNetIncome);
      
      // Calculate expected accumulated retention
      const expectedAccumulatedRetention = this.round(projectedTax * (month / 12), params.roundingDecimals);
      
      // Calculate monthly retention
      const monthlyRetention = Math.max(0, expectedAccumulatedRetention - accumulatedRetention);
      
      // Update accumulated values
      accumulatedIncome += monthlyIncome + additionalIncome;
      accumulatedRetention += monthlyRetention;

      const calculation: MonthlyCalculation = {
        month,
        monthName,
        monthlyIncome,
        additionalIncome,
        projectedAccumulatedIncome: projectedAnnualIncome,
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
    const totalAnnualTax = this.calculateProgressiveTax(Math.max(0, totalAnnualIncome - this.DEDUCTION_7_UIT));
    const totalAnnualRetention = monthlyCalculations.reduce((sum, calc) => sum + calc.monthlyRetention, 0);
    const averageMonthlyRetention = totalAnnualRetention / monthlyCalculations.length;

    return {
      parameters: params,
      monthlyCalculations,
      summary: {
        totalAnnualIncome,
        totalAnnualTax,
        totalAnnualRetention,
        averageMonthlyRetention
      }
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

    return totalTax;
  }

  private round(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  // Getter for UIT value
  getUIT(): number {
    return this.UIT_2024;
  }

  // Getter for 7 UIT deduction
  getDeduction7UIT(): number {
    return this.DEDUCTION_7_UIT;
  }
}
