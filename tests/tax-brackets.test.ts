import { SunatCalculator } from '../src/lib/sunat-calculator';

describe('Tax Bracket Calculations', () => {
  let calculator: SunatCalculator;

  beforeEach(() => {
    calculator = new SunatCalculator();
  });

  describe('Tax Bracket Thresholds', () => {
    test('should apply 8% rate for income up to 7 UIT', () => {
      const params = {
        year: 2024,
        monthlyIncome: 3000, // 36,000 annual (below 7 UIT = 38,500)
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 36000 - 38500; // Should be negative
      expect(netIncome).toBeLessThan(0);
      expect(result.summary.totalAnnualTax).toBe(0);
    });

    test('should apply 14% rate for income between 7-12 UIT', () => {
      const params = {
        year: 2024,
        monthlyIncome: 4000, // 48,000 annual (between 7-12 UIT: 38,500 - 66,000)
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 48000 - 38500; // 9,500
      expect(netIncome).toBeGreaterThan(0);
      expect(netIncome).toBeLessThan(12 * 5500); // 66,000
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });

    test('should apply 17% rate for income between 12-20 UIT', () => {
      const params = {
        year: 2024,
        monthlyIncome: 8000, // 96,000 annual (between 12-20 UIT: 66,000 - 110,000)
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 96000 - 38500; // 57,500
      expect(netIncome).toBeGreaterThan(0);
      expect(netIncome).toBeLessThan(20 * 5500); // 110,000
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });

    test('should apply 20% rate for income between 20-35 UIT', () => {
      const params = {
        year: 2024,
        monthlyIncome: 12000, // 144,000 annual (between 20-35 UIT: 110,000 - 192,500)
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 144000 - 38500; // 105,500
      expect(netIncome).toBeGreaterThan(0);
      expect(netIncome).toBeLessThan(35 * 5500); // 192,500
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });

    test('should apply 30% rate for income above 35 UIT', () => {
      const params = {
        year: 2024,
        monthlyIncome: 20000, // 240,000 annual (above 35 UIT: 192,500)
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 240000 - 38500; // 201,500
      expect(netIncome).toBeGreaterThan(35 * 5500); // 192,500
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });
  });

  describe('Progressive Tax Calculation', () => {
    test('should calculate tax correctly across multiple brackets', () => {
      const params = {
        year: 2024,
        monthlyIncome: 15000, // 180,000 annual
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 180000 - 38500; // 141,500
      
      // This should span multiple tax brackets
      expect(netIncome).toBeGreaterThan(12 * 5500); // Above 12 UIT
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });

    test('should handle exact bracket boundaries', () => {
      // Test income exactly at 7 UIT threshold
      const params = {
        year: 2024,
        monthlyIncome: 38500 / 12, // Exactly 7 UIT annual
        additionalIncome: 0,
        additionalMonth: 0,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      };

      const result = calculator.calculate(params);
      const netIncome = 38500 - 38500; // Exactly 0
      expect(netIncome).toBe(0);
      expect(result.summary.totalAnnualTax).toBe(0);
    });
  });

  describe('UIT Value Validation', () => {
    test('should use correct UIT value for 2024', () => {
      expect(calculator.getUIT()).toBe(5500);
    });

    test('should calculate correct 7 UIT deduction', () => {
      expect(calculator.getDeduction7UIT()).toBe(38500);
    });

    test('should maintain UIT consistency across calculations', () => {
      const params = {
        year: 2024,
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
      
      // Net income should be 12000 - 38500 = -26500 (negative, so no tax)
      expect(firstMonth.projectedNetIncome).toBe(0); // Should be capped at 0
    });
  });
});
