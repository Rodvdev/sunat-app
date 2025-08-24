# Diagrama de Secuencia - Cese de Trabajador

```mermaid
sequenceDiagram
   actor RRHH
   participant Sistema
   participant BaseDatos
   participant Calculadora
   participant SUNAT

   RRHH->>Sistema: Registra cese de trabajador
   Sistema->>RRHH: Solicita fecha y motivo del cese
   RRHH->>Sistema: Ingresa fecha de cese y motivo
   
   Sistema->>Sistema: Valida fecha de cese (no futura)
   Sistema->>BaseDatos: Obtiene datos del trabajador
   BaseDatos-->>Sistema: Devuelve información del trabajador
   
   Sistema->>Calculadora: Inicia cálculo de liquidación final
   Calculadora->>Calculadora: Determina meses trabajados en el año
   Calculadora->>Calculadora: Calcula ingresos hasta fecha de cese
   Calculadora->>Calculadora: Aplica deducción proporcional de 7 UIT
   Calculadora->>Calculadora: Calcula gastos deducibles hasta cese
   
   Calculadora->>Calculadora: Calcula renta neta proporcional
   Calculadora->>Calculadora: Aplica escala progresiva de impuestos
   Calculadora->>Calculadora: Calcula impuesto anual proporcional
   
   Calculadora->>Calculadora: Obtiene retenciones acumuladas hasta cese
   Calculadora->>Calculadora: Compara retenciones con impuesto proporcional
   
   alt Retenciones < Impuesto Proporcional
       Calculadora->>Calculadora: Calcula saldo por regularizar
       Calculadora->>Calculadora: Determina retención final del mes de cese
   else Retenciones ≥ Impuesto Proporcional
       Calculadora->>Calculadora: Identifica saldo a favor
       Calculadora->>Calculadora: Calcula devolución o ajuste
   end
   
   Calculadora-->>Sistema: Devuelve liquidación final
   Sistema->>BaseDatos: Guarda liquidación final
   BaseDatos-->>Sistema: Confirma guardado
   
   Sistema->>Sistema: Genera constancia de liquidación final
   Sistema->>Sistema: Prepara reporte de cese para SUNAT
   
   Sistema->>RRHH: Muestra liquidación final
   Sistema->>RRHH: Genera constancia de liquidación
   Sistema->>RRHH: Muestra saldo por regularizar o a favor
   
   Sistema->>BaseDatos: Marca trabajador como cesado
   BaseDatos-->>Sistema: Confirma cambio de estado
   
   Sistema->>SUNAT: Envía reporte de cese (si aplica)
   SUNAT-->>Sistema: Confirma recepción del reporte
   
   Sistema->>RRHH: Confirma proceso de cese completado
   Sistema->>RRHH: Genera reporte final del trabajador
```

## Descripción del Proceso

### 1. **Registro de Cese**
- RRHH registra fecha y motivo del cese
- Sistema valida fecha (no puede ser futura)
- Obtención de datos del trabajador

### 2. **Cálculo de Liquidación Final**
- **Meses trabajados**: Desde enero hasta mes de cese
- **Ingresos proporcionales**: Salario × meses trabajados + adicionales
- **Deducción 7 UIT**: Proporcional a meses trabajados
- **Gastos deducibles**: Acumulados hasta fecha de cese

### 3. **Cálculo de Impuesto Proporcional**
- **Renta neta**: Ingresos proporcionales - 7 UIT proporcional - Gastos deducibles
- **Escala progresiva**: Aplicación de tasas vigentes
- **Impuesto anual**: Proporcional a meses trabajados

### 4. **Comparación Final**
- **Retenciones acumuladas**: Hasta mes de cese
- **Saldo por regularizar**: Si retenciones < impuesto proporcional
- **Saldo a favor**: Si retenciones ≥ impuesto proporcional

### 5. **Liquidación Final**
- **Retención final**: Saldo por regularizar (si aplica)
- **Ajuste de retenciones**: Distribución proporcional
- **Cálculo de devolución**: Saldo a favor (si aplica)

### 6. **Documentación y Reportes**
- **Constancia de liquidación**: Documento oficial del cese
- **Reporte para SUNAT**: Información de cese y liquidación
- **Reporte final**: Resumen completo del trabajador

### 7. **Cambio de Estado**
- Marcado de trabajador como cesado
- Bloqueo de futuras operaciones
- Archivo de datos históricos

### 8. **Consideraciones Importantes**
- **Proporcionalidad**: Todos los cálculos son proporcionales a meses trabajados
- **Retenciones**: Solo se consideran hasta el mes de cese
- **Gastos deducibles**: Acumulados hasta fecha de cese
- **Documentación**: Generación obligatoria de constancia de liquidación
- **SUNAT**: Reporte de cese según normativa vigente
