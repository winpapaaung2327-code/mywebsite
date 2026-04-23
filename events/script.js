/* ========================================
   BEAN BOUTIQUE - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ========================================
     UTILITY: Shopping Cart (localStorage)
     ======================================== */
  function getCart() {
    try {
      var data = localStorage.getItem('beanBoutiqueCart');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('beanBoutiqueCart', JSON.stringify(cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    var badges = document.querySelectorAll('.nav__cart-badge');
    var cart = getCart();
    var totalItems = 0;
    for (var i = 0; i < cart.length; i++) {
      totalItems += cart[i].quantity;
    }
    for (var j = 0; j < badges.length; j++) {
      if (totalItems > 0) {
        badges[j].textContent = totalItems;
        badges[j].classList.remove('nav__cart-badge--hidden');
      } else {
        badges[j].classList.add('nav__cart-badge--hidden');
      }
    }
  }

  function addToCart(id, name, price, image) {
    var cart = getCart();
    var found = false;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        cart[i].quantity += 1;
        found = true;
        break;
      }
    }
    if (!found) {
      cart.push({
        id: id,
        name: name,
        price: parseFloat(price),
        quantity: 1,
        image: image || ''
      });
    }
    saveCart(cart);
    showToast(name + ' added to cart');
  }

  /* ========================================
     TOAST NOTIFICATION
     ======================================== */
  var toastEl = document.getElementById('toast');
  var toastTimeout = null;

  function showToast(message) {
    if (!toastEl) return;
    clearTimeout(toastTimeout);
    toastEl.querySelector('.toast__text').textContent = message;
    toastEl.classList.add('toast--visible');
    toastTimeout = setTimeout(function () {
      toastEl.classList.remove('toast--visible');
    }, 2500);
  }

  /* ========================================
     ADD TO CART BUTTONS (Event Delegation)
     ======================================== */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cart-add]');
    if (!btn) return;
    var id = btn.getAttribute('data-cart-id');
    var name = btn.getAttribute('data-cart-name');
    var price = btn.getAttribute('data-cart-price');
    var image = btn.getAttribute('data-cart-image') || '';
    addToCart(id, name, price, image);
  });

  /* ========================================
     HERO SLIDESHOW
     ======================================== */
  var slides = document.querySelectorAll('.hero__slide');
  var dots = document.querySelectorAll('.hero__dot');
  var currentSlide = 0;
  var slideInterval = null;

  function showSlide(index) {
    if (slides.length === 0) return;
    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.remove('hero__slide--active');
      if (dots[i]) dots[i].classList.remove('hero__dot--active');
    }
    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    slides[currentSlide].classList.add('hero__slide--active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('hero__dot--active');
  }

  function startSlideshow() {
    if (slides.length <= 1) return;
    slideInterval = setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5000);
  }

  function resetSlideshow() {
    clearInterval(slideInterval);
    startSlideshow();
  }

  if (dots.length > 0) {
    for (var d = 0; d < dots.length; d++) {
      dots[d].addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-slide'), 10);
        showSlide(idx);
        resetSlideshow();
      });
    }
  }

  if (slides.length > 0) {
    showSlide(0);
    startSlideshow();
  }

  /* ========================================
     MODAL POPUP (First-time visitors)
     ======================================== */
  var modalOverlay = document.getElementById('modalOverlay');
  var modalClose = document.getElementById('modalClose');
  var modalForm = document.getElementById('modalForm');
  var modalMessage = document.getElementById('modalMessage');

  function showModal() {
    if (!modalOverlay) return;
    var visited = localStorage.getItem('beanBoutiqueVisited');
    if (!visited) {
      setTimeout(function () {
        modalOverlay.classList.add('modal-overlay--visible');
      }, 1500);
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('modal-overlay--visible');
    localStorage.setItem('beanBoutiqueVisited', 'true');
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = this.querySelector('.modal__input');
      var email = emailInput.value.trim();
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        modalMessage.textContent = 'Please enter your email address.';
        modalMessage.className = 'modal__message modal__message--error';
        return;
      }

      if (!emailRegex.test(email)) {
        modalMessage.textContent = 'Please enter a valid email address.';
        modalMessage.className = 'modal__message modal__message--error';
        return;
      }

      modalMessage.textContent = 'Welcome aboard! Check your inbox for a surprise.';
      modalMessage.className = 'modal__message modal__message--success';
      emailInput.value = '';
      setTimeout(closeModal, 2500);
    });
  }

  showModal();

  /* ========================================
     MOBILE NAVIGATION
     ======================================== */
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      this.classList.toggle('nav__toggle--open');
      navMobile.classList.toggle('nav__mobile--open');
      document.body.style.overflow = navMobile.classList.contains('nav__mobile--open') ? 'hidden' : '';
    });

    var mobileLinks = navMobile.querySelectorAll('.nav__mobile-link');
    for (var ml = 0; ml < mobileLinks.length; ml++) {
      mobileLinks[ml].addEventListener('click', function () {
        navToggle.classList.remove('nav__toggle--open');
        navMobile.classList.remove('nav__mobile--open');
        document.body.style.overflow = '';
      });
    }
  }

  /* ========================================
     COFFEE SEARCH & FILTER
     ======================================== */
  var searchInput = document.getElementById('coffeeSearch');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var coffeeCards = document.querySelectorAll('.coffee__grid .card');
  var noResults = document.getElementById('noResults');
  var activeFilter = 'all';

  function filterCoffee() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var visibleCount = 0;

    for (var i = 0; i < coffeeCards.length; i++) {
      var card = coffeeCards[i];
      var name = (card.getAttribute('data-name') || '').toLowerCase();
      var category = card.getAttribute('data-category') || '';
      var roast = card.getAttribute('data-roast') || '';

      var matchesSearch = !query || name.indexOf(query) !== -1;
      var matchesFilter = activeFilter === 'all' ||
                          category === activeFilter ||
                          roast === activeFilter;

      if (matchesSearch && matchesFilter) {
        card.classList.add('card--visible');
        card.style.animationDelay = (visibleCount * 0.06) + 's';
        visibleCount++;
      } else {
        card.classList.remove('card--visible');
      }
    }

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.add('no-results--visible');
      } else {
        noResults.classList.remove('no-results--visible');
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCoffee);
  }

  for (var fb = 0; fb < filterBtns.length; fb++) {
    filterBtns[fb].addEventListener('click', function () {
      for (var k = 0; k < filterBtns.length; k++) {
        filterBtns[k].classList.remove('filter-btn--active');
      }
      this.classList.add('filter-btn--active');
      activeFilter = this.getAttribute('data-filter');
      filterCoffee();
    });
  }

  if (coffeeCards.length > 0) {
    filterCoffee();
  }

  /* ========================================
     EVENTS FORM VALIDATION
     ======================================== */
  var eventForm = document.getElementById('eventForm');
  var formSuccess = document.getElementById('formSuccess');

  if (eventForm) {
    eventForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      var nameInput = document.getElementById('regName');
      var emailInput = document.getElementById('regEmail');
      var phoneInput = document.getElementById('regPhone');
      var eventSelect = document.getElementById('regEvent');

      clearError(nameInput);
      clearError(emailInput);
      clearError(phoneInput);
      clearError(eventSelect);

      if (!nameInput.value.trim()) {
        showError(nameInput, 'Full name is required.');
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'Name must be at least 2 characters.');
        isValid = false;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email address is required.');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }

      if (phoneInput.value.trim()) {
        var phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
          showError(phoneInput, 'Please enter a valid phone number.');
          isValid = false;
        }
      }

      if (!eventSelect.value) {
        showError(eventSelect, 'Please select an event.');
        isValid = false;
      }

      if (isValid) {
        eventForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.style.animation = 'fadeIn 0.5s ease';
        }
      }
    });
  }

  function showError(input, message) {
    input.classList.add('form-input--error');
    var errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearError(input) {
    input.classList.remove('form-input--error');
    var errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  /* Real-time validation clear */
  var formInputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
  for (var fi = 0; fi < formInputs.length; fi++) {
    formInputs[fi].addEventListener('input', function () {
      this.classList.remove('form-input--error');
      var errorEl = this.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.textContent = '';
    });
    formInputs[fi].addEventListener('change', function () {
      this.classList.remove('form-input--error');
      var errorEl = this.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.textContent = '';
    });
  }

  /* ========================================
     CART PAGE RENDERING
     ======================================== */
  var cartItemsContainer = document.getElementById('cartItems');
  var cartEmptyEl = document.getElementById('cartEmpty');
  var cartSummaryEl = document.getElementById('cartSummary');
  var cartSubtotalEl = document.getElementById('cartSubtotal');
  var cartShippingEl = document.getElementById('cartShipping');
  var cartTotalEl = document.getElementById('cartTotal');

  function renderCart() {
    if (!cartItemsContainer) return;

    var cart = getCart();

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '';
      if (cartEmptyEl) cartEmptyEl.style.display = 'block';
      if (cartSummaryEl) cartSummaryEl.style.display = 'none';
      return;
    }

    if (cartEmptyEl) cartEmptyEl.style.display = 'none';
    if (cartSummaryEl) cartSummaryEl.style.display = 'block';

    var html = '';
    var subtotal = 0;

    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var lineTotal = item.price * item.quantity;
      subtotal += lineTotal;

      var imgSrc = item.image || 'https://picsum.photos/seed/coffeedefault/80/80';

      html += '<article class="cart-item">' +
        '<img src="' + imgSrc + '" alt="' + escapeHtml(item.name) + '" class="cart-item__image">' +
        '<div class="cart-item__details">' +
          '<div class="cart-item__name">' + escapeHtml(item.name) + '</div>' +
          '<div class="cart-item__price">$' + item.price.toFixed(2) + '</div>' +
        '</div>' +
        '<div class="cart-item__controls">' +
          '<button class="cart-item__qty-btn" data-qty-change="-1" data-qty-id="' + item.id + '" aria-label="Decrease quantity">&minus;</button>' +
          '<span class="cart-item__qty">' + item.quantity + '</span>' +
          '<button class="cart-item__qty-btn" data-qty-change="1" data-qty-id="' + item.id + '" aria-label="Increase quantity">&plus;</button>' +
        '</div>' +
        '<button class="cart-item__remove" data-remove-id="' + item.id + '" aria-label="Remove item">Remove</button>' +
      '</article>';
    }

    cartItemsContainer.innerHTML = html;

    var shipping = subtotal >= 50 ? 0 : 5.99;
    var total = subtotal + shipping;

    if (cartSubtotalEl) cartSubtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (cartShippingEl) {
      cartShippingEl.textContent = shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2);
      if (shipping === 0) {
        cartShippingEl.classList.add('cart-summary__row--free');
      } else {
        cartShippingEl.classList.remove('cart-summary__row--free');
      }
    }
    if (cartTotalEl) cartTotalEl.textContent = '$' + total.toFixed(2);
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* Cart: Quantity Change */
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', function (e) {
      var qtyBtn = e.target.closest('[data-qty-change]');
      var removeBtn = e.target.closest('[data-remove-id]');

      if (qtyBtn) {
        var id = qtyBtn.getAttribute('data-qty-id');
        var change = parseInt(qtyBtn.getAttribute('data-qty-change'), 10);
        var cart = getCart();
        for (var i = 0; i < cart.length; i++) {
          if (cart[i].id === id) {
            cart[i].quantity += change;
            if (cart[i].quantity <= 0) {
              cart.splice(i, 1);
            }
            break;
          }
        }
        saveCart(cart);
        renderCart();
      }

      if (removeBtn) {
        var removeId = removeBtn.getAttribute('data-remove-id');
        var cart2 = getCart();
        for (var j = 0; j < cart2.length; j++) {
          if (cart2[j].id === removeId) {
            cart2.splice(j, 1);
            break;
          }
        }
        saveCart(cart2);
        renderCart();
      }
    });
  }

  /* Cart: Checkout Button */
  var checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      var cart = getCart();
      if (cart.length === 0) return;
      showToast('Thank you! This is a demo checkout.');
    });
  }

  renderCart();
  updateCartBadge();

});