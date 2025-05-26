let products = [];
let categories = [];
let cart = [];
let totalPrice = 0;

const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const sortName = document.getElementById("sortName");
const sortPrice = document.getElementById("sortPrice");
const catalog = document.getElementById("catalog");
const cartContainer = document.getElementById("cartItems");
const totalPriceElement = document.getElementById("totalPrice");


const fetchProducts = async () => {
  const allProducts = [];

  for (let skip = 0; skip < 300; skip += 100) {
    const res = await fetch(`https://dummyjson.com/products?limit=100&skip=${skip}`);
    const data = await res.json();
    allProducts.push(...data.products);
  }

  products = allProducts;

  const userProducts = loadUserProducts();
  if (userProducts.length > 0) {
    products.push(...userProducts);
  }
  extractCategories(products);
  displayProducts(products);
};

const extractCategories = (products) => {
  const uniqueCategories = new Set();
  products.forEach(product => {
    if (product.category) uniqueCategories.add(product.category);
  });
  categories = [...uniqueCategories].sort();
  updateCategorySelect(categories);
};

const updateCategorySelect = (categories) => {
  catalog.innerHTML = ""; 

  
 const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "Hamma kategoriyalar";
  catalog.appendChild(allOption);

  
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.toLowerCase();
    option.textContent = category;
    catalog.appendChild(option);
  });
};



function displayProducts(items) {
  items = [...items].reverse(); 
  productList.innerHTML = "";
  items.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="box">
        <img src="${product.thumbnail}" alt="${product.title}" class="product-img">
        <div class="card-body">
          <h3>${product.title}</h3>
          <p>${product.brand || 'Brend yo‘q'}</p>
          <p>${product.category}</p>
          <p>${product.stock} ta qolgan</p>
          <p>Sof og'irligi: ${product.dimensions?.height || 'N/A'}</p>
          <p class="price">$${product.price}</p>
          <button class="buy">Buy</button>
        </div>
      </div>
    `;

    const buyBtn = card.querySelector(".buy");
    buyBtn.addEventListener("click", () => {
      addToCart({ title: product.title, price: product.price, image: product.thumbnail });
    });

    productList.appendChild(card);
  });

  const buyButtons = document.querySelectorAll('.buy');
  buyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        const message = document.getElementById('message');
        message.style.display = 'flex';
        setTimeout(() => {
          message.style.display = 'none';
        }, 10000);
      }, 20);
    });
  });
}


function addToCart(product) {
  cart.push(product);
  totalPrice += product.price;
  updateCart();
  saveCartToLocalStorage();
}


function removeFromCart(index) {
  totalPrice -= cart[index].price;
  cart.splice(index, 1);
  updateCart();
  saveCartToLocalStorage();
}


function updateCart() {
  cartContainer.innerHTML = "";
  cart.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}" width="60px" class="cart-item-img">
      <span>${item.title} - $${item.price}</span>
      <button class="dele" onclick="removeFromCart(${index})">X</button>
    `;
    cartContainer.appendChild(cartItem);
  });
  totalPriceElement.innerText = `Umumiy narx: $${totalPrice.toFixed(2)}`;
}


function saveCartToLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cart));
  localStorage.setItem("totalPrice", totalPrice.toFixed(2));
}


function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem("cartItems");
  const storedTotal = localStorage.getItem("totalPrice");
  if (storedCart) cart = JSON.parse(storedCart);
  if (storedTotal) totalPrice = parseFloat(storedTotal);
  updateCart();
}


searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(term));
  displayProducts(filtered);
});

