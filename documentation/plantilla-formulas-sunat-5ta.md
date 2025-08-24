# 📑 Plantilla de Fórmulas SUNAT – Retención de Quinta Categoría

> Documento de referencia para implementar el cálculo de **retenciones mensuales de renta de 5ta categoría** (trabajadores dependientes) en Perú.  
> Los valores de **UIT** y **tasas de tramos** deben actualizarse cada año.

---

## 📋 Tabla de Contenidos

1. [Variables Globales](#1-variables-globales)
2. [Proyección de Ingresos](#2-proyección-de-ingresos)
3. [Renta Neta Proyectada](#3-renta-neta-proyectada)
4. [Escala Progresiva Acumulativa](#4-escala-progresiva-acumulativa)
5. [Cálculo del Impuesto Proyectado](#5-cálculo-del-impuesto-proyectado)
6. [Retención Mensual](#6-retención-mensual)
7. [Ajuste de Retención del Mes](#7-ajuste-de-retención-del-mes)
8. [Manejo de Adicionales](#8-manejo-de-adicionales)
9. [Consideraciones Especiales](#9-consideraciones-especiales)
10. [Pseudocódigo](#10-pseudocódigo)
11. [Tabla Editable por Año](#11-tabla-editable-por-año)
12. [Checklist de Implementación](#12-checklist-de-implementación)

---

## 1. Variables Globales

| Variable | Descripción | Fórmula |
|----------|-------------|---------|
| `UIT` | Valor oficial vigente del año | - |
| `DEDUCCION_7UIT` | Deducción de 7 UIT | `7 × UIT` |
| `MES_CALCULO` | Mes actual (1 = Enero, …, 12 = Diciembre) | `m` |
| `MESES_RESTANTES` | Meses restantes del año | `13 – m` |
| `INGRESO_MENSUAL` | Ingreso mensual del trabajador | `IM` |
| `ADICIONALES[mes]` | Diccionario con gratificaciones, bonos, etc. | - |
| `RETENCION_ACUMULADA_PREVIA` | Retenciones ya realizadas hasta el mes previo | `RAP` |

**Nota**: Definir política de redondeo (ej. 2 decimales, half up).

---

## 2. Proyección de Ingresos

```text
INGRESO_ANUAL_PROYECTADO = (IM × 12) + SUM(ADICIONALES[1..12])
```

**Consideración**: Si el cálculo inicia en un mes distinto de enero, se debe proyectar considerando los meses restantes y los adicionales estimados.

---

## 3. Renta Neta Proyectada

```text
RENTA_NETA_PROYECTADA = max(0, INGRESO_ANUAL_PROYECTADO – DEDUCCION_7UIT)
```

---

## 4. Escala Progresiva Acumulativa

**Plantilla**: Sustituir valores en UIT y tasas según la ley vigente del año.

| Tramo | Límite en UIT | Límite en S/ (UIT × valor) | Tasa |
|-------|---------------|------------------------------|------|
| 1 | 0 – ___ UIT | 0 – ___ | ___% |
| 2 | ___ – ___ UIT | ___ – ___ | ___% |
| 3 | ___ – ___ UIT | ___ – ___ | ___% |
| 4 | ___ – ___ UIT | ___ – ___ | ___% |
| 5 | > ___ UIT | > ___ | ___% |

---

## 5. Cálculo del Impuesto Proyectado

```text
IMPUESTO_PROYECTADO =
  (min(RNP, L1) × T1)
+ (max(0, min(RNP – L1, L2 – L1)) × T2)
+ (max(0, min(RNP – L2, L3 – L2)) × T3)
+ (max(0, min(RNP – L3, L4 – L3)) × T4)
+ (max(0, RNP – L4) × T5)
```

**Donde**:
- `RNP` = Renta Neta Proyectada
- `L1..L4` = Límites en soles (UIT × múltiplos)
- `T1..T5` = Tasas de cada tramo

---

## 6. Retención Mensual

### Método Proporcional (Enero a Marzo)

```text
RETENCION_ACUMULADA_ESPERADA(m) = IMPUESTO_PROYECTADO × (m / 12)
```

### Método Saldo (Abril a Diciembre)

```text
RETENCION_ACUMULADA_ESPERADA(m) = (IMPUESTO_PROYECTADO – RETENCION_ACUMULADA_PREVIA) / MESES_RESTANTES
```

---

## 7. Ajuste de Retención del Mes

**Actualizar acumulado**:
```text
RETENCION_ACUMULADA_PREVIA ← RETENCION_ACUMULADA_PREVIA + RETENCION_DEL_MES(m)
```

---

## 8. Manejo de Adicionales

Si en el mes `k` existe un adicional:

1. **Recalcular ingresos proyectados**:
   ```text
   INGRESO_ANUAL_PROYECTADO' = INGRESO_ANUAL_PROYECTADO + ADICIONALES[k]
   ```

2. **Recalcular renta neta proyectada**:
   ```text
   RENTA_NETA_PROYECTADA' = max(0, INGRESO_ANUAL_PROYECTADO' – DEDUCCION_7UIT)
   ```

3. **Recalcular impuesto proyectado**:
   ```text
   IMPUESTO_PROYECTADO'
   ```

4. **Recalcular retención acumulada esperada**:
   ```text
   RETENCION_ACUMULADA_ESPERADA(k)
   ```

5. **Calcular retención del mes**:
   ```text
   RETENCION_DEL_MES(k) = max(0, RAE(k) – RAP)
   ```

---

## 9. Consideraciones Especiales

- **Si `RENTA_NETA_PROYECTADA ≤ 0`** → no hay retención.
- **En caso de cambio de sueldo o cese**: recalcular con la información actualizada.
- **Para comisiones o ingresos variables**: usar promedio mensual y actualizar la proyección cada mes.
- **Redondear de forma consistente** en cada paso.

---

## 10. Pseudocódigo

```pseudocode
IM ← ingreso_mensual
UIT ← valor_UIT
D7 ← 7 * UIT
RAP ← retenciones previas

para cada mes m de 1..12:
  if m < MES_CALCULO: continuar

  adicional ← ADICIONALES[m] o 0
  IAP ← (IM × 12) + SUM(ADICIONALES[1..12])
  RNP ← max(0, IAP – D7)

  IP ← calcular_impuesto_por_tramos(RNP, UIT)

  if m ≤ 3:
      RAE ← IP × (m / 12)
  else:
      RAE ← (IP – RAP) / (13 – m)

  RDM ← max(0, RAE – RAP)
  RAP ← RAP + RDM

  registrar(m, RDM, RAP)
fin
```

---

## 11. Tabla Editable por Año

| Año | UIT (S/.) | 7 UIT (S/.) | Tramo 1 | % | Tramo 2 | % | Tramo 3 | % | Tramo 4 | % | Tramo 5 | % |
|-----|------------|--------------|---------|---|---------|---|---------|---|---------|---|---------|---|
| 2025 | 5,150 | 36,050 | 0–5 UIT | 8% | 5–20 UIT | 14% | 20–35 UIT | 17% | 35–45 UIT | 20% | >45 UIT | 30% |

---

## 12. Checklist de Implementación

- [ ] **Parametrizar UIT y tasas por año**
- [ ] **Definir política de distribución** (proporcional vs. saldo)
- [ ] **Recalcular en caso de adicionales** o cambios salariales
- [ ] **Documentar redondeo usado**
- [ ] **Generar reporte mes a mes**: ingresos, adicionales, impuesto proyectado, retención
- [ ] **Validar contra ejemplos SUNAT**

---

## 📚 Referencias

- [SUNAT - Retenciones de Quinta Categoría](https://www.sunat.gob.pe/)
- [Código Tributario del Perú](https://www.gob.pe/institucion/sunat/normas-legales)
- [UIT vigente por año](https://www.gob.pe/institucion/sunat/informacion-institucional/uit)

---

*Última actualización: [Fecha]*
*Versión del documento: 1.0*
    