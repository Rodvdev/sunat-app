# 📋 Especificación de Software - Calculadora de Retención SUNAT 5ta Categoría

## 1. Descripción General

### 1.1 Propósito
Desarrollar un software para la SUNAT que permita calcular el porcentaje de retención de los trabajadores de quinta categoría para el ejercicio actual, considerando ingresos mensuales, gratificaciones, bonificaciones, utilidades y otros adicionales, con soporte completo para multi-empleador y cambios de trabajo durante el año.

### 1.2 Alcance
- Cálculo de retenciones mensuales de renta de 5ta categoría
- Proyección anual de impuestos con soporte para ingreso en cualquier mes
- Manejo de trabajadores con múltiples empleadores simultáneos
- Carga y consolidación de retenciones previas certificadas
- Cálculo de retenciones considerando adicionales variables con políticas específicas
- Generación de reportes mensuales detallados con trazabilidad completa
- Soporte para cese de trabajo con liquidación final

### 1.3 Usuarios Objetivo
- Personal de recursos humanos
- Contadores y asesores tributarios
- Personal de la SUNAT
- Empresas que requieran calcular retenciones de 5ta categoría
- Auditores internos y externos

---

## 2. Requisitos Funcionales

### 2.1 Gestión de Trabajadores
- **RF-001**: Registrar trabajador con datos básicos (nombre, DNI, fecha de ingreso)
- **RF-002**: Permitir ingreso de trabajador en cualquier mes del año
- **RF-003**: Editar información del trabajador
- **RF-004**: Eliminar trabajador del sistema
- **RF-005**: Registrar cese de trabajo con fecha y motivo
- **RF-006**: Gestionar múltiples empleadores simultáneos

### 2.2 Gestión de Empleadores
- **RF-007**: Registrar empleadores con datos fiscales
- **RF-008**: Designar empleador principal para retenciones
- **RF-009**: Cargar constancias de retenciones de otros empleadores
- **RF-010**: Consolidar retenciones previas certificadas

### 2.3 Configuración del Ejercicio
- **RF-011**: Configurar año fiscal
- **RF-012**: Configurar valor de UIT del año
- **RF-013**: Configurar tasas de impuestos por tramos con vigencia
- **RF-014**: Configurar política de redondeo (2 decimales, half-up)
- **RF-015**: Gestionar cambios de tasas intra-año

### 2.4 Gestión de Ingresos
- **RF-016**: Ingresar remuneración mensual base
- **RF-017**: Registrar gratificaciones legales (julio/diciembre)
- **RF-018**: Registrar bonificaciones extraordinarias
- **RF-019**: Registrar utilidades con reglas específicas
- **RF-020**: Registrar otros adicionales (comisiones, horas extras, etc.)
- **RF-021**: Clasificar tipo de adicional y política de proyección
- **RF-022**: Modificar ingresos de meses anteriores con auditoría

### 2.5 Cálculos de Retención
- **RF-023**: Calcular proyección anual de ingresos (considerando mes de ingreso)
- **RF-024**: Aplicar deducción de 7 UIT
- **RF-025**: Calcular renta neta proyectada
- **RF-026**: Aplicar escala progresiva acumulativa versionada
- **RF-027**: Calcular impuesto anual proyectado
- **RF-028**: Calcular retenciones mensuales (método proporcional enero-marzo, método saldo abril-diciembre)
- **RF-029**: Recalcular retenciones cuando se modifican ingresos o adicionales
- **RF-030**: Manejar liquidación final en caso de cese

### 2.6 Reportes y Visualización
- **RF-031**: Mostrar tabla mensual de cálculos con trazabilidad
- **RF-032**: Generar constancia mensual por trabajador
- **RF-033**: Generar reporte de retenciones por mes
- **RF-034**: Mostrar resumen anual con auditoría
- **RF-035**: Exportar reportes en formato PDF/Excel/CSV
- **RF-036**: Generar reporte de auditoría de cambios

---

## 3. Requisitos No Funcionales

