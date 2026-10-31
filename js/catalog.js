
/* ═══════════════════════════════════════════════════
   DATOS JAVASCRIPT
   ═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   1. CONFIGURACIÓN - Constantes globales
   Teléfonos, WhatsApp por marca, datos de la tienda
   y del desarrollador. Se usan en todo el sitio.
   ═══════════════════════════════════════════════════ */
const CONFIG = {
  whatsapp: {
    chuy: '59172988493',
    ruta9: '59172995911'
  },
  developer: { name: 'KEY STUDIO', url: 'https://keystudio.bo' },
  store: {
    name: 'TOTY\'S',
    logoImg: 'img/locales/toty-logo.png',
    tagline: 'Patio de comida',
    story: 'Una historia familiar, sabores que nos identifican. Toty’s Food Place es un emprendimiento gastronómico familiar ubicado en Yacuiba, nacido del esfuerzo, la perseverancia y el deseo de construir un proyecto propio a partir de los ahorros y la herencia de nuestros padres. Su nombre, Toty’s, rinde un homenaje lleno de cariño a nuestra madre, cuyo sobrenombre permanece vivo en cada etapa de este sueño. Con la ilusión de convertir una infraestructura propia en un espacio de encuentro y crecimiento, Toty’s Food Center fue concebido para albergar propuestas gastronómicas capaces de ofrecer experiencias diferentes, pero unidas por una misma filosofía: brindar buena comida, atención cercana y momentos para compartir. La primera gran apuesta fue conseguir la franquicia de Pollos Chuy, reconocida cadena de comida rápida con trayectoria en Santa Cruz de la Sierra. Este logro representó un importante paso en la consolidación del emprendimiento y el comienzo de un camino marcado por el trabajo constante y la confianza en nuestras posibilidades. Posteriormente, inspirados por los sabores, las costumbres y la identidad de nuestra región chaqueña, nació Ruta 9 – Sabores del Sur, una propuesta gastronómica que combina la esencia de la comida rápida con ese toque ahumado tan característico del Chaco. En Toty’s Food Place creemos que los negocios se construyen con trabajo, pero su verdadero valor se consolida con las personas, los recuerdos y los vínculos que nacen a su alrededor. Nuestra historia honra a quienes nos dieron el punto de partida, celebra los sabores que nos representan y continúa construyéndose junto a cada persona que nos elige. Porque detrás de cada plato hay una historia familiar y, en cada visita, una nueva oportunidad para compartir.',
    mission: 'Ofrecer a las familias y a la ciudad de Yacuiba experiencias gastronómicas de calidad, a través de propuestas de comida rápida que combinan sabor, tradición, innovación y la identidad de nuestra región chaqueña. Trabajamos con compromiso, esfuerzo y calidez humana para brindar productos de calidad.',
    vision: 'Consolidarnos como un referente gastronómico de Yacuiba y la región del Chaco, reconocidos por la calidad de nuestros productos, la identidad de nuestras propuestas y la calidez de nuestra atención. Aspiramos a fortalecer el crecimiento de Toty’s Food Place, preservar su esencia familiar y desarrollar nuestras marcas gastronómicas de manera sostenible, creando experiencias que permanezcan en la memoria de nuestros clientes y transmitiendo a las futuras generaciones el valor del esfuerzo, la perseverancia y el compromiso.',
    values: 'Calidad, limpieza, puntualidad, respeto por el cliente y pasión por la cocina. Creemos que una buena comida puede alegrar el día de las personas.',
    services: 'Atención en local, pedidos para llevar, delivery coordinado por WhatsApp y opciones para compartir en familia o con amigos. Cada marca tiene su propio canal de pedidos.',
    hoursMorning: 'Mier – Lun: 11:30 – 14:00',
    hoursNight: 'Mier – Lun: 18:00 – 22:00',
    address: 'Yacuiba, Bolivia',
    email: 'ventas@totys.bo',
    instagram: '@totys.bo'
  }
};

/* ═══════════════════════════════════════════════════
   2. DATOS: LOCALES DEL PATIO (Chuy / Ruta 9)
   Array con la información de cada marca: nombre,
   tagline, descripción, portada, logo, meta y badge.
   Se renderiza en renderLocales().
   ═══════════════════════════════════════════════════ */
