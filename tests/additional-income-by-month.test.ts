import { SunatCalculator } from '../src/lib/sunat-calculator';

describe('Additional Income By Month', () => {
  let calculator: SunatCalculator;

  beforeEach(() => {
    calculator = new SunatCalculator();
  });

  test('should calculate additional income for multiple months', () => {
    const result = calculator.calculate({
      year: 2025,
      monthlyIncome: 5000,
      additionalIncomeByMonth: [
        { month: 3, amount: 2000 },
        { month: 6, amount: 3000 },
        { month: 9, amount: 1500 }
      ],
      additionalIncome: 0, // Legacy field
      additionalMonth: 12, // Legacy field
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2,
      calculateGratificaciones: false,
      calculateCTS: false,
      calculateAsignacionFamiliar: false
    });

    // Verificar que los ingresos adicionales se aplican en los meses correctos
    const march = result.monthlyCalculations.find(m => m.month === 3);
    const june = result.monthlyCalculations.find(m => m.month === 6);
    const september = result.monthlyCalculations.find(m => m.month === 9);
    const december = result.monthlyCalculations.find(m => m.month === 12);

    expect(march?.additionalIncome).toBe(2000);
    expect(june?.additionalIncome).toBe(3000);
    expect(september?.additionalIncome).toBe(1500);
    expect(december?.additionalIncome).toBe(0); // No debería tener ingreso adicional

    // Verificar el total de ingresos adicionales
    expect(result.summary.totalAdditionalIncome).toBe(6500); // 2000 + 3000 + 1500
  });

  test('should handle empty additional income by month', () => {
    const result = calculator.calculate({
      year: 2025,
      monthlyIncome: 5000,
      additionalIncomeByMonth: [],
      additionalIncome: 0,
      additionalMonth: 12,
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2,
      calculateGratificaciones: false,
      calculateCTS: false,
      calculateAsignacionFamiliar: false
    });

    // Verificar que no hay ingresos adicionales
    const allMonths = result.monthlyCalculations;
    allMonths.forEach(month => {
      expect(month.additionalIncome).toBe(0);
    });

    expect(result.summary.totalAdditionalIncome).toBe(0);
  });

  test('should calculate total annual income correctly with monthly additional income', () => {
    const result = calculator.calculate({
      year: 2025,
      monthlyIncome: 5000,
      additionalIncomeByMonth: [
        { month: 3, amount: 2000 },
        { month: 6, amount: 3000 },
        { month: 9, amount: 1500 }
      ],
      additionalIncome: 0,
      additionalMonth: 12,
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2,
      calculateGratificaciones: false,
      calculateCTS: false,
      calculateAsignacionFamiliar: false
    });

    // Ingreso base anual: 5000 * 12 = 60000
    // Ingresos adicionales: 2000 + 3000 + 1500 = 6500
    // Total esperado: 60000 + 6500 = 66500
    expect(result.summary.totalAnnualIncome).toBe(66500);
  });

  test('should handle multiple additional income entries for the same month', () => {
    const result = calculator.calculate({
      year: 2025,
      monthlyIncome: 5000,
      additionalIncomeByMonth: [
        { month: 3, amount: 2000 },
        { month: 3, amount: 1000 }, // Segundo ingreso para el mismo mes
        { month: 6, amount: 3000 }
      ],
      additionalIncome: 0,
      additionalMonth: 12,
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2,
      calculateGratificaciones: false,
      calculateCTS: false,
      calculateAsignacionFamiliar: false
    });

    // El primer valor debería mantenerse (no se sobrescribe)
    const march = result.monthlyCalculations.find(m => m.month === 3);
    expect(march?.additionalIncome).toBe(2000); // Se mantiene el primer valor

    // Total: 2000 + 3000 = 5000
    expect(result.summary.totalAdditionalIncome).toBe(5000);
  });
});
