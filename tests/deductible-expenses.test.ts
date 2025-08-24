import { SunatCalculator } from '../src/lib/sunat-calculator';

describe('Deductible Expenses Tests', () => {
  let calculator: SunatCalculator;

  beforeEach(() => {
    calculator = new SunatCalculator();
  });

  describe('Deductible Expenses Calculation', () => {
    test('should calculate deductible expenses correctly', () => {
      const deductibleExpenses = {
        restaurants: 10000,
        medicalServices: 5000,
        professionalServices: 3000,
        rentalProperties: 8000,
        essaludContributions: 2000
      };

      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        deductibleExpenses
      });

      // Verify deductible expenses summary
      expect(result.summary.deductibleExpenses.totalExpenses).toBe(28000);
      expect(result.summary.deductibleExpenses.totalDeduction).toBe(8300); // 15% + 30% + 30% + 30% + 100%
      expect(result.summary.deductibleExpenses.maxDeduction).toBe(16050);
      expect(result.summary.deductibleExpenses.remainingDeduction).toBe(7750); // 16050 - 8300

      // Verify breakdown calculations
      expect(result.summary.deductibleExpenses.breakdown.restaurants.deduction).toBe(1500); // 15% of 10000
      expect(result.summary.deductibleExpenses.breakdown.medicalServices.deduction).toBe(1500); // 30% of 5000
      expect(result.summary.deductibleExpenses.breakdown.professionalServices.deduction).toBe(900); // 30% of 3000
      expect(result.summary.deductibleExpenses.breakdown.rentalProperties.deduction).toBe(2400); // 30% of 8000
      expect(result.summary.deductibleExpenses.breakdown.essaludContributions.deduction).toBe(2000); // 100% of 2000
    });

    test('should respect 3 UIT maximum limit', () => {
      const deductibleExpenses = {
        restaurants: 50000,
        medicalServices: 30000,
        professionalServices: 20000,
        rentalProperties: 40000,
        essaludContributions: 10000
      };

      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 8000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        deductibleExpenses
      });

      // Total deduction should be capped at 3 UIT (16,050)
      expect(result.summary.deductibleExpenses.totalDeduction).toBe(16050);
      expect(result.summary.deductibleExpenses.remainingDeduction).toBe(0);
    });

    test('should handle no deductible expenses', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2
      });

      expect(result.summary.deductibleExpenses.totalExpenses).toBe(0);
      expect(result.summary.deductibleExpenses.totalDeduction).toBe(0);
      expect(result.summary.deductibleExpenses.remainingDeduction).toBe(16050);
    });

    test('should calculate tax correctly with deductible expenses', () => {
      const deductibleExpenses = {
        restaurants: 10000,
        medicalServices: 5000,
        professionalServices: 0,
        rentalProperties: 0,
        essaludContributions: 0
      };

      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 8000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        deductibleExpenses
      });

      // Annual income: 8000 * 12 = 96,000
      // Deduction 7 UIT: 37,450
      // Deduction 3 UIT: 3,000 (15% of 10,000 + 30% of 5,000)
      // Net income: 96,000 - 37,450 - 3,000 = 55,550
      expect(result.summary.totalAnnualIncome).toBe(96000);
      expect(result.summary.deductibleExpenses.totalDeduction).toBe(3000);
      
      // Tax should be calculated on net income after both deductions
      expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    });
  });

  describe('Deductible Expenses Validation', () => {
    test('should validate deductible expenses correctly', () => {
      const validExpenses = {
        restaurants: 10000,
        medicalServices: 5000,
        professionalServices: 3000,
        rentalProperties: 8000,
        essaludContributions: 2000
      };

      const validation = calculator.validateDeductibleExpenses(validExpenses);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should detect negative values', () => {
      const invalidExpenses = {
        restaurants: -1000,
        medicalServices: 5000,
        professionalServices: 3000,
        rentalProperties: 8000,
        essaludContributions: 2000
      };

      const validation = calculator.validateDeductibleExpenses(invalidExpenses);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Los gastos en restaurants no pueden ser negativos.');
    });

    test('should provide warnings for high amounts', () => {
      const highExpenses = {
        restaurants: 60000,
        medicalServices: 40000,
        professionalServices: 30000,
        rentalProperties: 70000,
        essaludContributions: 15000
      };

      const validation = calculator.validateDeductibleExpenses(highExpenses);
      expect(validation.isValid).toBe(true);
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings.some(w => w.includes('restaurantes'))).toBe(true);
      expect(validation.warnings.some(w => w.includes('médicos'))).toBe(true);
      expect(validation.warnings.some(w => w.includes('alquiler'))).toBe(true);
    });
  });

  describe('UIT and Deduction Constants', () => {
    test('should return correct UIT values', () => {
      expect(calculator.getUIT()).toBe(5350);
      expect(calculator.getDeduction7UIT()).toBe(37450);
      expect(calculator.getMaxAdditionalDeduction()).toBe(16050);
    });

    test('should return correct deductible percentages', () => {
      const percentages = calculator.getDeductiblePercentages();
      expect(percentages.restaurants).toBe(0.15);
      expect(percentages.medicalServices).toBe(0.30);
      expect(percentages.professionalServices).toBe(0.30);
      expect(percentages.rentalProperties).toBe(0.30);
      expect(percentages.essaludContributions).toBe(1.00);
    });
  });
});