### 3.1 Rendimiento
- **RNF-001**: El sistema debe responder en menos de 2 segundos para cálculos de un trabajador
- **RNF-002**: Soporte para hasta 1000 trabajadores simultáneos
- **RNF-003**: Cálculos en tiempo real sin recarga de página
- **RNF-004**: Re-proyección mensual en menos de 1 segundo

### 3.2 Usabilidad
- **RNF-005**: Interfaz intuitiva y fácil de usar
- **RNF-006**: Formularios con validación en tiempo real
- **RNF-007**: Mensajes de error claros y específicos
- **RNF-008**: Diseño responsive para diferentes dispositivos
- **RNF-009**: Wizards para flujos complejos (multi-empleador, cese)

### 3.3 Seguridad y Privacidad
- **RNF-010**: Autenticación de usuarios con MFA
- **RNF-011**: Control de acceso basado en roles (RRHH, Auditor, Admin)
- **RNF-012**: Auditoría completa de cambios en cálculos
- **RNF-013**: Cifrado en reposo para datos PII (DNI, nombre)
- **RNF-014**: TLS 1.3 en tránsito
- **RNF-015**: Retención de logs conforme a política (5 años)
- **RNF-016**: Backup automático de datos con cifrado

### 3.4 Compatibilidad
- **RNF-017**: Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)
- **RNF-018**: Funcionamiento en dispositivos móviles
- **RNF-019**: Compatible con Vercel deployment
- **RNF-020**: Soporte para importación de constancias SUNAT

---

## 4. Arquitectura del Sistema

### 4.1 Tecnologías Recomendadas
- **Frontend**: Next.js 14 con TypeScript
- **Backend**: API Routes de Next.js
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Deployment**: Vercel
- **UI Framework**: Tailwind CSS + Headless UI
- **Validación**: Zod
- **Testing**: Jest + Testing Library
- **Cifrado**: bcrypt para hashes, AES-256 para datos sensibles

### 4.2 Estructura de Base de Datos

