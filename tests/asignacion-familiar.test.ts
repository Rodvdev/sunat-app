import { SunatCalculator } from '../src/lib/sunat-calculator';

describe('Asignación Familiar Tests', () => {
  let calculator: SunatCalculator;

  beforeEach(() => {
    calculator = new SunatCalculator();
  });

  describe('Asignación Familiar Calculation', () => {
    it('should calculate asignación familiar correctly for workers with children under 18', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 3000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: true,
        childrenCount: 2,
        childrenStudying: false
      });

      // Verificar que todos los meses tengan asignación familiar
      const monthsWithAsignacion = result.monthlyCalculations.filter(calc => calc.asignacionFamiliar > 0);
      expect(monthsWithAsignacion).toHaveLength(12); // Todos los meses

      // Verificar que el monto sea S/ 75.00 por mes
      const firstMonth = result.monthlyCalculations[0];
      expect(firstMonth.asignacionFamiliar).toBe(75.00);

      // Verificar el total anual
      expect(result.summary.totalAsignacionFamiliar).toBe(75.00 * 12); // S/ 900.00 anual
    });

    it('should calculate asignación familiar for workers with children studying after 18', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 4000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: false, // No tiene hijos menores de 18
        childrenCount: 0,
        childrenStudying: true // Pero tiene hijos estudiando después de 18
      });

      // Verificar que todos los meses tengan asignación familiar
      const monthsWithAsignacion = result.monthlyCalculations.filter(calc => calc.asignacionFamiliar > 0);
      expect(monthsWithAsignacion).toHaveLength(12); // Todos los meses

      // Verificar que el monto sea S/ 75.00 por mes
      const firstMonth = result.monthlyCalculations[0];
      expect(firstMonth.asignacionFamiliar).toBe(75.00);

      // Verificar el total anual
      expect(result.summary.totalAsignacionFamiliar).toBe(75.00 * 12); // S/ 900.00 anual
    });

    it('should not calculate asignación familiar for workers without children', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: false,
        childrenCount: 0,
        childrenStudying: false
      });

      // Verificar que ningún mes tenga asignación familiar
      const monthsWithAsignacion = result.monthlyCalculations.filter(calc => calc.asignacionFamiliar > 0);
      expect(monthsWithAsignacion).toHaveLength(0);

      // Verificar el total anual
      expect(result.summary.totalAsignacionFamiliar).toBe(0);
    });

    it('should respect calculateAsignacionFamiliar flag', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 3500,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: false, // No calcular asignación familiar
        hasChildren: true,
        childrenCount: 1,
        childrenStudying: false
      });

      // Verificar que ningún mes tenga asignación familiar aunque tenga hijos
      const monthsWithAsignacion = result.monthlyCalculations.filter(calc => calc.asignacionFamiliar > 0);
      expect(monthsWithAsignacion).toHaveLength(0);

      // Verificar el total anual
      expect(result.summary.totalAsignacionFamiliar).toBe(0);
    });
  });

  describe('Asignación Familiar Amount Validation', () => {
    it('should always be S/ 75.00 regardless of income level', () => {
      const testIncomes = [2000, 5000, 10000, 20000];

      testIncomes.forEach(income => {
        const result = calculator.calculate({
          year: 2025,
          monthlyIncome: income,
          additionalIncome: 0,
          additionalMonth: 12,
          calculationMonth: 1,
          previousRetentions: 0,
          roundingDecimals: 2,
          calculateAsignacionFamiliar: true,
          hasChildren: true,
          childrenCount: 1,
          childrenStudying: false
        });

        // Verificar que todos los meses tengan el mismo monto
        result.monthlyCalculations.forEach(month => {
          expect(month.asignacionFamiliar).toBe(75.00);
        });

        // Verificar el total anual
        expect(result.summary.totalAsignacionFamiliar).toBe(75.00 * 12);
      });
    });

    it('should be S/ 75.00 even for partial months worked', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 3000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 6, // Empezar en junio
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: true,
        childrenCount: 1,
        childrenStudying: false
      });

      // Verificar que los meses trabajados tengan asignación familiar completa
      const monthsWithAsignacion = result.monthlyCalculations.filter(calc => calc.asignacionFamiliar > 0);
      monthsWithAsignacion.forEach(month => {
        expect(month.asignacionFamiliar).toBe(75.00);
      });

      // Verificar el total anual (todos los meses del año)
      expect(result.summary.totalAsignacionFamiliar).toBe(75.00 * 12);
    });
  });

  describe('Asignación Familiar Integration', () => {
    it('should integrate with gratificaciones correctly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 4000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        calculateGratificaciones: true,
        hasChildren: true,
        childrenCount: 2,
        childrenStudying: false,
        insuranceType: 'essalud',
        startWorkMonth: 1
      });

      // Julio debería tener gratificaciones + asignación familiar (si inicia en enero)
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBeGreaterThan(0);
      expect(july?.asignacionFamiliar).toBe(75.00);

      // Diciembre debería tener gratificaciones + asignación familiar (si inicia en enero)
      const december = result.monthlyCalculations.find(calc => calc.month === 12);
      expect(december?.gratificaciones).toBeGreaterThan(0);
      expect(december?.asignacionFamiliar).toBe(75.00);

      // Verificar que el ingreso total del mes incluya ambos
      if (july && december) {
        expect(july.totalMonthlyIncome).toBe(4000 + july.gratificaciones + 75.00);
        expect(december.totalMonthlyIncome).toBe(4000 + december.gratificaciones + 75.00);
      }
    });

    it('should integrate with CTS correctly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        calculateCTS: true,
        hasChildren: true,
        childrenCount: 1,
        childrenStudying: false,
        startWorkMonth: 1
      });

      // Mayo debería tener CTS + asignación familiar (si inicia en enero)
      const may = result.monthlyCalculations.find(calc => calc.month === 5);
      expect(may?.cts).toBeGreaterThan(0);
      expect(may?.asignacionFamiliar).toBe(75.00);

      // Noviembre debería tener CTS + asignación familiar (si inicia en enero)
      const november = result.monthlyCalculations.find(calc => calc.month === 11);
      expect(november?.cts).toBeGreaterThan(0);
      expect(november?.asignacionFamiliar).toBe(75.00);
    });

    it('should be included in total annual income', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 6000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: true,
        childrenCount: 3,
        childrenStudying: false
      });

      // Verificar que esté incluido en el ingreso anual total
      expect(result.summary.totalAsignacionFamiliar).toBe(75.00 * 12); // S/ 900.00
      expect(result.summary.totalAnnualIncome).toBeGreaterThan(6000 * 12); // Más que solo el sueldo base
      
      // El ingreso anual incluye: sueldo + asignación familiar + gratificaciones + CTS
      const expectedIncome = (6000 * 12) + 900.00;
      expect(result.summary.totalAnnualIncome).toBeGreaterThan(expectedIncome);
    });
  });

  describe('Asignación Familiar Edge Cases', () => {
    it('should handle multiple children correctly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 7000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: true,
        childrenCount: 5, // 5 hijos
        childrenStudying: false
      });

      // Verificar que el monto siga siendo S/ 75.00 por mes (no se multiplica por número de hijos)
      const firstMonth = result.monthlyCalculations[0];
      expect(firstMonth.asignacionFamiliar).toBe(75.00);

      // Verificar el total anual
      expect(result.summary.totalAsignacionFamiliar).toBe(75.00 * 12);
    });

    it('should handle children studying after 18 correctly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 8000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: false,
        childrenCount: 0,
        childrenStudying: true // Hijos estudiando después de 18
      });

      // Verificar que reciba asignación familiar
      const firstMonth = result.monthlyCalculations[0];
      expect(firstMonth.asignacionFamiliar).toBe(75.00);

      // Verificar el total anual
      expect(result.summary.totalAsignacionFamiliar).toBe(75.00 * 12);
    });

    it('should handle both conditions (children under 18 and studying after 18)', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 9000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: true,
        childrenCount: 2,
        childrenStudying: true // También tiene hijos estudiando después de 18
      });

      // Verificar que reciba asignación familiar
      const firstMonth = result.monthlyCalculations[0];
      expect(firstMonth.asignacionFamiliar).toBe(75.00);

      // Verificar el total anual
      expect(result.summary.totalAsignacionFamiliar).toBe(75.00 * 12);
    });

    it('should handle zero income correctly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 0,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: true,
        childrenCount: 1,
        childrenStudying: false
      });

      // Verificar que aún reciba asignación familiar aunque no tenga ingresos
      const firstMonth = result.monthlyCalculations[0];
      expect(firstMonth.asignacionFamiliar).toBe(75.00);

      // Verificar el total anual
      expect(result.summary.totalAsignacionFamiliar).toBe(75.00 * 12);
    });
  });

  describe('Asignación Familiar Business Rules', () => {
    it('should be independent of other income types', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 10000,
        additionalIncome: 5000,
        additionalMonth: 6,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: true,
        childrenCount: 1,
        childrenStudying: false
      });

      // Verificar que todos los meses tengan asignación familiar
      result.monthlyCalculations.forEach(month => {
        expect(month.asignacionFamiliar).toBe(75.00);
      });

      // Verificar que el ingreso total del mes incluya asignación familiar
      const june = result.monthlyCalculations.find(calc => calc.month === 6);
      if (june) {
        expect(june.totalMonthlyIncome).toBe(10000 + 5000 + 75.00); // Sueldo + adicional + asignación familiar
      }
    });

    it('should be calculated monthly regardless of calculation start month', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 12000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 4, // Empezar cálculo en abril
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: true,
        childrenCount: 1,
        childrenStudying: false
      });

      // Verificar que los meses calculados tengan asignación familiar
      const calculatedMonths = result.monthlyCalculations.filter(calc => calc.month >= 4);
      calculatedMonths.forEach(month => {
        expect(month.asignacionFamiliar).toBe(75.00);
      });

      // Verificar el total anual (todos los meses del año)
      expect(result.summary.totalAsignacionFamiliar).toBe(75.00 * 12);
    });
  });
});
