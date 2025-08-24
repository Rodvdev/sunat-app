# Diagramas de Secuencia - Sistema SUNAT

Esta carpeta contiene todos los diagramas de secuencia necesarios para el sistema SUNAT, mostrando los flujos de interacción entre actores, sistema y componentes externos.

## 📋 Diagramas Disponibles

### 1. **Flujo Principal del Sistema** (`flujo-principal-sistema.md`) ⭐ **NUEVO**
- **Propósito**: Visión integral de todo el sistema SUNAT 2025
- **Actores**: Trabajador, RRHH, Sistema, BaseDatos, SUNAT, Calculadora, Auditoria
- **Flujo**: 4 fases principales desde registro hasta auditoría continua
- **Características**: Integración completa de todos los procesos, flujo unificado

### 2. **Cálculo Final del Año** (`calculo-final-anio.md`)
- **Propósito**: Proceso completo de cálculo anual con gastos deducibles
- **Actores**: Trabajador, Sistema, SUNAT, RRHH
- **Flujo**: Solicitud → Consulta SUNAT → Cálculo → Comparación → Resultado
- **Características**: Incluye gastos deducibles 2025, límite 3 UIT

### 3. **Registro de Trabajador** (`registro-trabajador.md`)
- **Propósito**: Proceso de registro de nuevo trabajador en el sistema
- **Actores**: RRHH, Sistema, BaseDatos, SUNAT
- **Flujo**: Inicio → Validación → Registro → Empleador → Configuración
- **Características**: Validación DNI, RUC, configuración inicial

### 4. **Cálculo de Retención Mensual** (`calculo-retencion-mensual.md`)
- **Propósito**: Cálculo mensual de retenciones con métodos proporcional y saldo
- **Actores**: RRHH, Sistema, BaseDatos, Calculadora
- **Flujo**: Solicitud → Datos → Cálculo → Método → Resultado
- **Características**: Método proporcional (Enero-Marzo), método saldo (Abril-Diciembre)

### 5. **Gestión de Gastos Deducibles** (`gastos-deducibles.md`)
- **Propósito**: Proceso completo de gestión de gastos deducibles 2025
- **Actores**: Trabajador, Sistema, BaseDatos, SUNAT, Calculadora
- **Flujo**: Ingreso → Categorización → Cálculo → Límites → Recalculo
- **Características**: 5 categorías, porcentajes específicos, límite 3 UIT

### 6. **Escenario Multi-Empleador** (`multi-empleador.md`)
- **Propósito**: Manejo de trabajadores con múltiples empleadores
- **Actores**: RRHH, Sistema, BaseDatos, SUNAT, Calculadora
- **Flujo**: Configuración → Empleadores → Constancias → Consolidación → Resultado
- **Características**: Empleador principal, consolidación de retenciones

### 7. **Cese de Trabajador** (`cese-trabajador.md`)
- **Propósito**: Proceso de liquidación final al cese del trabajador
- **Actores**: RRHH, Sistema, BaseDatos, Calculadora, SUNAT
- **Flujo**: Registro → Liquidación → Cálculo → Documentación → Estado
- **Características**: Cálculos proporcionales, liquidación final, reporte SUNAT

### 8. **Auditoría de Cambios** (`auditoria-cambios.md`)
- **Propósito**: Sistema de auditoría y trazabilidad de cambios
- **Actores**: Usuario, Sistema, BaseDatos, Auditoria, Logs
- **Flujo**: Cambio → Auditoría → Validación → Aplicación → Historial
- **Características**: Hash de seguridad, logs, historial completo, exportación

## 🔄 Flujos Principales del Sistema

### **Flujo de Trabajador Nuevo**
1. Registro de Trabajador
2. Cálculo de Retención Mensual (repetitivo)
3. Gestión de Gastos Deducibles (opcional)
4. Cálculo Final del Año

### **Flujo de Trabajador Existente**
1. Cálculo de Retención Mensual
2. Gestión de Gastos Deducibles
3. Cálculo Final del Año

