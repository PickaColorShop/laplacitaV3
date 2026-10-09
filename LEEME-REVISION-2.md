# La Placita de Santurce — Revisión 2 (propuesta de composición)

Base nueva y separada de la versión anterior. Estático (HTML/CSS/JS sin frameworks), listo para GitHub + Vercel.

## Vistas para revisar
| Vista | Archivo | Ruta |
|---|---|---|
| Portada | `index.html` | `/` |
| Mapa con leyenda | `directorio.html` | `/directorio` (acepta `?cat=`, `?q=`, `?n=`) |
| Página de miembro | `negocios/tasca-el-pescador.html` | `/negocios/tasca-el-pescador` |
| El mercado | `mercado.html` | `/mercado` |
| Restaurantes (incluye Bares y música) | `restaurantes.html` | `/restaurantes` (`#bares`) |
| Historia | `historia.html` | `/historia` |
| Eventos | `eventos.html` | `/eventos` |
| Planifica tu visita (incluye FAQ y contacto) | `visita.html` | `/visita` (`#contacto`) |

Los 27 negocios usan la misma plantilla de página (`negocios/*.html`) para que todos tengan el mismo nivel de presentación.

## Qué cambió frente a la versión anterior
- Portada: una imagen amplia, una frase y una sola acción principal ("Explorar el directorio"). Dirección y horarios se movieron a "Planifica tu visita".
- Sin grafiti, franjas de texto, tarjetas inclinadas ni recursos de cupón/afiche. Una sola tipografía (Manrope), márgenes amplios.
- Se conservan: búsqueda, filtros por categoría, día/noche y "Cómo llegar" (en el header y en cada ficha).
- Mapa como pieza central: números por negocio, color por categoría, leyenda/lista sincronizada, ficha al tocar, vista 2D, concepto 3D y lista/mapa por pestañas en celular.

## Marcas de revisión (no publicar sin resolver)
- **"Placeholder"** sobre cada foto: son fotos de stock (Unsplash) mientras llega la sesión de fotos y drone.
- **"Por confirmar"** junto a horarios, fechas de eventos, @laplacita.pr, teléfonos, menús, websites y direcciones no verificadas.
- **Mapa esquemático**: manzanas y posiciones aproximadas. Validar en sitio antes de cerrar la composición.
- **3D**: concepto de inclinación del mismo plano. El modelo 3D real requiere su propio levantamiento.
- Las promociones salieron de la portada; quedan enlazadas en el footer hasta confirmar.
- `noindex` activado en todas las páginas mientras sea una propuesta.

## Identidad
Los colores son tokens provisionales en `assets/css/r2.css` (`:root`). Al confirmar la paleta y los assets de La Placita se cambian en ese bloque y se aplican a todo el sitio.

## Ver en local
`npx serve .` dentro de esta carpeta (con doble clic los enlaces que empiezan con `/` no funcionan).
