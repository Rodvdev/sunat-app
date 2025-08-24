# Diagrama de Secuencia - Registro de Trabajador

```mermaid
sequenceDiagram
   actor RRHH
   participant Sistema
   participant BaseDatos
   participant SUNAT

   RRHH->>Sistema: Inicia registro de nuevo trabajador
   Sistema->>RRHH: Solicita datos básicos del trabajador
   RRHH->>Sistema: Ingresa DNI, nombre, fecha de ingreso
   
   Sistema->>Sistema: Valida formato de DNI (8 dígitos)
   Sistema->>Sistema: Valida fecha de ingreso (no futura)
   
   alt Datos válidos
       Sistema->>BaseDatos: Verifica si DNI ya existe
       BaseDatos-->>Sistema: Confirma DNI único
       Sistema->>BaseDatos: Registra trabajador
       BaseDatos-->>Sistema: Confirma registro exitoso
       Sistema->>RRHH: Solicita información del empleador
       RRHH->>Sistema: Ingresa RUC y datos del empleador
       Sistema->>SUNAT: Valida RUC del empleador
       SUNAT-->>Sistema: Confirma RUC válido y habido
       Sistema->>BaseDatos: Registra relación trabajador-empleador
       BaseDatos-->>Sistema: Confirma relación registrada
       Sistema-->>RRHH: Trabajador registrado exitosamente
   else Datos inválidos
       Sistema-->>RRHH: Muestra errores de validación
       RRHH->>Sistema: Corrige datos
       Sistema->>Sistema: Revalida información
   end
   
   Sistema->>RRHH: Solicita remuneración mensual base
   RRHH->>Sistema: Ingresa salario mensual
   Sistema->>Sistema: Calcula proyección anual inicial
   Sistema->>BaseDatos: Guarda configuración inicial
   Sistema-->>RRHH: Registro completado con proyección inicial
```

## Descripción del Proceso

### 1. **Inicio del Registro**
- RRHH inicia el proceso de registro
- Sistema solicita datos obligatorios del trabajador

### 2. **Validación de Datos**
- **DNI**: Formato de 8 dígitos, verificación de unicidad
- **Nombre**: Validación de caracteres válidos
- **Fecha de ingreso**: No puede ser futura

### 3. **Registro en Base de Datos**
- Verificación de DNI único
- Almacenamiento de datos del trabajador
- Creación de registro principal

### 4. **Asignación de Empleador**
- Ingreso de RUC del empleador
- Validación con SUNAT (estado habido)
- Registro de relación laboral

### 5. **Configuración Inicial**
- Definición de remuneración base
- Cálculo de proyección anual inicial
- Almacenamiento de configuración

### 6. **Confirmación**
- Registro exitoso del trabajador
- Proyección fiscal inicial calculada
- Sistema listo para cálculos mensuales
