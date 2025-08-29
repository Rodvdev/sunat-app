import { SunatCalculator } from '../src/lib/sunat-calculator';

describe('SunatCalculator - Recálculo de RBA por Ingresos Adicionales', () => {
  let calculator: SunatCalculator;

  beforeEach(() => {
    calculator = new SunatCalculator();
  });

  describe('Recálculo de RBA cuando se reciben ingresos adicionales', () => {
    it('debe recalcular la RBA a partir del mes del ingreso adicional', () => {
      const params = {
        year: 2025,
        monthlyIncome: 5000, // S/ 5,000 mensual
        additionalIncomeByMonth: [
          { month: 6, amount: 10000 } // Ingreso adicional de S/ 10,000 en junio
        ],
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1, // Empezar desde enero
        previousRetentions: 0,
        roundingDecimals: 2,
        deductibleExpenses: {
          restaurants: 0,
          medicalServices: 0,
          professionalServices: 0,
          rentalProperties: 0,
          essaludContributions: 0
        },
        // Configuración básica
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0,
        calculateGratificaciones: false,
        calculateCTS: false,
        calculateAsignacionFamiliar: false,
        insuranceType: 'essalud' as const,
        startWorkMonth: 1,
        hasChildren: false,
        childrenCount: 0,
        childrenStudying: false,
        isLimitedContract: false,
        isPublicSectorWorker: false,
        receivesSchoolingBonus: false,
        isJudicialWorker: false,
        donations: 0,
        previousTaxCredits: 0,
        previousTaxPayments: 0,
        previousTaxRefunds: 0,
        isOnlyFifthCategoryIncome: false
      };

      const result = calculator.calculate(params);

      // Verificar que hay cálculos mensuales
      expect(result.monthlyCalculations).toHaveLength(12);

      // Verificar que la RBA se recalcula en junio (mes 6)
      const junioCalculation = result.monthlyCalculations.find(calc => calc.month === 6);
      expect(junioCalculation).toBeDefined();
      expect(junioCalculation!.additionalIncome).toBe(10000);

      // Verificar que la RBA proyectada cambia en junio
      const eneroCalculation = result.monthlyCalculations.find(calc => calc.month === 1);
      const junioCalculation2 = result.monthlyCalculations.find(calc => calc.month === 6);
      const diciembreCalculation = result.monthlyCalculations.find(calc => calc.month === 12);
      
      expect(eneroCalculation).toBeDefined();
      expect(junioCalculation2).toBeDefined();
      expect(diciembreCalculation).toBeDefined();

      // La RBA original (sin ingreso adicional) debería ser menor que la recalculada en junio
      const rbaOriginal = eneroCalculation!.projectedAccumulatedIncome;
      const rbaJunio = junioCalculation2!.projectedAccumulatedIncome;
      const rbaDiciembre = diciembreCalculation!.projectedAccumulatedIncome;
      
      // La RBA recalculada en junio debería ser mayor debido al ingreso adicional
      expect(rbaJunio).toBeGreaterThan(rbaOriginal);
      
      // La RBA en diciembre debería ser igual a la de junio (ya que no hay más ingresos adicionales)
      expect(rbaDiciembre).toBe(rbaJunio);
    });

    it('debe ajustar las retenciones mensuales a partir del mes del ingreso adicional', () => {
      const params = {
        year: 2025,
        monthlyIncome: 8000, // S/ 8,000 mensual (supera 7 UIT)
        additionalIncomeByMonth: [
          { month: 4, amount: 15000 } // Ingreso adicional de S/ 15,000 en abril
        ],
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        deductibleExpenses: {
          restaurants: 1000,
          medicalServices: 2000,
          professionalServices: 0,
          rentalProperties: 0,
          essaludContributions: 0
        },
        // Configuración básica
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0,
        calculateGratificaciones: false,
        calculateCTS: false,
        calculateAsignacionFamiliar: false,
        insuranceType: 'essalud' as const,
        startWorkMonth: 1,
        hasChildren: false,
        childrenCount: 0,
        childrenStudying: false,
        isLimitedContract: false,
        isPublicSectorWorker: false,
        receivesSchoolingBonus: false,
        isJudicialWorker: false,
        donations: 0,
        previousTaxCredits: 0,
        previousTaxPayments: 0,
        previousTaxRefunds: 0,
        isOnlyFifthCategoryIncome: false
      };

      const result = calculator.calculate(params);

      // Verificar que hay cálculos mensuales
      expect(result.monthlyCalculations).toHaveLength(12);

      // Verificar que la retención mensual cambia a partir de abril
      const marzoCalculation = result.monthlyCalculations.find(calc => calc.month === 3);
      const abrilCalculation = result.monthlyCalculations.find(calc => calc.month === 4);
      const mayoCalculation = result.monthlyCalculations.find(calc => calc.month === 5);

      expect(marzoCalculation).toBeDefined();
      expect(abrilCalculation).toBeDefined();
      expect(mayoCalculation).toBeDefined();

      // La retención mensual debería ser diferente después del ingreso adicional
      const retencionMarzo = marzoCalculation!.monthlyRetention;
      const retencionAbril = abrilCalculation!.monthlyRetention;
      const retencionMayo = mayoCalculation!.monthlyRetention;

      // Verificar que las retenciones se ajustan debido al ingreso adicional
      expect(retencionAbril).toBeGreaterThan(0);
      expect(retencionMayo).toBeGreaterThan(0);
    });

    it('debe manejar múltiples ingresos adicionales en diferentes meses', () => {
      const params = {
        year: 2025,
        monthlyIncome: 6000, // S/ 6,000 mensual
        additionalIncomeByMonth: [
          { month: 3, amount: 8000 },  // Ingreso adicional de S/ 8,000 en marzo
          { month: 7, amount: 12000 }, // Ingreso adicional de S/ 12,000 en julio
          { month: 10, amount: 6000 }  // Ingreso adicional de S/ 6,000 en octubre
        ],
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        deductibleExpenses: {
          restaurants: 0,
          medicalServices: 0,
          professionalServices: 0,
          rentalProperties: 0,
          essaludContributions: 0
        },
        // Configuración básica
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0,
        calculateGratificaciones: false,
        calculateCTS: false,
        calculateAsignacionFamiliar: false,
        insuranceType: 'essalud' as const,
        startWorkMonth: 1,
        hasChildren: false,
        childrenCount: 0,
        childrenStudying: false,
        isLimitedContract: false,
        isPublicSectorWorker: false,
        receivesSchoolingBonus: false,
        isJudicialWorker: false,
        donations: 0,
        previousTaxCredits: 0,
        previousTaxPayments: 0,
        previousTaxRefunds: 0,
        isOnlyFifthCategoryIncome: false
      };

      const result = calculator.calculate(params);

      // Verificar que hay cálculos mensuales
      expect(result.monthlyCalculations).toHaveLength(12);

      // Verificar que cada mes con ingreso adicional tiene el monto correcto
      const marzoCalculation = result.monthlyCalculations.find(calc => calc.month === 3);
      const julioCalculation = result.monthlyCalculations.find(calc => calc.month === 7);
      const octubreCalculation = result.monthlyCalculations.find(calc => calc.month === 10);

      expect(marzoCalculation!.additionalIncome).toBe(8000);
      expect(julioCalculation!.additionalIncome).toBe(12000);
      expect(octubreCalculation!.additionalIncome).toBe(6000);

      // Verificar que la RBA se recalcula progresivamente
      const rbaEnero = result.monthlyCalculations.find(calc => calc.month === 1)!.projectedAccumulatedIncome;
      const rbaMarzo = marzoCalculation!.projectedAccumulatedIncome;
      const rbaJulio = julioCalculation!.projectedAccumulatedIncome;
      const rbaOctubre = octubreCalculation!.projectedAccumulatedIncome;
      const rbaDiciembre = result.monthlyCalculations.find(calc => calc.month === 12)!.projectedAccumulatedIncome;

      // La RBA debería aumentar progresivamente con cada ingreso adicional
      expect(rbaMarzo).toBeGreaterThan(rbaEnero);
      expect(rbaJulio).toBeGreaterThan(rbaMarzo);
      expect(rbaOctubre).toBeGreaterThan(rbaJulio);
      expect(rbaDiciembre).toBe(rbaOctubre); // Diciembre debería ser igual a octubre (último ingreso adicional)
    });

    it('debe calcular correctamente el impuesto anual recalculado', () => {
      const params = {
        year: 2025,
        monthlyIncome: 10000, // S/ 10,000 mensual (supera 7 UIT)
        additionalIncomeByMonth: [
          { month: 5, amount: 20000 } // Ingreso adicional de S/ 20,000 en mayo
        ],
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        deductibleExpenses: {
          restaurants: 2000,
          medicalServices: 3000,
          professionalServices: 1000,
          rentalProperties: 0,
          essaludContributions: 0
        },
        // Configuración básica
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0,
        calculateGratificaciones: false,
        calculateCTS: false,
        calculateAsignacionFamiliar: false,
        insuranceType: 'essalud' as const,
        startWorkMonth: 1,
        hasChildren: false,
        childrenCount: 0,
        childrenStudying: false,
        isLimitedContract: false,
        isPublicSectorWorker: false,
        receivesSchoolingBonus: false,
        isJudicialWorker: false,
        donations: 0,
        previousTaxCredits: 0,
        previousTaxPayments: 0,
        previousTaxRefunds: 0,
        isOnlyFifthCategoryIncome: false
      };

      const result = calculator.calculate(params);

      // Verificar que hay cálculos mensuales
      expect(result.monthlyCalculations).toHaveLength(12);

      // Verificar que el impuesto anual se recalcula en mayo
      const abrilCalculation = result.monthlyCalculations.find(calc => calc.month === 4);
      const mayoCalculation = result.monthlyCalculations.find(calc => calc.month === 5);
      const junioCalculation = result.monthlyCalculations.find(calc => calc.month === 6);

      expect(abrilCalculation).toBeDefined();
      expect(mayoCalculation).toBeDefined();
      expect(junioCalculation).toBeDefined();

      // El impuesto anual proyectado debería cambiar a partir de mayo
      const impuestoAbril = abrilCalculation!.projectedTax;
      const impuestoMayo = mayoCalculation!.projectedTax;
      const impuestoJunio = junioCalculation!.projectedTax;

      // El impuesto debería ser mayor después del ingreso adicional
      expect(impuestoMayo).toBeGreaterThan(impuestoAbril);
      expect(impuestoJunio).toBe(impuestoMayo); // Debería mantenerse igual
    });

    it('debe calcular retenciones adicionales proporcionales y no excesivas', () => {
      const params = {
        year: 2025,
        monthlyIncome: 5000, // S/ 5,000 mensual
        additionalIncomeByMonth: [
          { month: 6, amount: 10000 } // Ingreso adicional de S/ 10,000 en junio
        ],
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        deductibleExpenses: {
          restaurants: 0,
          medicalServices: 0,
          professionalServices: 0,
          rentalProperties: 0,
          essaludContributions: 0
        },
        // Configuración básica
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0,
        calculateGratificaciones: false,
        calculateCTS: false,
        calculateAsignacionFamiliar: false,
        insuranceType: 'essalud' as const,
        startWorkMonth: 1,
        hasChildren: false,
        childrenCount: 0,
        childrenStudying: false,
        isLimitedContract: false,
        isPublicSectorWorker: false,
        receivesSchoolingBonus: false,
        isJudicialWorker: false,
        donations: 0,
        previousTaxCredits: 0,
        previousTaxPayments: 0,
        previousTaxRefunds: 0,
        isOnlyFifthCategoryIncome: false
      };

      const result = calculator.calculate(params);

      // Verificar que hay cálculos mensuales
      expect(result.monthlyCalculations).toHaveLength(12);

      // Verificar que junio tiene el ingreso adicional
      const junioCalculation = result.monthlyCalculations.find(calc => calc.month === 6);
      expect(junioCalculation).toBeDefined();
      expect(junioCalculation!.additionalIncome).toBe(10000);

      // Verificar que la retención adicional no sea excesiva
      const retencionAdicional = junioCalculation!.additionalMonthlyRetention || 0;
      const retencionTotal = junioCalculation!.monthlyRetention;
      const retencionOrdinaria = retencionTotal - retencionAdicional;

      console.log(`🔍 VERIFICACIÓN RETENCIÓN ADICIONAL JUNIO:`);
      console.log(`   • Retención Ordinaria: S/ ${retencionOrdinaria.toFixed(2)}`);
      console.log(`   • Retención Adicional: S/ ${retencionAdicional.toFixed(2)}`);
      console.log(`   • Retención Total: S/ ${retencionTotal.toFixed(2)}`);
      console.log(`   • Ingreso Extraordinario: S/ ${junioCalculation!.additionalIncome.toFixed(2)}`);

      // La retención adicional debe ser mayor que 0 pero no excesiva
      expect(retencionAdicional).toBeGreaterThan(0);
      
      // La retención adicional no debe exceder el 30% del ingreso extraordinario
      const maxRetencionAdicional = junioCalculation!.additionalIncome * 0.30;
      expect(retencionAdicional).toBeLessThanOrEqual(maxRetencionAdicional);
      
      // La retención adicional debe ser razonable (no más del 50% del ingreso extraordinario)
      expect(retencionAdicional).toBeLessThanOrEqual(junioCalculation!.additionalIncome * 0.50);
      
      // La retención total no debe ser mayor que el ingreso total del mes
      expect(retencionTotal).toBeLessThanOrEqual(junioCalculation!.totalMonthlyIncome);
    });
  });

  describe('Validación de la metodología SUNAT', () => {
    it('debe aplicar la deducción de 7 UIT correctamente en el recálculo', () => {
      const params = {
        year: 2025,
        monthlyIncome: 3000, // S/ 3,000 mensual (no supera 7 UIT inicialmente)
        additionalIncomeByMonth: [
          { month: 6, amount: 50000 } // Ingreso adicional que hace superar 7 UIT
        ],
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1,
        previousRetentions: 0,
        roundingDecimals: 2,
        deductibleExpenses: {
          restaurants: 0,
          medicalServices: 0,
          professionalServices: 0,
          rentalProperties: 0,
          essaludContributions: 0
        },
        // Configuración básica
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0,
        calculateGratificaciones: false,
        calculateCTS: false,
        calculateAsignacionFamiliar: false,
        insuranceType: 'essalud' as const,
        startWorkMonth: 1,
        hasChildren: false,
        childrenCount: 0,
        childrenStudying: false,
        isLimitedContract: false,
        isPublicSectorWorker: false,
        receivesSchoolingBonus: false,
        isJudicialWorker: false,
        donations: 0,
        previousTaxCredits: 0,
        previousTaxPayments: 0,
        previousTaxRefunds: 0,
        isOnlyFifthCategoryIncome: false
      };

      const result = calculator.calculate(params);

      // Verificar que la deducción de 7 UIT se aplica correctamente
      const deduction7UIT = calculator.getDeduction7UIT(); // S/ 37,450
      expect(result.summary.deduction7UIT).toBe(deduction7UIT);

      // Verificar que el ingreso neto se calcula correctamente después del ingreso adicional
      const junioCalculation = result.monthlyCalculations.find(calc => calc.month === 6);
      expect(junioCalculation).toBeDefined();

      // El ingreso neto debería ser mayor después del ingreso adicional
      const ingresoNetoJunio = junioCalculation!.projectedNetIncome;
      expect(ingresoNetoJunio).toBeGreaterThan(0);
    });

    it('debe mantener retenciones mensuales consistentes con sueldo fijo sin ingresos adicionales', () => {
      const params = {
        year: 2025,
        monthlyIncome: 5000, // S/ 5,000 mensual fijo
        additionalIncomeByMonth: [], // Sin ingresos adicionales
        additionalIncome: 0,
        additionalMonth: 12,
        calculationMonth: 1, // Empezar en enero
        previousRetentions: 0,
        roundingDecimals: 2,
        deductibleExpenses: {
          restaurants: 0,
          medicalServices: 0,
          professionalServices: 0,
          rentalProperties: 0,
          essaludContributions: 0
        },
        // Configuración básica
        gratificaciones: 0,
        bonificaciones: 0,
        utilidades: 0,
        cts: 0,
        asignacionFamiliar: 0,
        calculateGratificaciones: false,
        calculateCTS: false,
        calculateAsignacionFamiliar: false,
        insuranceType: 'essalud' as const,
        startWorkMonth: 1,
        hasChildren: false,
        childrenCount: 0,
        childrenStudying: false,
        isLimitedContract: false,
        isPublicSectorWorker: false,
        receivesSchoolingBonus: false,
        isJudicialWorker: false,
        donations: 0,
        previousTaxCredits: 0,
        previousTaxPayments: 0,
        previousTaxRefunds: 0,
        isOnlyFifthCategoryIncome: false
      };

      const result = calculator.calculate(params);

      // Verificar que hay cálculos mensuales
      expect(result.monthlyCalculations).toHaveLength(12);

      // Obtener todas las retenciones mensuales
      const retencionesMensuales = result.monthlyCalculations.map(calc => calc.monthlyRetention);

      console.log(`🔍 VERIFICACIÓN RETENCIONES MENSUALES CONSISTENTES:`);
      console.log(`   • Enero: S/ ${retencionesMensuales[0].toFixed(2)}`);
      console.log(`   • Febrero: S/ ${retencionesMensuales[1].toFixed(2)}`);
      console.log(`   • Marzo: S/ ${retencionesMensuales[2].toFixed(2)}`);
      console.log(`   • Abril: S/ ${retencionesMensuales[3].toFixed(2)}`);
      console.log(`   • Mayo: S/ ${retencionesMensuales[4].toFixed(2)}`);
      console.log(`   • Junio: S/ ${retencionesMensuales[5].toFixed(2)}`);
      console.log(`   • Julio: S/ ${retencionesMensuales[6].toFixed(2)}`);
      console.log(`   • Agosto: S/ ${retencionesMensuales[7].toFixed(2)}`);
      console.log(`   • Septiembre: S/ ${retencionesMensuales[8].toFixed(2)}`);
      console.log(`   • Octubre: S/ ${retencionesMensuales[9].toFixed(2)}`);
      console.log(`   • Noviembre: S/ ${retencionesMensuales[10].toFixed(2)}`);
      console.log(`   • Diciembre: S/ ${retencionesMensuales[11].toFixed(2)}`);

      // Verificar que las retenciones de enero a noviembre sean iguales
      const retencionEneroNoviembre = retencionesMensuales[0];
      for (let i = 1; i < 11; i++) {
        expect(retencionesMensuales[i]).toBeCloseTo(retencionEneroNoviembre, 2);
      }

      // Verificar que diciembre tenga el ajuste final correcto
      const retencionDiciembre = retencionesMensuales[11];
      const diferenciaDiciembre = retencionDiciembre - retencionEneroNoviembre;
      
      // Diciembre debe tener un ajuste final para completar exactamente el impuesto anual
      // La diferencia debe ser pequeña (ajuste por redondeo)
      expect(Math.abs(diferenciaDiciembre)).toBeLessThan(0.05);
      
      // Verificar que el ajuste sea positivo (diciembre debe ser mayor o igual)
      expect(diferenciaDiciembre).toBeGreaterThanOrEqual(0);

      // Verificar que la suma de todas las retenciones sea igual al impuesto anual
      const totalRetenciones = retencionesMensuales.reduce((sum, ret) => sum + ret, 0);
      const impuestoAnual = result.summary.totalAnnualTax;
      
      console.log(`   • Total Retenciones: S/ ${totalRetenciones.toFixed(2)}`);
      console.log(`   • Impuesto Anual: S/ ${impuestoAnual.toFixed(2)}`);
      console.log(`   • Diferencia: S/ ${Math.abs(totalRetenciones - impuestoAnual).toFixed(2)}`);

      // La diferencia total debe ser mínima (aceptar hasta 5 centavos por redondeo)
      expect(Math.abs(totalRetenciones - impuestoAnual)).toBeLessThan(0.05);
    });
  });
});
