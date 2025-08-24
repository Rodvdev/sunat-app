import { SunatCalculator } from '../src/lib/sunat-calculator';

describe('Gratificaciones Calculation Tests', () => {
  let calculator: SunatCalculator;

  beforeEach(() => {
    calculator = new SunatCalculator();
  });

  describe('EsSalud Gratificación Calculation', () => {
    it('should calculate gratificación correctly for EsSalud (9%) - Example 1 from documentation', () => {
      // Ejemplo 1: Mario trabaja desde enero, sueldo S/ 2,500, EsSalud
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 2500,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        insuranceType: 'essalud',
        startWorkMonth: 1,
        gratificaciones: 0, // No usar gratificación manual
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0
      });

      // Verificar gratificación de julio (7 meses trabajados: Enero a Julio)
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBe(3179.17); // (2,500 × 7) ÷ 6 + 9% = 2,916.67 + 262.50 = 3,179.17
      expect(july?.gratificacionBase).toBe(2916.67); // (2,500 × 7) ÷ 6 = 2,916.67
      expect(july?.gratificacionBono).toBe(262.50); // 2,916.67 × 0.09 = 262.50
      expect(july?.mesesTrabajados).toBe(7); // Enero a Julio = 7 meses

      // Verificar gratificación de diciembre (12 meses trabajados: Enero a Diciembre)
      const december = result.monthlyCalculations.find(calc => calc.month === 12);
      expect(december?.gratificaciones).toBe(5450); // S/ 5,450 (2,500 × 12 ÷ 6 + 9%)
      expect(december?.gratificacionBase).toBe(5000); // (2,500 × 12) ÷ 6 = 5,000
      expect(december?.gratificacionBono).toBe(450); // 5,000 × 0.09 = 450
      expect(december?.mesesTrabajados).toBe(12); // Enero a Diciembre = 12 meses

      // Verificar resumen
      expect(result.summary.totalGratificaciones).toBe(8629.17); // 3,179.17 + 5,450
      expect(result.summary.gratificacionesCalculadas.julio?.tipoSeguro).toBe('essalud');
      expect(result.summary.gratificacionesCalculadas.julio?.porcentajeSeguro).toBe(9);
      expect(result.summary.gratificacionesCalculadas.diciembre?.tipoSeguro).toBe('essalud');
      expect(result.summary.gratificacionesCalculadas.diciembre?.porcentajeSeguro).toBe(9);
    });

    it('should calculate gratificación correctly for mid-year start - Example 2 from documentation', () => {
      // Ejemplo 2: Lucia trabaja desde febrero, sueldo S/ 3,000, EPS
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 3000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        insuranceType: 'eps',
        startWorkMonth: 2, // Febrero
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0
      });

      // Verificar gratificación de julio (6 meses trabajados: Febrero a Julio)
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBe(3202.5); // (3,000 × 6) ÷ 6 + 6.75% = 3,000 + 202.5 = 3,202.5
      expect(july?.gratificacionBase).toBe(3000); // (3,000 × 6) ÷ 6 = 3,000
      expect(july?.gratificacionBono).toBe(202.5); // 3,000 × 0.0675 = 202.5
      expect(july?.mesesTrabajados).toBe(6); // Febrero a Julio = 6 meses

      // Verificar gratificación de diciembre (11 meses trabajados: Febrero a Diciembre)
      const december = result.monthlyCalculations.find(calc => calc.month === 12);
      expect(december?.gratificaciones).toBe(5871.25); // (3,000 × 11) ÷ 6 + 6.75% = 5,500 + 371.25 = 5,871.25
      expect(december?.gratificacionBase).toBe(5500); // (3,000 × 11) ÷ 6 = 5,500
      expect(december?.gratificacionBono).toBe(371.25); // 5,500 × 0.0675 = 371.25
      expect(december?.mesesTrabajados).toBe(11); // Febrero a Diciembre = 11 meses

      // Verificar resumen
      expect(result.summary.totalGratificaciones).toBe(9073.75); // 3,202.5 + 5,871.25
      expect(result.summary.gratificacionesCalculadas.julio?.tipoSeguro).toBe('eps');
      expect(result.summary.gratificacionesCalculadas.julio?.porcentajeSeguro).toBe(6.75);
      expect(result.summary.gratificacionesCalculadas.diciembre?.tipoSeguro).toBe('eps');
      expect(result.summary.gratificacionesCalculadas.diciembre?.porcentajeSeguro).toBe(6.75);
    });
  });

  describe('EPS Gratificación Calculation', () => {
    it('should calculate gratificación correctly for EPS (6.75%)', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 4000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        insuranceType: 'eps',
        startWorkMonth: 1,
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0
      });

      // Verificar gratificación de julio
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBe(4981.67); // (4,000 × 7) ÷ 6 + 6.75% = 4,666.67 + 315 = 4,981.67
      expect(july?.gratificacionBase).toBe(4666.67); // (4,000 × 7) ÷ 6 = 4,666.67
      expect(july?.gratificacionBono).toBe(315); // 4,666.67 × 0.0675 = 315
      expect(july?.mesesTrabajados).toBe(7);

      // Verificar gratificación de diciembre
      const december = result.monthlyCalculations.find(calc => calc.month === 12);
      expect(december?.gratificaciones).toBe(8540); // (4,000 × 12) ÷ 6 + 6.75% = 8,000 + 540 = 8,540
      expect(december?.gratificacionBase).toBe(8000); // (4,000 × 12) ÷ 6 = 8,000
      expect(december?.gratificacionBono).toBe(540); // 8,000 × 0.0675 = 540
      expect(december?.mesesTrabajados).toBe(12);
    });
  });

  describe('Custom Start Month Scenarios', () => {
    it('should calculate gratificación correctly for March start', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 3500,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        insuranceType: 'essalud',
        startWorkMonth: 3, // Marzo
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0
      });

      // Verificar gratificación de julio (5 meses trabajados: Marzo a Julio)
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBe(3179.17); // (3,500 × 5) ÷ 6 + 9% = 2,916.67 + 262.50 = 3,179.17
      expect(july?.mesesTrabajados).toBe(5);

      // Verificar gratificación de diciembre (10 meses trabajados: Marzo a Diciembre)
      const december = result.monthlyCalculations.find(calc => calc.month === 12);
      expect(december?.gratificaciones).toBe(6358.33); // (3,500 × 10) ÷ 6 + 9% = 5,833.33 + 525 = 6,358.33
      expect(december?.mesesTrabajados).toBe(10);
    });

    it('should calculate gratificación correctly for September start', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 6000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        insuranceType: 'eps',
        startWorkMonth: 9, // Septiembre
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0
      });

      // Verificar gratificación de diciembre (4 meses trabajados: Septiembre a Diciembre)
      const december = result.monthlyCalculations.find(calc => calc.month === 12);
      expect(december?.gratificaciones).toBe(4270); // (6,000 × 4) ÷ 6 + 6.75% = 4,000 + 270 = 4,270
      expect(december?.mesesTrabajados).toBe(4);

      // Julio no debería tener gratificación porque empezó en septiembre
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBe(0);
      expect(july?.mesesTrabajados).toBeUndefined(); // No hay cálculo de gratificación
    });
  });

  describe('Manual Gratificación Override', () => {
    it('should use manual gratificación when specified', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 3000,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        insuranceType: 'essalud',
        startWorkMonth: 1,
        gratificaciones: 5000, // Gratificación manual
        gratificacionesMonth: 7, // Solo en julio
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0
      });

      // Julio debería tener la gratificación manual
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBe(5000);
      expect(july?.gratificacionBase).toBeUndefined(); // No hay cálculo automático
      expect(july?.gratificacionBono).toBeUndefined();

      // Diciembre no debería tener gratificación
      const december = result.monthlyCalculations.find(calc => calc.month === 12);
      expect(december?.gratificaciones).toBe(0);

      // Resumen debería mostrar solo la gratificación manual
      expect(result.summary.totalGratificaciones).toBe(5000);
      expect(result.summary.gratificacionesCalculadas).toEqual({});
    });
  });

  describe('Integration with Other Income Types', () => {
    it('should integrate gratificación with other income types correctly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 4000,
        additionalIncome: 2000,
        additionalMonth: 6,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        insuranceType: 'essalud',
        startWorkMonth: 1,
        gratificaciones: 0,
        bonificaciones: 1500,
        bonificacionesMonth: 9,
        utilidades: 3000,
        utilidadesMonth: 12,
        cts: 2000,
        asignacionFamiliar: 102.50
      });

      // Verificar julio (gratificación automática)
      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBeGreaterThan(0);
      if (july) {
        expect(july.totalMonthlyIncome).toBe(4000 + 0 + 0 + 0 + 0 + 102.50 + july.gratificaciones);
      }

      // Verificar junio (ingreso adicional)
      const june = result.monthlyCalculations.find(calc => calc.month === 6);
      expect(june?.additionalIncome).toBe(2000);
      expect(june?.totalMonthlyIncome).toBe(4000 + 2000 + 0 + 0 + 0 + 102.50);

      // Verificar septiembre (bonificación)
      const september = result.monthlyCalculations.find(calc => calc.month === 9);
      expect(september?.bonificaciones).toBe(1500);
      expect(september?.totalMonthlyIncome).toBe(4000 + 0 + 0 + 1500 + 0 + 102.50);

      // Verificar diciembre (gratificación + utilidades)
      const december = result.monthlyCalculations.find(calc => calc.month === 12);
      expect(december?.gratificaciones).toBeGreaterThan(0);
      expect(december?.utilidades).toBe(3000);
      if (december) {
        expect(december.totalMonthlyIncome).toBe(4000 + 0 + 0 + 0 + 3000 + 102.50 + december.gratificaciones);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero income correctly', () => {
      const result = calculator.calculate({
        year: 2025,
        monthlyIncome: 0,
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        insuranceType: 'essalud',
        startWorkMonth: 1,
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0
      });

      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBe(0);
      expect(july?.gratificacionBase).toBe(0);
      expect(july?.gratificacionBono).toBe(0);
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
        insuranceType: 'essalud',
        startWorkMonth: 1,
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0
      });

      const july = result.monthlyCalculations.find(calc => calc.month === 7);
      expect(july?.gratificaciones).toBe(63583.33); // (50,000 × 7) ÷ 6 + 9% = 58,333.33 + 5,250 = 63,583.33
      expect(july?.gratificacionBase).toBe(58333.33);
      expect(july?.gratificacionBono).toBe(5250);
    });
  });
});
