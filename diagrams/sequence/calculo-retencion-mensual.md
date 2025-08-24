# Diagrama de Secuencia - Cálculo de Retención Mensual

```mermaid
sequenceDiagram
   actor RRHH
   participant Sistema
   participant BaseDatos
   participant Calculadora

   RRHH->>Sistema: Solicita cálculo de retención mensual
   Sistema->>BaseDatos: Obtiene datos del trabajador
   BaseDatos-->>Sistema: Devuelve información del trabajador
   
   Sistema->>RRHH: Solicita ingresos del mes
   RRHH->>Sistema: Ingresa salario base + adicionales
   
   Sistema->>Sistema: Valida montos ingresados
   Sistema->>Calculadora: Inicia cálculo de retención
   
   Calculadora->>Calculadora: Calcula proyección anual
   Calculadora->>Calculadora: Aplica deducción de 7 UIT
   Calculadora->>Calculadora: Calcula gastos deducibles (si aplican)
   Calculadora->>Calculadora: Determina renta neta imponible
   Calculadora->>Calculadora: Aplica escala progresiva de impuestos
   Calculadora->>Calculadora: Calcula impuesto anual proyectado
   
   alt Mes ≤ 3 (Enero-Marzo)
       Calculadora->>Calculadora: Aplica método proporcional
       Calculadora->>Calculadora: Calcula retención acumulada objetivo
       Calculadora->>Calculadora: Determina retención mensual
   else Mes > 3 (Abril-Diciembre)
       Calculadora->>Calculadora: Aplica método de saldo
       Calculadora->>Calculadora: Calcula meses restantes
       Calculadora->>Calculadora: Distribuye saldo pendiente
   end
   
   Calculadora-->>Sistema: Devuelve resultado del cálculo
   Sistema->>BaseDatos: Guarda cálculo mensual
   BaseDatos-->>Sistema: Confirma guardado
   
   Sistema->>RRHH: Muestra resultado del cálculo
   Sistema->>RRHH: Genera constancia mensual
   Sistema->>RRHH: Muestra proyección actualizada
```

## Descripción del Proceso

### 1. **Solicitud de Cálculo**
- RRHH solicita cálculo para un mes específico
- Sistema recupera datos del trabajador

### 2. **Ingreso de Datos**
- Salario base del mes
- Ingresos adicionales (bonos, comisiones, etc.)
- Gastos deducibles (si aplican)

### 3. **Cálculo de Proyección**
- **Proyección anual**: Salario × 12 + adicionales
- **Deducción 7 UIT**: S/ 37,450
- **Gastos deducibles**: Máximo 3 UIT (S/ 16,050)
- **Renta neta**: Ingresos - 7 UIT - Gastos deducibles

### 4. **Aplicación de Impuestos**
- Escala progresiva (8% a 30%)
- Impuesto anual proyectado
- Comparación con retenciones previas

### 5. **Método de Cálculo Mensual**
- **Enero-Marzo**: Método proporcional
  - Objetivo acumulado = Impuesto × (mes / 12)
  - Retención = Objetivo - Retenciones previas
- **Abril-Diciembre**: Método de saldo
  - Meses restantes = 13 - mes actual
  - Retención mensual = Saldo pendiente / meses restantes

### 6. **Resultado y Documentación**
- Retención mensual calculada
- Constancia mensual generada
- Proyección anual actualizada
- Almacenamiento en base de datos
