# Cálculo de Gratificaciones - Sistema SUNAT 2025

## 📋 **Descripción General**

Las gratificaciones son beneficios obligatorios que las empresas deben pagar a sus trabajadores en julio y diciembre de cada año, según la normativa peruana vigente.

## 🧮 **Fórmula de Cálculo**

### **Fórmula Base**
```
Gratificación = (Sueldo × Meses Trabajados) ÷ 6 + Bono de Seguro
```

### **Componentes**
1. **Sueldo Base**: Remuneración mensual bruta del trabajador
2. **Meses Trabajados**: Cantidad de meses desde el inicio del trabajo hasta el mes de gratificación
3. **Divisor**: Siempre 6 (constante fija según normativa)
4. **Bono de Seguro**: Porcentaje adicional según el tipo de seguro de salud

## 🏥 **Tipos de Seguro y Porcentajes**

### **EsSalud (Seguro Público)**
- **Porcentaje**: 9% del cálculo base
- **Aplicación**: Automática para trabajadores afiliados a EsSalud

### **EPS (Entidad Prestadora de Salud Privada)**
- **Porcentaje**: 6.75% del cálculo base
- **Aplicación**: Para trabajadores afiliados a EPS privadas

## 📅 **Meses de Pago**

### **Gratificación de Julio**
- **Período**: Enero a Julio
- **Cálculo**: (Sueldo × 7) ÷ 6 + Bono de Seguro

### **Gratificación de Diciembre**
- **Período**: Enero a Diciembre
- **Cálculo**: (Sueldo × 12) ÷ 6 + Bono de Seguro

## 📊 **Ejemplos Prácticos**

### **Ejemplo 1: Trabajador desde Enero - EsSalud**
**Datos del Trabajador:**
- **Nombre**: Mario
- **Sueldo Mensual**: S/ 2,500
- **Mes de Inicio**: Enero
- **Tipo de Seguro**: EsSalud (9%)

**Cálculo de Julio:**
```
Meses trabajados: 7 (Enero a Julio)
Cálculo base: (2,500 × 7) ÷ 6 = 17,500 ÷ 6 = 2,916.67
Bono EsSalud: 2,916.67 × 0.09 = 262.50
Total gratificación: 2,916.67 + 262.50 = S/ 3,179.17
```

**Cálculo de Diciembre:**
```
Meses trabajados: 12 (Enero a Diciembre)
Cálculo base: (2,500 × 12) ÷ 6 = 30,000 ÷ 6 = 5,000
Bono EsSalud: 5,000 × 0.09 = 450
Total gratificación: 5,000 + 450 = S/ 5,450
```

**Total Anual**: S/ 3,179.17 + S/ 5,450 = **S/ 8,629.17**

### **Ejemplo 2: Trabajador desde Febrero - EPS**
**Datos del Trabajador:**
- **Nombre**: Lucía
- **Sueldo Mensual**: S/ 3,000
- **Mes de Inicio**: Febrero
- **Tipo de Seguro**: EPS (6.75%)

**Cálculo de Julio:**
```
Meses trabajados: 6 (Febrero a Julio)
Cálculo base: (3,000 × 6) ÷ 6 = 18,000 ÷ 6 = 3,000
Bono EPS: 3,000 × 0.0675 = 202.50
Total gratificación: 3,000 + 202.50 = S/ 3,202.50
```

**Cálculo de Diciembre:**
```
Meses trabajados: 11 (Febrero a Diciembre)
Cálculo base: (3,000 × 11) ÷ 6 = 33,000 ÷ 6 = 5,500
Bono EPS: 5,500 × 0.0675 = 371.25
Total gratificación: 5,500 + 371.25 = S/ 5,871.25
```

**Total Anual**: S/ 3,202.50 + S/ 5,871.25 = **S/ 9,073.75**

### **Ejemplo 3: Trabajador desde Marzo - EsSalud**
**Datos del Trabajador:**
- **Nombre**: Carlos
- **Sueldo Mensual**: S/ 3,500
- **Mes de Inicio**: Marzo
- **Tipo de Seguro**: EsSalud (9%)

**Cálculo de Julio:**
```
Meses trabajados: 5 (Marzo a Julio)
Cálculo base: (3,500 × 5) ÷ 6 = 17,500 ÷ 6 = 2,916.67
Bono EsSalud: 2,916.67 × 0.09 = 262.50
Total gratificación: 2,916.67 + 262.50 = S/ 3,179.17
```

**Cálculo de Diciembre:**
```
Meses trabajados: 10 (Marzo a Diciembre)
Cálculo base: (3,500 × 10) ÷ 6 = 35,000 ÷ 6 = 5,833.33
Bono EsSalud: 5,833.33 × 0.09 = 525
Total gratificación: 5,833.33 + 525 = S/ 6,358.33
```