const locales = [
  {
    id: 'chuy',
    name: 'Pollos Chuy',
    tagline: 'Pollos Chuy',
    description: 'Pollo a la Broaster con papas fritas. Bebidas bien frías para acompañar. La especialidad de Pollos Chuy.',
    cover: 'img/locales/chuy-portada.png',
    logo: { type: 'initials', value: 'CH' },
    logoImg: 'img/locales/chuy-logo.png',
    meta: [
      { icon: 'fa-drumstick-bite', text: 'Pollos a la Broaster' },
      { icon: 'fa-glass-water', text: 'Bebidas frías' },
      { icon: 'fa-clock', text: 'Almuerzo: 11:30 – 14:00' },
      { icon: 'fa-clock', text: 'Cena: 18:00 – 22:00' }
    ],
    action: 'chuy',
    badge: 'Chuy',
    badgeIcon: 'fa-drumstick-bite'
  },
  {
    id: 'ruta9',
    name: 'Ruta 9',
    tagline: 'Hamburguesas ahumadas',
    description: 'Hamburguesas jugosas, papas crujientes y con salsa especial. El sabor ahumado de Ruta 9.',
    cover: 'img/locales/ruta9-portada.png',
    logo: { type: 'initials', value: 'R9' },
    logoImg: 'img/locales/ruta9-logo.png',
    meta: [
      { icon: 'fa-burger', text: 'Hamburguesas' },
      { icon: 'fa-fire', text: 'Ahumadas' },
      { icon: 'fa-clock', text: 'Almuerzo: 11:30 – 14:00' },
      { icon: 'fa-clock', text: 'Cena: 18:00 – 22:00' }
    ],
    action: 'ruta9',
    badge: 'Ruta 9',
    badgeIcon: 'fa-fire'
  }
];

/* ═══════════════════════════════════════════════════
   3. DATOS: GALERÍA DEL LOCAL
   Array de imágenes del patio: id, src, título y
   categoría. Se renderiza en renderGallery().
   ═══════════════════════════════════════════════════ */
const gallery = [
  { id: 1, src: 'img/locales/local.png', title: 'Nuestro patio', cat: 'Ambiente' },
  { id: 2, src: 'img/locales/ruta9-hero.jpg', title: 'Pollo a la Broaster', cat: 'Chuy' },
  { id: 3, src: 'img/locales/ruta9-hero.jpg', title: 'Hamburguesa Ahumada', cat: 'Ruta 9' },
  { id: 7, src: 'img/productos/chuy/combo2.png', title: 'Combos para compartir', cat: 'Chuy' },
];

/* ═══════════════════════════════════════════════════
   4. CATÁLOGOS POR MARCA
   Reemplaza las URL de image, img e images cuando
   agregues las fotos locales de cada marca.
   ═══════════════════════════════════════════════════ */
