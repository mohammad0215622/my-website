// Dummy Product Database (LocalStorage or Database could be used here in future)
let productDatabase = JSON.parse(localStorage.getItem('products')) || [];

// Add New Product
const addProductForm = document.getElementById('add-product-form');
addProductForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('product-name').value;
  const category = document.getElementById('product-category').value;
  const price = document.getElementById('product-price').value;
  const image = document.getElementById('product-image').value;
  
  const newProduct = {
    id: Date.now(),
    name,
    category,
    price: parseFloat(price),
    image,
  };
  
  productDatabase.push(newProduct);
  localStorage.setItem('products', JSON.stringify(productDatabase));
  renderProductList();
  addProductForm.reset();
});

// Render Product List in Admin Panel
function renderProductList() {
  const productListAdmin = document.getElementById('product-list-admin');
  productListAdmin.innerHTML = '';
  
  productDatabase.forEach(product => {
    const productItem = `
      <li>
        ${product.name} - $${product.price} 
        <button class="delete-product" data-id="${product.id}">Delete</button>
      </li>
    `;
    productListAdmin.innerHTML += productItem;
  });

  // Add Event Listener to Delete Product
  const deleteButtons = document.querySelectorAll('.delete-product');
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-id');
      productDatabase = productDatabase.filter(product => product.id != productId);
      localStorage.setItem('products', JSON.stringify(productDatabase));
      renderProductList();
    });
  });
}

// Initial Render
renderProductList();
