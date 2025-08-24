# Cálculo de CTS y Asignación Familiar - Sistema SUNAT 2025

## 📋 **Descripción General**

Este documento detalla el cálculo de dos beneficios importantes para los trabajadores peruanos:
1. **CTS (Compensación por Tiempo de Servicios)**
2. **Asignación Familiar**

## 🧮 **CTS - Compensación por Tiempo de Servicios**

### **¿Qué es la CTS?**
La CTS es un beneficio social que se paga a los trabajadores dependientes en mayo y noviembre de cada año, según la normativa peruana vigente.

### **Fórmula de Cálculo**
```
CTS = [(Remuneración computable / 12) × N° de meses] + [(Remuneración computable / 360) × N° de días]
```

### **Componentes de la Fórmula**
1. **Primer componente**: `(Remuneración computable / 12) × N° de meses`
   - **Remuneración computable**: Sueldo mensual base
   - **Divisor**: 12 (meses del año)
   - **Multiplicador**: Meses trabajados desde el inicio hasta el mes de pago

2. **Segundo componente**: `(Remuneración computable / 360) × N° de días`
   - **Remuneración computable**: Sueldo mensual base
   - **Divisor**: 360 (días del año)
   - **Multiplicador**: Días trabajados en el mes de pago (aproximado a 30 días)

### **Meses de Pago**
- **Primer pago**: Mayo
- **Segundo pago**: Noviembre

### **Ejemplos Prácticos**

#### **Ejemplo 1: Trabajador desde Enero - Sueldo S/ 3,000**
**Cálculo de Mayo:**
```
Meses trabajados: 5 (Enero a Mayo)
Días trabajados: 30 (Mayo)

Primer componente: (3,000 / 12) × 5 = 250 × 5 = 1,250
Segundo componente: (3,000 / 360) × 30 = 8.33 × 30 = 250

Total CTS Mayo: 1,250 + 250 = S/ 1,500
```

**Cálculo de Noviembre:**
```
Meses trabajados: 11 (Enero a Noviembre)
Días trabajados: 30 (Noviembre)

Primer componente: (3,000 / 12) × 11 = 250 × 11 = 2,750
Segundo componente: (3,000 / 360) × 30 = 8.33 × 30 = 250

Total CTS Noviembre: 2,750 + 250 = S/ 3,000
```

**Total Anual CTS**: S/ 1,500 + S/ 3,000 = **S/ 4,500**

#### **Ejemplo 2: Trabajador desde Marzo - Sueldo S/ 4,000**
**Cálculo de Mayo:**
```
Meses trabajados: 3 (Marzo a Mayo)
Días trabajados: 30 (Mayo)

Primer componente: (4,000 / 12) × 3 = 333.33 × 3 = 1,000
Segundo componente: (4,000 / 360) × 30 = 11.11 × 30 = 333.33

Total CTS Mayo: 1,000 + 333.33 = S/ 1,333.33
```

**Cálculo de Noviembre:**
```
Meses trabajados: 9 (Marzo a Noviembre)
Días trabajados: 30 (Noviembre)

Primer componente: (4,000 / 12) × 9 = 333.33 × 9 = 3,000
Segundo componente: (4,000 / 360) × 30 = 11.11 × 30 = 333.33

Total CTS Noviembre: 3,000 + 333.33 = S/ 3,333.33
```

**Total Anual CTS**: S/ 1,333.33 + S/ 3,333.33 = **S/ 4,666.66**

### **Consideraciones Importantes**
- **Base de cálculo**: Solo el sueldo base mensual
- **No incluye**: Bonificaciones, utilidades, gratificaciones
- **Meses trabajados**: Se cuenta desde el mes de inicio del trabajo
- **Días trabajados**: Se aproxima a 30 días por mes
- **Personalización**: Se puede especificar un mes personalizado

## 👨‍👩‍👧‍👦 **Asignación Familiar**

### **¿Qué es la Asignación Familiar?**
La asignación familiar es un beneficio que reciben los trabajadores que tienen hijos menores de 18 años o hijos estudiando después de cumplir la mayoría de edad.