const catalogByBrand = {
  chuy: {
    categories: [
      { id: 'pollos', name: 'Pollos', brand: 'chuy', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600' },
      { id: 'bebidas-chuy', name: 'Bebidas', brand: 'chuy', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600' },
      { id: 'hamburguesas-chuy', name: 'Hamburguesas', brand: 'chuy', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600' },
      { id: 'paracompartir-chuy', name: 'para compartir', brand: 'chuy', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600' },
      { id: 'porcion-chuy', name: 'Porción', brand: 'chuy', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600' }
    ],
    categoryLabels: {
      pollos: 'Pollos',
      'bebidas-chuy': 'Bebidas',
      'hamburguesas-chuy': 'Hamburguesas',
      'paracompartir-chuy': 'para compartir',
      'porcion-chuy': 'Porción'
    },
    categoryTaglines: {
      pollos: 'Jugosos y deliciosos',
      'bebidas-chuy': 'Refrescantes',
      'paracompartir-chuy': 'Para compartir'
    },
    products: [
      { id: 101, name: 'Pollo a la Broaster (1/4)', brand: 'Chuy', price: 30, cat: 'pollos',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Porción': '1/4 de pollo', 'Acompañamiento': 'Papas Fritas', 'Preparación': 'A la Broaster', 'Garantía': 'Calidad garantizada' } },
      { id: 102, name: 'Pollo a la Broaster Económico', brand: 'Chuy', price: 20, cat: 'pollos',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Porción': 'Económico de Pollo', 'Acompañamiento': 'Papas Fritas', 'Preparación': 'A la Broaster', 'Garantía': 'Calidad garantizada' } },
      { id: 103, name: 'Coca Cola 500ml', brand: 'Chuy', price: 8, cat: 'bebidas-chuy',
        img: 'img/productos/chuy/coca500.png',
        images: ['img/productos/chuy/coca500.png'],
        details: { 'Presentación': '500ml', 'Temperatura': 'Bien fría', 'Tipo': 'Gaseosa' } },
      { id: 104, name: 'Coca Cola 2 Lts.', brand: 'Chuy', price: 20, cat: 'bebidas-chuy',
        img: 'img/productos/chuy/coca2lts.png',
        images: ['img/productos/chuy/coca2lts.png'],
        details: { 'Presentación': '2 Lts.', 'Temperatura': 'Bien fría', 'Tipo': 'Gaseosa' } },
      { id: 105, name: 'Hamburguesa ADULADA', brand: 'Chuy', price: 28, cat: 'hamburguesas-chuy',
        img: 'img/productos/chuy/hamburguesa.jpg',
        images: ['img/productos/chuy/hamburguesa.jpg'],
        details: { 'Porción': 'Individual', 'Tipo': 'Hamburguesas', 'Garantía': 'Calidad garantizada' } },
      { id: 106, name: 'Picazo', brand: 'Chuy', price: 115, cat: 'paracompartir-chuy',
        img: 'img/productos/chuy/combo1.png',
        images: ['img/productos/chuy/combo1.png'],
        details: { 'Incluye': '2 Porciones de Chuicito + 2 Porciones de Alitas + 3 Porciones de Papas   ', 'Precio': 'Bs. 110', 'Preparación': 'A la Broaster', 'Garantía': 'Calidad garantizada' } },
      { id: 107, name: 'Piernuditas', brand: 'Chuy', price: 120, cat: 'paracompartir-chuy',
        img: 'img/productos/chuy/combo2.png',
        images: ['img/productos/chuy/combo2.png'],
        details: { 'Incluye': '8 Piernas de Pollos + 4 Porciones de Arroz + 3 Porciones de Papas', 'Precio': 'Bs. 110', 'Preparación': 'A la Broaster', 'Garantía': 'Calidad garantizada' } },
      { id: 108, name: 'Mix Pack', brand: 'Chuy', price: 110, cat: 'paracompartir-chuy',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Incluye' : ''} },
        { id: 109, name: 'Chuycito XL', brand: 'Chuy', price: 60, cat: 'paracompartir-chuy',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Incluye' : ''} },
        { id: 111, name: 'Chuycito', brand: 'Chuy', price: 32, cat: 'pollos',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Incluye' : ''} },
        { id: 110, name: 'Alitas', brand: 'Chuy', price: 32, cat: 'pollos',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Incluye' : ''} },
        { id: 112, name: 'Milanesa Picada', brand: 'Chuy', price: 26, cat: 'pollos',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Incluye' : ''} },
        { id: 113, name: 'Tallarín', brand: 'Chuy', price: 26, cat: 'pollos',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Incluye' : ''} },
        { id: 114, name: 'Boomerang', brand: 'Chuy', price: 28, cat: 'pollos',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Incluye' : ''} },
        { id: 118, name: 'Porción de Papa', brand: 'Chuy', price: 10, cat: 'porcion-chuy',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Incluye' : ''} },
        { id: 115, name: 'Porción de Arroz', brand: 'Chuy', price: 8, cat: 'porcion-chuy',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Incluye' : ''} },
    { id: 116, name: 'Salsa Golf', brand: 'Chuy', price: 3, cat: 'porcion-chuy',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Incluye' : ''} },
      { id: 117, name: 'Salsa BBQ', brand: 'Chuy', price: 5, cat: 'porcion-chuy',
        img: 'img/productos/chuy/fondo.png',
        images: ['img/productos/chuy/fondo.png'],
        details: { 'Incluye' : ''} },
        ],
    promotions: [
      { id: 'chuy-1', badge: 'CHUY', title: 'Combo 4x4', sub: 'Con papas fritas + Milanesa +  Porciones de tenders', image: 'img/productos/chuy/combo3.png', cat: 'combos-chuy', brand: 'chuy',
        fullDescription: '12 Piezas de Alitas + 3 Porciones de Papas + 2 Milanesas Picadas + 3 Porciones de Tenders.',
        validUntil: 'Consultar vigencia',
        conditions: ['Sujeto a stock disponible', 'Delivery coordinado por separado'] },
      { id: 'chuy-2', badge: 'CHUY', title: 'COMBO PIERNUDITAS', sub: 'Piernas de Pollos + Porciones de Arroz + Porciones de Papas', image: 'img/productos/chuy/combo2.png', cat: 'combos-chuy', brand: 'chuy',
        fullDescription: '8 Piernas de Pollos + 4 Porciones de Arroz + 3 Porciones de Papas.',
        validUntil: 'Consultar vigencia',
        conditions: ['Sujeto a stock disponible', 'Delivery coordinado por separado'] },
      { id: 'chuy-3', badge: 'CHUY', title: 'COMBO PICAZO', sub: 'Porciones de Chuicito +  Porciones de Alitas +  Porciones de Papas ', image: 'img/productos/chuy/combo1.png', cat: 'combos-chuy', brand: 'chuy',
        fullDescription: '2 Porciones de Chuicito + 2 Porciones de Alitas + 3 Porciones de Papas Lleva dos jugos naturales al precio de uno. Sabores maracuyá o frutilla.',
        validUntil: 'Consultar vigencia',
        conditions: ['Sujeto a stock disponible', 'Delivery coordinado por separado'] }
    ]
  },
  ruta9: {
    categories: [
      { id: 'hamburguesas', name: 'Hamburguesas', brand: 'ruta9', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600' },
      { id: 'bebidas-r9', name: 'Bebidas', brand: 'ruta9', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600' },
      { id: 'combos-r9', name: 'Combos', brand: 'ruta9', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600' },
      { id: 'porcion-ruta9', name: 'Porción', brand: 'ruta9', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600' },
    ],

    categoryLabels: {
      hamburguesas: 'Hamburguesas',
      'bebidas-r9': 'Bebidas',
      'combos-r9': 'Combos',
      'porcion-ruta9': 'Porción'
    },
    categoryTaglines: {
      hamburguesas: 'Ahumadas',
      'bebidas-r9': 'Refrescantes',
      'combos-r9': 'Para compartir',
      'porcion-ruta9': 'Porción individual'
    },
    products: [
      { id: 201, name: 'Hamburguesa Clásica', brand: 'Ruta 9', price: 30, cat: 'hamburguesas',
        img: 'img/productos/ruta9/clasica.jpg',
        images: ['img/productos/ruta9/clasica.jpg', 'img/productos/ruta9/clasica1.jpg'],
        details: { 'Ingredientes': 'Carne de res, queso, lechuga, tomate, salsa', 'Pan': 'Pan especial', 'Preparación': 'Ahumada', 'Garantía': 'Calidad garantizada' } },
      { id: 202, name: 'Hamburguesa Burguesa', brand: 'Ruta 9', price: 32, cat: 'hamburguesas',
        img: 'img/productos/ruta9/burguesa1.jpg',
        images: ['img/productos/ruta9/burguesa1.jpg', 'img/productos/ruta9/burguesa.jpg'],
        details: { 'Ingredientes': 'Doble carne, doble queso, tocino', 'Pan': 'Pan Especial', 'Preparación': 'Ahumada', 'Garantía': 'Calidad garantizada' } },
      { id: 203, name: 'Hamburguesa Corralita', brand: 'Ruta 9', price: 32, cat: 'hamburguesas',
        img: 'img/productos/ruta9/corralita1.jpg',
        images: ['img/productos/ruta9/corralita1.jpg', 'img/productos/ruta9/corralita.jpg'],
        details: { 'Ingredientes': 'Carne de res, queso, lechuga, tomate, salsa', 'Pan': 'Pan especial', 'Preparación': 'Ahumada', 'Garantía': 'Calidad garantizada' } },
      { id: 207, name: 'Hamburguesa Turca', brand: 'Ruta 9', price: 34, cat: 'hamburguesas',
        img: 'img/productos/ruta9/corralita1.jpg',
        images: ['img/productos/ruta9/corralita1.jpg', 'img/productos/ruta9/corralita.jpg'],
        details: { 'Ingredientes': 'Carne de res, queso, lechuga, tomate, salsa', 'Pan': 'Pan especial', 'Preparación': 'Ahumada', 'Garantía': 'Calidad garantizada' } },

      { id: 204, name: 'Hamburguesa Ruta 9', brand: 'Ruta 9', price: 32, cat: 'hamburguesas',
        img: 'img/productos/ruta9/ruta91.jpg',
        images: ['img/productos/ruta9/ruta91.jpg', 'img/productos/ruta9/ruta9.jpg'],
        details: { 'Ingredientes': 'Carne de res, queso, lechuga, tomate, salsa', 'Pan': 'Pan especial', 'Preparación': 'Ahumada', 'Garantía': 'Calidad garantizada' } },
      { id: 205, name: 'Combo Personal Ruta 9', brand: 'Ruta 9', price: 38, cat: 'combos-r9',
        img: 'img/productos/ruta9/comboruta.jpg',
        images: ['img/productos/ruta9/comboruta.jpg'],
        details: { 'Incluye': 'Hamburguesa, papas y Pepsi de 1 Lts.', 'Porción': 'Personal', 'Preparación': 'Ahumada', 'Garantía': 'Calidad garantizada' } },
      { id: 206, name: 'Pepsi de 1Lts.', brand: 'Ruta 9', price: 10, cat: 'bebidas-r9',
        img: 'img/productos/ruta9/pepsi1.jpg',
        images: ['img/productos/ruta9/pepsi1.jpg'],
        details: { } },
      { id: 208, name: 'Porción de Papa', brand: 'Ruta 9', price: 10, cat: 'porcion-ruta9',
        img: 'img/productos/ruta9/fondo.jpg',
        images: ['img/productos/ruta9/fondo.jpg'],
        details: { 'Incluye' : ''} },
      { id: 209, name: 'Aros de Cebolla', brand: 'Ruta 9', price: 15, cat: 'porcion-ruta9',
        img: 'img/productos/ruta9/fondo.jpg',
        images: ['img/productos/ruta9/fondo.jpg'],
        details: { 'Incluye' : ''} },
      { id: 210, name: 'Pepsi de 2Lts.', brand: 'Ruta 9', price: 16, cat: 'bebidas-r9',
        img: 'img/productos/ruta9/fondo.jpg',
        images: ['img/productos/ruta9/fondo.jpg'] },
      { id: 211, name: 'Guaraná de 1Lts.', brand: 'Ruta 9', price: 14, cat: 'bebidas-r9',
        img: 'img/productos/ruta9/fondo.jpg',
        images: ['img/productos/ruta9/fondo.jpg'],
        details: { } },
      { id: 212, name: 'Paceñita', brand: 'Ruta 9', price: 6, cat: 'bebidas-r9',
        img: 'img/productos/ruta9/fondo.jpg',
        images: ['img/productos/ruta9/fondo.jpg'] },
      { id: 213, name: 'Guaraná de 2Lts.', brand: 'Ruta 9', price: 20, cat: 'bebidas-r9',
        img: 'img/productos/ruta9/fondo.jpg',
        images: ['img/productos/ruta9/fondo.jpg'] },
      { id: 214, name: 'Paceña 710 ml..', brand: 'Ruta 9', price: 25, cat: 'bebidas-r9',
        img: 'img/productos/ruta9/fondo.jpg',
        images: ['img/productos/ruta9/fondo.jpg'] },
    ],
    promotions: [
      { id: 'r9-1', badge: 'RUTA 9', title: 'Combo Personal Ruta 9', sub: 'Hamburguesa, papas y Pepsi de 1 Lts.', image: 'img/productos/ruta9/comboruta.jpg', cat: 'combos-r9', brand: 'ruta9',
        fullDescription: 'La favorita de Ruta 9.',
        validUntil: 'Consultar vigencia vigente en tienda',
        conditions: ['Precio final según modelo', 'Delivery coordinado por separado', 'Sujeto a stock disponible'] },
    ]
  }
};

const categories = Object.values(catalogByBrand).flatMap(brand => brand.categories);
const catLabels = Object.assign({}, ...Object.values(catalogByBrand).map(brand => brand.categoryLabels));
const catTaglines = Object.assign({}, ...Object.values(catalogByBrand).map(brand => brand.categoryTaglines));
const products = Object.values(catalogByBrand).flatMap(brand => brand.products.filter(product => !product.hidden));
const promotions = Object.values(catalogByBrand).flatMap(brand => brand.promotions.filter(promotion => !promotion.hidden));

const branches = [
  { id: 1, name: 'Pollos Chuy', location: 'Yacuiba', initials: 'CH',
    address: 'Completar dirección de Chuy, Yacuiba', phone: '72988493', whatsapp: CONFIG.whatsapp.chuy,
    logoImg: 'img/locales/chuy-logo.png',
    hoursMorning: 'Mier – Lun: 11:30 – 14:00', hoursNight: 'Mier – Lun: 18:00 – 22:00',
    facebook: 'https://www.facebook.com/share/1EUPJgrsGc/?mibextid=wwXIfr', instagram: 'https://instagram.com/chuy.bo' },
  { id: 2, name: 'Hamburguesas Ruta 9', location: 'Yacuiba', initials: 'R9',
    address: 'Completar dirección de Ruta 9, Yacuiba', phone: '72995911', whatsapp: CONFIG.whatsapp.ruta9,
    logoImg: 'img/locales/ruta9-logo.png',
    hoursMorning: 'Mier – Lun: 11:30 – 14:00', hoursNight: 'Mier – Lun: 18:00 – 22:00',
    facebook: 'https://www.facebook.com/share/19pSqJTgZq/?mibextid=wwXIfr', instagram: 'https://instagram.com/ruta9.bo' }
];
