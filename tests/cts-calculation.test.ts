import { SunatCalculator } from '../src/lib/sunat-calculator';

describe('CTS Calculation Tests', () => {
  let calculator: SunatCalculator;

  beforeEach(() => {
    calculator = new SunatCalculator();
  });

  describe('CTS Calculation According to Peruvian Law', () => {
    it('should calculate CTS correctly for May (first payment)', () => {
      // CTS se paga en Mayo y Noviembre
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 3000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: true,
        startWorkMonth: 1
      });

      // Verificar CTS de mayo
      const may = result.monthlyCalculations.find(calc => calc.month === 5);
      expect(may?.cts).toBeGreaterThan(0);
      expect(may?.ctsBase).toBeDefined();
      expect(may?.ctsDias).toBeDefined();
      expect(may?.ctsTotal).toBeDefined();

      // Verificar que el total de CTS sea la suma de base + días
      if (may?.ctsBase && may?.ctsDias && may?.ctsTotal) {
        expect(may.ctsTotal).toBe(may.ctsBase + may.ctsDias);
      }
    });

    it('should calculate CTS correctly for November (second payment)', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 4000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: true,
        startWorkMonth: 1
      });

      // Verificar CTS de noviembre
      const november = result.monthlyCalculations.find(calc => calc.month === 11);
      expect(november?.cts).toBeGreaterThan(0);
      expect(november?.ctsBase).toBeDefined();
      expect(november?.ctsDias).toBeDefined();
      expect(november?.ctsTotal).toBeDefined();

      // Verificar que el total de CTS sea la suma de base + días
      if (november?.ctsBase && november?.ctsDias && november?.ctsTotal) {
        expect(november.ctsTotal).toBe(november.ctsBase + november.ctsDias);
      }
    });

    it('should not calculate CTS for other months', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 3500,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: true,
        startWorkMonth: 1
      });

      // Verificar que solo mayo y noviembre tengan CTS
      const monthsWithCTS = result.monthlyCalculations.filter(calc => calc.cts > 0);
      expect(monthsWithCTS).toHaveLength(2);
      
      const ctsMonths = monthsWithCTS.map(calc => calc.month);
      expect(ctsMonths).toContain(5); // Mayo
      expect(ctsMonths).toContain(11); // Noviembre
    });

    it('should respect start work month for CTS calculation', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: true,
        startWorkMonth: 3 // Empezó en marzo
      });

      // Mayo debería tener CTS (empezó en marzo)
      const may = result.monthlyCalculations.find(calc => calc.month === 5);
      expect(may?.cts).toBeGreaterThan(0);

      // Noviembre debería tener CTS (empezó en marzo)
      const november = result.monthlyCalculations.find(calc => calc.month === 11);
      expect(november?.cts).toBeGreaterThan(0);
    });

    it('should not calculate CTS if started after May', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 6000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: true,
        startWorkMonth: 6 // Empezó en junio
      });

      // Mayo no debería tener CTS (empezó después)
      const may = result.monthlyCalculations.find(calc => calc.month === 5);
      expect(may?.cts).toBe(0);

      // Noviembre debería tener CTS (empezó en junio)
      const november = result.monthlyCalculations.find(calc => calc.month === 11);
      expect(november?.cts).toBeGreaterThan(0);
    });

    it('should not calculate CTS if started after November', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 7000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: true,
        startWorkMonth: 12 // Empezó en diciembre
      });

      // Mayo no debería tener CTS (empezó después)
      const may = result.monthlyCalculations.find(calc => calc.month === 5);
      expect(may?.cts).toBe(0);

      // Noviembre no debería tener CTS (empezó después)
      const november = result.monthlyCalculations.find(calc => calc.month === 11);
      expect(november?.cts).toBe(0);
    });
  });

  describe('CTS Formula Validation', () => {
    it('should apply correct CTS formula: [(Remuneración / 12) × Meses] + [(Remuneración / 360) × Días]', () => {
      const monthlyIncome = 3000;
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: true,
        startWorkMonth: 1
      });

      const may = result.monthlyCalculations.find(calc => calc.month === 5);
      expect(may?.cts).toBeGreaterThan(0);

      if (may?.ctsBase && may?.ctsDias && may?.ctsTotal) {
        // Verificar fórmula: [(3000 / 12) × 5] + [(3000 / 360) × 30]
        const expectedBase = (monthlyIncome / 12) * 5; // 5 meses trabajados
        const expectedDias = (monthlyIncome / 360) * 30; // 30 días en mayo
        const expectedTotal = expectedBase + expectedDias;

        expect(may.ctsBase).toBeCloseTo(expectedBase, 2);
        expect(may.ctsDias).toBeCloseTo(expectedDias, 2);
        expect(may.ctsTotal).toBeCloseTo(expectedTotal, 2);
      }
    });

    it('should calculate CTS correctly for different income levels', () => {
      const testCases = [
        { income: 2000, expectedBaseMay: 833.33, expectedDiasMay: 166.67 },
        { income: 4000, expectedBaseMay: 1666.67, expectedDiasMay: 333.33 },
        { income: 6000, expectedBaseMay: 2500, expectedDiasMay: 500 }
      ];

      testCases.forEach(({ income, expectedBaseMay, expectedDiasMay }) => {
        const result = calculator.calculate({
          year: 2025,
          monthlyIncome: income,
          additionalIncome: 0,
          additionalMonth: 12,
          calculationMonth: 1,
          previousRetentions: 0,
          roundingDecimals: 2,
          calculateCTS: true,
          startWorkMonth: 1
        });

        const may = result.monthlyCalculations.find(calc => calc.month === 5);
        expect(may?.cts).toBeGreaterThan(0);

        if (may?.ctsBase && may?.ctsDias) {
          expect(may.ctsBase).toBeCloseTo(expectedBaseMay, 2);
          expect(may.ctsDias).toBeCloseTo(expectedDiasMay, 2);
        }
      });
    });
  });

  describe('CTS Configuration Options', () => {
    it('should respect calculateCTS flag', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 3000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: false, // No calcular CTS
        startWorkMonth: 1
      });

      // Ningún mes debería tener CTS
      const monthsWithCTS = result.monthlyCalculations.filter(calc => calc.cts > 0);
      expect(monthsWithCTS).toHaveLength(0);
    });

    it('should use manual CTS when specified', () => {
      const manualCTS = 2500;
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 3000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: false,
        cts: manualCTS,
        ctsMonth: 6 // Solo en junio
      });

      // Junio debería tener el CTS manual
      const june = result.monthlyCalculations.find(calc => calc.month === 6);
      expect(june?.cts).toBe(manualCTS);

      // Otros meses no deberían tener CTS
      const otherMonths = result.monthlyCalculations.filter(calc => calc.month !== 6 && calc.cts > 0);
      expect(otherMonths).toHaveLength(0);
    });
  });

  describe('CTS Integration with Other Income Types', () => {
    it('should integrate CTS with gratificaciones correctly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 4000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: true,
        calculateGratificaciones: true,
        insuranceType: 'essalud',
        startWorkMonth: 1
      });

      // Mayo debería tener CTS y gratificaciones
      const may = result.monthlyCalculations.find(calc => calc.month === 5);
      expect(may?.cts).toBeGreaterThan(0);
      expect(may?.gratificaciones).toBe(0); // Julio y diciembre

      // Julio debería tener gratificaciones pero no CTS
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBeGreaterThan(0);
      expect(july?.cts).toBe(0);

      // Noviembre debería tener CTS pero no gratificaciones
      const november = result.monthlyCalculations.find(calc => calc.month === 11);
      expect(november?.cts).toBeGreaterThan(0);
      expect(november?.gratificaciones).toBe(0);

      // Diciembre debería tener gratificaciones pero no CTS
      const december = result.monthlyCalculations.find(calc => calc.month === 12);
      expect(december?.gratificaciones).toBeGreaterThan(0);
      expect(december?.cts).toBe(0);
    });

    it('should include CTS in total annual income', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: true,
        startWorkMonth: 1
      });

      // Verificar que el CTS esté incluido en el RBA
      expect(result.summary.totalCTS).toBeGreaterThan(0);
      expect(result.summary.totalAnnualIncome).toBeGreaterThan(5000 * 12); // Más que solo el sueldo base
    });
  });

  describe('CTS Edge Cases', () => {
    it('should handle zero income correctly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 0,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: true,
        startWorkMonth: 1
      });

      const may = result.monthlyCalculations.find(calc => calc.month === 5);
      expect(may?.cts).toBe(0);
      expect(may?.ctsBase).toBe(0);
      expect(may?.ctsDias).toBe(0);
    });

    it('should handle very high income correctly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 50000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateCTS: true,
        startWorkMonth: 1
      });

      const may = result.monthlyCalculations.find(calc => calc.month === 5);
      expect(may?.cts).toBeGreaterThan(0);
      
      if (may?.ctsBase && may?.ctsDias) {
        // Verificar que los cálculos sean razonables
        expect(may.ctsBase).toBeGreaterThan(20000); // (50000 / 12) × 5
        expect(may.ctsDias).toBeGreaterThan(4000); // (50000 / 360) × 30
      }
    });
  });
});
