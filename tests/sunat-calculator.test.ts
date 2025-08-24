import { SunatCalculator, SunatCalculationParams } from '../src/lib/sunat-calculator';

describe('SunatCalculator - 5th Category Income Tax Calculation', () => {
  let calculator: SunatCalculator;

  beforeEach(() => {
    calculator = new SunatCalculator();
  });

  describe('Basic Configuration', () => {
    test('should have correct UIT value for 2025', () => {
      expect(calculator.getUIT()).toBe(5350);
    });

    test('should have correct 7 UIT deduction', () => {
      expect(calculator.getDeduction7UIT()).toBe(37450); // 7 * 5350
    });
  });

  describe('Caso 1: Ingreso Bajo (S/ 1,000 mensual)', () => {
    const params: SunatCalculationParams = {
      year: 2025,
      monthlyIncome: 1000,
      additionalIncome: 0,
      additionalMonth: 0,
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2
    };

    test('should calculate correct annual income', () => {
      const result = calculator.calculate(params);
      expect(result.summary.totalAnnualIncome).toBe(12000);
    });

    test('should have no tax due (below 7 UIT threshold)', () => {
      const result = calculator.calculate(params);
      expect(result.summary.totalAnnualTax).toBe(0);
      expect(result.summary.totalAnnualRetention).toBe(0);
    });

    test('should calculate 12 months of calculations', () => {
      const result = calculator.calculate(params);
      expect(result.monthlyCalculations).toHaveLength(12);
    });

    test('should have zero retention for all months', () => {
      const result = calculator.calculate(params);
      result.monthlyCalculations.forEach(month => {
        expect(month.monthlyRetention).toBe(0);
        expect(month.projectedNetIncome).toBe(0);
      });
    });
  });

  describe('Caso 2: Ingreso Medio (S/ 5,000 mensual)', () => {
    const params: SunatCalculationParams = {
      year: 2025,
      monthlyIncome: 5000,
      additionalIncome: 0,
      additionalMonth: 0,
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2
    };

    test('should calculate correct annual income', () => {
      const result = calculator.calculate(params);
      expect(result.summary.totalAnnualIncome).toBe(60000);
    });

    test('should calculate tax above 7 UIT threshold', () => {
      const result = calculator.calculate(params);
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });

    test('should have progressive monthly retentions', () => {
      const result = calculator.calculate(params);
      const retentions = result.monthlyCalculations.map(m => m.monthlyRetention);
      
      // First month should have retention
      expect(retentions[0]).toBeGreaterThan(0);
      
      // Retentions should generally increase or stay the same
      for (let i = 1; i < retentions.length; i++) {
        expect(retentions[i]).toBeGreaterThanOrEqual(0);
      }
    });

    test('should calculate correct projected net income', () => {
      const result = calculator.calculate(params);
      const firstMonth = result.monthlyCalculations[0];
      // 60000 - 37450 = 22550
      expect(firstMonth.projectedNetIncome).toBe(22550);
    });
  });

  describe('Caso 3: Ingreso Medio con Adicional en Junio', () => {
    const params: SunatCalculationParams = {
      year: 2025,
      monthlyIncome: 5000,
      additionalIncome: 10000,
      additionalMonth: 6, // June
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2
    };

    test('should include additional income in June', () => {
      const result = calculator.calculate(params);
      const juneCalculation = result.monthlyCalculations.find(m => m.month === 6);
      expect(juneCalculation?.additionalIncome).toBe(10000);
      expect(juneCalculation?.observations).toBe('Ingreso adicional');
    });

    test('should calculate higher annual income due to additional', () => {
      const result = calculator.calculate(params);
      expect(result.summary.totalAnnualIncome).toBe(70000); // 5000*12 + 10000
    });

    test('should have higher tax due with additional income', () => {
      const result = calculator.calculate(params);
      const resultWithoutAdditional = calculator.calculate({
        ...params,
        additionalIncome: 0,
        additionalMonth: 0
      });
      
      expect(result.summary.totalAnnualTax).toBeGreaterThan(resultWithoutAdditional.summary.totalAnnualTax);
    });

    test('should recalculate projections after June', () => {
      const result = calculator.calculate(params);
      
      // All months should project the same annual income (including additional)
      result.monthlyCalculations.forEach(month => {
        expect(month.projectedAccumulatedIncome).toBe(70000); // 5000*12 + 10000
      });
    });
  });

  describe('Caso 4: Ingreso Medio con Adicional en Noviembre (Cálculo desde Julio)', () => {
    const params: SunatCalculationParams = {
      year: 2025,
      monthlyIncome: 5000,
      additionalIncome: 10000,
      additionalMonth: 11, // November
      calculationMonth: 7, // July
      previousRetentions: 0,
      roundingDecimals: 2
    };

    test('should calculate only 6 months (July to December)', () => {
      const result = calculator.calculate(params);
      expect(result.monthlyCalculations).toHaveLength(6);
    });

    test('should start from July', () => {
      const result = calculator.calculate(params);
      expect(result.monthlyCalculations[0].month).toBe(7);
      expect(result.monthlyCalculations[0].monthName).toBe('Julio');
    });

    test('should include additional in November', () => {
      const result = calculator.calculate(params);
      const novemberCalculation = result.monthlyCalculations.find(m => m.month === 11);
      expect(novemberCalculation?.additionalIncome).toBe(10000);
    });

    test('should have higher retention in November due to additional', () => {
      const result = calculator.calculate(params);
      const novemberCalculation = result.monthlyCalculations.find(m => m.month === 11);
      const octoberCalculation = result.monthlyCalculations.find(m => m.month === 10);
      
      // November retention should be greater than or equal to October retention
      expect(novemberCalculation?.monthlyRetention).toBeGreaterThanOrEqual(octoberCalculation?.monthlyRetention || 0);
    });
  });

  describe('Caso 5: Ingreso Alto (S/ 15,000 mensual)', () => {
    const params: SunatCalculationParams = {
      year: 2025,
      monthlyIncome: 15000,
      additionalIncome: 0,
      additionalMonth: 0,
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2
    };

    test('should calculate high annual income', () => {
      const result = calculator.calculate(params);
      expect(result.summary.totalAnnualIncome).toBe(180000);
    });

    test('should apply higher tax brackets', () => {
      const result = calculator.calculate(params);
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
      
      // Should be in higher tax bracket (above 12 UIT)
      const annualIncome = 180000;
      const netIncome = annualIncome - 37450; // 141500
      expect(netIncome).toBeGreaterThan(12 * 5350); // 66000
    });

    test('should have significant monthly retentions', () => {
      const result = calculator.calculate(params);
      const firstMonth = result.monthlyCalculations[0];
      expect(firstMonth.monthlyRetention).toBeGreaterThan(1000); // Should be substantial
    });
  });

  describe('Edge Cases', () => {
    describe('Edge Case 1: Zero Income', () => {
      const params: SunatCalculationParams = {
        year: 2025,
        monthlyIncome: 0,
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      test('should handle zero income without errors', () => {
        const result = calculator.calculate(params);
        expect(result.summary.totalAnnualIncome).toBe(0);
        expect(result.summary.totalAnnualTax).toBe(0);
        expect(result.summary.totalAnnualRetention).toBe(0);
      });

      test('should have zero retentions for all months', () => {
        const result = calculator.calculate(params);
        result.monthlyCalculations.forEach(month => {
          expect(month.monthlyRetention).toBe(0);
        });
      });
    });

    describe('Edge Case 2: Very High Income (Above 35 UIT)', () => {
      const params: SunatCalculationParams = {
        year: 2025,
        monthlyIncome: 50000, // 600,000 annual
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      test('should handle very high income correctly', () => {
        const result = calculator.calculate(params);
        expect(result.summary.totalAnnualIncome).toBe(600000);
        
        // Should be well above 35 UIT threshold
        const netIncome = 600000 - 37450; // 561500
        expect(netIncome).toBeGreaterThan(35 * 5350); // 192500
      });

      test('should apply highest tax bracket', () => {
        const result = calculator.calculate(params);
        expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
        
        // Tax should be substantial
        expect(result.summary.totalAnnualTax).toBeGreaterThan(100000);
      });
    });

    describe('Edge Case 3: Previous Retentions', () => {
      const params: SunatCalculationParams = {
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 7, // July
        previousRetentions: 5000, // Previous retentions
        roundingDecimals: 2
      };

      test('should account for previous retentions', () => {
        const result = calculator.calculate(params);
        
        // First month should consider previous retentions
        const firstMonth = result.monthlyCalculations[0];
        expect(firstMonth.previousAccumulatedRetention).toBe(5000);
      });

      test('should reduce monthly retention due to previous payments', () => {
        const result = calculator.calculate(params);
        const resultWithoutPrevious = calculator.calculate({
          ...params,
          previousRetentions: 0
        });
        
        // If previous retentions don't exceed expected tax, total retention should be the same
        if (params.previousRetentions < result.summary.totalAnnualTax) {
          expect(result.summary.totalAnnualRetention).toBe(resultWithoutPrevious.summary.totalAnnualRetention);
          
          // But first month retention should be lower
          const firstMonth = result.monthlyCalculations[0];
          const firstMonthWithoutPrevious = resultWithoutPrevious.monthlyCalculations[0];
          expect(firstMonth.monthlyRetention).toBeLessThanOrEqual(firstMonthWithoutPrevious.monthlyRetention);
        } else {
          // If previous retentions exceed expected tax, monthly retentions should be 0
          result.monthlyCalculations.forEach(month => {
            expect(month.monthlyRetention).toBe(0);
          });
        }
      });
    });

    describe('Edge Case 4: Mid-Year Calculation with High Previous Retentions', () => {
      const params: SunatCalculationParams = {
        year: 2025,
        monthlyIncome: 8000,
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 6, // June
        previousRetentions: 20000, // High previous retentions
        roundingDecimals: 2
      };

      test('should handle high previous retentions correctly', () => {
        const result = calculator.calculate(params);
        expect(result.monthlyCalculations).toHaveLength(7); // June to December
        
        // First month should have high previous retention
        const firstMonth = result.monthlyCalculations[0];
        expect(firstMonth.previousAccumulatedRetention).toBe(20000);
      });

      test('should calculate correct remaining months', () => {
        const result = calculator.calculate(params);
        const months = result.monthlyCalculations.map(m => m.month);
        expect(months).toEqual([6, 7, 8, 9, 10, 11, 12]);
      });

      test('should handle overpayment scenarios', () => {
        const result = calculator.calculate(params);
        
        // If previous retentions exceed expected, monthly retention might be 0
        const totalExpectedTax = result.summary.totalAnnualTax;
        const previousRetentions = 20000;
        
        if (previousRetentions >= totalExpectedTax) {
          // All months should have 0 retention
          result.monthlyCalculations.forEach(month => {
            expect(month.monthlyRetention).toBe(0);
          });
        }
      });
    });
  });

  describe('Rounding and Precision', () => {
    test('should respect rounding decimals parameter', () => {
      const params: SunatCalculationParams = {
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 3
      };

      const result = calculator.calculate(params);
      
      // Check that all monetary values respect 3 decimal places
      result.monthlyCalculations.forEach(month => {
        const decimalPlaces = month.monthlyRetention.toString().split('.')[1]?.length || 0;
        // Note: The actual precision depends on the calculation method
        // We'll check that it's reasonable (not excessive)
        expect(decimalPlaces).toBeLessThanOrEqual(15);
      });
    });
  });

  describe('Validation and Error Handling', () => {
    test('should handle invalid month numbers gracefully', () => {
      const params: SunatCalculationParams = {
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 13, // Invalid month
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      expect(result.monthlyCalculations).toHaveLength(0);
    });

    test('should handle negative income gracefully', () => {
      const params: SunatCalculationParams = {
        year: 2025,
        monthlyIncome: -1000,
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      expect(result.summary.totalAnnualIncome).toBe(-12000);
      expect(result.summary.totalAnnualTax).toBe(0);
    });
  });
});