### **Requisitos para Recibir Asignación Familiar**
1. **Hijos menores de 18 años**: Al menos un hijo menor de edad
2. **Hijos estudiando**: Hijos mayores de 18 años que estén estudiando (máximo 6 años posteriores)
3. **Documentación**: Comprobante de hijos (partida de nacimiento, DNI, etc.)

### **Monto de la Asignación Familiar**
- **Monto mensual**: S/ 75.00 Nuevos Soles
- **Base de cálculo**: 10% de la Remuneración Mínima Legal Vigente (RMLV)
- **Característica**: Monto fijo, no varía según ingresos del trabajador
- **Frecuencia**: Mensual (todos los meses del año)

### **Ejemplos Prácticos**

#### **Ejemplo 1: Trabajador con 2 hijos menores de 18 años**
```
Monto mensual: S/ 75.00
Número de hijos: 2
Total mensual: S/ 75.00 (no se multiplica por número de hijos)
Total anual: S/ 75.00 × 12 = S/ 900.00
```

#### **Ejemplo 2: Trabajador con 1 hijo estudiando después de 18 años**
```
Monto mensual: S/ 75.00
Número de hijos: 1 (estudiando)
Total mensual: S/ 75.00
Total anual: S/ 75.00 × 12 = S/ 900.00
```

#### **Ejemplo 3: Trabajador con 3 hijos menores y 1 estudiando**
```
Monto mensual: S/ 75.00
Total mensual: S/ 75.00 (no se multiplica por número total de hijos)
Total anual: S/ 75.00 × 12 = S/ 900.00
```

### **Características de la Asignación Familiar**
- **Monto íntegro**: Se recibe completo independientemente de los días trabajados
- **Independiente del sueldo**: No varía según el nivel de ingresos
- **Aplicación mensual**: Se recibe todos los meses del año
- **No acumulable**: No se puede acumular de un mes a otro
- **No transferible**: Solo para el trabajador que cumple los requisitos

## 🔧 **Implementación en el Sistema**

### **Configuración de CTS**
```typescript
interface SunatCalculationParams {
  // ... otros campos
  calculateCTS: boolean;              // Si se debe calcular CTS automáticamente
  cts?: number;                       // CTS manual (opcional)
  ctsMonth?: number;                  // Mes personalizado para CTS
  startWorkMonth: number;             // Mes de inicio de trabajo
}
```

### **Configuración de Asignación Familiar**
```typescript
interface SunatCalculationParams {
  // ... otros campos
  calculateAsignacionFamiliar: boolean; // Si se debe calcular asignación familiar
  hasChildren: boolean;               // Si tiene hijos menores de 18 años
  childrenCount: number;              // Número de hijos
  childrenStudying: boolean;          // Si tiene hijos estudiando después de 18
}
```

### **Cálculo Automático vs Manual**

#### **CTS Automático**
- **Activado por defecto**: `calculateCTS: true`
- **Meses de pago**: Mayo y Noviembre
- **Fórmula aplicada**: Según normativa peruana
- **Validaciones**: Solo si el trabajador ya estaba empleado en esos meses

#### **CTS Manual**
- **Activado**: `calculateCTS: false`
- **Monto**: Especificado en `cts`
- **Mes**: Especificado en `ctsMonth`
- **Uso**: Para casos especiales o montos específicos

#### **Asignación Familiar Automática**
- **Activada por defecto**: `calculateAsignacionFamiliar: true`
- **Validación**: Verifica `hasChildren` o `childrenStudying`
- **Monto**: S/ 75.00 mensual automático
- **Frecuencia**: Todos los meses del año

#### **Asignación Familiar Manual**
- **Activada**: `calculateAsignacionFamiliar: false`
- **Monto**: Especificado en `asignacionFamiliar`
- **Uso**: Para casos especiales o montos específicos

## 📊 **Integración con Otros Ingresos**

### **CTS + Gratificaciones**
- **Mayo**: CTS + asignación familiar
- **Julio**: Gratificaciones + asignación familiar
- **Noviembre**: CTS + asignación familiar
- **Diciembre**: Gratificaciones + asignación familiar