### **Flujo de Cese**
1. Registro de Cese
2. Liquidación Final
3. Reporte a SUNAT

### **Flujo de Auditoría**
1. Detección de Cambios
2. Registro de Auditoría
3. Validación y Aplicación
4. Historial y Reportes

## 🎯 Casos de Uso Cubiertos

- ✅ **RF-001**: Registrar trabajador con datos básicos
- ✅ **RF-002**: Permitir ingreso de trabajador en cualquier mes
- ✅ **RF-023**: Calcular proyección anual de ingresos
- ✅ **RF-024**: Aplicar deducción de 7 UIT
- ✅ **RF-025**: Calcular renta neta proyectada
- ✅ **RF-026**: Aplicar escala progresiva acumulativa
- ✅ **RF-027**: Calcular impuesto anual proyectado
- ✅ **RF-028**: Calcular retenciones mensuales
- ✅ **RF-029**: Recalcular retenciones cuando se modifican ingresos
- ✅ **RF-030**: Manejar liquidación final en caso de cese

## 🔧 Componentes del Sistema

### **Actores Principales**
- **Trabajador**: Usuario final que consulta información
- **RRHH**: Personal de recursos humanos que gestiona datos
- **Sistema**: Aplicación principal SUNAT
- **BaseDatos**: Almacenamiento persistente de datos
- **SUNAT**: Servicios externos de validación
- **Calculadora**: Motor de cálculos fiscales
- **Auditoria**: Sistema de trazabilidad y auditoría
- **Logs**: Almacenamiento de eventos del sistema

### **Flujos de Datos**
- **Entrada**: Formularios, validaciones, comprobantes
- **Procesamiento**: Cálculos, validaciones, reglas de negocio
- **Salida**: Reportes, constancias, confirmaciones
- **Almacenamiento**: Base de datos, logs, auditoría

## 📊 Métricas de Complejidad

| Diagrama | Complejidad | Actores | Interacciones |
|----------|-------------|---------|---------------|
| **Flujo Principal del Sistema** | **Alta** | **7** | **45+** |
| Cálculo Final del Año | Media | 4 | 15 |
| Registro de Trabajador | Baja | 4 | 12 |
| Cálculo Mensual | Media | 4 | 18 |
| Gastos Deducibles | Alta | 5 | 22 |
| Multi-Empleador | Alta | 5 | 25 |
| Cese de Trabajador | Media | 5 | 20 |
| Auditoría | Media | 5 | 18 |

## 🚀 Uso de los Diagramas

### **Para Desarrolladores**
- **Flujo Principal**: Entender la arquitectura completa del sistema
- **Diagramas Específicos**: Implementar funcionalidades individuales
- **Integración**: Conectar componentes y flujos de datos
- **Testing**: Identificar casos de prueba críticos

### **Para Usuarios Finales**
- **Flujo Principal**: Comprender el proceso completo del sistema
- **Diagramas Específicos**: Entender funcionalidades particulares
- **Puntos de Interacción**: Identificar dónde y cómo interactuar
- **Flujos de Trabajo**: Conocer procesos y validaciones

### **Para Testing**
- **Flujo Principal**: Validar integración de componentes
- **Diagramas Específicos**: Probar funcionalidades individuales
- **Casos de Prueba**: Identificar escenarios críticos
- **Validación End-to-End**: Verificar flujos completos

## 📚 Documentación Relacionada

- [Especificación de Software](../documentation/software_specification.md)
- [Gastos Deducibles 2025](../documentation/gastos_deducibles_2025.md)
- [Casos de Prueba](../documentation/casos_de_prueba.md)
- [README de Tests](../../tests/README.md)

## 🔄 Mantenimiento

Los diagramas se actualizan automáticamente cuando:
- Se modifican flujos de negocio
- Se agregan nuevas funcionalidades
- Se cambian reglas de validación
- Se actualizan normativas SUNAT

**Última actualización**: Diciembre 2024
**Versión**: 2.0 (Incluye Gastos Deducibles 2025)
**Diagramas**: 8 diagramas de secuencia completos
