# Diagrama de Secuencia - Gestión de Gastos Deducibles

```mermaid
sequenceDiagram
   actor Trabajador
   participant Sistema
   participant BaseDatos
   participant SUNAT
   participant Calculadora

   Trabajador->>Sistema: Ingresa gastos deducibles del mes
   Sistema->>Sistema: Valida formato de datos
   
   Sistema->>Sistema: Categoriza gastos por tipo
   Sistema->>Sistema: Aplica porcentajes de deducción
   
   Sistema->>Calculadora: Calcula deducciones por categoría
   Calculadora->>Calculadora: Restaurantes: 15% del gasto
   Calculadora->>Calculadora: Servicios médicos: 30% del gasto
   Calculadora->>Calculadora: Servicios profesionales: 30% del gasto
   Calculadora->>Calculadora: Alquiler: 30% del gasto
   Calculadora->>Calculadora: EsSalud: 100% del aporte
   
   Calculadora->>Calculadora: Suma total de deducciones
   Calculadora->>Calculadora: Verifica límite de 3 UIT (S/ 16,050)
   
   alt Total deducciones > 3 UIT
       Calculadora->>Calculadora: Limita deducción a 3 UIT
       Calculadora->>Calculadora: Calcula deducción restante disponible
   else Total deducciones ≤ 3 UIT
       Calculadora->>Calculadora: Aplica deducciones completas
       Calculadora->>Calculadora: Deducción restante = 3 UIT - total
   end
   
   Calculadora-->>Sistema: Devuelve resumen de deducciones
   Sistema->>BaseDatos: Guarda gastos y deducciones
   BaseDatos-->>Sistema: Confirma guardado
   
   Sistema->>SUNAT: Valida comprobantes (si aplica)
   SUNAT-->>Sistema: Confirma validez de comprobantes
   
   Sistema->>Trabajador: Muestra resumen de deducciones
   Sistema->>Trabajador: Informa límite aplicado
   Sistema->>Trabajador: Muestra deducción restante disponible
   
   Sistema->>Calculadora: Recalcula impuesto con deducciones
   Calculadora->>Calculadora: Aplica deducciones a renta neta
   Calculadora->>Calculadora: Recalcula impuesto anual
   Calculadora-->>Sistema: Devuelve nuevo cálculo
   
   Sistema->>Trabajador: Muestra impacto en impuesto anual
   Sistema->>Trabajador: Genera reporte de gastos deducibles
```

## Descripción del Proceso

### 1. **Ingreso de Gastos**
- Trabajador ingresa gastos por categoría
- Sistema valida formato y montos
- Categorización automática por tipo

### 2. **Cálculo de Deducciones**
- **Restaurantes, bares y hoteles**: 15%
- **Servicios médicos y odontológicos**: 30%
- **Servicios profesionales y oficios**: 30%
- **Alquiler de inmuebles**: 30%
- **Aportaciones a EsSalud**: 100%

### 3. **Aplicación de Límites**
- **Límite máximo**: 3 UIT (S/ 16,050)
- **Verificación**: Total deducciones ≤ 3 UIT
- **Ajuste**: Si excede, se limita al máximo

### 4. **Validación de Comprobantes**
- Verificación con SUNAT
- Validación de estado habido del emisor
- Confirmación de actividad económica

### 5. **Recálculo de Impuestos**
- Aplicación de deducciones a renta neta
- Recalculación de impuesto anual
- Actualización de proyecciones

### 6. **Resultado y Documentación**
- Resumen de deducciones aplicadas
- Impacto en impuesto anual
- Reporte de gastos deducibles
- Deducción restante disponible

### 7. **Restricciones Importantes**
- Solo aplica si ingresos > 7 UIT (S/ 37,450)
- Comprobantes válidos obligatorios
- Medios de pago electrónicos para montos ≥ S/ 2,000
- Vigencia hasta 31 de diciembre de 2025
