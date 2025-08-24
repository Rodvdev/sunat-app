# 🎨 Style Guidelines — SUNAT Futuro UI

> Lineamientos de diseño para una interfaz digital **modernizada y accesible** inspirada en los colores e identidad de SUNAT.

---

## 1. Identidad Visual

### Colores Oficiales
Basado en la paleta actual de SUNAT, con ajustes para mayor contraste y un look moderno.

| Uso                  | Color HEX | Notas |
|----------------------|-----------|-------|
| **Rojo Institucional** | `#B71C1C` | Color de acciones críticas, headers importantes (ej: “Operaciones en Línea”) |
| **Azul Primario**     | `#004C97` | Identidad principal SUNAT, usado en barras superiores y botones principales |
| **Azul Claro Secundario** | `#1976D2` | Variantes para hover, resaltados e íconos secundarios |
| **Celeste de Fondo**  | `#E3F2FD` | Fondos suaves de secciones o tarjetas |
| **Gris Oscuro Texto** | `#333333` | Texto principal |
| **Gris Medio Texto**  | `#666666` | Texto secundario, descripciones |
| **Gris Claro Bordes** | `#E0E0E0` | Líneas divisorias y bordes suaves |
| **Verde Éxito**       | `#2E7D32` | Mensajes de éxito o validaciones correctas |
| **Amarillo Advertencia** | `#F9A825` | Alertas suaves (ej: plazos, vencimientos) |

---

## 2. Tipografía

- **Fuente Base:** `Inter` (o `Roboto` como fallback)  
- **Escalas:**
  - Títulos (H1): `32px`, bold, azul primario  
  - Subtítulos (H2): `24px`, semibold, gris oscuro  
  - Texto general: `16px`, regular, gris oscuro  
  - Texto auxiliar: `14px`, gris medio  
- **Altura de línea:** 1.5 para mejorar la legibilidad  
- **Estilo:** Minimalista, con fuerte contraste en títulos

---

## 3. Componentes UI

### Header Superior
- **Background:** Azul primario `#004C97`  
- **Logo SUNAT:** Minimalista en blanco  
- **Botones destacados:** Rojo institucional `#B71C1C` con hover `#C62828`  
- **Acciones secundarias:** Azul claro `#1976D2`

### Barra de Navegación
- Ubicación fija superior o lateral  
- Íconos lineales (`Lucide` o `Material Icons`)  
- Hover con fondo celeste `#E3F2FD` y texto azul  

### Tarjetas / Secciones
- Fondo: blanco  
- Bordes: `1px solid #E0E0E0`  
- Sombra suave: `0px 2px 6px rgba(0,0,0,0.05)`  
- Encabezado: azul primario  
- Botones dentro: primarios en azul, secundarios en gris  

### Botones
- **Primario:** Azul `#004C97`, texto blanco  
- **Hover:** Azul claro `#1976D2`  
- **Secundario:** Borde gris claro, texto gris oscuro  
- **Crítico:** Rojo institucional `#B71C1C`, hover `#C62828`  
- **Éxito:** Verde `#2E7D32`

### Formularios
- Inputs con borde `#E0E0E0`  
- Focus: sombra azul `0 0 0 2px rgba(25, 118, 210, 0.3)`  
- Placeholders en gris medio  
- Labels en azul oscuro  

---

## 4. Interacción y Accesibilidad

- **Contraste mínimo:** 4.5:1 en texto  
- **Focus states:** Siempre visibles (borde azul claro)  
- **Responsive:** Mobile-first (botones grandes, cards apiladas)  
- **Animaciones:** Transiciones suaves de 200ms (hover, focus, expandir secciones)  

---

## 5. Ejemplos de Uso

### Header Modernizado
```html
<header class="bg-[#004C97] text-white flex justify-between p-4">
  <div class="font-bold text-xl">SUNAT Futuro</div>
  <nav class="flex gap-4">
    <button class="bg-[#B71C1C] hover:bg-[#C62828] px-3 py-2 rounded">Operaciones en Línea</button>
    <button class="hover:text-[#E3F2FD]">Trámites y Consultas</button>
  </nav>
</header>

Tarjeta Informativa
<div class="bg-white border border-[#E0E0E0] rounded-xl shadow-sm p-6">
  <h2 class="text-[#004C97] text-lg font-semibold">Cálculo del Impuesto</h2>
  <p class="text-[#666666] text-sm mt-2">
    Proyecte sus ingresos gravados que percibirá en todo el año según SUNAT.
  </p>
  <button class="mt-4 bg-[#004C97] hover:bg-[#1976D2] text-white px-4 py-2 rounded">
    Calcular
  </button>
</div>

6. Principios de Modernización
	1.	Simplicidad: Interfaz clara, sin saturación de botones.
	2.	Accesibilidad: Texto legible, colores con contraste, soporte de lectores de pantalla.
	3.	Modularidad: Reutilización de tarjetas, botones y formularios.
	4.	Identidad: Mantener la esencia SUNAT (azul/rojo institucional) pero con un look futurista y digital.
	5.	Responsive: Adaptado para escritorio, tablet y móvil.

    