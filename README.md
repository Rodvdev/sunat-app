# SUNAT App

A comprehensive application for calculating 5th category income tax and deductible expenses according to SUNAT methodology for the year 2025.

## ✨ New Features - 2025

### 🧾 Deductible Expenses Calculator
- **Restaurantes, bares y hoteles**: 15% deduction
- **Servicios médicos y odontológicos**: 30% deduction  
- **Servicios profesionales y oficios**: 30% deduction
- **Alquiler de inmuebles**: 30% deduction
- **Aportaciones a EsSalud**: 100% deduction
- **Límite máximo**: 3 UIT (S/ 16,050) para el ejercicio 2025

## 🧪 Test Suite

This project includes a comprehensive Jest test suite covering:

- **5 Main Test Cases**: Core business scenarios for SUNAT tax calculations
- **4 Edge Cases**: Boundary conditions and error handling
- **Deductible Expenses Tests**: Complete coverage of 2025 deductible expenses logic
- **Gratificaciones Tests**: Complete coverage of gratificaciones calculation logic ⭐ **NUEVO**
- **CTS Tests**: Complete coverage of CTS calculation logic ⭐ **NUEVO**
- **Asignación Familiar Tests**: Complete coverage of family allowance logic ⭐ **NUEVO**
- **100% Code Coverage**: Complete testing of all calculation logic

### Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm test -- deductible-expenses.test.ts
npm test -- sunat-calculator.test.ts
npm test -- gratificaciones-calculation.test.ts ⭐ **NUEVO**
npm test -- cts-calculation.test.ts ⭐ **NUEVO**
npm test -- asignacion-familiar.test.ts ⭐ **NUEVO**
```

### Test Coverage

- **Total Tests**: 100+
- **Test Suites**: 7
- **Coverage**: 100% (Statements, Branches, Functions, Lines)

See [tests/README.md](tests/README.md) for detailed test documentation.

## 🚀 Development

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

## 📚 Documentation

- [Software Specification](documentation/software_specification.md)
- [Gastos Deducibles 2025](documentation/gastos_deducibles_2025.md)
- [Cálculo de Gratificaciones](documentation/calculo-gratificaciones.md) ⭐ **NUEVO**
- [Cálculo de CTS y Asignación Familiar](documentation/calculo-cts-asignacion-familiar.md) ⭐ **NUEVO**
- [Test Cases Template](documentation/casos_de_prueba.md)
- [Style Guidelines](documentation/styles_guideline.md)
- [Test Suite Documentation](tests/README.md)

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript
- **UI Components**: Tailwind CSS + Headless UI
- **State Management**: React Hook Form with Zod validation
- **Testing**: Jest + Testing Library
- **Deployment**: Vercel-ready configuration

## 🔧 Key Components

- **Calculadora SUNAT**: Main tax calculation interface
- **Gastos Deducibles**: Deductible expenses documentation and calculator
- **Tipos de Ingresos Adicionales**: Gratificaciones, CTS, Asignación Familiar ⭐ **NUEVO**
- **Documentación**: Comprehensive SUNAT guidelines
- **Configuración**: System settings and preferences

## 🆕 Nuevas Funcionalidades - 2025

### **Gastos Deducibles 2025**
- **5 categorías**: Restaurantes (15%), Servicios Médicos (30%), Servicios Profesionales (30%), Alquiler (30%), EsSalud (100%)
- **Límite máximo**: 3 UIT adicionales (S/ 16,050)
- **Validación automática**: Solo aplica si ingresos > 7 UIT
- **Integración completa**: Con cálculos fiscales principales

### **Tipos de Ingresos Adicionales** ⭐ **NUEVO**
- **Gratificaciones**: Julio y Diciembre por defecto (mes personalizable)
  - Fórmula: `(Sueldo × Meses Trabajados) ÷ 6 + Bono de Seguro`
  - EsSalud: 9% | EPS: 6.75%
  - Cálculo automático según mes de inicio de trabajo
- **Bonificaciones**: Mes personalizable
- **Utilidades**: Mes personalizable  
- **CTS**: Compensación por Tiempo de Servicios (Mayo y Noviembre por defecto, mes personalizable)
  - Fórmula: `[(Remuneración / 12) × Meses] + [(Remuneración / 360) × Días]`
  - Cálculo automático según mes de inicio de trabajo
- **Asignación Familiar**: Mensual (S/ 75.00)
  - Para trabajadores con hijos menores de 18 años
  - Para trabajadores con hijos estudiando después de 18 años (máximo 6 años)
  - Monto fijo independiente de días trabajados
- **Ingreso Adicional**: Monto único en mes específico
- **Cálculo inteligente**: Proyecciones anuales actualizadas automáticamente
