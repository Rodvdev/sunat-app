import { SunatCalculator } from '../src/lib/sunat-calculator';

describe('Additional Income Types Tests', () => {
  let calculator: SunatCalculator;

  beforeEach(() => {
    calculator = new SunatCalculator();
  });

  describe('Gratificaciones Calculation', () => {
    it('should calculate gratificaciones in July and December by default', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        gratificaciones: 5000, // S/ 5,000 de gratificación
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0
      });

      // Verificar que julio y diciembre tienen gratificaciones
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      const december = result.monthlyCalculations.find(calc => calc.month === 12);

      expect(july?.gratificaciones).toBeGreaterThan(0);
      expect(december?.gratificaciones).toBeGreaterThan(0);
      if (july && december) {
        expect(july.totalMonthlyIncome).toBe(5000 + july.gratificaciones);
        expect(december.totalMonthlyIncome).toBe(5000 + december.gratificaciones);
      }

      // Verificar que otros meses no tienen gratificaciones
      const march = result.monthlyCalculations.find(calc => calc.month === 3);
      expect(march?.gratificaciones).toBe(0);
      expect(march?.totalMonthlyIncome).toBe(5000); // Solo salario base
    });

    it('should allow custom gratificaciones month', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        gratificaciones: 3000,
        gratificacionesMonth: 6, // Junio
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0
      });

      const june = result.monthlyCalculations.find(calc => calc.month === 6);
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      const december = result.monthlyCalculations.find(calc => calc.month === 12);

      expect(june?.gratificaciones).toBe(3000);
      expect(july?.gratificaciones).toBe(0); // No en julio por defecto
      expect(december?.gratificaciones).toBe(0); // No en diciembre por defecto
    });
  });

  describe('CTS Calculation', () => {
    it('should calculate CTS in May and November by default', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 2000, // S/ 2,000 de CTS
        asignacionFamiliar: 0
      });

      const may = result.monthlyCalculations.find(calc => calc.month === 5);
      const november = result.monthlyCalculations.find(calc => calc.month === 11);

      expect(may?.cts).toBeGreaterThan(0);
      expect(november?.cts).toBeGreaterThan(0);
      if (may && november) {
        expect(may.totalMonthlyIncome).toBe(5000 + may.cts);
        expect(november.totalMonthlyIncome).toBe(5000 + november.cts);
      }
    });

    it('should allow custom CTS month', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 1500,
        ctsMonth: 8, // Agosto
        asignacionFamiliar: 0
      });

      const august = result.monthlyCalculations.find(calc => calc.month === 8);
      const may = result.monthlyCalculations.find(calc => calc.month === 5);
      const november = result.monthlyCalculations.find(calc => calc.month === 11);

      expect(august?.cts).toBe(1500);
      expect(may?.cts).toBe(0);
      expect(november?.cts).toBe(0);
    });
  });

  describe('Asignación Familiar', () => {
    it('should calculate asignación familiar monthly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 102.50 // S/ 102.50 mensual
      });

      // Verificar que todos los meses tienen asignación familiar
      result.monthlyCalculations.forEach(calc => {
        expect(calc.asignacionFamiliar).toBe(102.50);
        // El ingreso total incluye: sueldo + asignación familiar + gratificaciones/CTS si aplica
        expect(calc.totalMonthlyIncome).toBeGreaterThanOrEqual(5000 + 102.50);
      });
    });
  });

  describe('Combined Additional Income Types', () => {
    it('should calculate all income types correctly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 1000,
        additionalMonth: 6,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        gratificaciones: 5000,
        bonificaciones: 2000,
        bonificacionesMonth: 9,
        utilidades: 3000,
        utilidadesMonth: 12,
        cts: 2000,
        asignacionFamiliar: 102.50
      });

      // Verificar junio (ingreso adicional)
      const june = result.monthlyCalculations.find(calc => calc.month === 6);
      expect(june?.additionalIncome).toBe(1000);
      expect(june?.totalMonthlyIncome).toBe(6102.50); // 5000 + 1000 + 102.50

      // Verificar julio (gratificación)
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBeGreaterThan(0);
      if (july) {
        expect(july.totalMonthlyIncome).toBe(5000 + july.gratificaciones + 102.50);
      }

      // Verificar septiembre (bonificación)
      const september = result.monthlyCalculations.find(calc => calc.month === 9);
      expect(september?.bonificaciones).toBe(2000);
      expect(september?.totalMonthlyIncome).toBe(7102.50); // 5000 + 2000 + 102.50

      // Verificar noviembre (CTS)
      const november = result.monthlyCalculations.find(calc => calc.month === 11);
      expect(november?.cts).toBeGreaterThan(0);
      if (november) {
        expect(november.totalMonthlyIncome).toBe(5000 + november.cts + 102.50);
      }

      // Verificar diciembre (utilidades)
      const december = result.monthlyCalculations.find(calc => calc.month === 12);
      expect(december?.utilidades).toBe(3000);
      expect(december?.gratificaciones).toBeGreaterThan(0);
      if (december) {
        expect(december.totalMonthlyIncome).toBe(5000 + 3000 + december.gratificaciones + 102.50);
      }
    });

    it('should include all income types in annual total', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 1000,
        additionalMonth: 6,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: true,
        childrenCount: 1,
        childrenStudying: false,
        gratificaciones: 5000,
        bonificaciones: 2000,
        bonificacionesMonth: 9,
        utilidades: 3000,
        utilidadesMonth: 12,
        cts: 2000,
        asignacionFamiliar: 102.50
      });

      // El sistema calcula automáticamente gratificaciones y CTS
      expect(result.summary.totalAnnualIncome).toBeGreaterThan((5000 * 12) + 1000 + 2000 + 3000 + (102.50 * 12));
      expect(result.summary.totalGratificaciones).toBeGreaterThan(0); // Julio y Diciembre
      expect(result.summary.totalBonificaciones).toBe(2000);
      expect(result.summary.totalUtilidades).toBe(3000);
      expect(result.summary.totalCTS).toBeGreaterThan(0); // Mayo y Noviembre
      expect(result.summary.totalAsignacionFamiliar).toBe(102.50 * 12);
      expect(result.summary.totalAdditionalIncome).toBeGreaterThan(1000 + 2000 + 3000 + (102.50 * 12));
    });
  });

  describe('Observations and Documentation', () => {
    it('should include correct observations for each income type', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 5000,
        additionalIncome: 1000,
        additionalMonth: 6,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        calculateAsignacionFamiliar: true,
        hasChildren: true,
        childrenCount: 1,
        childrenStudying: false,
        gratificaciones: 5000,
        bonificaciones: 2000,
        bonificacionesMonth: 9,
        utilidades: 3000,
        utilidadesMonth: 12,
        cts: 2000,
        asignacionFamiliar: 102.50
      });

      // Verificar observaciones en junio
      const june = result.monthlyCalculations.find(calc => calc.month === 6);
      expect(june?.observations).toContain('Ingreso adicional');

      // Verificar observaciones en julio
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.observations).toContain('Gratificación');

      // Verificar observaciones en septiembre
      const september = result.monthlyCalculations.find(calc => calc.month === 9);
      expect(september?.observations).toContain('Bonificación');

      // Verificar observaciones en noviembre
      const november = result.monthlyCalculations.find(calc => calc.month === 11);
      expect(november?.observations).toContain('CTS');

      // Verificar observaciones en diciembre
      const december = result.monthlyCalculations.find(calc => calc.month === 12);
      expect(december?.observations).toContain('Gratificación');
      expect(december?.observations).toContain('Utilidades');

      // Verificar que todos los meses tienen asignación familiar
      result.monthlyCalculations.forEach(calc => {
        expect(calc.observations).toContain('Asignación Familiar');
      });
    });
  });
});