```sql
-- Tabla de trabajadores
CREATE TABLE workers (
  id SERIAL PRIMARY KEY,
  dni VARCHAR(8) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  start_month INTEGER NOT NULL CHECK (start_month >= 1 AND start_month <= 12),
  end_date DATE NULL, -- Para cese
  end_reason VARCHAR(255) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de empleadores
CREATE TABLE employers (
  id SERIAL PRIMARY KEY,
  ruc VARCHAR(11) UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  tax_address TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de contratos de empleo
CREATE TABLE employment_contracts (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER REFERENCES workers(id) ON DELETE CASCADE,
  employer_id INTEGER REFERENCES employers(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(worker_id, employer_id, start_date)
);

-- Tabla de configuración anual
CREATE TABLE yearly_config (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  uit_value DECIMAL(10,2) NOT NULL,
  deduction_7uit DECIMAL(10,2) NOT NULL,
  rounding_policy VARCHAR(20) NOT NULL DEFAULT 'half-up',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(year)
);

-- Tabla de tramos fiscales por vigencia
CREATE TABLE tax_tiers (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  tier_order INTEGER NOT NULL,
  min_uit DECIMAL(8,2) NOT NULL,
  max_uit DECIMAL(8,2) NULL, -- NULL para último tramo
  min_amount DECIMAL(12,2) NOT NULL,
  max_amount DECIMAL(12,2) NULL,
  rate_pct DECIMAL(5,2) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(year, tier_order, effective_from)
);

-- Tabla de ingresos mensuales
CREATE TABLE monthly_income (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER REFERENCES workers(id) ON DELETE CASCADE,
  employer_id INTEGER REFERENCES employers(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  base_salary DECIMAL(10,2) NOT NULL DEFAULT 0,
  gratuity DECIMAL(10,2) NOT NULL DEFAULT 0,
  bonus DECIMAL(10,2) NOT NULL DEFAULT 0,
  utilities DECIMAL(10,2) NOT NULL DEFAULT 0,
  other_additional DECIMAL(10,2) NOT NULL DEFAULT 0,
  income_source_type VARCHAR(50) NOT NULL DEFAULT 'regular', -- 'regular', 'gratuity', 'bonus', 'utilities', 'other'
  projection_policy VARCHAR(20) NOT NULL DEFAULT 'monthly', -- 'monthly', 'prorated', 'annual'
  notes TEXT NULL,
  total_income DECIMAL(10,2) GENERATED ALWAYS AS (
    base_salary + gratuity + bonus + utilities + other_additional
  ) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(worker_id, employer_id, year, month)
);

-- Tabla de retenciones previas certificadas
CREATE TABLE prior_withholdings (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER REFERENCES workers(id) ON DELETE CASCADE,
  employer_id INTEGER REFERENCES employers(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  amount DECIMAL(10,2) NOT NULL,
  certificate_number VARCHAR(50) NOT NULL,
  certificate_date DATE NOT NULL,
  source_employer VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(worker_id, employer_id, year, month)
);

-- Tabla de retenciones calculadas
CREATE TABLE monthly_retention (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER REFERENCES workers(id) ON DELETE CASCADE,
  employer_id INTEGER REFERENCES employers(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  projected_annual_income DECIMAL(12,2) NOT NULL,
  projected_net_income DECIMAL(12,2) NOT NULL,
  projected_tax DECIMAL(12,2) NOT NULL,
  expected_accumulated_retention DECIMAL(12,2) NOT NULL,
  previous_accumulated_retention DECIMAL(12,2) NOT NULL DEFAULT 0,
  monthly_retention DECIMAL(10,2) NOT NULL,
  calculation_method VARCHAR(20) NOT NULL, -- 'proportional' o 'balance'
  calculation_hash VARCHAR(64) NOT NULL, -- Para no repudio
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(worker_id, employer_id, year, month)
);

-- Tabla de logs de cálculo
CREATE TABLE calculation_logs (
  id SERIAL PRIMARY KEY,
  worker_id INTEGER REFERENCES workers(id) ON DELETE CASCADE,
  employer_id INTEGER REFERENCES employers(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  calculation_type VARCHAR(50) NOT NULL, -- 'initial', 'recalculation', 'adjustment'
  inputs JSONB NOT NULL, -- Datos de entrada
  formula_version VARCHAR(20) NOT NULL, -- Versión de la fórmula aplicada
  calculation_hash VARCHAR(64) NOT NULL, -- Hash del resultado
  user_id INTEGER NULL, -- Usuario que realizó el cálculo
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monthly_income_updated_at BEFORE UPDATE ON monthly_income FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monthly_retention_updated_at BEFORE UPDATE ON monthly_retention FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para optimización
CREATE INDEX idx_monthly_income_worker_year_month ON monthly_income(worker_id, year, month);
CREATE INDEX idx_monthly_retention_worker_year_month ON monthly_retention(worker_id, year, month);
CREATE INDEX idx_tax_tiers_year_effective ON tax_tiers(year, effective_from);
CREATE INDEX idx_calculation_logs_worker_year_month ON calculation_logs(worker_id, year, month);
```

---

## 5. Especificación de Funcionalidades

### 5.1 Flujo Principal de Cálculo (CORREGIDO)

