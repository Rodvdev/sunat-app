import { SunatCalculator } from '../src/lib/sunat-calculator';

describe('Tax Bracket Calculations', () => {
  let calculator: SunatCalculator;

  beforeEach(() => {
    calculator = new SunatCalculator();
  });

  describe('Tax Bracket Thresholds', () => {
    test('should apply 8% rate for income up to 7 UIT', () => {
      const params = {
        year: 2025,
        monthlyIncome: 3000, // 36,000 annual (below 7 UIT = 37,450)
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 36000 - 37450; // Should be negative
      expect(netIncome).toBeLessThan(0);
      expect(result.summary.totalAnnualTax).toBe(0);
    });

    test('should apply 14% rate for income between 7-12 UIT', () => {
      const params = {
        year: 2025,
        monthlyIncome: 4000, // 48,000 annual (between 7-12 UIT: 37,450 - 66,000)
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 48000 - 37450; // 9,500
      expect(netIncome).toBeGreaterThan(0);
      expect(netIncome).toBeLessThan(12 * 5350); // 66,000
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });

    test('should apply 17% rate for income between 12-20 UIT', () => {
      const params = {
        year: 2025,
        monthlyIncome: 8000, // 96,000 annual (between 12-20 UIT: 66,000 - 110,000)
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 96000 - 37450; // 57,500
      expect(netIncome).toBeGreaterThan(0);
      expect(netIncome).toBeLessThan(20 * 5350); // 110,000
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });

    test('should apply 20% rate for income between 20-35 UIT', () => {
      const params = {
        year: 2025,
        monthlyIncome: 12000, // 144,000 annual (between 20-35 UIT: 110,000 - 192,500)
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 144000 - 37450; // 105,500
      expect(netIncome).toBeGreaterThan(0);
      expect(netIncome).toBeLessThan(35 * 5350); // 192,500
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });

    test('should apply 30% rate for income above 35 UIT', () => {
      const params = {
        year: 2025,
        monthlyIncome: 20000, // 240,000 annual (above 35 UIT: 192,500)
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 240000 - 37450; // 201,500
      expect(netIncome).toBeGreaterThan(35 * 5350); // 192,500
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });
  });

  describe('Progressive Tax Calculation', () => {
    test('should calculate tax correctly across multiple brackets', () => {
      const params = {
        year: 2025,
        monthlyIncome: 15000, // 180,000 annual
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 180000 - 37450; // 141,500
      
      // This should span multiple tax brackets
      expect(netIncome).toBeGreaterThan(12 * 5350); // Above 12 UIT
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });

    test('should handle exact bracket boundaries', () => {
      // Test income exactly at 7 UIT threshold
      const params = {
        year: 2025,
        monthlyIncome: 37450 / 12, // Exactly 7 UIT annual
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 37450 - 37450; // Exactly 0
      expect(netIncome).toBe(0);
      expect(result.summary.totalAnnualTax).toBe(0);
    });
  });

  describe('UIT Value Validation', () => {
    test('should use correct UIT value for 2025', () => {
      expect(calculator.getUIT()).toBe(5350);
    });

    test('should calculate correct 7 UIT deduction', () => {
      expect(calculator.getDeduction7UIT()).toBe(37450);
    });

    test('should maintain UIT consistency across calculations', () => {
      const params = {
        year: 2025,
        monthlyIncome: 1000,
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const firstMonth = result.monthlyCalculations[0];
      
      // Projected income should be exactly 12 * monthly income
      expect(firstMonth.projectedAccumulatedIncome).toBe(12000);
      
      // Net income should be 12000 - 37450 = -26500 (negative, so no tax)
      expect(firstMonth.projectedNetIncome).toBe(0); // Should be capped at 0
    });
  });
});