sortName.addEventListener("change", () => {
  const sorted = [...products];
  sorted.sort((a, b) => sortName.value === "a-z" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
  displayProducts(sorted);
});

sortPrice.addEventListener("change", () => {
  const sorted = [...products];
  sorted.sort((a, b) => sortPrice.value === "low-high" ? a.price - b.price : b.price - a.price);
  displayProducts(sorted);
});

catalog.addEventListener("change", () => {
  const selectedCategory = catalog.value;
  const filtered = selectedCategory ? products.filter(p => p.category.toLowerCase() === selectedCategory) : products;
  displayProducts(filtered);
});


document.getElementById('shop').onclick = function () {
  const cartBox = document.getElementById('cart');
  cartBox.style.display = 'flex';
  this.style.display = 'none';
};

document.getElementById('close').onclick = function () {
  const cartBox = document.getElementById('cart');
  cartBox.style.display = 'none';
  document.getElementById('shop').style.display = 'flex';
};


document.getElementById('darkToggle').onclick = function () {
  document.body.classList.toggle('dark-mode');
};


function changeLanguage() {
  const lang = document.getElementById("lang").value;
  if (lang === "uz") {
    window.location.href = "index.html";
  } else if (lang === "ru") {
    window.location.href = "rus.html";
  }
}


function changeLogin() {
  const log = document.getElementById("log").value;
  if (log === "lo") {
    window.location.href = "login.html";
  } else if (log === "re") {
    window.location.href = "regis.html";
  } else {
    console.log('Error!');
  }
}


const swiper = new Swiper(".mySwiper", {
  loop: true,
  autoplay: {
    delay: 2800,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  slidesPerView: 1,
});

window.addEventListener('load', function () {
  setTimeout(function () {
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
  }, 3000);
});

function loadUserProducts() {
  const stored = localStorage.getItem("userProducts");
  return stored ? JSON.parse(stored) : [];
}


function saveUserProduct(product) {
  const existing = loadUserProducts();
  existing.push(product);
  localStorage.setItem("userProducts", JSON.stringify(existing));
}


document.getElementById("startSellingBtn").addEventListener("click", () => {
 document.getElementById("sellForm").style.display = "flex" ;
 document.getElementById("sellForm").style.flexDirection = "column" ;
 document.getElementById("sellForm").style.position = "fixed" ;
 document.getElementById("sellForm").style.zIndex = "99999" ;
 document.getElementById("sellForm").style.background = 'rgba(139, 139, 139, 0.36)' ;
 document.getElementById("sellForm").style.backdropFilter = "blur(10px)" ;
 document.getElementById("sellForm").style.padding = "50px" ;
 document.getElementById("sellForm").style.borderRadius = "10px" ;
 
});


document.getElementById("submitProduct").addEventListener("click", () => {
  const title = document.getElementById("newTitle").value;
  const brand = document.getElementById("newBrand").value;
  const category = document.getElementById("newCategory").value;
  const stock = parseInt(document.getElementById("newStock").value);
  const height = parseFloat(document.getElementById("newHeight").value);
  const price = parseFloat(document.getElementById("newPrice").value);
  const thumbnail = document.getElementById("newImage").value;

  if (!title || !price || !thumbnail) {
    alert("Iltimos, nom, narx va rasm URL ni kiriting.");
    return;
  }

  const newProduct = {
    id: Date.now(),
    title,
    brand,
    category,
    stock: stock || 1,
    price,
    thumbnail,
    dimensions: { height: height || 0 }
  };

  saveUserProduct(newProduct);
  products.push(newProduct);
  extractCategories(products); 
  displayProducts(products); 

  document.getElementById("sellForm").reset();
});


window.addEventListener("load", () => {
  loadCartFromLocalStorage();
  fetchProducts();
});


function refresh() {
  localStorage.clear();
  cart = [];
  totalPrice = 0;
  updateCart();
  fetchProducts(); 
}
const submitProduct = document.getElementById('submitProduct').onclick = function(){
  document.getElementById("sellForm").style.display = "none";
  
}


  document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const name = localStorage.getItem("registeredName");
    const username = localStorage.getItem("registeredName");

    const logSelect = document.getElementById("log");
    const profileBox = document.getElementById("profileBox");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const nameDisplay = document.getElementById("usernameDisplay");

    if (isLoggedIn === "true" && name) {
      logSelect.style.display = "none";
      profileBox.style.display = "flex";
      usernameDisplay.textContent = ` ${name}`;
      nameDisplay.textContent = ` ${username}`;
    }
  });

  function logout() {
    localStorage.removeItem("isLoggedIn");
    location.reload();
  }

document.getElementById('profileBox').onclick = function(){
  document.getElementById('profileBox').style.display = 'flex'
  document.getElementById('prof').style.display = 'flex'
  document.addEventListener(window, ()=>{
      document.getElementById('prof').style.display = 'none'
  })
}