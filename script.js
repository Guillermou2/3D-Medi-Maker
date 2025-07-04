// Espera a que todo el contenido de la página se cargue antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

    // --- State ---
    // Un arreglo para mantener los productos en el carrito.
    let cart = [];

    // --- Selectores de Elementos ---
    // Se declaran todas las constantes una sola vez para un código más limpio.
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeModalBtn = document.getElementById('closeModal');
    
    const cartModal = document.getElementById('cartModal');
    const cartIcon = document.getElementById('cartIcon');
    const closeCartModalBtn = document.getElementById('closeCartModal');
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.getElementById('cartCount');
    const cartContent = document.getElementById('cartContent');
    const cartEmptyMessage = document.getElementById('cartEmptyMessage');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');

    const paymentSection = document.getElementById('paymentSection');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const paymentContents = document.querySelectorAll('.payment-content');

    // --- Lógica del Modal de Inicio de Sesión ---
    if (loginBtn) {
        loginBtn.addEventListener('click', () => loginModal.classList.add('active'));
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => loginModal.classList.remove('active'));
    }
    if (loginModal) {
        loginModal.addEventListener('click', (event) => {
            if (event.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }

    // --- Lógica del Modal del Carrito ---
    if (cartIcon) {
        cartIcon.addEventListener('click', () => cartModal.classList.add('active'));
    }
    if (closeCartModalBtn) {
        closeCartModalBtn.addEventListener('click', () => cartModal.classList.remove('active'));
    }
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => cartModal.classList.remove('active'));
    }
    if (cartModal) {
        cartModal.addEventListener('click', (event) => {
            if (event.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }

    // --- Lógica del Checkout (Proceder al Pago) ---
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Solo procede si hay algo en el carrito.
            if (cart.length > 0) {
                cartModal.classList.remove('active'); // Cierra el modal del carrito
                paymentSection.style.display = 'block'; // Muestra la sección de pago
                paymentSection.scrollIntoView({ behavior: 'smooth' }); // Desplaza la vista a la sección de pago
            }
        });
    }

    // --- Lógica de las Pestañas de Pago ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            paymentContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // --- Funcionalidad del Carrito de Compras ---
    // Añadir producto al carrito
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const product = {
                id: event.target.dataset.id,
                name: event.target.dataset.name,
                price: parseFloat(event.target.dataset.price)
            };
            addToCart(product);
        });
    });

    function addToCart(product) {
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        if (existingProductIndex > -1) {
            // Si el producto ya existe, incrementa la cantidad
            cart[existingProductIndex].quantity += 1;
        } else {
            // Si es nuevo, lo añade al carrito con cantidad 1
            cart.push({ ...product, quantity: 1 });
        }
        renderCart(); // Actualiza la vista del carrito
    }
    
    // Eliminar producto del carrito
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart(); // Actualiza la vista del carrito
    }

    // Renderiza (dibuja) el contenido del carrito en el modal
    function renderCart() {
        cartContent.innerHTML = ''; // Limpia el contenido anterior

        if (cart.length === 0) {
            cartEmptyMessage.style.display = 'block';
            cartContent.style.display = 'none';
        } else {
            cartEmptyMessage.style.display = 'none';
            cartContent.style.display = 'block';
            
            const productList = document.createElement('div');
            productList.classList.add('cart-product-list');

            cart.forEach(item => {
                const productElement = document.createElement('div');
                productElement.classList.add('cart-product');
                productElement.innerHTML = `
                    <div class="cart-product-details">
                        <span class="cart-product-name">${item.name}</span>
                        <span class="cart-product-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="cart-product-actions">
                        <span class="cart-product-quantity">x ${item.quantity}</span>
                        <button class="remove-from-cart-btn" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
                productList.appendChild(productElement);
            });
            cartContent.appendChild(productList);
        }

        // Agrega listeners a los botones de eliminar recién creados
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.closest('button').dataset.id;
                removeFromCart(productId);
            });
        });
        
        updateCartSummary(); // Actualiza el resumen (total, contador, etc.)
    }

    // Actualiza el resumen del carrito y el contador del ícono
    function updateCartSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 0; // Envío fijo por ahora
        const total = subtotal + shipping;

        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Habilita o deshabilita el botón de pago según si el carrito está vacío
        checkoutBtn.disabled = cart.length === 0;
    }
    
    // Llama a la función una vez al cargar la página para establecer el estado inicial
    renderCart();
});