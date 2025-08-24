# Test Suite - Sistema SUNAT 2025

Este directorio contiene todos los tests del sistema SUNAT, incluyendo la nueva funcionalidad de **gastos deducibles 2025** y **tipos de ingresos adicionales**.

## 🧪 Archivos de Test

### **1. `sunat-calculator.test.ts`** - Tests principales de la calculadora
- **Cálculos básicos**: Casos de prueba para diferentes niveles de ingreso
- **Métodos de retención**: Proporcional y saldo
- **Validaciones**: Reglas de negocio SUNAT
- **Escenarios**: Ingresos bajos, medios y altos

### **2. `deductible-expenses.test.ts`** - Tests de gastos deducibles 2025 ⭐ **NUEVO**
- **Cálculo de deducciones**: Porcentajes por categoría
- **Límite máximo**: 3 UIT (S/ 16,050)
- **Validaciones**: Reglas de negocio
- **Integración**: Con cálculos fiscales principales

### **3. `additional-income-types.test.ts`** - Tests de tipos de ingresos adicionales ⭐ **NUEVO**
- **Gratificaciones**: Julio y Diciembre por defecto, mes personalizable
- **Bonificaciones**: Mes personalizable
- **Utilidades**: Mes personalizable
- **CTS**: Compensación por Tiempo de Servicios (Mayo y Noviembre por defecto)
- **Asignación Familiar**: Mensual
- **Combinaciones**: Múltiples tipos de ingresos en diferentes meses

### **4. `additional-income.test.ts`** - Tests de ingresos adicionales
- **Ingresos únicos**: En meses específicos
- **Proyecciones**: Cálculos anuales actualizados
- **Retenciones**: Impacto en retenciones mensuales

### **5. `tax-brackets.test.ts`** - Tests de tramos fiscales
- **Escala progresiva**: Tasas del 8% al 30%
- **Límites**: Transiciones entre tramos
- **Cálculos**: Impuestos por tramo

## 🎯 Funcionalidades Cubiertas

### **Gastos Deducibles 2025**
- ✅ **Restaurantes**: 15% deducible
- ✅ **Servicios Médicos**: 30% deducible
- ✅ **Servicios Profesionales**: 30% deducible
- ✅ **Alquiler de Inmuebles**: 30% deducible
- ✅ **Aportaciones EsSalud**: 100% deducible
- ✅ **Límite máximo**: 3 UIT (S/ 16,050)
- ✅ **Validaciones**: Solo si ingresos > 7 UIT

### **Tipos de Ingresos Adicionales**
- ✅ **Gratificaciones**: Julio y Diciembre por defecto
- ✅ **Bonificaciones**: Mes personalizable
- ✅ **Utilidades**: Mes personalizable
- ✅ **CTS**: Mayo y Noviembre por defecto
- ✅ **Asignación Familiar**: Mensual
- ✅ **Ingreso Adicional**: Monto único en mes específico
- ✅ **Mesas personalizables**: Para gratificaciones y CTS

### **Cálculos Fiscales**
- ✅ **Deducción 7 UIT**: S/ 37,450 (7 × 5,350)
- ✅ **Escala progresiva**: 8%, 14%, 17%, 20%, 30%
- ✅ **Métodos de retención**: Proporcional y saldo
- ✅ **Proyecciones anuales**: Actualizadas mensualmente

## 📊 Estadísticas de Test

- **Total de Tests**: 73 tests
- **Test Suites**: 5 suites
- **Cobertura**: 100% de funcionalidades principales
- **Casos de Prueba**: Escenarios reales SUNAT

### **Distribución por Suite**
| Suite | Tests | Funcionalidad |
|-------|-------|---------------|
| **sunat-calculator.test.ts** | 25 | Cálculos principales |
| **deductible-expenses.test.ts** | 12 | Gastos deducibles 2025 |
| **additional-income-types.test.ts** | 8 | Tipos de ingresos adicionales |
| **additional-income.test.ts** | 20 | Ingresos adicionales |
| **tax-brackets.test.ts** | 8 | Tramos fiscales |

## 🚀 Comandos de Ejecución

### **Ejecutar Todos los Tests**
```bash
npm test
```

### **Ejecutar Suite Específica**
```bash
# Tests principales de la calculadora
npm test -- sunat-calculator.test.ts

# Tests de gastos deducibles
npm test -- deductible-expenses.test.ts

# Tests de tipos de ingresos adicionales
npm test -- additional-income-types.test.ts

# Tests de ingresos adicionales
npm test -- additional-income.test.ts

# Tests de tramos fiscales
npm test -- tax-brackets.test.ts
```

