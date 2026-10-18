# Guia del catalogo

Los datos editables estan en `js/catalog.js`. `js/app.js` contiene la logica de la pagina; normalmente no hace falta editarlo para agregar contenido.

## Secciones por marca

Dentro de `catalogByBrand` estan los bloques independientes:

- `catalogByBrand.chuy`: categorias, etiquetas, productos y promociones de Chuy.
- `catalogByBrand.ruta9`: categorias, etiquetas, productos y promociones de Ruta 9.

Agrega cada elemento dentro del bloque de su marca. Las listas globales `categories`, `products` y `promotions` se generan automaticamente al final del archivo; no hace falta editarlas. Las categorias vacias tambien aparecen en la pagina con el aviso "Productos proximamente".

## Carpetas de imagenes

Copia las fotos al proyecto y reemplaza la URL del campo correspondiente por una ruta relativa:

- Productos Chuy: `img/productos/chuy/`
- Productos Ruta 9: `img/productos/ruta9/`
- Categorias Chuy: `img/categorias/chuy/`
- Categorias Ruta 9: `img/categorias/ruta9/`
- Promociones Chuy: `img/promociones/chuy/`
- Promociones Ruta 9: `img/promociones/ruta9/`
- Portadas y logos: `img/locales/`
- Galeria del patio: `img/galeria/`

Ejemplo: guarda la foto como `img/productos/chuy/pollo-brasa.webp` y asigna esa ruta a `img` e `images` del producto. Usa nombres simples, sin espacios ni tildes. Este proyecto estatico no tiene un panel para subir y guardar imagenes desde la web.

## Agregar una categoria

Dentro de la marca correspondiente, agrega:

1. Un elemento en `categories` con un `id` unico, `name`, `brand` e `image`.
2. El mismo `id` en `categoryLabels` y `categoryTaglines`.
3. Cada producto asociado con ese `id` en su campo `cat`.

## Agregar un producto

Agrega el objeto en `products` del bloque de su marca. Incluye `id` numerico unico, `name`, `brand`, `price`, `cat`, `img`, `images` y `details`. `img` es la foto principal; `images` contiene las fotos de la vista detallada. `cat` debe coincidir exactamente con el `id` de una categoria de esa marca.

Para ocultar un producto sin borrar sus datos, agrega `hidden: true` a su objeto. Los productos ocultos no aparecen en la tienda ni en las busquedas.

## Agregar una promocion

Agrega el objeto en `promotions` de la marca correspondiente. Conserva un `id` unico, `brand` y `cat`; cambia `image` por la ruta local de la foto de la promocion.

## Otros cambios de imagen

- Logo de TOTY'S en el encabezado: cambia `CONFIG.store.logoImg` al inicio de `js/catalog.js`. Si queda en `null`, se muestra el texto TOTY'S.
- Locales: actualiza `cover` y, si hay logo original, `logoImg` dentro de `locales`. Si `logoImg` queda en `null`, se muestran las iniciales configuradas en `logo`.
- Galeria: actualiza `src` en el elemento correspondiente de `gallery`.

Despues de guardar, recarga la pagina y comprueba ambas marcas y la vista del producto.
