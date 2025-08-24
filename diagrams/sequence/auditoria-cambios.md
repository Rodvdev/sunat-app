# Diagrama de Secuencia - Auditoría de Cambios

```mermaid
sequenceDiagram
   actor Usuario
   participant Sistema
   participant BaseDatos
   participant Auditoria
   participant Logs

   Usuario->>Sistema: Realiza cambio en datos del trabajador
   Sistema->>Sistema: Detecta modificación de datos
   Sistema->>Auditoria: Inicia proceso de auditoría
   
   Auditoria->>Auditoria: Captura estado anterior
   Auditoria->>Auditoria: Captura estado nuevo
   Auditoria->>Auditoria: Identifica tipo de cambio
   Auditoria->>Auditoria: Genera hash de seguridad
   
   Auditoria->>Logs: Registra evento de auditoría
   Logs->>Logs: Almacena timestamp del cambio
   Logs->>Logs: Registra usuario que realizó el cambio
   Logs->>Logs: Almacena IP y sesión del usuario
   
   Auditoria->>BaseDatos: Guarda registro de auditoría
   BaseDatos-->>Auditoria: Confirma guardado
   
   Sistema->>Sistema: Valida integridad del cambio
   Sistema->>Sistema: Verifica permisos del usuario
   
   alt Cambio válido y autorizado
       Sistema->>BaseDatos: Aplica cambio a datos principales
       BaseDatos-->>Sistema: Confirma aplicación del cambio
       Sistema->>Auditoria: Marca cambio como exitoso
       Auditoria->>Logs: Registra éxito de la operación
   else Cambio inválido o no autorizado
       Sistema->>Auditoria: Marca cambio como fallido
       Auditoria->>Logs: Registra fallo de la operación
       Sistema-->>Usuario: Muestra error de validación
   end
   
   Sistema->>Auditoria: Solicita historial de cambios
   Auditoria->>BaseDatos: Consulta historial de auditoría
   BaseDatos-->>Auditoria: Devuelve historial de cambios
   Auditoria-->>Sistema: Devuelve historial completo
   
   Sistema->>Usuario: Muestra confirmación del cambio
   Sistema->>Usuario: Ofrece acceso al historial de auditoría
   
   Usuario->>Sistema: Solicita historial de auditoría
   Sistema->>Auditoria: Obtiene historial detallado
   Auditoria->>Logs: Recupera logs de auditoría
   Logs-->>Auditoria: Devuelve logs del trabajador
   Auditoria-->>Sistema: Devuelve historial completo
   
   Sistema->>Usuario: Muestra historial de auditoría
   Sistema->>Usuario: Permite exportar reporte de auditoría
```

## Descripción del Proceso

### 1. **Detección de Cambios**
- Sistema detecta automáticamente modificaciones
- Inicio inmediato del proceso de auditoría
- Captura de estado anterior y nuevo

### 2. **Registro de Auditoría**
- **Timestamp**: Fecha y hora exacta del cambio
- **Usuario**: Identificación del usuario que realizó el cambio
- **IP y sesión**: Información de seguridad
- **Tipo de cambio**: Clasificación del tipo de modificación

### 3. **Generación de Hash de Seguridad**
- **Hash del cambio**: Identificación única de la modificación
- **Integridad**: Verificación de que el cambio no fue alterado
- **No repudio**: Garantía de que el cambio fue realizado

### 4. **Validación y Aplicación**
- **Validación**: Verificación de permisos y reglas de negocio
- **Autorización**: Confirmación de que el usuario puede realizar el cambio
- **Aplicación**: Implementación del cambio en la base de datos

### 5. **Registro de Resultado**
- **Éxito**: Cambio aplicado correctamente
- **Fallo**: Error en la aplicación del cambio
- **Logs**: Registro detallado del resultado

### 6. **Historial de Auditoría**
- **Consulta**: Acceso al historial completo de cambios
- **Filtros**: Búsqueda por fecha, usuario, tipo de cambio
- **Exportación**: Generación de reportes de auditoría

### 7. **Tipos de Cambios Auditados**
- **Datos personales**: Nombre, DNI, fecha de ingreso
- **Información laboral**: Salario, empleador, fecha de cese
- **Ingresos**: Modificaciones de salarios y adicionales
- **Gastos deducibles**: Cambios en gastos y deducciones
- **Configuración**: Cambios en parámetros del sistema

### 8. **Seguridad y Cumplimiento**
- **Retención**: Logs conservados por 5 años según normativa
- **Acceso**: Solo usuarios autorizados pueden ver historial
- **Integridad**: Hash de seguridad para verificar cambios
- **Trazabilidad**: Rastro completo de todas las modificaciones
- **Cumplimiento**: Adherencia a estándares de auditoría SUNAT
