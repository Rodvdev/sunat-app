# SUNAT 5th Category Income Tax Calculator - Test Suite

This directory contains comprehensive tests for the SUNAT 5th category income tax calculation system, covering the 5 main test cases, 4 edge cases, and the new deductible expenses functionality for 2025.

## 🧪 Test Coverage

### Main Test Cases (5)

1. **Caso 1: Ingreso Bajo (S/ 1,000 mensual)**
   - Tests low income scenarios below the 7 UIT threshold
   - Verifies no tax is due for incomes below S/ 37,450 annually
   - Tests 12-month calculation period

2. **Caso 2: Ingreso Medio (S/ 5,000 mensual)**
   - Tests medium income scenarios above the 7 UIT threshold
   - Verifies progressive tax bracket calculations
   - Tests monthly retention calculations

3. **Caso 3: Ingreso Medio con Adicional en Junio**
   - Tests additional income scenarios (bonus, commission, etc.)
   - Verifies tax recalculation when additional income is received
   - Tests impact on annual projections

4. **Caso 4: Ingreso Medio con Adicional en Noviembre (Cálculo desde Julio)**
   - Tests mid-year calculation scenarios
   - Verifies correct handling of remaining months
   - Tests additional income impact on partial year calculations

5. **Caso 5: Ingreso Alto (S/ 15,000 mensual)**
   - Tests high income scenarios in upper tax brackets
   - Verifies highest tax bracket applications
   - Tests substantial monthly retention calculations

### Edge Cases (4)

1. **Edge Case 1: Zero Income**
   - Tests boundary condition with zero income
   - Verifies graceful handling of edge cases
   - Tests no-tax scenarios

2. **Edge Case 2: Very High Income (Above 35 UIT)**
   - Tests extreme high income scenarios
   - Verifies highest tax bracket calculations
   - Tests substantial tax amounts

3. **Edge Case 3: Previous Retentions**
   - Tests scenarios with existing tax payments
   - Verifies correct adjustment of monthly retentions
   - Tests overpayment scenarios

4. **Edge Case 4: Mid-Year Calculation with High Previous Retentions**
   - Tests complex scenarios combining multiple factors
   - Verifies correct handling of partial years with overpayments
   - Tests edge case combinations

### 🆕 Deductible Expenses Tests (2025)

1. **Deductible Expenses Calculation**
   - Tests calculation of deductions by category
   - Verifies 3 UIT maximum limit enforcement
   - Tests breakdown by expense type and percentage

2. **Deductible Expenses Validation**
   - Tests input validation and error detection
   - Verifies warning system for high amounts
   - Tests negative value handling

3. **UIT and Deduction Constants**
   - Tests correct UIT values for 2025
   - Verifies deduction limits and percentages
   - Tests constant getter methods

## 📁 Test Files

- **`sunat-calculator.test.ts`** - Main test suite covering all 5 cases and 4 edge cases
- **`tax-brackets.test.ts`** - Specific tests for tax bracket calculations
- **`additional-income.test.ts`** - Tests for additional income scenarios
- **`deductible-expenses.test.ts`** - Complete coverage of 2025 deductible expenses
- **`run-tests.ts`** - Standalone test runner script

## 🚀 Running Tests

### Prerequisites

Install dependencies:
```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Test Suites

```bash
# Run deductible expenses tests only
npm test -- deductible-expenses.test.ts

# Run main calculator tests
npm test -- sunat-calculator.test.ts

# Run tax bracket tests
npm test -- tax-brackets.test.ts
```

### Run Standalone Test Runner

```bash
npx ts-node tests/run-tests.ts
```

## 📊 Test Structure

Each test case follows this structure:

```typescript
describe('Caso X: Description', () => {
  const params: SunatCalculationParams = {
    // Test parameters
  };

  test('should calculate correct annual income', () => {
    // Test implementation
  });

  test('should handle tax calculations correctly', () => {
    // Test implementation
  });
});
```

## 🔍 Test Validation

Tests validate:

- **Income Calculations**: Monthly and annual income projections
- **Tax Bracket Applications**: Progressive tax rate calculations
- **Retention Calculations**: Monthly and accumulated tax retentions
- **Additional Income**: Bonus, commission, and other additional payments
- **Mid-Year Scenarios**: Partial year calculations
- **Previous Payments**: Handling of existing tax payments
- **Edge Cases**: Boundary conditions and extreme scenarios
- **Deductible Expenses**: 2025 deduction calculations and limits

## 📈 Expected Results

### Low Income (S/ 1,000 monthly)
- Annual income: S/ 12,000
- Annual tax: S/ 0 (below 7 UIT threshold)
- Monthly retentions: S/ 0 for all months

### Medium Income (S/ 5,000 monthly)
- Annual income: S/ 60,000
- Annual tax: S/ > 0 (above 7 UIT threshold)
- Progressive monthly retentions

### High Income (S/ 15,000 monthly)
- Annual income: S/ 180,000
- Annual tax: S/ > 0 (upper tax brackets)
- Substantial monthly retentions

### Deductible Expenses (2025)
- **Restaurantes**: 15% deduction up to 3 UIT limit
- **Servicios médicos**: 30% deduction up to 3 UIT limit
- **Servicios profesionales**: 30% deduction up to 3 UIT limit
- **Alquiler**: 30% deduction up to 3 UIT limit
- **EsSalud**: 100% deduction up to 3 UIT limit
- **Total máximo**: S/ 16,050 (3 UIT)

## 🛠️ Technical Details

- **Framework**: Jest with TypeScript support
- **Coverage**: Comprehensive test coverage for all calculation scenarios
- **Validation**: Mathematical accuracy and business logic validation
- **Edge Cases**: Boundary condition testing and error handling
- **Performance**: Efficient test execution with proper setup/teardown
- **Deductible Expenses**: Complete 2025 SUNAT compliance testing

## 📝 Test Data

All test data is based on:
- **UIT 2025**: S/ 5,350
- **7 UIT Deduction**: S/ 37,450
- **3 UIT Additional Deduction**: S/ 16,050 (gastos deducibles)
- **Tax Brackets**: Progressive rates from 8% to 30%
- **Rounding**: Configurable decimal precision
- **Months**: January (1) to December (12)

## 🔧 Customization

Tests can be customized by modifying:
- Income amounts and frequencies
- Additional income scenarios
- Calculation start months
- Previous retention amounts
- Rounding precision
- Tax bracket configurations
- Deductible expenses amounts and categories

## 📚 Related Documentation

- [Software Specification](../documentation/software_specification.md)
- [Gastos Deducibles 2025](../documentation/gastos_deducibles_2025.md)
- [Test Cases Template](../documentation/casos_de_prueba.md)
- [Style Guidelines](../documentation/styles_guideline.md)

## 🆕 What's New in 2025

### Deductible Expenses Integration
- Complete integration with existing tax calculation system
- Real-time validation and calculation
- Comprehensive test coverage for all scenarios
- SUNAT 2025 compliance verification
- User-friendly interface with detailed breakdowns
