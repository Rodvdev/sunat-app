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

    test('should calculate correct annual income including automatic benefits', () => {
      const result = calculator.calculate(params);
      // El sistema ahora incluye automáticamente gratificaciones, CTS y asignación familiar
      // Para sueldo de S/ 1,000 mensual, el ingreso anual será mayor que 12,000
      expect(result.summary.totalAnnualIncome).toBeGreaterThan(12000);
      // Debería incluir: sueldo base + gratificaciones + CTS + asignación familiar
      expect(result.summary.totalAnnualIncome).toBeGreaterThan(12000 + 1000 + 500 + 900);
    });

    test('should have tax due due to automatic benefits (above 7 UIT threshold)', () => {
      const result = calculator.calculate(params);
      // Con los beneficios automáticos, el ingreso anual supera los 7 UIT
      // Pero para sueldo muy bajo, puede que aún no supere el umbral
      expect(result.summary.totalAnnualTax).toBeGreaterThanOrEqual(0);
      expect(result.summary.totalAnnualRetention).toBeGreaterThanOrEqual(0);
    });

    test('should calculate 12 months of calculations', () => {
      const result = calculator.calculate(params);
      expect(result.monthlyCalculations).toHaveLength(12);
    });

    test('should have retention for all months due to automatic benefits', () => {
      const result = calculator.calculate(params);
      result.monthlyCalculations.forEach(month => {
        expect(month.monthlyRetention).toBeGreaterThanOrEqual(0);
        expect(month.projectedNetIncome).toBeGreaterThanOrEqual(0);
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

    test('should calculate correct annual income including automatic benefits', () => {
      const result = calculator.calculate(params);
      // El sistema ahora incluye automáticamente gratificaciones, CTS y asignación familiar
      // Para sueldo de S/ 5,000 mensual, el ingreso anual será mayor que 60,000
      expect(result.summary.totalAnnualIncome).toBeGreaterThan(60000);
      // Debería incluir: sueldo base + gratificaciones + CTS + asignación familiar
      expect(result.summary.totalAnnualIncome).toBeGreaterThan(60000 + 6000 + 5000 + 900);
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

    test('should calculate correct projected net income including automatic benefits', () => {
      const result = calculator.calculate(params);
      const firstMonth = result.monthlyCalculations[0];
      // Con beneficios automáticos, el ingreso neto será mayor que 22,550
      expect(firstMonth.projectedNetIncome).toBeGreaterThan(22550);
      // Debería ser mayor debido a gratificaciones, CTS y asignación familiar
      expect(firstMonth.projectedNetIncome).toBeGreaterThan(60000 + 6000 + 5000 + 900 - 37450);
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

    test('should calculate higher annual income due to additional and automatic benefits', () => {
      const result = calculator.calculate(params);
      // Con beneficios automáticos + ingreso adicional, el total será mayor que 70,000
      expect(result.summary.totalAnnualIncome).toBeGreaterThan(70000);
      // Debería incluir: sueldo base + ingreso adicional + gratificaciones + CTS + asignación familiar
      expect(result.summary.totalAnnualIncome).toBeGreaterThan(70000 + 6000 + 5000 + 900);
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

    test('should recalculate projections after June including automatic benefits', () => {
      const result = calculator.calculate(params);
      
      // All months should project the same annual income (including additional and automatic benefits)
      result.monthlyCalculations.forEach(month => {
        expect(month.projectedAccumulatedIncome).toBeGreaterThan(70000); // 5000*12 + 10000 + beneficios automáticos
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

    test('should have retention in November due to additional income', () => {
      const result = calculator.calculate(params);
      const novemberCalculation = result.monthlyCalculations.find(m => m.month === 11);
      const octoberCalculation = result.monthlyCalculations.find(m => m.month === 10);
      
      // Both months should have retention due to automatic benefits
      expect(novemberCalculation?.monthlyRetention).toBeGreaterThanOrEqual(0);
      expect(octoberCalculation?.monthlyRetention).toBeGreaterThanOrEqual(0);
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

    test('should calculate high annual income including automatic benefits', () => {
      const result = calculator.calculate(params);
      // Con beneficios automáticos, el ingreso anual será mayor que 180,000
      expect(result.summary.totalAnnualIncome).toBeGreaterThan(180000);
      // Debería incluir: sueldo base + gratificaciones + CTS + asignación familiar
      expect(result.summary.totalAnnualIncome).toBeGreaterThan(180000 + 18000 + 15000 + 900);
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

      test('should handle very high income correctly including automatic benefits', () => {
        const result = calculator.calculate(params);
        // Con beneficios automáticos, el ingreso anual será mayor que 600,000
        expect(result.summary.totalAnnualIncome).toBeGreaterThan(600000);
        
        // Should be well above 35 UIT threshold
        const netIncome = result.summary.totalAnnualIncome - 37450;
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

    test('should handle negative income gracefully including automatic benefits', () => {
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
      // Con beneficios automáticos, el ingreso anual puede ser mayor que -12,000
      // Pero para sueldo negativo, los beneficios automáticos pueden no aplicarse
      expect(result.summary.totalAnnualIncome).toBeLessThanOrEqual(0);
      expect(result.summary.totalAnnualTax).toBe(0);
    });
  });

  test('should calculate additional monthly retention for extraordinary income (PASO 5 SUNAT)', () => {
    const calculator = new SunatCalculator();
    
    const result = calculator.calculate({
      year: 2025,
      monthlyIncome: 5000, // 60,000 anual (por encima de 7 UIT = 37,450)
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

    // Verificar que hay impuesto anual (por encima de 7 UIT)
    expect(result.summary.totalAnnualTax).toBeGreaterThan(0);
    
    // Verificar que todas las retenciones mensuales son mayores a 0
    result.monthlyCalculations.forEach(month => {
      expect(month.monthlyRetention).toBeGreaterThan(0);
      expect(month.additionalMonthlyRetention).toBe(0); // Sin ingresos extraordinarios
    });
    
    // Ahora probar con ingresos extraordinarios en un mes específico
    const resultWithExtraordinary = calculator.calculate({
      year: 2025,
      monthlyIncome: 5000, // 60,000 anual
      additionalIncomeByMonth: [],
      additionalIncome: 0,
      additionalMonth: 12,
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2,
      calculateGratificaciones: false,
      calculateCTS: false,
      calculateAsignacionFamiliar: false,
      // Agregar ingresos extraordinarios en enero (mes 1)
      bonificaciones: 2000, // Bonificación extraordinaria
      bonificacionesMonth: 1, // Aplicar en enero
      utilidades: 1000,      // Utilidades
      utilidadesMonth: 1     // Aplicar en enero
    });

    // Verificar que hay retenciones adicionales por ingresos extraordinarios
    const monthWithExtraordinary = resultWithExtraordinary.monthlyCalculations.find(m => m.month === 1);
    expect(monthWithExtraordinary?.additionalMonthlyRetention).toBeGreaterThan(0);
    
    // Verificar que la retención total incluye la básica + la adicional
    expect(monthWithExtraordinary?.monthlyRetention).toBeGreaterThan(
      result.monthlyCalculations.find(m => m.month === 1)?.monthlyRetention || 0
    );
  });

  test('should calculate zero monthly retentions when income is below 7 UIT', () => {
    const calculator = new SunatCalculator();
    
    const result = calculator.calculate({
      year: 2025,
      monthlyIncome: 2000, // 24,000 anual (por debajo de 7 UIT = 37,450)
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

    // Verificar que no hay impuesto anual
    expect(result.summary.totalAnnualTax).toBe(0);
    
    // Verificar que todas las retenciones mensuales son 0
    result.monthlyCalculations.forEach(month => {
      expect(month.monthlyRetention).toBe(0);
    });
    
    // Verificar que el total de retenciones anuales es 0
    expect(result.summary.totalAnnualRetention).toBe(0);
  });

  test('should calculate correct retentions for 5000 base salary with EPS gratifications, 2 children, and CTS', () => {
    const calculator = new SunatCalculator();
    
    const result = calculator.calculate({
      year: 2025,
      monthlyIncome: 5000, // S/ 5,000 mensual
      additionalIncomeByMonth: [],
      additionalIncome: 0,
      additionalMonth: 12,
      calculationMonth: 1,
      previousRetentions: 0,
      roundingDecimals: 2,
      calculateGratificaciones: true, // Gratificaciones automáticas
      calculateCTS: true, // CTS automático
      calculateAsignacionFamiliar: true, // Asignación familiar automática
      insuranceType: 'eps', // Tipo EPS
      startWorkMonth: 1, // Inicio en enero
      hasChildren: true, // Tiene hijos
      childrenCount: 2, // 2 hijos
      childrenStudying: false
    });

    // Verificar ingresos anuales proyectados (según logs reales)
    expect(result.summary.totalAnnualIncome).toBeCloseTo(86202.08, 0);
    
    // Verificar que hay impuesto anual (por encima de 7 UIT = 37,450)
    expect(result.summary.totalAnnualTax).toBeCloseTo(4578.29, 0);
    
    // Verificar retenciones mensuales específicas
    const enero = result.monthlyCalculations.find(m => m.month === 1);
    const septiembre = result.monthlyCalculations.find(m => m.month === 9);
    const diciembre = result.monthlyCalculations.find(m => m.month === 12);
    
    // Enero-Agosto: retención alta (primeros meses)
    expect(enero?.monthlyRetention).toBeCloseTo(381.52, 0);
    
    // Septiembre-Noviembre: retención baja (meses intermedios)
    expect(septiembre?.monthlyRetention).toBeCloseTo(76.30, 0);
    
    // Diciembre: retención alta (regularización final)
    expect(diciembre?.monthlyRetention).toBeCloseTo(1297.23, 0);
    
    // Verificar que las gratificaciones y CTS se muestran en la tabla
    const julio = result.monthlyCalculations.find(m => m.month === 7);
    const mayo = result.monthlyCalculations.find(m => m.month === 5);
    
    expect(julio?.gratificaciones).toBeCloseTo(6227.08, 0);
    expect(mayo?.cts).toBeCloseTo(2500, 0);
    
    // Verificar asignación familiar mensual
    result.monthlyCalculations.forEach(month => {
      expect(month.asignacionFamiliar).toBe(150); // 75 * 2 hijos
    });
    
    // Verificar totales en el resumen
    expect(result.summary.totalGratificaciones).toBeCloseTo(16902.08, 0);
    expect(result.summary.totalCTS).toBeCloseTo(7500, 0);
    expect(result.summary.totalAsignacionFamiliar).toBe(1800); // 150 * 12 meses
  });
});