```typescript
interface RetentionCalculation {
  workerId: number;
  employerId: number;
  year: number;
  month: number;
  baseSalary: number;
  additionalIncome: number;
  previousRetentions: number;
  priorWithholdings: number; // Retenciones certificadas de otros empleadores
  startMonth: number; // Mes de ingreso del trabajador
}

interface CalculationResult {
  projectedAnnualIncome: number;
  projectedNetIncome: number;
  projectedTax: number;
  expectedAccumulatedRetention: number;
  monthlyRetention: number;
  calculationMethod: 'proportional' | 'balance';
  calculationHash: string;
}

// Función de redondeo consistente (2 decimales, half-up)
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function calculateRetention(input: RetentionCalculation): CalculationResult {
  // 1. Proyección anual considerando mes de ingreso
  const projectedAnnualIncome = calculateProjectedAnnualIncome(input);
  
  // 2. Renta neta proyectada
  const projectedNetIncome = Math.max(0, projectedAnnualIncome - DEDUCTION_7UIT);
  
  // 3. Impuesto proyectado por tramos
  const projectedTax = calculateTaxByTiers(projectedNetIncome);
  
  // 4. Consolidar retenciones previas (propias + certificadas)
  const totalPreviousRetentions = input.previousRetentions + input.priorWithholdings;
  
  let calculationMethod: 'proportional' | 'balance';
  let monthlyRetention: number;
  let expectedAccumulatedRetention: number;

  if (input.month <= 3) {
    // Método proporcional (enero a marzo): objetivo acumulado y diferencia
    const targetAccumulated = projectedTax * (input.month / 12);
    monthlyRetention = Math.max(0, round2(targetAccumulated - totalPreviousRetentions));
    expectedAccumulatedRetention = round2(totalPreviousRetentions + monthlyRetention);
    calculationMethod = 'proportional';
  } else {
    // Método saldo (abril a diciembre): monto mensual directo
    const remainingMonths = 13 - input.month; // abril=9, mayo=8, ..., dic=1
    const remainingTax = Math.max(0, projectedTax - totalPreviousRetentions);
    monthlyRetention = round2(remainingTax / remainingMonths);
    expectedAccumulatedRetention = round2(totalPreviousRetentions + monthlyRetention);
    calculationMethod = 'balance';
  }

  // 5. Generar hash de cálculo para trazabilidad
  const calculationHash = generateCalculationHash({
    inputs: input,
    projectedTax,
    monthlyRetention,
    calculationMethod
  });

  return {
    projectedAnnualIncome,
    projectedNetIncome,
    projectedTax,
    expectedAccumulatedRetention,
    monthlyRetention,
    calculationMethod,
    calculationHash
  };
}

// Función para proyección anual considerando mes de ingreso
function calculateProjectedAnnualIncome(input: RetentionCalculation): number {
  const monthsRemaining = 13 - input.startMonth;
  
  // Opción A (conservadora): proyectar solo meses restantes
  const baseProjection = input.baseSalary * monthsRemaining;
  
  // Sumar adicionales futuros según política
  const additionalProjection = calculateAdditionalProjection(input);
  
  return round2(baseProjection + additionalProjection);
}

// Función para proyección de adicionales según política
function calculateAdditionalProjection(input: RetentionCalculation): number {
  // Implementar según políticas específicas de cada tipo de adicional
  // Gratificaciones legales: prorratear en meses restantes
  // Bonos extraordinarios: según política de empresa
  // Utilidades: reglas específicas SUNAT
  return 0; // Placeholder
}
```

### 5.2 Cálculo de Impuesto por Tramos (Versionado)

```typescript
interface TaxTier {
  id: number;
  year: number;
  tierOrder: number;
  minUIT: number;
  maxUIT: number | null;
  minAmount: number;
  maxAmount: number | null;
  ratePct: number;
  effectiveFrom: Date;
  effectiveTo: Date | null;
}

function calculateTaxByTiers(netIncome: number, year: number, calculationDate: Date): number {
  // Obtener tramos vigentes para la fecha de cálculo
  const activeTiers = getActiveTaxTiers(year, calculationDate);
  
  let totalTax = 0;
  let remainingIncome = netIncome;
  
  for (const tier of activeTiers) {
    if (remainingIncome <= 0) break;
    
    const tierAmount = Math.min(
      remainingIncome,
      (tier.maxAmount || Infinity) - tier.minAmount
    );
    
    if (tierAmount > 0) {
      totalTax += tierAmount * (tier.ratePct / 100);
      remainingIncome -= tierAmount;
    }
  }
  
  return round2(totalTax); // Redondeo consistente a 2 decimales
}

function getActiveTaxTiers(year: number, date: Date): TaxTier[] {
  // Consultar base de datos para tramos vigentes en la fecha
  return prisma.taxTiers.findMany({
    where: {
      year,
      effectiveFrom: { lte: date },
      OR: [
        { effectiveTo: null },
        { effectiveTo: { gte: date } }
      ]
    },
    orderBy: { tierOrder: 'asc' }
  });
}
```

