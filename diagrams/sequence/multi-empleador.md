# Diagrama de Secuencia - Escenario Multi-Empleador

```mermaid
sequenceDiagram
   actor RRHH
   participant Sistema
   participant BaseDatos
   participant SUNAT
   participant Calculadora

   RRHH->>Sistema: Registra trabajador con múltiples empleadores
   Sistema->>RRHH: Solicita designación de empleador principal
   RRHH->>Sistema: Designa empleador principal para retenciones
   
   Sistema->>BaseDatos: Guarda configuración multi-empleador
   BaseDatos-->>Sistema: Confirma configuración
   
   loop Para cada empleador secundario
       RRHH->>Sistema: Ingresa datos del empleador secundario
       Sistema->>SUNAT: Valida RUC del empleador
       SUNAT-->>Sistema: Confirma RUC válido
       Sistema->>BaseDatos: Registra empleador secundario
       BaseDatos-->>Sistema: Confirma registro
   end
   
   RRHH->>Sistema: Carga constancias de retenciones previas
   Sistema->>Sistema: Valida formato de constancias
   Sistema->>Sistema: Extrae datos de retenciones
   
   Sistema->>BaseDatos: Almacena constancias validadas
   BaseDatos-->>Sistema: Confirma almacenamiento
   
   Sistema->>Calculadora: Inicia cálculo consolidado
   Calculadora->>Calculadora: Obtiene retenciones del empleador principal
   Calculadora->>Calculadora: Consolida retenciones de empleadores secundarios
   Calculadora->>Calculadora: Calcula total de retenciones acumuladas
   
   Calculadora->>Calculadora: Aplica deducción de 7 UIT
   Calculadora->>Calculadora: Aplica gastos deducibles (si aplican)
   Calculadora->>Calculadora: Calcula renta neta imponible
   Calculadora->>Calculadora: Aplica escala progresiva de impuestos
   
   Calculadora->>Calculadora: Compara retenciones acumuladas con impuesto anual
   
   alt Retenciones < Impuesto Anual
       Calculadora->>Calculadora: Calcula saldo por regularizar
       Calculadora->>Calculadora: Determina retención mensual adicional
   else Retenciones ≥ Impuesto Anual
       Calculadora->>Calculadora: Identifica saldo a favor
       Calculadora->>Calculadora: Ajusta retenciones futuras
   end
   
   Calculadora-->>Sistema: Devuelve cálculo consolidado
   Sistema->>BaseDatos: Guarda resultado consolidado
   BaseDatos-->>Sistema: Confirma guardado
   
   Sistema->>RRHH: Muestra resumen consolidado
   Sistema->>RRHH: Genera reporte multi-empleador
   Sistema->>RRHH: Muestra retenciones por empleador
   Sistema->>RRHH: Informa saldo por regularizar o a favor
```

## Descripción del Proceso

### 1. **Configuración Multi-Empleador**
- Registro de trabajador con múltiples empleadores
- Designación de empleador principal para retenciones
- Validación de RUC de cada empleador

### 2. **Gestión de Empleadores Secundarios**
- Registro de cada empleador secundario
- Validación de estado habido con SUNAT
- Almacenamiento de relaciones laborales

### 3. **Carga de Constancias**
- Ingreso de constancias de retenciones previas
- Validación de formato y contenido
- Extracción de datos de retenciones

### 4. **Cálculo Consolidado**
- **Retenciones del empleador principal**: Cálculo mensual
- **Retenciones de empleadores secundarios**: Consolidación de constancias
- **Total acumulado**: Suma de todas las retenciones

### 5. **Aplicación de Deducciones**
- Deducción estándar de 7 UIT (S/ 37,450)
- Gastos deducibles (máximo 3 UIT)
- Renta neta imponible consolidada

### 6. **Comparación y Resultado**
- **Saldo por regularizar**: Si retenciones < impuesto anual
- **Saldo a favor**: Si retenciones ≥ impuesto anual
- **Ajuste de retenciones**: Distribución en meses restantes

### 7. **Reporte Consolidado**
- Resumen de retenciones por empleador
- Total consolidado del ejercicio
- Saldo por regularizar o a favor
- Recomendaciones de retención adicional

### 8. **Consideraciones Importantes**
- Solo un empleador puede retener impuestos
- Constancias deben ser válidas y vigentes
- Consolidación automática de retenciones previas
- Cálculo proporcional de saldos pendientes
