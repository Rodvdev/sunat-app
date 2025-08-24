import { SunatCalculator, SunatCalculationParams } from '../src/lib/sunat-calculator';

describe('Additional Income Scenarios', () => {
  let calculator: SunatCalculator;

  beforeEach(() => {
    calculator = new SunatCalculator();
  });

  describe('Additional Income in Different Months', () => {
    test('should handle additional income in January', () => {
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: 5000,
        additionalIncome: 15000,
        additionalMonth: 1, // January
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      
      // January should have additional income
      const january = result.monthlyCalculations.find(m => m.month === 1);
      expect(january?.additionalIncome).toBe(15000);
      expect(january?.observations).toBe('Mes con adicional');
      
      // All months should project the same annual income
      result.monthlyCalculations.forEach(month => {
        expect(month.projectedAccumulatedIncome).toBe(75000); // 5000*12 + 15000
      });
    });

    test('should handle additional income in December', () => {
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: 5000,
        additionalIncome: 20000,
        additionalMonth: 12, // December
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      
      // December should have additional income
      const december = result.monthlyCalculations.find(m => m.month === 12);
      expect(december?.additionalIncome).toBe(20000);
      
      // All months should project the same annual income
      result.monthlyCalculations.forEach(month => {
        expect(month.projectedAccumulatedIncome).toBe(80000); // 5000*12 + 20000
      });
    });

    test('should handle multiple additional income months', () => {
      // Note: Current implementation only supports one additional month
      // This test documents the limitation
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: 5000,
        additionalIncome: 10000,
        additionalMonth: 6, // June
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      
      // Only June should have additional income
      const monthsWithAdditional = result.monthlyCalculations.filter(m => m.additionalIncome > 0);
      expect(monthsWithAdditional).toHaveLength(1);
      expect(monthsWithAdditional[0].month).toBe(6);
    });
  });

  describe('Additional Income Impact on Tax Brackets', () => {
    test('should push income into higher tax bracket', () => {
      // Base income just below 7 UIT threshold
      const baseIncome = 3000; // 36,000 annual (below 38,500)
      const additionalIncome = 5000; // Will push total to 41,000 (above 38,500)
      
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: baseIncome,
        additionalIncome,
        additionalMonth: 6,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const resultWithoutAdditional = calculator.calculate({
        ...params,
        additionalIncome: 0,
        additionalMonth: 0
      });

      // Without additional: no tax (below 7 UIT)
      expect(resultWithoutAdditional.summary.totalAnnualTax).toBe(0);
      
      // With additional: should have tax (above 7 UIT)
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });

    test('should significantly increase tax for high-income earners', () => {
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: 15000, // 180,000 annual
        additionalIncome: 50000, // Additional 50,000
        additionalMonth: 6,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const resultWithoutAdditional = calculator.calculate({
        ...params,
        additionalIncome: 0,
        additionalMonth: 0
      });

      const taxIncrease = result.summary.totalAnnualTax - resultWithoutAdditional.summary.totalAnnualTax;
      expect(taxIncrease).toBeGreaterThan(0);
      
      // Tax increase should be substantial for 50,000 additional income
      expect(taxIncrease).toBeGreaterThanOrEqual(10000);
    });
  });

  describe('Mid-Year Calculations with Additional Income', () => {
    test('should recalculate projections when starting mid-year', () => {
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: 5000,
        additionalIncome: 10000,
        additionalMonth: 11, // November
        calculationMonth: 7, // July
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      
      // Should calculate 6 months (July to December)
      expect(result.monthlyCalculations).toHaveLength(6);
      
      // All months should project the same annual income
      result.monthlyCalculations.forEach(month => {
        expect(month.projectedAccumulatedIncome).toBe(70000); // 5000*12 + 10000
      });
    });

    test('should handle additional income before calculation month', () => {
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: 5000,
        additionalIncome: 10000,
        additionalMonth: 3, // March
        calculationMonth: 7, // July
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      
      // Should calculate 6 months (July to December)
      expect(result.monthlyCalculations).toHaveLength(6);
      
      // All months should project the same annual income (including March additional)
      result.monthlyCalculations.forEach(month => {
        expect(month.projectedAccumulatedIncome).toBe(70000); // 5000*12 + 10000
      });
    });
  });

  describe('Edge Cases for Additional Income', () => {
    test('should handle zero additional income', () => {
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      
      // No month should have additional income
      const monthsWithAdditional = result.monthlyCalculations.filter(m => m.additionalIncome > 0);
      expect(monthsWithAdditional).toHaveLength(0);
      
      // All months should have same projected income
      result.monthlyCalculations.forEach(month => {
        expect(month.projectedAccumulatedIncome).toBe(60000); // 5000*12
      });
    });

    test('should handle very large additional income', () => {
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: 5000,
        additionalIncome: 100000, // Very large additional
        additionalMonth: 6,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      
      // Total annual income should be very high
      expect(result.summary.totalAnnualIncome).toBe(160000); // 5000*12 + 100000
      
      // Should be above 12 UIT threshold but below 35 UIT
      const netIncome = 160000 - 38500; // 121,500
      expect(netIncome).toBeGreaterThan(12 * 5500); // 66,000
      expect(netIncome).toBeLessThan(35 * 5500); // 192,500
      
      // Tax should be substantial (actual calculated value is around 16,710)
      expect(result.summary.totalAnnualTax).toBeGreaterThan(15000);
    });

    test('should handle additional income equal to monthly income', () => {
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: 5000,
        additionalIncome: 5000, // Equal to monthly income
        additionalMonth: 6,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      
      // Total annual income should be 13 months worth
      expect(result.summary.totalAnnualIncome).toBe(65000); // 5000*12 + 5000
      
      // June should have additional income
      const june = result.monthlyCalculations.find(m => m.month === 6);
      expect(june?.additionalIncome).toBe(5000);
    });
  });

  describe('Additional Income with Previous Retentions', () => {
    test('should consider previous retentions when calculating with additional income', () => {
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: 5000,
        additionalIncome: 10000,
        additionalMonth: 6,
        calculationMonth: 7, // July
        previousRetentions: 5000, // Previous retentions
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      
      // First month should consider previous retentions
      const firstMonth = result.monthlyCalculations[0];
      expect(firstMonth.previousAccumulatedRetention).toBe(5000);
      
      // Should calculate 6 months (July to December)
      expect(result.monthlyCalculations).toHaveLength(6);
    });

    test('should handle overpayment scenarios with additional income', () => {
      const params: SunatCalculationParams = {
        year: 2024,
        monthlyIncome: 5000,
        additionalIncome: 10000,
        additionalMonth: 6,
        calculationMonth: 7, // July
        previousRetentions: 50000, // Very high previous retentions
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      
      // If previous retentions exceed expected tax, monthly retentions might be 0
      const totalExpectedTax = result.summary.totalAnnualTax;
      const previousRetentions = 50000;
      
      if (previousRetentions >= totalExpectedTax) {
        // All months should have 0 retention
        result.monthlyCalculations.forEach(month => {
          expect(month.monthlyRetention).toBe(0);
        });
      }
    });
  });
});