### 5.3 Manejo de Multi-Empleador

```typescript
interface MultiEmployerCalculation {
  workerId: number;
  year: number;
  month: number;
  primaryEmployerId: number;
  secondaryEmployers: SecondaryEmployer[];
}

interface SecondaryEmployer {
  employerId: number;
  withholdings: PriorWithholding[];
}

function calculateMultiEmployerRetention(input: MultiEmployerCalculation): CalculationResult {
  // 1. Obtener retenciones del empleador principal
  const primaryRetention = getPrimaryEmployerRetention(input);
  
  // 2. Consolidar retenciones certificadas de otros empleadores
  const certifiedWithholdings = consolidateCertifiedWithholdings(input.secondaryEmployers);
  
  // 3. Calcular retención considerando consolidación
  return calculateRetention({
    ...input,
    previousRetentions: primaryRetention.previousRetentions,
    priorWithholdings: certifiedWithholdings.totalAmount
  });
}

function consolidateCertifiedWithholdings(secondaryEmployers: SecondaryEmployer[]): {
  totalAmount: number;
  details: PriorWithholding[];
} {
  let totalAmount = 0;
  const details: PriorWithholding[] = [];
  
  for (const employer of secondaryEmployers) {
    for (const withholding of employer.withholdings) {
      totalAmount += withholding.amount;
      details.push(withholding);
    }
  }
  
  return {
    totalAmount: round2(totalAmount),
    details
  };
}
```

---

## 6. Interfaz de Usuario

### 6.1 Páginas Principales

#### 6.1.1 Dashboard Principal
- Resumen de trabajadores activos por empleador
- Total de retenciones del mes actual consolidado
- Gráficos de retenciones por mes con filtros por empleador
- Alertas de cambios en ingresos o adicionales
- Acceso rápido a funcionalidades principales

#### 6.1.2 Gestión de Trabajadores
- Lista de trabajadores con búsqueda y filtros por empleador
- Formulario de registro/edición con validaciones
- Vista detallada de cada trabajador con historial
- Gestión de cese con liquidación final
- Importación de constancias de empleador anterior

#### 6.1.3 Gestión de Empleadores
- Lista de empleadores con datos fiscales
- Designación de empleador principal
- Carga de constancias de retenciones certificadas
- Validación de RUC y datos fiscales

#### 6.1.4 Calculadora de Retención
- Formulario de entrada de datos con validación en tiempo real
- Vista previa de cálculos con trazabilidad completa
- Tabla mensual de resultados con método de cálculo
- Botones de acción (guardar, exportar, imprimir, auditoría)
- Wizards para flujos complejos (multi-empleador, cese)

#### 6.1.5 Configuración del Sistema
- Configuración anual (UIT, tasas por vigencia)
- Configuración de empresa y empleadores
- Gestión de usuarios y permisos con RBAC
- Políticas de redondeo y cálculo

### 6.2 Componentes de UI

#### 6.2.1 Formulario de Trabajador
```typescript
interface WorkerForm {
  dni: string;
  name: string;
  startDate: Date;
  startMonth: number;
  baseSalary: number;
  primaryEmployerId: number;
  secondaryEmployerIds: number[];
}
```

#### 6.2.2 Formulario de Ingresos Mensuales
```typescript
interface MonthlyIncomeForm {
  year: number;
  month: number;
  baseSalary: number;
  gratuity: number;
  bonus: number;
  utilities: number;
  otherAdditional: number;
  incomeSourceType: 'regular' | 'gratuity' | 'bonus' | 'utilities' | 'other';
  projectionPolicy: 'monthly' | 'prorated' | 'annual';
  notes: string;
}
```