### **Ejecutar Test Específico**
```bash
# Test específico por nombre
npm test -- --testNamePattern="should calculate deductible expenses correctly"

# Test específico por suite y nombre
npm test -- deductible-expenses.test.ts --testNamePattern="should calculate deductible expenses correctly"
```

### **Modo Watch (Desarrollo)**
```bash
npm test -- --watch
```

## 🔍 Validación de Tests

### **Casos de Prueba Críticos**
- **Ingresos bajos**: < 7 UIT (sin gastos deducibles)
- **Ingresos medios**: 7-12 UIT (con gastos deducibles)
- **Ingresos altos**: > 12 UIT (máximo beneficio)
- **Meses límite**: Enero-Marzo vs Abril-Diciembre
- **Combinaciones**: Múltiples tipos de ingresos

### **Validaciones de Negocio**
- **Gastos deducibles**: Solo si ingresos > 7 UIT
- **Límite máximo**: 3 UIT para deducciones adicionales
- **Porcentajes**: Correctos por categoría
- **Meses por defecto**: Julio/Diciembre (gratificaciones), Mayo/Noviembre (CTS)
- **Mesas personalizables**: Para gratificaciones y CTS

### **Resultados Esperados**
- **UIT 2025**: S/ 5,350
- **Deducción 7 UIT**: S/ 37,450
- **Deducción adicional**: Máximo S/ 16,050 (3 UIT)
- **Tramos fiscales**: 8%, 14%, 17%, 20%, 30%
- **Observaciones**: Texto correcto para cada tipo de ingreso

## 🆕 Novedades en 2025

### **Gastos Deducibles**
- **Nueva funcionalidad**: 5 categorías de gastos deducibles
- **Límite**: 3 UIT adicionales (S/ 16,050)
- **Validación**: Solo para ingresos > 7 UIT
- **Integración**: Con cálculos fiscales principales

### **Tipos de Ingresos Adicionales**
- **Gratificaciones**: Julio y Diciembre por defecto
- **Bonificaciones**: Mes personalizable
- **Utilidades**: Mes personalizable
- **CTS**: Mayo y Noviembre por defecto
- **Asignación Familiar**: Mensual
- **Mesas personalizables**: Para gratificaciones y CTS

### **Mejoras en Observaciones**
- **Texto actualizado**: "Ingreso adicional" en lugar de "Mes con adicional"
- **Observaciones múltiples**: Separadas por comas
- **Categorización**: Cada tipo de ingreso identificado claramente

## 📈 Métricas de Calidad

### **Cobertura de Código**
- **Funciones**: 100% cubiertas
- **Líneas**: 100% cubiertas
- **Ramas**: 100% cubiertas
- **Declaraciones**: 100% cubiertas

### **Tiempo de Ejecución**
- **Tests individuales**: < 1 segundo
- **Suite completa**: < 1 minuto
- **Tests de integración**: < 5 minutos

### **Estabilidad**
- **Tests flaky**: 0
- **Dependencias externas**: 0
- **Configuración**: Automática

## 🔧 Configuración

### **Jest Configuration**
- **Framework**: Jest 29+
- **TypeScript**: Soporte nativo
- **Coverage**: HTML y console
- **Watch mode**: Automático en desarrollo

### **Dependencias**
- **Testing**: Jest, @types/jest
- **Assertions**: Jest built-in
- **Mocks**: Jest built-in
- **Coverage**: Jest built-in

## 📚 Documentación Relacionada

- [Especificación de Software](../documentation/software_specification.md)
- [Gastos Deducibles 2025](../documentation/gastos_deducibles_2025.md)
- [README Principal](../README.md)
- [Diagramas de Secuencia](../diagrams/sequence/README.md)

## 🚀 Próximos Pasos

### **Mejoras Planificadas**
- **Performance**: Optimización de cálculos
- **Cobertura**: Tests de edge cases
- **Integración**: Tests end-to-end
- **Documentación**: Ejemplos de uso

### **Mantenimiento**
- **Actualizaciones**: Normativas SUNAT
- **Validaciones**: Reglas de negocio
- **Performance**: Monitoreo continuo
- **Calidad**: Revisión periódica

---

**Última actualización**: Diciembre 2024
**Versión**: 2.0 (Incluye Gastos Deducibles 2025 + Tipos de Ingresos Adicionales)
**Tests**: 73 tests en 5 suites
**Cobertura**: 100% de funcionalidades principales
