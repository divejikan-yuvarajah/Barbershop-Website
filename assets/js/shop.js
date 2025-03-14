let productList = document.querySelector('.product-list');
let cartList = document.querySelector('.cart-item-list');
let cartIcon = document.querySelector('.shopping-cart-icon');
let cartIconCount = document.querySelector('.shopping-cart-icon span');
let body = document.querySelector('.shopping-body');
let closeCartBtn = document.querySelector('.cart-close-btn');
let products = [];
let cart = [];

// Toggle cart visibility
cartIcon.addEventListener('click', () => {
    body.classList.toggle('show-cart');
});
closeCartBtn.addEventListener('click', () => {
    body.classList.toggle('show-cart');
});

// Render products in the product list
const renderProducts = () => {
    if (products.length > 0) {
        productList.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            let productDiv = document.createElement('div');
            productDiv.dataset.id = product.id;
            productDiv.classList.add('product-item');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="product-price">LKR.${product.price}</div>
                <button class="add-to-cart-btn">Add To Cart</button>`;
            productList.appendChild(productDiv);
        });
    }
};

// Handle product clicks to add to cart
productList.addEventListener('click', (event) => {
    let clickedElement = event.target;
    if (clickedElement.classList.contains('add-to-cart-btn')) {
        let productId = clickedElement.parentElement.dataset.id;
        addToCart(productId);
    }
});

// Add item to cart
const addToCart = (productId) => {
    let existingProductIndex = cart.findIndex(item => item.product_id == productId);
    if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push({ product_id: productId, quantity: 1 });
    }
    updateCartDisplay();
    saveCartToLocalStorage();
};

// Update cart display
const updateCartDisplay = () => {
    cartList.innerHTML = ''; // Clear existing cart items
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(cartItem => {
            let productInfo = products.find(product => product.id == cartItem.product_id);
            totalQuantity += cartItem.quantity;

            let cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.dataset.id = cartItem.product_id;
            cartItemDiv.innerHTML = `
                <div class="cart-item-image">
                    <img src="${productInfo.image}">
                </div>
                <div class="cart-item-name">${productInfo.name}</div>
                <div class="cart-item-total-price">LKR.${productInfo.price * cartItem.quantity}</div>
                <div class="cart-item-quantity">
                    <span class="quantity-minus">&lt;</span>
                    <span>${cartItem.quantity}</span>
                    <span class="quantity-plus">&gt;</span>
                </div>`;
            cartList.appendChild(cartItemDiv);
        });
    }
    cartIconCount.innerText = totalQuantity;
};

// Save cart to localStorage
const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Load cart from localStorage
const loadCartFromLocalStorage = () => {
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
};

// Change quantity of items in cart
cartList.addEventListener('click', (event) => {
    let clickedElement = event.target;
    if (clickedElement.classList.contains('quantity-minus') || clickedElement.classList.contains('quantity-plus')) {
        let productId = clickedElement.parentElement.parentElement.dataset.id;
        let action = clickedElement.classList.contains('quantity-plus') ? 'plus' : 'minus';
        updateCartItemQuantity(productId, action);
    }
});

// Update item quantity in cart
const updateCartItemQuantity = (productId, action) => {
    let cartItemIndex = cart.findIndex(item => item.product_id == productId);
    if (cartItemIndex >= 0) {
        if (action === 'plus') {
            cart[cartItemIndex].quantity++;
        } else if (action === 'minus') {
            cart[cartItemIndex].quantity--;
            if (cart[cartItemIndex].quantity <= 0) {
                cart.splice(cartItemIndex, 1); // Remove item if quantity is zero
            }
        }
    }
    updateCartDisplay();
    saveCartToLocalStorage();
};

// Initialize the application
const initializeApp = () => {
    // Fetch products from an external JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts();
            loadCartFromLocalStorage();
            updateCartDisplay();
        });
};

initializeApp();




document.addEventListener('DOMContentLoaded', function() {
    // Handle the checkout button click
    const checkoutButton = document.querySelector('.cart-checkout-btn');
    
    checkoutButton.addEventListener('click', function() {
        // Redirect to a payment page or display a modal for payment
        // For simplicity, we are redirecting to 'payment.html'
        window.location.href = 'payment.html'; // You can change 'payment.html' to your payment page URL
        
        // If you want to display a payment form or modal instead of a page redirect, you can do so here:
        /*
        const paymentFormModal = document.querySelector('.payment-form-modal');
        paymentFormModal.style.display = 'block';
        */
    });

    // Handle close button click (if applicable)
    const closeButton = document.querySelector('.cart-close-btn');
    closeButton.addEventListener('click', function() {
        // Hide shopping cart or perform any necessary actions
        document.querySelector('.shopping-cart-tab').style.display = 'none';
    });
});
