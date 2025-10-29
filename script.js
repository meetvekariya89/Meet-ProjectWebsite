function getProducts() {
    let storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        return JSON.parse(storedProducts);
    }
    return [
        { id: 1, name: 'Non-stick Pan', price: 1500, img: 'p1.png', category: 'Pan' },
        { id: 2, name: 'Chef Knife', price: 345, img: 'p2.png', category: 'Knife' },
        { id: 3, name: 'Cutting Board', price: 500, img: 'p3.png', category: 'Board' },
        { id: 4, name: 'Mixing Bowl', price: 100, img: 'p4.png', category: 'Bowl' },
        { id: 5, name: 'Sauce Pan', price: 2000, img: 'p5.png', category: 'Pan' },
        { id: 6, name: 'Frying Pan', price: 2350, img: 'p6.png', category: 'Pan' },
        { id: 7, name: 'Bread Knife', price: 175, img: 'p7.png', category: 'Knife' },
        { id: 8, name: 'Wooden Board', price: 1050, img: 'p8.png', category: 'Board' },
        { id: 9, name: 'Salad Bowl', price: 677, img: 'p9.png', category: 'Bowl' },
        { id: 10, name: 'Casserole Pot', price: 9500, img: 'p10.png', category: 'Pot' }
    ];
}

let products = getProducts();

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function getCart() {
    let storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
}

let cart = getCart();

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const productList = document.getElementById('product-list');
const adminProductList = document.getElementById('admin-product-list');

function toggleMobileMenu() { 
    document.getElementById('mobile-menu').classList.toggle('hidden'); 
}

function showSection(id) { 
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active')); 
    document.getElementById(id).classList.add('active'); 
}

function showAdminPage(pageId) { 
    document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active')); 
    document.getElementById(pageId).classList.add('active'); 
}

let slideIndex = 0; 
const slides = document.querySelectorAll('.carousel-slide'); 

function showSlide(i) { 
    slides.forEach(s => s.classList.add('hidden')); 
    if(slides.length > 0) {
        slides[i].classList.remove('hidden'); 
    }
} 

function nextSlide() { 
    slideIndex = (slideIndex + 1) % slides.length; 
    showSlide(slideIndex); 
} 

function prevSlide() { 
    slideIndex = (slideIndex - 1 + slides.length) % slides.length; 
    showSlide(slideIndex); 
} 

function displayProducts(list) { 
    if (!productList) return;
    productList.innerHTML = ''; 
    list.forEach(p => { 
        let div = document.createElement('div'); 
        div.className = 'card p-4'; 
        div.innerHTML = `<img src="${p.img}" class="card-img mb-2"><h4 class="font-semibold text-lg">${p.name}</h4><p>₹${p.price.toFixed(2)}</p><button class="bg-wood px-4 py-1 rounded mt-2" onclick="addToCart(${p.id})">Add to Cart</button>`; 
        productList.appendChild(div); 
    }); 
}

function filterCategory(cat) { 
    if (cat === 'all') { 
        displayProducts(products); 
    } else { 
        displayProducts(products.filter(p => p.category === cat)); 
    } 
}

function searchProducts() {
    let query = document.getElementById("searchBar").value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(query));
    displayProducts(filtered);
}

function addToCart(id) { 
    let prod = products.find(p => p.id === id); 
    cart.push(prod); 
    saveCart(); 
    updateCart(); 
}

function removeFromCart(index) { 
    cart.splice(index, 1); 
    saveCart(); 
    updateCart(); 
}

function updateCart() { 
    const cartCount = document.getElementById('cart-count');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    
    if (cartCount) cartCount.innerText = cart.length; 
    if (cartCountMobile) cartCountMobile.innerText = cart.length; 

    const cartItems = document.getElementById('cart-items'); 
    const cartTotal = document.getElementById('cart-total'); 
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutTotalSummary = document.getElementById('checkout-total-summary');

    if (cartItems) {
        cartItems.innerHTML = ''; 
        let total = 0; 
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-gray-500 italic">Your cart is empty.</p>';
            if (checkoutBtn) checkoutBtn.disabled = true;
            const checkoutFormContainer = document.getElementById('checkout-form-container');
            const cartContent = document.getElementById('cart-content');
            if (checkoutFormContainer) checkoutFormContainer.classList.add('hidden');
            if (cartContent) cartContent.classList.remove('hidden');
        } else {
            cart.forEach((item, i) => { 
                total += item.price; 
                let div = document.createElement('div'); 
                div.className = 'flex justify-between items-center border-b py-2'; 
                div.innerHTML = `<span>${item.name}</span><span>₹${item.price.toFixed(2)} <button class="text-red-600 ml-2" onclick="removeFromCart(${i})"><i class="fas fa-trash"></i></button></span>`; 
                cartItems.appendChild(div); 
            }); 
            if (checkoutBtn) checkoutBtn.disabled = false;
        }
        
        if (cartTotal) cartTotal.innerText = total.toFixed(2); 
        if (checkoutTotalSummary) checkoutTotalSummary.innerText = total.toFixed(2);
    }
}