**Total Anual**: S/ 3,179.17 + S/ 6,358.33 = **S/ 9,537.50**

## 🔧 **Implementación en el Sistema**

### **Parámetros de Entrada**
```typescript
interface SunatCalculationParams {
  // ... otros campos
  insuranceType?: 'essalud' | 'eps';     // Tipo de seguro
  startWorkMonth?: number;               // Mes de inicio (1-12)
  gratificaciones?: number;              // Gratificación manual (opcional)
  gratificacionesMonth?: number;         // Mes personalizado (opcional)
}
```

### **Cálculo Automático**
El sistema calcula automáticamente las gratificaciones cuando:
- No se especifica `gratificacionesMonth` (mes personalizado)
- El trabajador ya está empleado en julio y/o diciembre
- Se proporciona `insuranceType` y `startWorkMonth`

### **Cálculo Manual**
Se puede especificar una gratificación manual cuando:
- Se proporciona `gratificaciones` (monto)
- Se especifica `gratificacionesMonth` (mes específico)

## 📈 **Casos Especiales**

### **Trabajador Nuevo (Inicio Tardío)**
- **Ejemplo**: Inicio en septiembre
- **Julio**: Sin gratificación (no estaba empleado)
- **Diciembre**: Gratificación por 4 meses trabajados

### **Trabajador con Ingresos Variables**
- **Base**: Se usa el sueldo mensual base
- **No incluye**: Bonificaciones, utilidades, CTS, etc.
- **Solo incluye**: Sueldo base mensual

### **Trabajador con Múltiples Empleadores**
- **Responsabilidad**: Solo el empleador principal
- **Cálculo**: Basado en el sueldo del empleador principal
- **Consolidación**: Se incluye en el cálculo anual total

## ⚠️ **Consideraciones Importantes**

### **Requisitos Legales**
- **Obligatorio**: Para todos los trabajadores dependientes
- **Frecuencia**: Dos veces al año (julio y diciembre)
- **Base**: Sueldo bruto mensual (sin descuentos)

### **Excepciones**
- **Trabajadores independientes**: No aplica
- **Contratos por obra**: Según duración del contrato
- **Trabajadores del hogar**: Normativa específica

### **Validaciones del Sistema**
- **Mes de inicio**: Debe estar entre 1 y 12
- **Tipo de seguro**: Solo 'essalud' o 'eps'
- **Sueldo base**: Debe ser mayor a 0
- **Meses trabajados**: Cálculo automático según mes de inicio

## 🔍 **Verificación de Cálculos**

### **Validación Manual**
Para verificar que el cálculo es correcto:

1. **Identificar meses trabajados**
2. **Aplicar fórmula base**: (Sueldo × Meses) ÷ 6
3. **Calcular bono de seguro**: Base × Porcentaje
4. **Sumar componentes**: Base + Bono

### **Validación en el Sistema**
El sistema proporciona desglose detallado:
- `gratificacionBase`: Cálculo base
- `gratificacionBono`: Bono por tipo de seguro
- `gratificacionTotal`: Total de gratificación
- `mesesTrabajados`: Meses trabajados hasta el mes actual

## 📊 **Resumen de Cálculos**

### **Variables Clave**
- **Divisor fijo**: 6 (normativa peruana)
- **Porcentajes**: EsSalud 9%, EPS 6.75%
- **Meses**: Julio y diciembre por defecto
- **Personalización**: Meses personalizables disponibles

### **Fórmulas Resumidas**
```
EsSalud:   Gratificación = Base × 1.09
EPS:       Gratificación = Base × 1.0675
Base:      (Sueldo × Meses) ÷ 6
```

### **Integración con Sistema**
- **Cálculo automático**: Julio y diciembre
- **Proyecciones anuales**: Incluye gratificaciones
- **Retenciones mensuales**: Considera gratificaciones
- **Auditoría**: Trazabilidad completa de cálculos

## 📚 **Referencias Legales**

- **Constitución Política del Perú**: Artículo 24
- **Ley de Gratificaciones**: Ley N° 27735
- **Reglamento de Gratificaciones**: D.S. N° 005-2002-TR
- **Modificaciones 2025**: Según normativa vigente

## 🚀 **Próximas Actualizaciones**

### **Funcionalidades Planificadas**
- **Historial de gratificaciones**: Por trabajador y año
- **Comparativas**: Entre diferentes tipos de seguro
- **Reportes**: Detallados para auditoría
- **Integración**: Con sistemas de nómina externos

### **Mejoras Técnicas**
- **Performance**: Optimización de cálculos
- **Validaciones**: Reglas de negocio adicionales
- **Interfaz**: Formularios específicos para gratificaciones
- **Exportación**: Formatos estándar para contabilidad

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0
**Sistema**: SUNAT Calculator 2025
**Cumplimiento**: Normativa peruana vigente