### **CTS + Otros Ingresos**
- **Bonificaciones**: Se pueden especificar en cualquier mes
- **Utilidades**: Se pueden especificar en cualquier mes
- **Ingreso adicional**: Se puede especificar en cualquier mes
- **Asignación familiar**: Todos los meses (si aplica)

### **Cálculo del Ingreso Total Mensual**
```
Ingreso Total = Sueldo Base + Ingreso Adicional + Gratificaciones + 
                Bonificaciones + Utilidades + CTS + Asignación Familiar
```

## ⚠️ **Consideraciones Importantes**

### **Requisitos Legales**
- **CTS**: Obligatorio para trabajadores dependientes
- **Asignación Familiar**: Solo para trabajadores que cumplan requisitos
- **Documentación**: Comprobantes válidos para asignación familiar
- **Cumplimiento**: Según normativa SUNAT vigente

### **Validaciones del Sistema**
- **Mes de inicio**: Debe estar entre 1 y 12
- **Cálculo automático**: Respetar flags de configuración
- **Meses de pago**: Solo en meses correspondientes
- **Montos**: Validar que sean positivos y razonables

### **Casos Especiales**
- **Trabajador nuevo**: Solo CTS si ya estaba empleado en mayo/noviembre
- **Trabajador con cese**: CTS proporcional hasta el mes de cese
- **Múltiples empleadores**: CTS solo del empleador principal
- **Hijos múltiples**: Asignación familiar no se multiplica por número de hijos

## 🔍 **Verificación de Cálculos**

### **Validación de CTS**
Para verificar que el cálculo de CTS es correcto:

1. **Identificar meses trabajados** desde el inicio
2. **Aplicar primer componente**: (Sueldo ÷ 12) × Meses
3. **Aplicar segundo componente**: (Sueldo ÷ 360) × 30
4. **Sumar componentes**: Base + Días = Total CTS

### **Validación de Asignación Familiar**
Para verificar que la asignación familiar es correcta:

1. **Verificar requisitos**: Hijos menores de 18 o estudiando
2. **Confirmar monto**: S/ 75.00 mensual
3. **Verificar frecuencia**: Todos los meses del año
4. **Validar total anual**: S/ 900.00

### **Validación en el Sistema**
El sistema proporciona desglose detallado:

#### **Para CTS:**
- `ctsBase`: Cálculo por meses trabajados
- `ctsDias`: Cálculo por días trabajados
- `ctsTotal`: Total de CTS del mes

#### **Para Asignación Familiar:**
- `asignacionFamiliar`: Monto mensual (S/ 75.00)
- `totalAsignacionFamiliar`: Total anual
- **Integración**: Incluido en `totalMonthlyIncome`

## 📚 **Referencias Legales**

### **CTS**
- **Ley de CTS**: Ley N° 27360
- **Reglamento**: D.S. N° 001-97-TR
- **Modificaciones**: Según normativa vigente 2025

### **Asignación Familiar**
- **Constitución Política del Perú**: Artículo 24
- **Ley de Asignación Familiar**: Ley N° 25151
- **Reglamento**: D.S. N° 004-2002-TR
- **Monto 2025**: S/ 75.00 (10% de RMLV)

## 🚀 **Próximas Actualizaciones**

### **Funcionalidades Planificadas**
- **Historial de CTS**: Por trabajador y año
- **Historial de asignación familiar**: Por trabajador y año
- **Reportes consolidados**: CTS + asignación familiar
- **Integración**: Con sistemas de nómina externos

### **Mejoras Técnicas**
- **Performance**: Optimización de cálculos
- **Validaciones**: Reglas de negocio adicionales
- **Interfaz**: Formularios específicos para CTS y asignación familiar
- **Exportación**: Formatos estándar para contabilidad

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0
**Sistema**: SUNAT Calculator 2025
**Cumplimiento**: Normativa peruana vigente
**Fuentes**: 
- [Noticiero Contable - CTS](https://noticierocontable.com/algunos-datos-sobre-la-cts/)
- [TUO Compensación por Tiempo de Servicios](https://cdn.www.gob.pe/uploads/document/file/229267/TUO_Compensacion_por_Tiempo_de_Servicios_-_D.S_001-97-TR.pdf)