function showCheckoutForm() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before proceeding to checkout.");
        return;
    }
    document.getElementById('cart-content').classList.add('hidden');
    document.getElementById('checkout-form-container').classList.remove('hidden');
    updateCart(); 
}

function showCartDetails() {
    document.getElementById('checkout-form-container').classList.add('hidden');
    document.getElementById('cart-content').classList.remove('hidden');
}

function processOrder(event) {
    event.preventDefault();
    
    let totalAmount = document.getElementById('checkout-total-summary').innerText;
    
    if (!document.querySelector('input[type="radio"][name="payment"]:checked')) {
        alert('Please select a payment method.');
        return false;
    }
    
    if (confirm(`Confirm order? Total amount to pay is ₹${totalAmount}.`)) {
        alert("Order successfully placed! You will receive a confirmation email shortly. Thank you for shopping with S.M.METAL.");
        
        cart = [];
        saveCart();
        
        updateCart(); 
        showCartDetails(); 
        showSection('home');
    }
    return false;
}

function validateContactForm() { 
    let name = document.getElementById('name').value; 
    let email = document.getElementById('email').value; 
    let message = document.getElementById('message').value; 
    if (!name || !email || !message) { alert('Please fill all fields!'); return false; } 
    alert('Message sent!'); 
    return false; 
}

function checkAdminLoginStatus() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const loginDiv = document.getElementById('admin-login');
    const dashboardDiv = document.getElementById('admin-dashboard');
    const navLogout = document.getElementById('nav-admin-logout');
    
    if (loginDiv && dashboardDiv) {
        if (isLoggedIn) {
            loginDiv.classList.add('hidden');
            dashboardDiv.classList.remove('hidden');
            if(navLogout) navLogout.style.display = 'block';
            displayAdminProducts();
        } else {
            loginDiv.classList.remove('hidden');
            dashboardDiv.classList.add('hidden');
            if(navLogout) navLogout.style.display = 'none';
        }
    }
}

function adminLogin() {
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    const errorMsg = document.getElementById('login-error');

    if (username === "admin" && password === "12345") {
        localStorage.setItem('adminLoggedIn', 'true');
        checkAdminLoginStatus();
    } else {
        errorMsg.classList.remove('hidden');
    }
}

function adminLogout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('adminLoggedIn');
        
        if (window.location.pathname.endsWith('admin.html')) {
            checkAdminLoginStatus();
        } else {
            window.location.href = 'index.html';
        }
    }
}

function displayAdminProducts() {
    if (!adminProductList) return; 

    adminProductList.innerHTML = '';
    products.forEach((p, i) => {
        let div = document.createElement('div');
        div.className = 'card p-4 text-center';
        div.innerHTML = `
        <img src="${p.img}" class="card-img mb-2">
        <h4 class="font-semibold text-lg mb-1">${p.name}</h4>
        <p class="text-gray-600 mb-2">₹${p.price.toFixed(2)}</p>
        <button onclick="editProduct(${i})" class="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button onclick="deleteProduct(${i})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
          <i class="fas fa-trash"></i> Delete
        </button>`;
        adminProductList.appendChild(div);
    });
}

function insertProduct() {
    let name = document.getElementById('pname').value.trim();
    let price = parseFloat(document.getElementById('pprice').value);
    let img = document.getElementById('pimg').value.trim();
    let category = document.getElementById('pcategory').value.trim();

    if (!name || isNaN(price) || price <= 0 || !img || !category) {
        alert('Please fill all fields correctly!');
        return;
    }

    products.push({ id: products.length + 1, name, price, img, category });
    saveProducts();
    alert('Product added successfully!');
    document.getElementById('pname').value = '';
    document.getElementById('pprice').value = '';
    document.getElementById('pimg').value = '';
    document.getElementById('pcategory').value = '';

    displayAdminProducts();
}

function editProduct(index) {
    let newName = prompt('Enter new name:', products[index].name);
    let newPrice = prompt('Enter new price:', products[index].price);
    let newImg = prompt('Enter new image path:', products[index].img);
    let newCat = prompt('Enter new category:', products[index].category);

    if (newName && newPrice && newImg && newCat) {
        let parsedPrice = parseFloat(newPrice);
        if(isNaN(parsedPrice) || parsedPrice <= 0) {
            alert('Invalid price entered. Update canceled.');
            return;
        }

        products[index] = { 
            ...products[index], 
            name: newName, 
            price: parsedPrice, 
            img: newImg, 
            category: newCat 
        };
        saveProducts();
        alert('Product updated successfully!');
        displayAdminProducts();
    }
}

function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        products.splice(index, 1);
        saveProducts();
        alert('Product deleted!');
        displayAdminProducts();
    }
}

function initializeApp() {
    if (productList) {
        displayProducts(products);
        if (slides.length > 0) {
            setInterval(nextSlide, 5000); 
            showSlide(slideIndex);
        }
    }
    if (document.getElementById('admin-login')) {
        checkAdminLoginStatus();
    }
    
    updateCart();
}

window.onload = initializeApp;

function updateAnalyticsMetrics() {
}