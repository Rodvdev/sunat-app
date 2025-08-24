# Diagrama de Secuencia - Flujo Principal del Sistema SUNAT

```mermaid
sequenceDiagram
   actor Trabajador
   actor RRHH
   participant Sistema
   participant BaseDatos
   participant Calculadora

   Note over Trabajador,Calculadora: FLUJO PRINCIPAL DEL SISTEMA SUNAT 2025

   %% REGISTRO INICIAL
   RRHH->>Sistema: Registra trabajador + empleador
   Sistema->>BaseDatos: Guarda datos básicos
   Sistema->>Calculadora: Calcula proyección inicial
   
   %% OPERACIONES MENSUALES
   loop Cada mes
       RRHH->>Sistema: Ingresa salario mensual
       RRHH->>Sistema: Ingresa ingresos adicionales
       Note over RRHH,Sistema: Incluye: gratificaciones, bonificaciones, utilidades, CTS, asignación familiar
       Trabajador->>Sistema: Gastos deducibles (opcional)
       Sistema->>Calculadora: Calcula retención mensual
       Calculadora-->>Sistema: Retención + proyección
       Sistema->>BaseDatos: Guarda cálculo mensual
   end
   
   %% CÁLCULO FINAL
   Trabajador->>Sistema: Solicita cálculo anual
   Sistema->>Calculadora: Cálculo final consolidado
   Calculadora-->>Sistema: Impuesto anual vs retenciones
   Sistema-->>Trabajador: Resultado final + documentación
   
   Note over Trabajador,Calculadora: SISTEMA COMPLETO CON AUDITORÍA AUTOMÁTICA
```

## Descripción Resumida

### **Flujo Principal**
1. **Registro**: Trabajador + empleador + remuneración base
2. **Mensual**: Salarios + ingresos adicionales + gastos deducibles + retenciones
3. **Final**: Cálculo anual consolidado + resultado

### **Ingresos Adicionales Incluidos**
- **Gratificaciones**: Julio y Diciembre (o mes personalizado)
- **Bonificaciones**: Mes personalizable
- **Utilidades**: Mes personalizable
- **CTS**: Compensación por Tiempo de Servicios (Mayo y Noviembre)
- **Asignación Familiar**: Mensual
- **Ingreso Adicional**: Monto único en mes específico

### **Características Clave**
- **Gastos Deducibles**: Máximo 3 UIT (2025)
- **Métodos**: Proporcional (Enero-Marzo) y Saldo (Abril-Diciembre)
- **Auditoría**: Automática en todos los cambios
- **Documentación**: Constancias mensuales y anuales

### **Componentes**
- **Frontend**: Next.js 14 + TypeScript
- **Backend**: API Routes + Zod + Prisma
- **Base de Datos**: PostgreSQL
- **Testing**: Jest completo

### **Despliegue**
- **Plataforma**: Vercel
- **CI/CD**: Automático
- **Monitoreo**: Logs en tiempo real
