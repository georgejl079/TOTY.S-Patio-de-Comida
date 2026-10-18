/* Application behavior */

const App = {
  view: 'home',
  chuyFilter: 'all',
  ruta9Filter: 'all',
  activeBrand: null,
  cartBrand: null,
  carts: {
    chuy: JSON.parse(localStorage.getItem('totys_cart_chuy') || '[]'),
    ruta9: JSON.parse(localStorage.getItem('totys_cart_ruta9') || '[]')
  },
  product: null,
  previousView: 'home',
  _settingHash: false,
  _scrollSaveTimer: null,
  _lastFocused: null,

  // Inicialización de la aplicación
  init() {
    this.carts.chuy = this.normalizeCart(this.carts.chuy);
    this.carts.ruta9 = this.normalizeCart(this.carts.ruta9);
    try {
      localStorage.setItem('totys_cart_chuy', JSON.stringify(this.carts.chuy));
      localStorage.setItem('totys_cart_ruta9', JSON.stringify(this.carts.ruta9));
    } catch (e) {}

    this.renderLocales();
    this.renderGallery();
    this.renderMenu('totys');
    this.renderBrandView('chuy');
    this.renderBrandView('ruta9');
    this.renderAbout();
    this.updateCart();
    this.bindSearch();
    this.bindRouting();
    this.bindModals();

    const devUrl = CONFIG.developer?.url || '#';
    ['developer-link', 'footer-developer'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.href = devUrl;
    });
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    this.onResize();
    this.setDesktopNav('home');
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: renderLocales()
     ═══════════════════════════════════════════════════
     Qué hace: Muestra las tarjetas de los locales (Chuy y Ruta 9)
     en la página de inicio. Toma la información de la variable "locales"
     y crea las tarjetas con las imágenes, logos y descripciones.
  ═══════════════════════════════════════════════════ */
  renderLocales() {
    // Busca el contenedor HTML donde se mostrarán las tarjetas (por ID)
    const container = document.getElementById('locales-grid');
    // Si no encuentra el contenedor, detiene la función (no hace nada)
    if (!container) return;
    // Para cada local en la lista, crea el HTML de la tarjeta
    container.innerHTML = locales.map(loc => {
    // Para cada ícono de información del local (pollos, bebidas, horarios)
    const metaItems = loc.meta.map(m => `
      <div class="local-card-meta-item">
        <i class="fas ${m.icon}"></i>
        <span>${m.text}</span>
      </div>
    `).join('');
    // Verifica si el logo es tipo "iniciales" (CH, R9) o ícono
    // Si hay imagen de logo, la usamos; si no, iniciales o ícono
    let logoContent = '';
    if (loc.logoImg) {
      logoContent = '<img src="' + loc.logoImg + '" alt="' + loc.name + ' logo" class="local-card-logo-img" loading="lazy">';
    } else if (loc.logo.type === 'initials') {
      logoContent = loc.logo.value;
    } else {
      logoContent = '<i class="fas " + loc.logo.value + "></i>';
    }
    // Crea toda la tarjeta HTML con todos sus elementos
    return `
      <article class="local-card ${loc.id}">
        <div class="local-card-cover ${loc.id}">
          <img src="${loc.cover}" alt="${loc.name}" loading="lazy">
          <span class="local-card-badge ${loc.id}">
            <i class="fas ${loc.badgeIcon}"></i> ${loc.badge}
          </span>
        </div>
        <div class="local-card-body ${loc.id}">
          <div class="local-card-logo-wrap ${loc.id}">
            <div class="local-card-logo ${loc.id}">${logoContent}</div>
          </div>
          <p class="subtitle">${loc.tagline}</p>
          <p class="description">${loc.description}</p>
          <div class="local-card-meta">${metaItems}</div>
          <button type="button" class="local-card-cta" onclick="App.go('${loc.action}')">
            <i class="fas fa-door-open"></i> Ingresar a ${loc.name}
          </button>
        </div>
      </article>
    `;
  }).join('');
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: renderGallery()
     ═══════════════════════════════════════════════════
     Qué hace: Muestra la galería de fotos del local.
     Toma las imágenes de la variable "gallery" y crea
     botones que al hacer clic abren la imagen en grande.
  ═══════════════════════════════════════════════════ */
  renderGallery() {
    // Busca el contenedor de la galería
    const container = document.getElementById('gallery-grid');
    // Si no lo encuentra, no hace nada
    if (!container) return;
    // Para cada imagen, crea un botón con la foto
    container.innerHTML = gallery.map(item => `
      <button type="button" class="gallery-item" onclick="App.openGalleryModal(${item.id})" aria-label="Ver ${item.title}">
        <img src="${item.src}" alt="${item.title}" loading="lazy">
        <span class="zoom-icon"><i class="fas fa-expand"></i></span>
        <span class="caption">${item.title}</span>
      </button>
    `).join('');
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: openGalleryModal(id)
     ═══════════════════════════════════════════════════
     Qué hace: Abre una imagen de la galería en grande (modal).
     Recibe el ID de la imagen, busca la información y muestra
     la ventana emergente con la foto ampliada.
  ═══════════════════════════════════════════════════ */
  openGalleryModal(id) {
    // Busca la imagen en la galería usando su ID
    const item = gallery.find(g => g.id === Number(id));
    // Si no encuentra la imagen, no hace nada
    if (!item) return;
    // Coloca la imagen en el modal
    document.getElementById('gallery-modal-img').src = item.src;
    document.getElementById('gallery-modal-img').alt = item.title;
    // Muestra la categoría y título de la imagen
    document.getElementById('gallery-modal-cat').textContent = item.cat;
    document.getElementById('gallery-modal-title').textContent = item.title;
    // Muestra el modal (ventana emergente)
    document.getElementById('gallery-modal-overlay').classList.add('show');
    document.getElementById('gallery-modal').classList.add('show');
    // Bloquea el scroll de la página mientras el modal está abierto
    document.body.style.overflow = 'hidden';
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: closeGalleryModal()
     ═══════════════════════════════════════════════════
     Qué hace: Cierra la ventana emergente de la galería.
     Oculta el modal y vuelve a permitir el scroll de la página.
  ═══════════════════════════════════════════════════ */
  closeGalleryModal() {
    // Oculta el modal quitando la clase "show"
    document.getElementById('gallery-modal-overlay').classList.remove('show');
    document.getElementById('gallery-modal').classList.remove('show');
    // Vuelve a permitir el scroll de la página
    document.body.style.overflow = '';
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: bindSearch()
     ═══════════════════════════════════════════════════
     Qué hace: Conecta los campos de búsqueda (móvil y desktop)
     para que funcionen juntos. Cuando escribes en uno, se
     actualiza el otro y se filtran los productos.
  ═══════════════════════════════════════════════════ */
  bindSearch() {
    // Busca los campos de búsqueda de móvil y desktop
    const searchMobile = document.getElementById('search-input');
    const searchDesk = document.getElementById('search-input-desktop');
    // Función que se ejecuta cuando escribes en la búsqueda
    const onInput = (val) => {
      // Sincroniza ambos campos de búsqueda
      if (searchMobile) searchMobile.value = val;
      if (searchDesk) searchDesk.value = val;
      // Filtra los productos según lo que escribiste
      this.onSearch(val);
    };
    // Conecta el evento "input" a ambos campos
    if (searchMobile) searchMobile.addEventListener('input', (e) => onInput(e.target.value));
    if (searchDesk) searchDesk.addEventListener('input', (e) => onInput(e.target.value));
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: bindRouting()
     ═══════════════════════════════════════════════════
     Qué hace: Conecta los eventos de navegación y cambios
     de tamaño de pantalla. Permite que la página funcione
     correctamente al cambiar entre vistas y dispositivos.
  ═══════════════════════════════════════════════════ */
  bindRouting() {
    // Detecta cuando se cambia el tamaño de la ventana
    window.addEventListener('resize', () => this.onResize());
    // Detecta cuando cambia la URL (navegación entre páginas)
    window.addEventListener('hashchange', () => this.onHashChange());
    // Guarda la posición del scroll al hacer scroll
    window.addEventListener('scroll', () => this.queueSaveScroll(), { passive: true });
    // Guarda el scroll cuando se cierra la página
    window.addEventListener('pagehide', () => this.saveScroll());

    // Verifica si se compartió un producto específico
    const sharedId = new URLSearchParams(window.location.search).get('producto');
    if (location.hash) {
      // Si hay una URL con hash, aplica esa ruta
      this.applyRoute(this.parseHash(), true);
    } else if (sharedId && products.some(p => p.id === Number(sharedId))) {
      // Si se compartió un producto, abre ese producto
      this.openProduct(sharedId);
    } else {
      // Si no hay nada, va al inicio
      history.replaceState(null, '', location.pathname + location.search + '#/');
    }
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: bindModals()
     ═══════════════════════════════════════════════════
     Qué hace: Permite cerrar todas las ventanas emergentes
     (modales) presionando la tecla Escape.
  ═══════════════════════════════════════════════════ */
  bindModals() {
    // Escucha cuando se presiona una tecla
    document.addEventListener('keydown', (e) => {
      // Si es la tecla Escape, cierra todos los modales
      if (e.key === 'Escape') {
        this.closeAll();
        this.closePromoModal();
        this.closeCartSelector();
        this.closeManualSendModal();
        this.closeGalleryModal();
      }
    });
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: parseHash()
     ═══════════════════════════════════════════════════
     Qué hace: Lee la URL (después del #) y determina qué
     página mostrar. Por ejemplo: #/chuy va a la página de Chuy.
  ═══════════════════════════════════════════════════ */
  parseHash() {
    // Limpia el hash (quita el # y las barras al inicio)
    const raw = (location.hash || '').replace(/^#\/?/, '');
    // Separa las partes por las barras
    const parts = raw.split('/').filter(Boolean);
    // Si no hay nada, va al inicio
    if (!parts.length) return { view: 'home' };
    // Si es "chuy", va a la página de Chuy
    if (parts[0] === 'chuy') return { view: 'chuy' };
    // Si es "ruta9", va a la página de Ruta 9
    if (parts[0] === 'ruta9') return { view: 'ruta9' };
    // Si es "nosotros", va a la página "Acerca de"
    if (parts[0] === 'nosotros') return { view: 'about' };
    // Si es "producto" con un ID, abre ese producto
    if (parts[0] === 'producto' && parts[1]) return { view: 'product', id: parts[1] };
    // Si no reconoce la URL, va al inicio
    return { view: 'home' };
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: applyRoute(route, isInitialLoad)
     ═══════════════════════════════════════════════════
     Qué hace: Aplica la ruta determinada por parseHash().
     Cambia a la vista correspondiente (home, chuy, ruta9, etc).
  ═══════════════════════════════════════════════════ */
  applyRoute(route, isInitialLoad) {
    // Si la ruta es para un producto específico
    if (route.view === 'product') {
      // Verifica que el producto exista y lo abre
      if (products.some(p => p.id === Number(route.id))) this.openProduct(route.id, { silent: true });
      // Si no existe, va al inicio
      else this.go('home', {}, { silent: true });
    } else {
      // Para cualquier otra vista, cambia a esa vista
      this.go(route.view, {}, { silent: true });
    }
    if (isInitialLoad) this.restoreScroll(route.view);
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: onHashChange()
     ═══════════════════════════════════════════════════
     Qué hace: Se ejecuta cuando la URL cambia (cuando el
     usuario navega). Aplica la nueva ruta detectada.
  ═══════════════════════════════════════════════════ */
  onHashChange() {
    // Si el cambio de URL fue hecho por el código (no por el usuario), ignóralo
    if (this._settingHash) { this._settingHash = false; return; }
    // Aplica la nueva ruta
    this.applyRoute(this.parseHash());
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: updateHash(view)
     ═══════════════════════════════════════════════════
     Qué hace: Actualiza la URL cuando el usuario navega.
     Por ejemplo, si va a Chuy, cambia la URL a #/chuy.
  ═══════════════════════════════════════════════════ */
  updateHash(view) {
    let hash;
    // Define el hash según la vista
    if (view === 'home') hash = '#/';
    else if (view === 'chuy') hash = '#/chuy';
    else if (view === 'ruta9') hash = '#/ruta9';
    else if (view === 'about') hash = '#/nosotros';
    else return;
    // Solo actualiza si el hash es diferente
    if (location.hash !== hash) {
      this._settingHash = true;
      location.hash = hash;
    }
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: queueSaveScroll()
     ═══════════════════════════════════════════════════
     Qué hace: Guarda la posición del scroll después de
     un pequeño delay (para no guardar continuamente
     mientras el usuario hace scroll).
  ═══════════════════════════════════════════════════ */
  queueSaveScroll() {
    // Cancela el timer anterior si existe
    clearTimeout(this._scrollSaveTimer);
    // Crea un nuevo timer para guardar el scroll después de 150ms
    this._scrollSaveTimer = setTimeout(() => this.saveScroll(), 150);
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: saveScroll()
     ═══════════════════════════════════════════════════
     Qué hace: Guarda la posición actual del scroll en la
     memoria del navegador. Así cuando el usuario vuelve
     a esa página, queda donde estaba.
  ═══════════════════════════════════════════════════ */
  saveScroll() {
    try {
      // Determina qué vista estamos viendo
      const key = document.body.classList.contains('product-open') ? 'product' : this.view;
      // Obtiene la posición del scroll
      const y = document.body.classList.contains('product-open')
        ? (document.getElementById('view-product')?.scrollTop || 0)
        : window.scrollY;
      // Guarda la posición en la memoria del navegador
      sessionStorage.setItem('totys_scroll_' + key, String(y));
    } catch (e) {}
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: restoreScroll(view)
     ═══════════════════════════════════════════════════
     Qué hace: Restaura la posición del scroll que se guardó
     anteriormente. Devuelve al usuario a donde estaba.
  ═══════════════════════════════════════════════════ */
  restoreScroll(view) {
    try {
      // Obtiene la posición guardada del scroll
      const y = Number(sessionStorage.getItem('totys_scroll_' + view) || 0);
      // Si no hay posición guardada, no hace nada
      if (!y) return;
      // Restaura la posición
      requestAnimationFrame(() => {
        if (view === 'product') {
          const el = document.getElementById('view-product');
          if (el) el.scrollTop = y;
        } else {
          window.scrollTo(0, y);
        }
      });
    } catch (e) {}
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: isMobile()
     ═══════════════════════════════════════════════════
     Qué hace: Detecta si el usuario está en un dispositivo
     móvil (pantalla menor a 769px de ancho).
  ═══════════════════════════════════════════════════ */
  isMobile() { return window.innerWidth < 769; },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: onResize()
     ═══════════════════════════════════════════════════
     Qué hace: Se ejecuta cuando cambia el tamaño de la
     ventana. Ajusta el diseño entre móvil y desktop.
  ═══════════════════════════════════════════════════ */
  onResize() {
    // Agrega o quita la clase "desktop" según el tamaño
    document.body.classList.toggle('desktop', !this.isMobile());
    // Si estamos en desktop y viendo un producto, muestra el header
    if (!this.isMobile() && document.body.classList.contains('product-open')) {
      document.getElementById('app-header').style.display = '';
    }
  },

  /* ═══════════════════════════════════════════════════
     FUNCIONES DEL CARRITO (Sistema multi-marca)
     ═══════════════════════════════════════════════════
     Cada marca (Chuy y Ruta 9) tiene su propio carrito
     independiente. Estas funciones manejan los carritos.
  ═══════════════════════════════════════════════════ */

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: cartKeyForProduct(p)
     ═══════════════════════════════════════════════════
     Qué hace: Determina a qué carrito pertenece un producto
     (si es de Chuy o de Ruta 9) según su categoría.
  ═══════════════════════════════════════════════════ */
  cartKeyForProduct(p) {
    const brand = this.getBrandFromCat(p.cat);
    return brand === 'ruta9' ? 'ruta9' : 'chuy';
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: getCart(brand)
     ═══════════════════════════════════════════════════
     Qué hace: Obtiene los productos del carrito de una
     marca específica (Chuy o Ruta 9).
  ═══════════════════════════════════════════════════ */
  getCart(brand) {
    if (!brand || brand === 'totys') return [];
    return this.carts[brand] || [];
  },

  normalizeCart(items) {
    const itemsById = new Map();
    (Array.isArray(items) ? items : []).forEach(item => {
      if (!item || typeof item !== 'object') return;
      const itemKey = item.id != null ? String(item.id) : `${item.name}-${item.price}`;
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const existingItem = itemsById.get(itemKey);
      if (existingItem) {
        existingItem.quantity += quantity;
        return;
      }
      const normalizedItem = { ...item, quantity };
      delete normalizedItem.sku;
      itemsById.set(itemKey, normalizedItem);
    });
    return Array.from(itemsById.values());
  },

  cartQuantity(items) {
    return items.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  },

  cartTotal(items) {
    return items.reduce((total, item) => total + item.price * (Number(item.quantity) || 1), 0);
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: setCart(brand, items)
     ═══════════════════════════════════════════════════
     Qué hace: Guarda los productos en el carrito de una
     marca. Los guarda en la memoria del navegador para
     que no se pierdan al recargar la página.
  ═══════════════════════════════════════════════════ */
  setCart(brand, items) {
    if (!brand || brand === 'totys') return;
    this.carts[brand] = this.normalizeCart(items);
    try {
      localStorage.setItem('totys_cart_' + brand, JSON.stringify(this.carts[brand]));
    } catch (e) {}
    this.updateCart();
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: whatsappFor(brand)
     ═══════════════════════════════════════════════════
     Qué hace: Retorna el número de WhatsApp de la marca
     especificada (Chuy, Ruta 9 o TOTY'S general).
  ═══════════════════════════════════════════════════ */
  whatsappFor(brand) {
    if (brand === 'chuy') return CONFIG.whatsapp.chuy;
    if (brand === 'ruta9') return CONFIG.whatsapp.ruta9;
    return CONFIG.whatsapp.totys;
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: go(view, opts, navOpts)
     ═══════════════════════════════════════════════════
     Qué hace: Esta es la FUNCIÓN PRINCIPAL DE NAVEGACIÓN.
     Cambia entre las diferentes páginas (vistas) de la app:
     - 'home': Página de inicio
     - 'chuy': Página de Chuy (pollos)
     - 'ruta9': Página de Ruta 9 (hamburguesas)
     - 'about': Página "Acerca de"
     - 'product': Página de un producto específico
     También cambia los colores de la página según la marca.
  ═══════════════════════════════════════════════════ */
  go(view, opts = {}, navOpts = {}) {
    // Cierra cualquier ventana emergente abierta
    this.closeOverlays();
    // Si no vamos a un producto, quita el modo producto
    if (view !== 'product') {
      document.body.classList.remove('product-open');
      document.getElementById('app-header').style.display = '';
    }

    // Quita todos los modos de marca (colores)
    document.body.classList.remove('home-mode', 'chuy-mode', 'ruta9-mode');

    // Decide qué modo de marca activar según la vista
    if (view === 'ruta9') {
      // Activa modo Ruta 9 (negro/naranja)
      document.body.classList.add('ruta9-mode');
      this.activeBrand = 'ruta9';
      this.cartBrand = 'ruta9';
      this.updateBrandUI('ruta9');
    } else if (view === 'chuy') {
      // Activa modo Chuy (rojo/amarillo)
      document.body.classList.add('chuy-mode');
      this.activeBrand = 'chuy';
      this.cartBrand = 'chuy';
      this.updateBrandUI('chuy');
    } else if (view === 'product' && this.product) {
      // Si es un producto, activa el modo de su marca
      const prodBrand = this.getBrandFromCat(this.product.cat);
      if (prodBrand === 'ruta9') document.body.classList.add('ruta9-mode');
      else if (prodBrand === 'chuy') document.body.classList.add('chuy-mode');
      else document.body.classList.add('home-mode');
      this.activeBrand = prodBrand;
      this.cartBrand = prodBrand;
      this.updateBrandUI(prodBrand);
    } else {
      // Por defecto, modo TOTY'S (azul)
      document.body.classList.add('home-mode');
      this.activeBrand = null;
      this.cartBrand = null;
      this.updateBrandUI('totys');
    }

    // Guarda la vista actual
    this.view = view;
    // Oculta todas las vistas
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    // Muestra solo la vista seleccionada
    const el = document.getElementById('view-' + view);
    if (el) el.classList.add('active');
    // Actualiza los botones de navegación inferior
    document.querySelectorAll('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === view);
    });

    // Si vamos a Chuy o Ruta 9, renderiza sus productos
    if (view === 'chuy') this.renderBrandGrid('chuy', this.chuyFilter);
    if (view === 'ruta9') this.renderBrandGrid('ruta9', this.ruta9Filter);

    // Si no es una navegación silenciosa, hace scroll al inicio
    if (!navOpts.silent) {
      if (view === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      if (view === 'about') window.scrollTo({ top: 0 });
    }
    // Actualiza la navegación de desktop
    this.setDesktopNav(view);
    // Actualiza la URL (si no es silencioso)
    if (!navOpts.silent) this.updateHash(view);
    // Actualiza el contador del carrito
    this.updateCart();
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: setDesktopNav(view)
     ═══════════════════════════════════════════════════
     Qué hace: Actualiza los botones de navegación en desktop
     para mostrar cuál página está activa.
  ═══════════════════════════════════════════════════ */
  setDesktopNav(view) {
    document.querySelectorAll('.desktop-nav button').forEach(b => {
      b.classList.toggle('active', b.dataset.nav === view);
    });
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: updateBrandUI(brand)
     ═══════════════════════════════════════════════════
     Qué hace: Actualiza toda la interfaz según la marca
     activa (Chuy, Ruta 9 o TOTY'S). Cambia el logo,
     el anuncio superior y el título del menú.
  ═══════════════════════════════════════════════════ */
  updateBrandUI(brand) {
    const logos = ['mobile-logo', 'desktop-logo'];
    const announcement = document.getElementById('announcement-text');
    const menuTitle = document.getElementById('menu-title');

    const locLogo = locales.find(x => x.id === brand);
    const logoImg = brand === 'totys' ? CONFIG.store.logoImg : locLogo?.logoImg;
    const logoImgHtml = logoImg ? '<img src="' + logoImg + '" alt="' + brand + ' logo" class="header-logo-img">' : null;

    if (brand === 'chuy') {
      // Cambia todo a modo Chuy (pollos)
      logos.forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = logoImgHtml || 'Chuy'; });
      if (announcement) announcement.textContent = '🔥 CHUY · POLLOS Y BEBIDAS · DELIVERY · WHATSAPP 🍗';
      if (menuTitle) menuTitle.textContent = 'Chuy';
    } else if (brand === 'ruta9') {
      // Cambia todo a modo Ruta 9 (hamburguesas)
      logos.forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = logoImgHtml || 'Ruta 9 <i class="fas fa-fire" style="font-size:0.8em;"></i>'; });
      if (announcement) announcement.textContent = '🔥 RUTA 9 · HAMBURGUESAS AL FUEGO · DELIVERY · WHATSAPP 🍔';
      if (menuTitle) menuTitle.textContent = 'Ruta 9';
    } else {
      // Cambia todo a modo TOTY'S (general)
      logos.forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = logoImgHtml || 'TOTY\'S'; });
      if (announcement) announcement.textContent = '🍽️ TOTY\'S · PATIO DE COMIDA · CHUY & RUTA 9';
      if (menuTitle) menuTitle.textContent = 'Menú';
    }
    // Actualiza el menú lateral
    this.renderMenu(brand);
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: getBrandFromCat(cat)
     ═══════════════════════════════════════════════════
     Qué hace: Determina a qué marca pertenece una categoría
     de producto. Por ejemplo, "pollos" es de Chuy.
  ═══════════════════════════════════════════════════ */
  getBrandFromCat(cat) {
    // Busca la categoría en la lista de categorías
    const c = categories.find(x => x.id === cat);
    // Retorna la marca de esa categoría (Chuy o Ruta 9)
    return c ? c.brand : 'chuy';
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: renderBrandView(brand)
     ═══════════════════════════════════════════════════
     Qué hace: Prepara la página de una marca (Chuy o Ruta 9)
     mostrando sus promociones, filtros de categorías y productos.
     Esta función NO muestra la página, solo la prepara.
  ═══════════════════════════════════════════════════ */
  renderBrandView(brand) {
    // Define el prefijo según la marca (chuy o ruta9)
    const prefix = brand === 'chuy' ? 'chuy' : 'ruta9';
    // Filtra las categorías de esta marca
    const brandCats = categories.filter(c => c.brand === brand);
    // Filtra los productos de esta marca
    const brandProducts = products.filter(p => this.getBrandFromCat(p.cat) === brand);
    // Filtra las promociones de esta marca
    const brandPromos = promotions.filter(pr => pr.brand === brand);

    // Muestra las promociones de la marca
    const promosEl = document.getElementById(prefix + '-promos');
    if (promosEl) {
      promosEl.innerHTML = brandPromos.map((pr) => {
        const globalIdx = promotions.indexOf(pr);
        return `<article class="promo-card" onclick="App.openPromoModal(${globalIdx});">
          <button type="button" class="card-float-share" onclick="event.stopPropagation(); App.sharePromo(${globalIdx})" aria-label="Compartir promoción"><i class="fas fa-share-alt"></i></button>
          <img src="${pr.image}" alt="${pr.title}" loading="lazy">
          <div class="promo-body"><span class="badge">${pr.badge}</span><strong>${pr.title}</strong><p>${pr.sub}</p></div>
        </article>`;
      }).join('');
    }

    // Muestra los filtros de categorías
    const filtersEl = document.getElementById(prefix + '-filters');
    if (filtersEl) {
      const cats = ['all', ...brandCats.map(c => c.id)];
      filtersEl.innerHTML = cats.map(c => {
        // Cuenta cuántos productos hay en cada categoría
        const count = c === 'all' ? brandProducts.length : brandProducts.filter(p => p.cat === c).length;
        const label = c === 'all' ? 'Todos' : catLabels[c];
        return `<div class="filter-chip${c === 'all' ? ' active' : ''}" data-cat="${c}" onclick="App.filterBrand('${brand}','${c}')">
          <span class="filter-chip-btn">${label}</span>
          <span class="filter-chip-count">${count}</span>
        </div>`;
      }).join('');
    }

    // Renderiza el grid de productos
    this.renderBrandGrid(brand, brand === 'chuy' ? this.chuyFilter : this.ruta9Filter);
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: renderBrandGrid(brand, cat)
     ═══════════════════════════════════════════════════
     Qué hace: Renderiza los chips de categorías y el
     grid de productos de una marca (chuy o ruta9),
     filtrando por categoría si no es 'all'.
  ═══════════════════════════════════════════════════ */
  renderBrandGrid(brand, cat) {
    const prefix = brand === 'chuy' ? 'chuy' : 'ruta9';
    const gridEl = document.getElementById(prefix + '-grid');
    const catsEl = document.getElementById(prefix + '-categories');
    const brandProducts = products.filter(p => this.getBrandFromCat(p.cat) === brand);
    const brandCats = categories.filter(c => c.brand === brand);

    if (!gridEl) return;

    if (cat === 'all') {
      gridEl.style.display = 'none';
      gridEl.innerHTML = '';
      if (catsEl) {
        catsEl.style.display = '';
        catsEl.innerHTML = brandCats.map(c => {
          const catProducts = brandProducts.filter(p => p.cat === c.id);
          const tagline = catTaglines[c.id] ? `<span class="cat-eyebrow">${catTaglines[c.id]}</span>` : '';
          const categoryContent = catProducts.length
            ? `<div class="grid">${catProducts.map(p => this.productCard(p)).join('')}</div>`
            : '<p class="empty">Productos próximamente.</p>';
          return `<div class="cat-section">
            <div class="section-title cat-section-title">
              <div>${tagline}<h2>${c.name}</h2></div>
              <button type="button" class="link-btn" onclick="App.filterBrand('${brand}','${c.id}')">Ver todo <i class="fas fa-chevron-right"></i></button>
            </div>
            ${categoryContent}
          </div>`;
        }).join('');
      }
    } else {
      if (catsEl) { catsEl.style.display = 'none'; catsEl.innerHTML = ''; }
      gridEl.style.display = '';
      const data = brandProducts.filter(p => p.cat === cat);
      gridEl.innerHTML = data.length ? data.map(p => this.productCard(p)).join('') : '<p class="empty">No hay productos.</p>';
    }

    const filtersEl = document.getElementById(prefix + '-filters');
    if (filtersEl) {
      filtersEl.querySelectorAll('.filter-chip').forEach(b =>
        b.classList.toggle('active', b.dataset.cat === cat)
      );
    }

    const countEl = document.getElementById(prefix + '-count');
    if (countEl) countEl.textContent = '(' + brandProducts.length + ' productos)';
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: filterBrand(brand, cat)
     ═══════════════════════════════════════════════════
     Qué hace: Guarda el filtro activo de la marca y
     vuelve a renderizar el grid con esa categoría.
  ═══════════════════════════════════════════════════ */
  filterBrand(brand, cat) {
    if (brand === 'chuy') this.chuyFilter = cat;
    else this.ruta9Filter = cat;
    this.renderBrandGrid(brand, cat);
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: renderGrid(id, data)
     ═══════════════════════════════════════════════════
     Qué hace: Dibuja el grid de productos en el
     contenedor indicado. Si no hay datos, muestra
     el mensaje "No hay productos".
  ═══════════════════════════════════════════════════ */
  renderGrid(id, data) {
    const g = document.getElementById(id);
    if (!g) return;
    g.innerHTML = data.length ? data.map(p => this.productCard(p)).join('') : '<p class="empty">No hay productos.</p>';
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: productCard(p)
     ═══════════════════════════════════════════════════
    Qué hace: Genera el HTML de una tarjeta de
    producto: imagen, nombre, precio, categoría
     y botones (ver detalles, WhatsApp, compartir).
  ═══════════════════════════════════════════════════ */
  productCard(p) {
    const brandTag = p.brand ? `<span class="brand-tag">${p.brand}</span>` : '';
    return `<div class="card">
      <button type="button" class="card-img-btn" onclick="App.openProduct(${p.id})" aria-label="Ver ${p.name}">
        <div class="card-img"><img src="${p.img}" alt="${p.name}" loading="lazy">${brandTag}</div>
      </button>
      <button type="button" class="card-info" onclick="App.openProduct(${p.id})">
        <h4>${p.name}</h4>
        <div class="row"><span class="price">Bs. ${p.price}</span><span>${catLabels[p.cat]}</span></div>
      </button>
      <div class="card-actions">
        <button type="button" class="card-btn-wa" onclick="event.stopPropagation(); App.quickWhatsapp(${p.id})"><i class="fab fa-whatsapp"></i> Consultar</button>
        <div class="card-actions-row">
          <button type="button" class="card-btn" onclick="event.stopPropagation(); App.addToCartProduct(${p.id})"><i class="fas fa-shopping-cart"></i> Agregar</button>
          <button type="button" class="card-icon-btn" onclick="event.stopPropagation(); App.shareProduct(${p.id})" aria-label="Compartir producto"><i class="fas fa-share-alt"></i></button>
        </div>
      </div>
    </div>`;
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: quickWhatsapp(id)
     ═══════════════════════════════════════════════════
     Qué hace: Abre WhatsApp con un mensaje pre-escrito
    del producto (nombre y precio) hacia el número
     de la marca correspondiente.
  ═══════════════════════════════════════════════════ */
  quickWhatsapp(id) {
    const p = products.find(x => x.id === Number(id));
    if (!p) return;
    const brand = this.getBrandFromCat(p.cat);
    const phone = this.whatsappFor(brand);
    const msg = `Hola TOTY'S (${brand === 'chuy' ? 'Chuy' : 'Ruta 9'}), me interesa este producto:\n*${p.name}*\nBs. ${p.price}\n¿Podrían darme más información?`;
    window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: openProduct(id, navOpts)
     ═══════════════════════════════════════════════════
     Qué hace: Abre la vista de detalle de un producto.
     Guarda la vista anterior, cambia el modo de marca,
     y carga imagen principal, thumbs y detalles.
  ═══════════════════════════════════════════════════ */
  openProduct(id, navOpts = {}) {
    const p = products.find(x => x.id === Number(id));
    if (!p) return;
    this.closeOverlays();
    this.previousView = document.body.classList.contains('product-open') ? this.previousView : this.view;
    this.product = p;
    document.body.classList.add('product-open');

    document.body.classList.remove('home-mode', 'chuy-mode', 'ruta9-mode');
    const prodBrand = this.getBrandFromCat(p.cat);
    if (prodBrand === 'ruta9') document.body.classList.add('ruta9-mode');
    else if (prodBrand === 'chuy') document.body.classList.add('chuy-mode');
    else document.body.classList.add('home-mode');
    this.activeBrand = prodBrand;
    this.cartBrand = prodBrand;
    this.updateBrandUI(prodBrand);

    document.getElementById('app-header').style.display = this.isMobile() ? 'none' : '';
    document.getElementById('pd-main-img').src = p.images[0];
    document.getElementById('pd-main-img').alt = p.name;
    document.getElementById('pd-thumbs').innerHTML = p.images.map((src, i) =>
      `<button type="button" class="pd-thumb${i === 0 ? ' active' : ''}" data-idx="${i}" onclick="App.setImage(this)" aria-label="Ver imagen ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`
    ).join('');
    document.getElementById('pd-cat-label').textContent = catLabels[p.cat];
    document.getElementById('pd-name').textContent = p.name;
    document.getElementById('pd-price').textContent = 'Bs. ' + p.price;
    document.getElementById('pd-price-sticky').textContent = 'Bs. ' + p.price;
    const priceBtn = document.getElementById('pd-price-btn');
    if (priceBtn) priceBtn.textContent = 'Bs. ' + p.price;
    document.getElementById('panel-details').innerHTML = '<table class="detail-table">' +
      Object.entries(p.details).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('') + '</table>';

    if (!navOpts.silent) {
      document.getElementById('view-product').scrollTop = 0;
      window.scrollTo(0, 0);
    }
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-product').classList.add('active');
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    if (!navOpts.silent) {
      this._settingHash = true;
      location.hash = '#/producto/' + p.id;
    }
    this.updateCart();
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: closeProduct()
     ═══════════════════════════════════════════════════
     Qué hace: Cierra la vista de producto y vuelve
     a la vista anterior (según la marca del producto
     o la vista guardada en previousView).
  ═══════════════════════════════════════════════════ */
  closeProduct() {
    document.body.classList.remove('product-open');
    document.getElementById('app-header').style.display = '';
    const prodBrand = this.product ? this.getBrandFromCat(this.product.cat) : null;
    if (prodBrand === 'ruta9') this.go('ruta9');
    else if (prodBrand === 'chuy') this.go('chuy');
    else this.go(this.previousView || 'home');
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: setImage(btn)
     ═══════════════════════════════════════════════════
     Qué hace: Cambia la imagen principal del producto
     al hacer clic en un thumb (miniatura). Marca
     el thumb activo según el índice (data-idx).
  ═══════════════════════════════════════════════════ */
  setImage(btn) {
    const idx = Number(btn.dataset.idx);
    const img = btn.querySelector('img');
    if (!img) return;
    document.getElementById('pd-main-img').src = img.src;
    document.querySelectorAll('.pd-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: addToCart()
     ═══════════════════════════════════════════════════
     Qué hace: Añade el producto actual al carrito de
     su marca, lo guarda en localStorage, muestra un
     toast y abre el panel del carrito.
  ═══════════════════════════════════════════════════ */
  addToCart() {
    if (!this.product) return;
    this.addProductToCart(this.product, true);
  },
  addProductToCart(product, openCart = false) {
    const key = this.cartKeyForProduct(product);
    const cart = this.getCart(key).slice();
    const existingItem = cart.find(item => Number(item.id) === Number(product.id));
    if (existingItem) {
      existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, cat: product.cat, brand: product.brand, quantity: 1 });
    }
    this.setCart(key, cart);
    this.toast('🔥 ¡Añadido al pedido de ' + (key === 'chuy' ? 'Chuy' : 'Ruta 9') + '!');
    if (openCart) setTimeout(() => this.openCart(key), 400);
  },
  addToCartProduct(id) {
    const product = products.find(item => item.id === Number(id));
    if (product) this.addProductToCart(product);
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: renderMenu(brand)
     ═══════════════════════════════════════════════════
     Qué hace: Genera el contenido del menú lateral
     según la marca: inicio, categorías, contacto
     por WhatsApp y enlaces a redes sociales.
  ═══════════════════════════════════════════════════ */
  renderMenu(brand) {
    let content = '';
    if (brand === 'chuy') {
      const chuyCats = categories.filter(c => c.brand === 'chuy');
      content = `<p class="menu-label">Chuy</p>
        <button type="button" class="menu-link" onclick="App.go('chuy'); App.closeMenu();"><i class="fas fa-drumstick-bite"></i> Inicio Chuy</button>
        ${chuyCats.map(c => `<button type="button" class="menu-link" onclick="App.filterBrand('chuy','${c.id}'); App.go('chuy'); App.closeMenu();"><i class="fas fa-tag"></i> ${c.name}</button>`).join('')}
        <p class="menu-label">Contacto</p>
        <button type="button" class="menu-link" onclick="App.whatsappBrand('chuy'); App.closeMenu();"><i class="fab fa-whatsapp"></i> WhatsApp Chuy</button>`;
    } else if (brand === 'ruta9') {
      const r9Cats = categories.filter(c => c.brand === 'ruta9');
      content = `<p class="menu-label">Ruta 9</p>
        <button type="button" class="menu-link" onclick="App.go('ruta9'); App.closeMenu();"><i class="fas fa-fire"></i> Inicio Ruta 9</button>
        ${r9Cats.map(c => `<button type="button" class="menu-link" onclick="App.filterBrand('ruta9','${c.id}'); App.go('ruta9'); App.closeMenu();"><i class="fas fa-tag"></i> ${c.name}</button>`).join('')}
        <p class="menu-label">Contacto</p>
        <button type="button" class="menu-link" onclick="App.whatsappBrand('ruta9'); App.closeMenu();"><i class="fab fa-whatsapp"></i> WhatsApp Ruta 9</button>`;
    } else {
      content = `
        <p class="menu-label">Marcas</p>
        <button type="button" class="menu-link" onclick="App.go('chuy'); App.closeMenu();"><i class="fas fa-drumstick-bite" style="color:#cc0000;"></i> Chuy · Pollos y bebidas</button>
        <button type="button" class="menu-link" onclick="App.go('ruta9'); App.closeMenu();"><i class="fas fa-fire" style="color:#ff6a00;"></i> Ruta 9 · Hamburguesas</button>
        <p class="menu-label">TOTY'S</p>
        <button type="button" class="menu-link" onclick="App.go('home'); App.closeMenu();"><i class="fas fa-home"></i> Inicio</button>
        <button type="button" class="menu-link" onclick="App.go('about'); App.closeMenu();"><i class="fas fa-info-circle"></i> Sobre TOTY'S</button>
        <button type="button" class="menu-link" onclick="App.whatsappBrand('totys'); App.closeMenu();"><i class="fab fa-whatsapp"></i> WhatsApp TOTY'S</button>
        <button type="button" class="menu-link" onclick="App.sharePage(); App.closeMenu();"><i class="fas fa-share-alt"></i> Compartir tienda</button>
      `;
    }
    const menuEl = document.getElementById('menu-content');
    if (!menuEl) return;
    menuEl.innerHTML = content;
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: openMenu()
     ═══════════════════════════════════════════════════
     Qué hace: Abre el menú lateral y el overlay.
     Guarda el elemento con foco para restaurarlo
     al cerrar (accesibilidad).
  ═══════════════════════════════════════════════════ */
  openMenu() {
    this._lastFocused = document.activeElement;
    document.getElementById('menu-sidebar').classList.add('open');
    document.getElementById('overlay').classList.add('show');
    setTimeout(() => {
      const first = document.querySelector('#menu-content button');
      if (first) first.focus();
    }, 350);
  },
  /* ═══════════════════════════════════════════════════
     FUNCIÓN: closeMenu()
     ═══════════════════════════════════════════════════
     Qué hace: Cierra el menú lateral. Solo oculta
     el overlay si el carrito también está cerrado.
     Restaura el foco al elemento anterior.
  ═══════════════════════════════════════════════════ */
  closeMenu() {
    const menu = document.getElementById('menu-sidebar');
    if (menu) menu.classList.remove('open');
    const cart = document.getElementById('cart-panel');
    const overlay = document.getElementById('overlay');
    if ((!cart || !cart.classList.contains('open')) && overlay) {
      overlay.classList.remove('show');
    }
    if (this._lastFocused) {
      try { this._lastFocused.focus(); } catch (e) {}
    }
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: openCart(brand)
     ═══════════════════════════════════════════════════
     Qué hace: Abre el panel del carrito. Si no hay
     marca activa, muestra el selector de marca.
     Sino, marca la marca, cierra el menú y actualiza.
  ═══════════════════════════════════════════════════ */
  openCart(brand) {
    const target = brand || this.cartBrand || this.activeBrand;
    if (!target || target === 'totys') {
      this.openCartSelector();
      return;
    }
    this.cartBrand = target;
    this.closeMenu();
    document.getElementById('cart-panel').classList.add('open');
    document.getElementById('overlay').classList.add('show');
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === 'cart'));
    this.updateCart();
  },
  /* ═══════════════════════════════════════════════════
     FUNCIÓN: closeCart()
     ═══════════════════════════════════════════════════
     Qué hace: Cierra el panel del carrito y oculta
     el overlay de fondo.
  ═══════════════════════════════════════════════════ */
  closeCart() {
    const cartPanel = document.getElementById('cart-panel');
    const overlay = document.getElementById('overlay');
    if (cartPanel) cartPanel.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
  },
  /* ═══════════════════════════════════════════════════
     FUNCIÓN: closeAll()
     ═══════════════════════════════════════════════════
     Qué hace: Cierra el menú y el carrito a la vez.
     Atajo para cerrar todos los paneles principales.
  ═══════════════════════════════════════════════════ */
  closeAll() { this.closeMenu(); this.closeCart(); },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: closeOverlays()
     ═══════════════════════════════════════════════════
     Qué hace: Cierra todos los overlays: menú, carrito,
     modal de promoción y selector de marca.
  ═══════════════════════════════════════════════════ */
  closeOverlays() {
    this.closeMenu();
    this.closeCart();
    const promoOverlay = document.getElementById('promo-modal-overlay');
    if (promoOverlay && promoOverlay.classList.contains('show')) this.closePromoModal();
    this.closeCartSelector();
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: openCartSelector()
     ═══════════════════════════════════════════════════
     Qué hace: Abre el modal para elegir marca
     (Chuy o Ruta 9) cuando no hay una activa.
     Muestra cantidad y total de cada carrito.
  ═══════════════════════════════════════════════════ */
  openCartSelector() {
    this.updateSelectorCounts();
    document.getElementById('cart-selector-overlay').classList.add('show');
    document.getElementById('cart-selector').classList.add('show');
    document.body.style.overflow = 'hidden';
  },
  /* ═══════════════════════════════════════════════════
     FUNCIÓN: closeCartSelector()
     ═══════════════════════════════════════════════════
     Qué hace: Cierra el modal selector de marca.
     Restaura el scroll si no hay otros paneles abiertos.
  ═══════════════════════════════════════════════════ */
  closeCartSelector() {
    const o = document.getElementById('cart-selector-overlay');
    const m = document.getElementById('cart-selector');
    if (o) o.classList.remove('show');
    if (m) m.classList.remove('show');
    if (!document.getElementById('cart-panel').classList.contains('open') &&
        !document.getElementById('manual-send-modal').classList.contains('show')) {
      document.body.style.overflow = '';
    }
  },
  /* ═══════════════════════════════════════════════════
     FUNCIÓN: updateSelectorCounts()
     ═══════════════════════════════════════════════════
     Qué hace: Actualiza los contadores del selector de
     marca: muestra (cantidad · Bs. total) por marca.
  ═══════════════════════════════════════════════════ */
  updateSelectorCounts() {
    const c1 = this.getCart('chuy');
    const c2 = this.getCart('ruta9');
    const t1 = this.cartTotal(c1);
    const t2 = this.cartTotal(c2);
    const el1 = document.getElementById('selector-count-chuy');
    const el2 = document.getElementById('selector-count-ruta9');
    if (el1) el1.textContent = `(${this.cartQuantity(c1)} · Bs. ${t1})`;
    if (el2) el2.textContent = `(${this.cartQuantity(c2)} · Bs. ${t2})`;
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: updateCart()
     ═══════════════════════════════════════════════════
     Qué hace: Actualiza todos los badges de cantidad
     del carrito (móvil, desktop, producto y tabs)
     según lo que hay en cada carrito por marca.
  ═══════════════════════════════════════════════════ */
  updateCart() {

    const chuyCount = this.cartQuantity(this.getCart('chuy'));

    const ruta9Count = this.cartQuantity(this.getCart('ruta9'));

    // Un solo badge visible: el del restaurante activo. Nunca dos números a la vez.

    const activeBrand = this.cartBrand;

    // Oculta todos los badges del header/desktop/producto

    const allBadgeIds = [

      'cart-badge-chuy', 'cart-badge-ruta9',

      'cart-badge-desk-chuy', 'cart-badge-desk-ruta9',

      'cart-badge-pd-chuy', 'cart-badge-pd-ruta9'

    ];

    allBadgeIds.forEach(id => {

      const el = document.getElementById(id);

      if (el) { el.textContent = '0'; el.style.display = 'none'; }

    });

    // Muestra solo el del restaurante activo si tiene items

    if (activeBrand === 'chuy' && chuyCount > 0) {

      ['cart-badge-chuy','cart-badge-desk-chuy','cart-badge-pd-chuy'].forEach(id => {

        const el = document.getElementById(id);

        if (el) { el.textContent = String(chuyCount); el.style.display = ''; }

      });

    } else if (activeBrand === 'ruta9' && ruta9Count > 0) {

      ['cart-badge-ruta9','cart-badge-desk-ruta9','cart-badge-pd-ruta9'].forEach(id => {

        const el = document.getElementById(id);

        if (el) { el.textContent = String(ruta9Count); el.style.display = ''; }

      });

    }

    // Tabs inferior: solo muestra el del restaurante activo

    const tabChuy = document.getElementById('tab-badge-chuy');

    const tabRuta9 = document.getElementById('tab-badge-ruta9');

    if (tabChuy) { tabChuy.textContent = String(chuyCount); tabChuy.classList.toggle('show', chuyCount > 0 && activeBrand === 'chuy'); }

    if (tabRuta9) { tabRuta9.textContent = String(ruta9Count); tabRuta9.classList.toggle('show', ruta9Count > 0 && activeBrand === 'ruta9'); }


    const brand = this.cartBrand;

    const box = document.getElementById('cart-items');

    const totalEl = document.getElementById('cart-total');

    const titleEl = document.getElementById('cart-title');

    const sec = document.getElementById('cart-secondary-action');

    if (!box) return;


    if (!brand || brand === 'totys') {

      box.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px 0;">Elige una marca para ver su pedido</p>';

      if (totalEl) totalEl.textContent = 'Bs. 0';

      if (titleEl) titleEl.textContent = 'Mi pedido';

      if (sec) sec.innerHTML = '';

      return;

    }


    const cart = this.getCart(brand);

    if (titleEl) titleEl.textContent = 'Pedido · ' + (brand === 'chuy' ? 'Chuy' : 'Ruta 9');


    if (!cart.length) {

      box.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px 0;">Tu pedido de ' + (brand === 'chuy' ? 'Chuy' : 'Ruta 9') + ' está vacío</p>';

    } else {

      box.innerHTML = cart.map((item, i) => `

        <div class="cart-item">

          <img src="${item.img}" alt="${item.name}" loading="lazy">

          <div class="cart-item-info">

            <p style="font-weight:600;font-size:0.85rem;">${item.name}</p>

            <p style="font-weight:700;margin-top:4px;color:var(--primary);">Bs. ${item.price} c/u</p>

            <div class="cart-quantity" aria-label="Cantidad de ${item.name}">
              <button type="button" class="cart-quantity-btn" onclick="App.changeCartQuantity('${brand}', ${i}, -1)" aria-label="Disminuir cantidad de ${item.name}"><i class="fas fa-minus"></i></button>
              <span class="cart-quantity-value">${item.quantity}</span>
              <button type="button" class="cart-quantity-btn" onclick="App.changeCartQuantity('${brand}', ${i}, 1)" aria-label="Aumentar cantidad de ${item.name}"><i class="fas fa-plus"></i></button>
            </div>

            <p class="cart-item-subtotal">Subtotal: Bs. ${item.price * item.quantity}</p>

          </div>

          <button type="button" class="icon-btn" style="width:36px;height:36px;" onclick="App.removeCart('${brand}', ${i})" aria-label="Eliminar ${item.name}">

            <i class="fas fa-trash-alt"></i>

          </button>

        </div>

      `).join('');

    }

    const total = this.cartTotal(cart);

    if (totalEl) totalEl.textContent = 'Bs. ' + total;


    if (sec) {

      const other = brand === 'chuy' ? 'ruta9' : 'chuy';

      const otherCart = this.getCart(other);
      const otherCount = this.cartQuantity(otherCart);

      if (otherCount > 0) {

        const otherName = other === 'chuy' ? 'Chuy' : 'Ruta 9';

        const otherTotal = this.cartTotal(otherCart);

        sec.innerHTML = `

          <button type="button" class="btn-wa" style="background:linear-gradient(135deg,#ffb800,#ff6a00);color:#000;"

            onclick="App.sendBothOrders('${brand}','${other}')">

            <i class="fas fa-fire"></i> Enviar también a ${otherName} (${otherCount} · Bs. ${otherTotal})

          </button>

        `;

      } else {

        sec.innerHTML = '';

      }

    }

  },   /* ════════════════════════════════════════════════════

      FUNCIÓN: removeCart(brand, i)

      ════════════════════════════════════════════════════
     ═══════════════════════════════════════════════════
     Qué hace: Elimina un producto del carrito de la
     marca indicada, según su índice (posición).
  ═══════════════════════════════════════════════════ */
  removeCart(brand, i) {
    const cart = this.getCart(brand).slice();
    cart.splice(i, 1);
    this.setCart(brand, cart);
  },
  changeCartQuantity(brand, i, change) {
    const cart = this.getCart(brand).slice();
    const item = cart[i];
    if (!item) return;
    item.quantity = (Number(item.quantity) || 1) + change;
    if (item.quantity <= 0) cart.splice(i, 1);
    this.setCart(brand, cart);
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: buildWhatsappUrl(brand)
     ═══════════════════════════════════════════════════
     Qué hace: Construye el enlace de WhatsApp con el
    pedido completo de la marca: lista de productos,
    cantidades y total. Retorna null
     si el carrito está vacío.
  ═══════════════════════════════════════════════════ */
  buildWhatsappUrl(brand) {
    const cart = this.getCart(brand);
    if (!cart.length) return null;
    const phone = this.whatsappFor(brand);
    const lines = cart.map(item => `• ${item.name} x ${item.quantity} — Bs. ${item.price * item.quantity}`).join('\n');
    const total = this.cartTotal(cart);
    const msg = `*PEDIDO ${brand === 'chuy' ? 'CHUY' : 'RUTA 9'} — TOTY'S*\n${lines}\n*Total: Bs. ${total}*`;
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: whatsapp()
     ═══════════════════════════════════════════════════
     Qué hace: Envía el pedido por WhatsApp de la marca
     activa. Si el carrito está vacío, muestra un toast.
     Si hay productos en ambas marcas, pregunta si desea
     combinarlos o enviar solo una.
  ═══════════════════════════════════════════════════ */
  whatsapp() {
    const brand = this.cartBrand || this.activeBrand;
    if (brand && brand !== 'totys') {
      const cart = this.getCart(brand);
      if (!cart.length) {
        this.toast('Tu pedido de ' + (brand === 'chuy' ? 'Chuy' : 'Ruta 9') + ' está vacío');
        return;
      }
      const other = brand === 'chuy' ? 'ruta9' : 'chuy';
      const otherCart = this.getCart(other);
      if (otherCart.length) {
        this.sendBothOrders(brand, other);
      } else {
        this.whatsappBrand(brand);
      }
      return;
    }
    const chuyCart = this.getCart('chuy');
    const r9Cart = this.getCart('ruta9');
    if (chuyCart.length && r9Cart.length) this.sendBothOrders('chuy', 'ruta9');
    else if (chuyCart.length) this.whatsappBrand('chuy');
    else if (r9Cart.length) this.whatsappBrand('ruta9');
    else this.openCartSelector();
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: whatsappBrand(brand)
     ═══════════════════════════════════════════════════
     Qué hace: Abre WhatsApp de una marca con el pedido
     construido. Si el carrito está vacío, abre un
     mensaje genérico pidiendo información.
  ═══════════════════════════════════════════════════ */
  whatsappBrand(brand) {
    const url = this.buildWhatsappUrl(brand);
    if (url) {
      window.open(url, '_blank');
    } else {
      const phone = this.whatsappFor(brand);
      const msg = `Hola TOTY'S (${brand === 'chuy' ? 'Chuy' : 'Ruta 9'}), me gustaría más información sobre sus productos.`;
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
    }
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: sendBothOrders(brandA, brandB)
     ═══════════════════════════════════════════════════
     Qué hace: Envía los pedidos de ambas marcas por
     separado (cada local tiene su WhatsApp). Abre la
     primera ventana y, tras un delay, la segunda.
  ═══════════════════════════════════════════════════ */
  sendBothOrders(brandA, brandB) {
    const urlA = this.buildWhatsappUrl(brandA);
    const urlB = this.buildWhatsappUrl(brandB);
    if (!urlA || !urlB) return;
    this.closeCart();
    this.closeCartSelector();
    window.open(urlA, '_blank');
    setTimeout(() => {
      const winB = window.open(urlB, '_blank');
      if (!winB) this.showManualSendModal(brandA, brandB, urlA, urlB);
    }, 700);
    this.toast('🔥 Enviando pedidos a Chuy y Ruta 9...');
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: showManualSendModal(brandA, brandB, ...)
     ═══════════════════════════════════════════════════
     Qué hace: Muestra el modal de envío manual cuando
     el navegador bloquea la apertura automática de la
     segunda ventana de WhatsApp.
  ═══════════════════════════════════════════════════ */
  showManualSendModal(brandA, brandB, urlA, urlB) {
    const overlay = document.getElementById('manual-send-overlay');
    const modal = document.getElementById('manual-send-modal');
    document.getElementById('manual-send-cat').textContent = 'TOTY\'S · Patio de comida';
    document.getElementById('manual-send-title').textContent = 'Envía tu segundo pedido';
    document.getElementById('manual-send-desc').textContent = 'Tu navegador bloqueó la apertura automática. Toca el botón del local que falta para completar tu pedido.';
    document.getElementById('manual-send-details').innerHTML = `
      <p style="font-size:.85rem;color:var(--dim);margin-bottom:12px;">
        Cada local tiene su propio WhatsApp, por eso los pedidos se envían por separado.
      </p>
    `;
    const btnA = document.getElementById('manual-send-a');
    const btnB = document.getElementById('manual-send-b');
    btnA.innerHTML = `<i class="fas fa-drumstick-bite"></i> Enviar a ${brandA === 'chuy' ? 'Chuy' : 'Ruta 9'}`;
    btnA.style.background = brandA === 'chuy' ? 'linear-gradient(135deg,#ff1a1a,#cc0000)' : 'linear-gradient(135deg,#ff6a00,#ff2d00)';
    btnA.onclick = () => window.open(urlA, '_blank');
    btnB.innerHTML = `<i class="fas fa-fire"></i> Enviar a ${brandB === 'chuy' ? 'Chuy' : 'Ruta 9'}`;
    btnB.style.background = brandB === 'chuy' ? 'linear-gradient(135deg,#ff1a1a,#cc0000)' : 'linear-gradient(135deg,#ff6a00,#ff2d00)';
    btnB.onclick = () => window.open(urlB, '_blank');
    overlay.classList.add('show');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  closeManualSendModal() {
    const o = document.getElementById('manual-send-overlay');
    const m = document.getElementById('manual-send-modal');
    if (o) o.classList.remove('show');
    if (m) m.classList.remove('show');
    if (!document.getElementById('cart-panel').classList.contains('open')) {
      document.body.style.overflow = '';
    }
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: toast(msg)
     ═══════════════════════════════════════════════════
     Qué hace: Muestra un mensaje flotante (toast)
     durante 2.5 segundos. Se usa para confirmaciones
     como "Añadido al pedido".
  ═══════════════════════════════════════════════════ */
  toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: onSearch(q)
     ═══════════════════════════════════════════════════
    Qué hace: Ejecuta la búsqueda de productos por
    nombre o categoría. Navega a la vista de
     la marca y aplica el filtro correspondiente.
  ═══════════════════════════════════════════════════ */
  onSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) {
      if (this.activeBrand === 'chuy') { this.chuyFilter = 'all'; this.renderBrandGrid('chuy', 'all'); }
      else if (this.activeBrand === 'ruta9') { this.ruta9Filter = 'all'; this.renderBrandGrid('ruta9', 'all'); }
      return;
    }
    const found = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.cat.includes(q) ||
      (p.brand || '').toLowerCase().includes(q)
    );
    if (!found.length) return;
    const chuyCount = found.filter(p => this.getBrandFromCat(p.cat) === 'chuy').length;
    const r9Count = found.filter(p => this.getBrandFromCat(p.cat) === 'ruta9').length;
    const brand = chuyCount >= r9Count ? 'chuy' : 'ruta9';
    this.go(brand);
    setTimeout(() => {
      const prefix = brand;
      const catsEl = document.getElementById(prefix + '-categories');
      if (catsEl) { catsEl.style.display = 'none'; catsEl.innerHTML = ''; }
      const gridEl = document.getElementById(prefix + '-grid');
      if (gridEl) {
        gridEl.style.display = '';
        this.renderGrid(prefix + '-grid', found.filter(p => this.getBrandFromCat(p.cat) === brand));
      }
      const countEl = document.getElementById(prefix + '-count');
      if (countEl) countEl.textContent = '(' + found.filter(p => this.getBrandFromCat(p.cat) === brand).length + ' resultados)';
    }, 100);
  },

  productUrl(id) {
    const url = new URL(window.location.href);
    url.hash = '';
    url.searchParams.set('producto', id);
    return url.toString();
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: shareProduct(id)
     ═══════════════════════════════════════════════════
     Qué hace: Comparte un producto. Usa la API nativa
     de compartir si existe; si no, copia el enlace al
     portapapeles o abre WhatsApp.
  ═══════════════════════════════════════════════════ */
  async shareProduct(id) {
    const p = products.find(x => x.id === Number(id));
    if (!p) return;
    const url = this.productUrl(id);
    const shareData = { title: p.name + ' · TOTY\'S', text: `Mira este producto: ${p.name} — Bs. ${p.price}`, url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      this.toast('Enlace copiado');
    } catch (e) {
      window.open('https://wa.me/?text=' + encodeURIComponent(shareData.text + ' ' + url), '_blank');
    }
  },

  pageUrl() {
    const url = new URL(window.location.href);
    url.hash = '';
    url.searchParams.delete('producto');
    return url.toString();
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: sharePage()
     ═══════════════════════════════════════════════════
     Qué hace: Comparte la página actual. Usa la API
     nativa de compartir o copia el enlace al
     portapapeles.
  ═══════════════════════════════════════════════════ */
  async sharePage() {
    const url = this.pageUrl();
    const shareData = { title: 'TOTY\'S · Chuy & Ruta 9', text: 'Mira el menú de TOTY\'S: Chuy (pollos y bebidas) y Ruta 9 (hamburguesas).', url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      this.toast('Enlace copiado');
    } catch (e) {
      window.open('https://wa.me/?text=' + encodeURIComponent(shareData.text + ' ' + url), '_blank');
    }
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: sharePromo(idx)
     ═══════════════════════════════════════════════════
     Qué hace: Comparte una promoción. Usa la API
     nativa de compartir o copia el enlace al
     portapapeles; si falla, abre WhatsApp.
  ═══════════════════════════════════════════════════ */
  async sharePromo(idx) {
    const pr = promotions[Number(idx)];
    if (!pr) return;
    const shareData = { title: pr.title + ' · TOTY\'S', text: `Promoción: ${pr.title} — ${pr.sub}`, url: this.pageUrl() };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) {}
      return;
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
      this.toast('Enlace copiado');
    } catch (e) {
      window.open('https://wa.me/?text=' + encodeURIComponent(shareData.text + ' ' + shareData.url), '_blank');
    }
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: openPromoModal(idx)
     ═══════════════════════════════════════════════════
     Qué hace: Abre el modal de una promoción con su
     imagen, categoría, título, descripción, vigencia
     y condiciones. El CTA navega a la marca.
  ═══════════════════════════════════════════════════ */
  openPromoModal(idx) {
    const pr = promotions[Number(idx)];
    if (!pr) return;
    document.getElementById('promo-modal-img').src = pr.image;
    document.getElementById('promo-modal-img').alt = pr.title;
    document.getElementById('promo-modal-cat').textContent = pr.badge + ' · ' + catLabels[pr.cat];
    document.getElementById('promo-modal-title').textContent = pr.title;
    document.getElementById('promo-modal-desc').textContent = pr.fullDescription || pr.sub;
    document.getElementById('promo-modal-details').innerHTML = '<table class="detail-table">' +
      `<tr><td>Marca</td><td>${pr.brand === 'chuy' ? 'Chuy' : 'Ruta 9'}</td></tr>` +
      `<tr><td>Categoría</td><td>${catLabels[pr.cat]}</td></tr>` +
      `<tr><td>Vigencia</td><td>${pr.validUntil || 'Consultar disponibilidad'}</td></tr>` +
      (pr.conditions && pr.conditions.length ? `<tr><td>Condiciones</td><td>${pr.conditions.join(' · ')}</td></tr>` : '') +
      '</table>';
    document.getElementById('promo-modal-cta').onclick = () => {
      this.closePromoModal();
      this.go(pr.brand === 'chuy' ? 'chuy' : 'ruta9');
    };
    document.getElementById('promo-modal-wa').onclick = () => {
      const phone = this.whatsappFor(pr.brand);
      const msg = `Hola TOTY'S (${pr.brand === 'chuy' ? 'Chuy' : 'Ruta 9'}), vi la promoción "${pr.title}" y me gustaría más información.`;
      window.open('https://wa.me/' + phone + '?text=' + encodeURIComponent(msg), '_blank');
    };
    document.getElementById('promo-modal-share').onclick = () => this.sharePromo(idx);
    document.getElementById('promo-modal-overlay').classList.add('show');
    document.getElementById('promo-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: closePromoModal()
     ═══════════════════════════════════════════════════
     Qué hace: Cierra el modal de promoción y
     restaura el scroll de la página.
  ═══════════════════════════════════════════════════ */
  closePromoModal() {
    document.getElementById('promo-modal-overlay').classList.remove('show');
    document.getElementById('promo-modal').classList.remove('show');
    document.body.style.overflow = '';
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: renderAbout()
     ═══════════════════════════════════════════════════
     Qué hace: Renderiza la página "Nosotros" con
     la historia, misión, visión, valores, servicios,
     horarios, marcas y beneficios (desde CONFIG).
  ═══════════════════════════════════════════════════ */
  renderAbout() {
    const s = (window.STORE || CONFIG.store);
    const aboutEl = document.getElementById('about-content');
    if (!aboutEl) return;
    aboutEl.innerHTML = `
      <div class="about-block"><h3>Nuestra historia</h3><p>${s.story}</p></div>
      <div class="about-block"><h3>Misión</h3><p>${s.mission}</p></div>
      <div class="about-block"><h3>Visión</h3><p>${s.vision}</p></div>
      <div class="about-block"><h3>Valores</h3><p>${s.values}</p></div>
      <div class="about-block"><h3>Servicios</h3><p>${s.services}</p></div>
      <div class="about-block"><h3>Horarios</h3>
        <div class="hours-grid" style="margin-top:12px;">
          <div class="hours-card morning"><i class="fas fa-sun"></i><div><strong>Turno mañana</strong><span>${s.hoursMorning}</span></div></div>
          <div class="hours-card night"><i class="fas fa-moon"></i><div><strong>Turno noche</strong><span>${s.hoursNight}</span></div></div>
        </div>
      </div>
      <div class="about-block branches-section">
        <h3>Nuestras marcas</h3>
        <p class="branches-intro">En TOTY'S conviven dos marcas con su propio WhatsApp de atención y su propio carrito de pedidos.</p>
        <div class="branches-grid" id="branches-grid"></div>
      </div>
      <div class="about-block"><h3>¿Por qué elegir TOTY'S?</h3>
        <div style="display:grid;gap:10px;margin-top:12px;">
          <div class="info-card"><i class="fas fa-check-circle"></i><div><strong>Calidad garantizada</strong><span>Ingredientes frescos y preparación al momento.</span></div></div>
          <div class="info-card"><i class="fas fa-tags"></i><div><strong>Los mejores precios</strong><span>Variedad de platos y combos para todos.</span></div></div>
          <div class="info-card"><i class="fas fa-motorcycle"></i><div><strong>Delivery coordinado</strong><span>Pedidos por WhatsApp con entrega a domicilio.</span></div></div>
          <div class="info-card"><i class="fas fa-users"></i><div><strong>Atención personalizada</strong><span>Te ayudamos a elegir lo mejor para tu antojo.</span></div></div>
        </div>
      </div>
      <div class="about-info">
        <div class="info-card"><i class="fas fa-sun"></i><div><strong>Turno mañana</strong><span>${s.hoursMorning}</span></div></div>
        <div class="info-card"><i class="fas fa-moon"></i><div><strong>Turno noche</strong><span>${s.hoursNight}</span></div></div>
        <div class="info-card"><i class="fas fa-map-marker-alt"></i><div><strong>Ubicación</strong><span>${s.address}</span></div></div>
        <div class="info-card"><i class="fab fa-instagram"></i><div><strong>Instagram</strong><span>${s.instagram}</span></div></div>
      </div>
    `;
    this.renderBranches();
  },

  /* ═══════════════════════════════════════════════════
     FUNCIÓN: renderBranches()
     ═══════════════════════════════════════════════════
     Qué hace: Renderiza las tarjetas de sucursales
     (TOTY'S, Chuy y Ruta 9) con dirección, teléfono,
     horarios y enlaces a redes sociales.
  ═══════════════════════════════════════════════════ */
  renderBranches() {
    document.getElementById('branches-grid').innerHTML = branches.map(b => `
      <div class="branch-card">
        <div class="branch-head">
          <div class="branch-logo">${b.initials}</div>
          <div>
            <div class="branch-name">${b.name}</div>
            <div class="branch-loc"><i class="fas fa-map-marker-alt"></i>${b.location}</div>
          </div>
        </div>
        <div class="branch-rows">
          <div class="branch-row"><i class="fas fa-map-marker-alt"></i><span>${b.address}</span></div>
          <div class="branch-row"><i class="fab fa-whatsapp"></i><span>WhatsApp: ${b.phone}</span></div>
          <div class="branch-row"><i class="fas fa-sun"></i><span>${b.hoursMorning}</span></div>
          <div class="branch-row"><i class="fas fa-moon"></i><span>${b.hoursNight}</span></div>
        </div>
        <div class="branch-social">
          <a class="wa" href="https://wa.me/${b.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp ${b.name}"><i class="fab fa-whatsapp"></i></a>
          <a href="${b.facebook}" target="_blank" rel="noopener" aria-label="Facebook ${b.name}"><i class="fas fa-facebook-f"></i></a>
          <a href="${b.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${b.name}"><i class="fas fa-instagram"></i></a>
        </div>
      </div>
    `).join('');
  }
};

/* ═══════════════════════════════════════════════════
   INICIALIZACIÓN
   Cuando el DOM está listo, ejecuta App.init()
   que renderiza todas las vistas y vincula eventos.
   ═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => App.init());