#### 6.2.3 Formulario de Multi-Empleador
```typescript
interface MultiEmployerForm {
  primaryEmployerId: number;
  secondaryEmployers: {
    employerId: number;
    certificateFile: File;
    certificateNumber: string;
    certificateDate: Date;
  }[];
}
```

#### 6.2.4 Tabla de Resultados
- Columnas: Mes, Ingreso, Adicionales, Proyección Anual, Renta Neta, Impuesto, Retención Acumulada, Retención del Mes, Método, Hash
- Filtros por año, trabajador y empleador
- Exportación a Excel/PDF/CSV
- Auditoría de cambios con historial

---

## 7. Casos de Uso

### 7.1 Caso de Uso: Calcular Retención de Nuevo Trabajador
1. Usuario accede al sistema
2. Registra nuevo trabajador con fecha de ingreso y empleador principal
3. Ingresa remuneración mensual base
4. Sistema calcula proyección anual (considerando mes de ingreso)
5. Sistema aplica deducción de 7 UIT
6. Sistema calcula impuesto por tramos vigentes
7. Sistema calcula retenciones mensuales según método
8. Usuario visualiza resultados en tabla mensual con trazabilidad
9. Usuario puede exportar constancia mensual o imprimir reporte

### 7.2 Caso de Uso: Multi-Empleador con Retenciones Certificadas
1. Usuario registra trabajador con múltiples empleadores
2. Designa empleador principal para retenciones
3. Carga constancias de retenciones de otros empleadores
4. Sistema valida constancias y consolida montos
5. Sistema recalcula retenciones considerando consolidación
6. Usuario visualiza retenciones consolidadas por mes
7. Sistema genera constancia consolidada para SUNAT

### 7.3 Caso de Uso: Modificar Ingresos y Recalcular
1. Usuario modifica ingresos de un mes específico
2. Sistema valida que solo se modifiquen meses anteriores
3. Sistema recalcula proyección anual
4. Sistema recalcula impuesto proyectado
5. Sistema recalcula retenciones desde el mes de modificación
6. Sistema actualiza tabla de resultados con nueva trazabilidad
7. Sistema registra log de auditoría del cambio
8. Usuario confirma cambios

### 7.4 Caso de Uso: Cese de Trabajador con Liquidación Final
1. Usuario registra cese de trabajador con fecha y motivo
2. Sistema calcula liquidación final del mes de cese
3. Sistema ajusta proyección anual a meses trabajados
4. Sistema recalcula retenciones finales
5. Sistema genera constancia de liquidación final
6. Usuario puede exportar constancia para declaración anual

### 7.5 Caso de Uso: Configurar Ejercicio Fiscal
1. Administrador accede a configuración
2. Ingresa nuevo valor de UIT
3. Configura tasas por tramos con fechas de vigencia
4. Sistema valida datos y consistencia
5. Sistema actualiza configuración
6. Sistema recalcula todas las retenciones activas
7. Sistema genera reporte de impacto de cambios

---

## 8. Validaciones y Reglas de Negocio

### 8.1 Validaciones de Entrada
- DNI debe tener 8 dígitos numéricos únicos
- Fecha de ingreso no puede ser futura
- Mes de ingreso debe estar entre 1 y 12
- Ingresos no pueden ser negativos
- UIT debe ser mayor a 0
- RUC debe tener 11 dígitos y ser válido
- Fechas de vigencia de tasas no pueden solaparse

### 8.2 Reglas de Negocio
- Solo se pueden modificar ingresos de meses anteriores
- Las retenciones se calculan desde el mes de ingreso
- Los adicionales se consideran según política específica
- El método de cálculo cambia según el mes (proporcional vs saldo)
- Las retenciones no pueden ser negativas
- Un trabajador solo puede tener un empleador principal por año
- Las constancias de retenciones previas deben ser válidas y vigentes
- En caso de cese, se liquida solo hasta el mes trabajado

