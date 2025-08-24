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
```

### Test Coverage

- **Total Tests**: 64+
- **Test Suites**: 4
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
- **Documentación**: Comprehensive SUNAT guidelines
- **Configuración**: System settings and preferences
