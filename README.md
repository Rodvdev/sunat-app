# Aplicación SUNAT

Una aplicación integral para calcular el impuesto a la renta de quinta categoría según la metodología SUNAT para el año 2025.


## 🧪 Suite de Pruebas

Este proyecto incluye una suite completa de pruebas Jest que cubre:

- **5 Casos de Prueba Principales**: Escenarios de negocio centrales para cálculos fiscales SUNAT
- **4 Casos Extremos**: Condiciones límite y manejo de errores
- **Pruebas de Gastos Deducibles**: Cobertura completa de la lógica de gastos deducibles 2025
- **Pruebas de Gratificaciones**: Cobertura completa de la lógica de cálculo de gratificaciones ⭐ **NUEVO**
- **Pruebas de CTS**: Cobertura completa de la lógica de cálculo de CTS ⭐ **NUEVO**
- **Pruebas de Asignación Familiar**: Cobertura completa de la lógica de asignación familiar ⭐ **NUEVO**
- **100% de Cobertura de Código**: Pruebas completas de toda la lógica de cálculo

### Ejecutar Pruebas

```bash
# Instalar dependencias
npm install

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo observación
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar suites de pruebas específicas
npm test -- deductible-expenses.test.ts
npm test -- sunat-calculator.test.ts
npm test -- gratificaciones-calculation.test.ts ⭐ **NUEVO**
npm test -- cts-calculation.test.ts ⭐ **NUEVO**
npm test -- asignacion-familiar.test.ts ⭐ **NUEVO**
```

### Cobertura de Pruebas

- **Total de Pruebas**: 100+
- **Suites de Pruebas**: 7
- **Cobertura**: 100% (Declaraciones, Ramas, Funciones, Líneas)

Ver [tests/README.md](tests/README.md) para documentación detallada de pruebas.

## 🚀 Desarrollo

```bash
npm run dev     # Iniciar servidor de desarrollo
npm run build   # Construir para producción
npm run start   # Iniciar servidor de producción
npm run lint    # Ejecutar ESLint
```

## 📚 Documentación

- [Especificación del Software](documentation/software_specification.md)
- [Gastos Deducibles 2025](documentation/gastos_deducibles_2025.md)
- [Cálculo de Gratificaciones](documentation/calculo-gratificaciones.md) ⭐ **NUEVO**
- [Cálculo de CTS y Asignación Familiar](documentation/calculo-cts-asignacion-familiar.md) ⭐ **NUEVO**
- [Plantilla de Casos de Prueba](documentation/casos_de_prueba.md)
- [Guía de Estilos](documentation/styles_guideline.md)
- [Documentación de la Suite de Pruebas](tests/README.md)

## 🏗️ Arquitectura

- **Frontend**: Next.js 14 con TypeScript
- **Componentes UI**: Tailwind CSS + Headless UI
- **Gestión de Estado**: React Hook Form con validación Zod
- **Pruebas**: Jest + Testing Library
- **Despliegue**: Configuración lista para Vercel

## 🔧 Componentes Clave

- **Calculadora SUNAT**: Interfaz principal de cálculo fiscal
- **Gastos Deducibles**: Documentación y calculadora de gastos deducibles
- **Tipos de Ingresos Adicionales**: Gratificaciones, CTS, Asignación Familiar ⭐ **NUEVO**
- **Documentación**: Guías integrales de SUNAT
- **Configuración**: Configuraciones del sistema y preferencias

## 🆕 Nuevas Funcionalidades

### **Gastos Deducibles 2025**
- **5 categorías**: Restaurantes (15%), Servicios Médicos (30%), Servicios Profesionales (30%), Alquiler (30%), EsSalud (100%)
- **Límite máximo**: 3 UIT adicionales (S/ 16,050)
- **Validación automática**: Solo aplica si ingresos > 7 UIT
- **Integración completa**: Con cálculos fiscales principales

### **Tipos de Ingresos Adicionales 2025** 
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