### 8.3 Manejo de Errores
- Validación en tiempo real en formularios
- Mensajes de error específicos por campo
- Log de errores para auditoría con contexto completo
- Rollback automático en caso de fallo en cálculos
- Notificaciones de errores críticos a administradores

---

## 9. Testing

### 9.1 Casos de Prueba Obligatorios

#### 9.1.1 Casos Base de SUNAT
- Cálculos con los casos proporcionados en `casos_de_prueba.md`
- Validación de fórmulas según `plantilla-formulas-sunat-5ta.md`
- Verificación de redondeo consistente (2 decimales, half-up)

#### 9.1.2 Casos de Multi-Empleador
- Trabajador con 2 empleadores simultáneos
- Consolidación de retenciones certificadas
- Cambio de empleador principal durante el año
- Validación de constancias de otros empleadores

#### 9.1.3 Casos de Ingreso/Cese
- Ingreso en septiembre (4 meses restantes)
- Cese en noviembre con liquidación final
- Distribución correcta de retenciones en meses restantes
- Validación de cierre exacto (suma = impuesto proyectado ± 0.01)

#### 9.1.4 Casos de Adicionales
- Gratificaciones legales (julio/diciembre)
- Bonos extraordinarios con políticas específicas
- Utilidades con reglas SUNAT
- Re-proyección mensual al añadir adicionales

#### 9.1.5 Casos de Edge Cases
- Ingresos muy altos (máximo tramo)
- Ingresos muy bajos (sin retención)
- Cambios de sueldo múltiples en el año
- Tasas de impuesto cambiantes intra-año

### 9.2 Tipos de Testing
- **Unit testing**: Funciones de cálculo individuales
- **Integration testing**: Flujos completos de cálculo
- **E2E testing**: Casos de uso principales
- **Performance testing**: 1000 trabajadores con cambios simultáneos
- **Security testing**: Validación de acceso y cifrado
- **Compliance testing**: Verificación de fórmulas SUNAT

### 9.3 Métricas de Testing
- Cobertura de código: mínimo 90%
- Tiempo de respuesta: máximo 2 segundos
- Precisión de cálculos: error máximo ±0.01
- Rendimiento: 1000 trabajadores en <30 segundos

---

## 10. Despliegue y Mantenimiento

### 10.1 Despliegue
- Deployment automático en Vercel con CI/CD
- Variables de entorno para configuración sensible
- Base de datos PostgreSQL en Vercel con cifrado
- CDN para assets estáticos con cache optimizado
- Health checks automáticos

### 10.2 Monitoreo
- Logs de aplicación con niveles estructurados
- Métricas de rendimiento en tiempo real
- Alertas de errores con escalado automático
- Dashboard de monitoreo con KPIs clave
- Backup automático de base de datos con cifrado

### 10.3 Actualizaciones
- Actualización anual de UIT y tasas con migración automática
- Migraciones de base de datos con rollback automático
- Deployment sin tiempo de inactividad (blue-green)
- Actualización de fórmulas con versionado
- Notificaciones de cambios a usuarios

---

## 11. Cronograma de Desarrollo

### Fase 1 (Semanas 1-2): Setup y Arquitectura
- Configuración del proyecto Next.js con TypeScript
- Configuración de Prisma y base de datos PostgreSQL
- Estructura de carpetas y componentes base
- Configuración de seguridad y cifrado

### Fase 2 (Semanas 3-4): Funcionalidades Core
- Implementación de cálculos de retención corregidos
- API endpoints básicos con validación
- Componentes de formulario con validación en tiempo real
- Sistema de auditoría y logs

### Fase 3 (Semanas 5-6): Multi-Empleador y Cese
- Gestión de múltiples empleadores
- Carga de constancias certificadas
- Consolidación de retenciones previas
- Manejo de cese con liquidación final

### Fase 4 (Semanas 7-8): UI y UX
- Interfaz de usuario completa con wizards
- Tablas de resultados con trazabilidad
- Reportes y exportación múltiple
- Dashboard y visualizaciones

