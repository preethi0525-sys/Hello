const products = [
  { id: 'sample-product', name: 'Everyday Backpack', price: 48, image: 'backpack' },
  { id: 'coffee-mug', name: 'Ceramic Coffee Mug', price: 18, image: 'mug' },
  { id: 'canvas-tote', name: 'Canvas Market Tote', price: 26, image: 'tote' },
];
const productPath = (product) => `/products/${product.id}`;
const money = (amount) => `$${amount.toFixed(2)}`;
const store = {
  getCart() { try { return JSON.parse(localStorage.getItem('northstar-cart') || '[]'); } catch { return []; } },
  setCart(cart) { localStorage.setItem('northstar-cart', JSON.stringify(cart)); updateCartCount(); },
};
function updateCartCount() {
  const count = store.getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('[data-testid="cart-count"]').forEach((el) => { el.textContent = String(count); });
}
function productCard(product) {
  return `<article class="product-card" data-testid="product-card" data-product-id="${product.id}">
    <a href="${productPath(product)}" aria-label="View ${product.name}">
      <img class="card-image" src="/product.svg?item=${product.image}" alt="${product.name}" />
      <h2>${product.name}</h2><p class="price">${money(product.price)}</p>
    </a></article>`;
}
function renderHome() {
  document.querySelector('main').innerHTML = `<section class="hero"><p class="eyebrow">A small shop for a big adventure</p><h1>Find your everyday favorites</h1><p>Explore useful goods, then use the sample shop to practice testing.</p><a class="button-link" href="/collections/all">Browse all products</a></section>
    <section aria-labelledby="featured-heading"><h2 id="featured-heading">Featured products</h2><div class="product-grid">${products.map(productCard).join('')}</div></section>`;
}
function renderCatalog() {
  document.querySelector('main').innerHTML = `<h1>All products</h1><label for="sort-select">Sort products</label><select id="sort-select" data-testid="sort-select"><option value="featured">Featured</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select><div class="product-grid" data-testid="product-grid">${products.map(productCard).join('')}</div>`;
  document.querySelector('[data-testid="sort-select"]').addEventListener('change', (event) => {
    const sorted = [...products];
    if (event.target.value === 'price-low') sorted.sort((a, b) => a.price - b.price);
    if (event.target.value === 'price-high') sorted.sort((a, b) => b.price - a.price);
    document.querySelector('[data-testid="product-grid"]').innerHTML = sorted.map(productCard).join('');
  });
}
function renderSearch() {
  const query = new URLSearchParams(location.search).get('q') || '';
  document.querySelector('#site-search').value = query;
  const matches = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.id.includes(query.toLowerCase()));
  document.querySelector('main').innerHTML = `<h1>Search results</h1><p>Results for <span data-testid="search-query"></span></p><section data-testid="search-results" aria-label="Search results">${matches.length ? `<div class="product-grid">${matches.map(productCard).join('')}</div>` : '<p data-testid="search-empty-state">No products found. Try another search.</p>'}</section>`;
  document.querySelector('[data-testid="search-query"]').textContent = query;
}
function renderProduct() {
  const id = location.pathname.split('/').pop();
  const product = products.find((item) => item.id === id) || products[0];
  const outOfStock = new URLSearchParams(location.search).get('test-stock') === 'out';
  document.querySelector('main').innerHTML = `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/collections/all">Shop</a> / ${product.name}</nav>
    <section class="product-detail" data-testid="product-page"><img data-testid="product-image" src="/product.svg?item=${product.image}" alt="${product.name}" />
      <div><h1 data-testid="product-name"></h1><p class="price" data-testid="product-price">${money(product.price)}</p><p data-testid="stock-status">${outOfStock ? 'Out of stock' : 'In stock'}</p>
        <p>Everyday quality, ready for your next adventure.</p><fieldset><legend>Choose a color</legend><button type="button" class="variant" data-testid="product-variant" aria-pressed="true">Navy</button><button type="button" class="variant" data-testid="product-variant" aria-pressed="false">Sand</button></fieldset>
        <label for="quantity-input">Quantity</label><input id="quantity-input" data-testid="quantity-input" type="number" min="1" value="1" />
        <p class="error" data-testid="cart-error" role="alert" hidden></p><p class="success" data-testid="cart-confirmation" role="status" hidden>Added to your cart.</p>
        <button data-testid="add-to-cart-button" type="button" ${outOfStock ? 'disabled' : ''}>Add to cart</button></div></section>`;
  document.querySelector('[data-testid="product-name"]').textContent = product.name;
  document.querySelectorAll('[data-testid="product-variant"]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-testid="product-variant"]').forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
  }));
  document.querySelector('[data-testid="add-to-cart-button"]').addEventListener('click', () => {
    const quantity = Number(document.querySelector('[data-testid="quantity-input"]').value);
    const error = document.querySelector('[data-testid="cart-error"]');
    if (!Number.isInteger(quantity) || quantity < 1) { error.textContent = 'Enter a quantity of at least 1.'; error.hidden = false; return; }
    const cart = store.getCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.quantity += quantity; else cart.push({ id: product.id, quantity });
    store.setCart(cart);
    error.hidden = true;
    document.querySelector('[data-testid="cart-confirmation"]').hidden = false;
  });
}
function renderCart() {
  const cart = store.getCart();
  if (!cart.length) {
    document.querySelector('main').innerHTML = `<h1>Your cart</h1><p data-testid="cart-empty-state">Your cart is empty.</p><a data-testid="continue-shopping" class="button-link" href="/collections/all">Continue shopping</a>`;
    return;
  }
  document.querySelector('main').innerHTML = `<h1>Your cart</h1><div class="cart-lines">${cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return `<article class="cart-line" data-testid="cart-line" data-product-id="${item.id}"><h2>${product.name}</h2><p>Each: ${money(product.price)}</p><p data-testid="line-item-price">Line total: ${money(product.price * item.quantity)}</p><label for="qty-${item.id}">Quantity</label><input id="qty-${item.id}" data-testid="cart-item-quantity" type="number" min="1" value="${item.quantity}" /><button type="button" data-testid="remove-item">Remove</button></article>`;
  }).join('')}</div><p>Subtotal: <strong data-testid="cart-subtotal">${money(cart.reduce((sum, item) => sum + products.find((p) => p.id === item.id).price * item.quantity, 0))}</strong></p><form id="discount-form"><label for="discount-code">Discount code</label><input id="discount-code" data-testid="discount-code" /><button data-testid="apply-discount">Apply discount</button><p class="error" data-testid="discount-error" role="alert" hidden>That discount code is not valid.</p></form><a class="button-link" href="/checkout">Continue to checkout</a>`;
  document.querySelectorAll('[data-testid="cart-item-quantity"]').forEach((input) => input.addEventListener('change', () => {
    const value = Number(input.value);
    const line = input.closest('[data-testid="cart-line"]');
    if (!Number.isInteger(value) || value < 1) { input.value = '1'; return; }
    const currentCart = store.getCart();
    const item = currentCart.find((entry) => entry.id === line.dataset.productId);
    item.quantity = value;
    store.setCart(currentCart);
    renderCart();
  }));
  document.querySelectorAll('[data-testid="remove-item"]').forEach((button) => button.addEventListener('click', () => {
    const id = button.closest('[data-testid="cart-line"]').dataset.productId;
    store.setCart(store.getCart().filter((item) => item.id !== id));
    renderCart();
  }));
  document.querySelector('#discount-form').addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('[data-testid="discount-error"]').hidden = false; });
}
function renderCheckout() {
  const cart = store.getCart();
  const total = cart.reduce((sum, item) => sum + products.find((p) => p.id === item.id).price * item.quantity, 0);
  document.querySelector('main').innerHTML = `<h1>Checkout</h1><div class="checkout-layout"><form data-testid="checkout-form" id="checkout-form" novalidate><h2>Contact and delivery</h2>
    <label for="checkout-email">Email</label><input id="checkout-email" type="email" autocomplete="email" />
    <label for="checkout-name">Full name</label><input id="checkout-name" autocomplete="name" />
    <label for="checkout-address">Street address</label><input id="checkout-address" autocomplete="street-address" />
    <label for="checkout-city">City</label><input id="checkout-city" autocomplete="address-level2" />
    <div class="error" data-testid="checkout-errors" role="alert" hidden>Please complete the required checkout fields before continuing.</div>
    <button data-testid="place-order-button" type="submit">Review order (demo only)</button></form>
    <aside data-testid="order-summary"><h2>Order summary</h2><p>${cart.length ? `${cart.reduce((n, item) => n + item.quantity, 0)} item(s)` : 'No items in cart'}</p><p>Total: <strong data-testid="order-total">${money(total)}</strong></p><p>This sample does not process payments.</p></aside></div>`;
  document.querySelector('#checkout-form').addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('[data-testid="checkout-errors"]').hidden = false; });
}
function renderAccount(register = false) {
  document.querySelector('main').innerHTML = register
    ? `<h1>Create account</h1><form data-testid="register-form" id="account-form" novalidate><label for="account-name">Full name</label><input id="account-name" autocomplete="name" /><label for="account-email">Email</label><input id="account-email" type="email" autocomplete="email" /><label for="account-password">Password</label><input id="account-password" type="password" autocomplete="new-password" /><label class="check-label"><input type="checkbox" /> I agree to the store terms</label><a data-testid="privacy-policy-link" href="/privacy">Privacy policy</a><p class="error" data-testid="register-errors" role="alert" hidden>Enter your name, a valid email address, and a password.</p><button data-testid="register-submit">Create account</button></form>`
    : `<h1>Sign in</h1><form data-testid="login-form" id="account-form" novalidate><label for="account-email">Email</label><input id="account-email" data-testid="login-email" type="email" autocomplete="email" /><label for="account-password">Password</label><input id="account-password" data-testid="login-password" type="password" autocomplete="current-password" /><p class="error" data-testid="login-errors" role="alert" hidden>Enter a valid email and password.</p><button data-testid="login-submit">Sign in</button></form>`;
  document.querySelector('#account-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const values = [...event.currentTarget.querySelectorAll('input:not([type="checkbox"])')].map((input) => input.value.trim());
    const valid = register ? values[0] && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[1]) && values[2].length >= 6 : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[0]) && values[1].length > 0;
    if (!valid) { document.querySelector(register ? '[data-testid="register-errors"]' : '[data-testid="login-errors"]').hidden = false; return; }
    if (!register) document.querySelector('main').innerHTML = `<h1>Welcome to your account</h1><section data-testid="account-dashboard"><h2>Account dashboard</h2><p>This is a demo account session.</p><p data-testid="account-orders">No sample orders yet.</p></section>`;
  });
}
function renderNotFound() {
  document.querySelector('main').innerHTML = `<section data-testid="not-found-page"><h1>Page not found</h1><p>That page does not exist in this demo store.</p><a data-testid="continue-shopping" class="button-link" href="/collections/all">Continue shopping</a></section>`;
}
const route = location.pathname;
if (route === '/') renderHome();
else if (route === '/collections/all') renderCatalog();
else if (route.startsWith('/products/')) renderProduct();
else if (route === '/search') renderSearch();
else if (route === '/cart') renderCart();
else if (route === '/checkout') renderCheckout();
else if (route === '/account/login') renderAccount();
else if (route === '/account/register') renderAccount(true);
else renderNotFound();
updateCartCount();
