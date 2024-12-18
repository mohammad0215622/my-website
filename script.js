// Dummy Products Data
const products = [
  { id: 1, name: "Smartphone", price: 200, image: "https://via.placeholder.com/150" },
  { id: 2, name: "Laptop", price: 600, image: "https://via.placeholder.com/150" },
  { id: 3, name: "Headphones", price: 50, image: "https://via.placeholder.com/150" },
  { id: 4, name: "T-shirt", price: 20, image: "https://via.placeholder.com/150" },
  { id: 5, name: "Washing Machine", price: 150, image: "https://via.placeholder.com/150" },
  { id: 6, name: "Tablet", price: 400, image: "https://via.placeholder.com/150" },
  { id: 7, name: "Smart Watch", price: 120, image: "https://via.placeholder.com/150" },
  { id: 8, name: "Bluetooth Speaker", price: 80, image: "https://via.placeholder.com/150" }
];

// Render Products in the Product Grid
function renderProducts() {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';
  products.forEach(product => {
    const productCard = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
    productList.innerHTML += productCard;
  });
}

// Search Products
document.getElementById('search').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
  
  // Show matching products
  const searchResults = document.getElementById('search-results');
  searchResults.innerHTML = '';

  if (filteredProducts.length > 0) {
    filteredProducts.forEach(product => {
      const productCard = `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
        </div>
      `;
      searchResults.innerHTML += productCard;
    });
  } else {
    searchResults.innerHTML = '<p>No matching products found.</p>';
  }
});

// Handle Add to Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  cartCount.textContent = cart.length;
}

document.getElementById('product-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('add-to-cart')) {
    const productId = e.target.getAttribute('data-id');
    const product = products.find(p => p.id == productId);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }
});

// Toggle Login/Logout
const loginBtn = document.getElementById('login-btn');
loginBtn.addEventListener('click', function() {
  if (loginBtn.textContent === 'Login') {
    loginBtn.textContent = 'Logout';
    // Simulate login here (you could implement real login logic)
  } else {
    loginBtn.textContent = 'Login';
    // Simulate logout (clear session or authentication state)
  }
});

// Initial Load
renderProducts();
updateCartCount();