### Fase 5 (Semanas 9-10): Testing y Refinamiento
- Implementación de casos de prueba completos
- Testing de rendimiento y seguridad
- Optimizaciones y refinamientos
- Documentación de usuario final

### Fase 6 (Semana 11): Despliegue
- Configuración de Vercel con CI/CD
- Despliegue a producción
- Configuración de monitoreo
- Documentación final y capacitación

---

## 12. Consideraciones Técnicas

### 12.1 Performance
- Cálculos en tiempo real optimizados con memoización
- Lazy loading de componentes y datos
- Caching de resultados de cálculos con invalidación inteligente
- Paginación para listas grandes con virtualización
- Optimización de consultas de base de datos

### 12.2 Escalabilidad
- Arquitectura modular con separación clara de responsabilidades
- API stateless con rate limiting
- Base de datos optimizada con índices estratégicos
- Microservicios para cálculos complejos (futuro)
- Load balancing automático en Vercel

### 12.3 Seguridad
- Validación de entrada en frontend y backend con Zod
- Sanitización de datos y prevención de inyección SQL
- Control de acceso basado en roles (RBAC)
- Auditoría completa de cambios con no repudio
- Cifrado de datos sensibles en reposo y tránsito

---

## 13. Documentación Adicional

### 13.1 Referencias
- [Orientación SUNAT - Cálculo del Impuesto](https://orientacion.sunat.gob.pe/3071-02-calculo-del-impuesto)
- Documento de casos de prueba: `casos_de_prueba.md`
- Plantilla de fórmulas: `plantilla-formulas-sunat-5ta.md`
- [Código Tributario del Perú](https://www.gob.pe/institucion/sunat/normas-legales)
- [UIT vigente por año](https://www.gob.pe/institucion/sunat/informacion-institucional/uit)

### 13.2 Glosario
- **UIT**: Unidad Impositiva Tributaria
- **5ta Categoría**: Trabajadores dependientes
- **Retención**: Pago anticipado del impuesto a la renta
- **Gratificación**: Pago adicional por fiestas patrias y navidad
- **Bonificación**: Pago extraordinario por productividad
- **Utilidades**: Distribución de beneficios empresariales
- **Multi-empleador**: Trabajador con más de un empleador simultáneo
- **Constancia**: Documento oficial que certifica retenciones previas

---

## 14. Aprobaciones

- **Analista de Requisitos**: ___
- **Arquitecto de Software**: ___
- **Líder de Proyecto**: ___
- **Cliente (SUNAT)**: ___
- **Auditor de Seguridad**: ___

**Fecha de Aprobación**: ___
**Versión del Documento**: 2.0

---

## 15. Checklist de Cumplimiento 100%

### 15.1 Funcionalidades Core
- [ ] Método proporcional y saldo corregidos y documentados
- [ ] Soporte multi-empleador con constancias certificadas
- [ ] Flujo de retenciones previas (empleador anterior)
- [ ] Manejo de ingreso/cese en meses distintos a enero
- [ ] Política de redondeo única (2 decimales, half-up)

### 15.2 Arquitectura y Seguridad
- [ ] Tax tiers parametrizados por vigencia, no hard-codeados
- [ ] Cifrado de datos PII (DNI, nombre)
- [ ] RBAC implementado (RRHH, Auditor, Admin)
- [ ] Auditoría completa con logs de cálculo
- [ ] Retención de datos conforme a política

### 15.3 Testing y Validación
- [ ] Casos de prueba que cubran los 5 escenarios principales
- [ ] Edge cases y casos de stress probados
- [ ] Validación de fórmulas SUNAT verificada
- [ ] Testing de rendimiento con 1000 trabajadores
- [ ] Testing de seguridad y compliance

### 15.4 Documentación y Despliegue
- [ ] Documentación de usuario final completa
- [ ] Despliegue en Vercel con CI/CD
- [ ] Monitoreo y alertas configurados
- [ ] Backup y recuperación de desastres
- [ ] Capacitación de usuarios finales
