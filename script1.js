const products = [
  { id: 1, image: "./images/products/burger.png", title: "Burger1", description: "Enjoy the crispy chicken fillet in a soft bun with spicy mayo and our signature sauce", price: 100, category: "Burger", rating: 5 },
  { id: 2, image: "./images/products/shawarma.jpg", title: "Shawarma1", description: "Aromatic Arabian rice with 6 packs of hot shots with KFC famous Vietnamese sauce", price: 200, category: "Shawarma", rating: 4 },
  { id: 3, image: "./images/products/piz.jpg", title: "Pizza1", description: "Crispy zinger with crispy rolled into paratha", price: 300, category: "Pizza", rating: 3 },
  { id: 4, image: "./images/products/burger.png", title: "Burger2", description: "Enjoy the crispy chicken fillet in a soft bun with spicy mayo and our signature sauce", price: 400, category: "Burger", rating: 2 },
  { id: 5, image: "./images/products/shawarma.jpg", title: "Shawarma2", description: "Aromatic Arabian rice with 6 packs of hot shots with KFC famous Vietnamese sauce", price: 500, category: "Shawarma", rating: 1 },
  { id: 6, image: "./images/products/piz.jpg", title: "Pizza2", description: "Crispy zinger with crispy rolled into paratha", price: 600, category: "Pizza", rating: 5 },
  { id: 7, image: "./images/products/burger.png", title: "Burger3", description: "Enjoy the crispy chicken fillet in a soft bun with spicy mayo and our signature sauce", price: 700, category: "Burger", rating: 4 },
  { id: 8, image: "./images/products/shawarma.jpg", title: "Shawarma3", description: "Aromatic Arabian rice with 6 packs of hot shots with KFC famous Vietnamese sauce", price: 800, category: "Shawarma", rating: 3 },
  { id: 9, image: "./images/products/piz.jpg", title: "Pizza3", description: "Crispy zinger with crispy rolled into paratha", price: 900, category: "Pizza", rating: 2 },
];

const categories = [
  { id: 1, title: "Burger", image: "" },
  { id: 2, title: "Shawarma", image: "" },
  { id: 3, title: "Pizza", image: "" },
];

let selectedCategory = [];
let selectedRating = 0;
let selectedSort = "ratingHightolow";

const priceRange = (() => {
  let min = Math.min(...products.map((p) => p.price));
  let max = Math.max(...products.map((p) => p.price));
  return { min, max };
})();

let selectedPrice = {
  min: priceRange.min,
  max: priceRange.max,
  isApplied: false,
};

let itemsPerPage = 8;
let currentPage = 1;
let searchTerm = "";

const categoryTitles = categories.map((category) => category.title);

const categoryFilterEl = document.getElementById("categoryFilter");
const productsGridEl = document.getElementById("productsGrid");
const priceFilterEl = document.getElementById("priceFilter");
const ratingFilterEl = document.getElementById("ratingFilter");
const sortSelectEl = document.getElementById("sortSelect");
const itemsPerPageSelectEl = document.getElementById("itemsPerPageSelect");
const paginationEl = document.getElementById("pagination");
const searchInputEl = document.getElementById("searchInput");

const onChangeCategory = (category, isChecked) => {
  if (isChecked) {
    selectedCategory.push(category);
  } else {
    selectedCategory = selectedCategory.filter((cat) => cat !== category);
  }
  currentPage = 1;
  renderProducts();
};

const onChangePrice = (price) => {
  selectedPrice.max = parseInt(price);
  selectedPrice.isApplied = true;
  currentPage = 1;
  renderProducts();
};

const onChangeRatingHandler = (rating) => {
  selectedRating = rating;
  renderRatingFilter();
  currentPage = 1;
  renderProducts();
};

const onSearchInput = (event) => {
  searchTerm = event.target.value.toLowerCase();
  currentPage = 1;
  renderProducts();
};

const getSortData = (data, sortBy) => {
  return data.sort((a, b) => {
    if (sortBy === 'ratingHightolow') return b.rating - a.rating;
    if (sortBy === 'ratingLowToHigh') return a.rating - b.rating;
    if (sortBy === 'priceHightoLow') return b.price - a.price;
    if (sortBy === 'priceLowToHigh') return a.price - b.price;
    return 0;
  });
};

const getFilterData = (data, selectedCategory, selectedRating, selectedPrice, searchTerm) => {
  return data.filter((product) => {
    if (selectedCategory.length && !selectedCategory.includes(product.category)) return false;
    if (selectedRating && product.rating < selectedRating) return false;
    if (selectedPrice.isApplied && (product.price < selectedPrice.min || product.price > selectedPrice.max)) return false;
    if (searchTerm) {
      const searchableText = (product.title + " " + product.description + " " + product.category).toLowerCase();
      if (!searchableText.includes(searchTerm)) return false;
    }
    return true;
  });
};

const renderCategories = () => {
  categoryFilterEl.innerHTML = categoryTitles.map((category) => `
      <div class="relative flex items-center">
        <div class="flex items-center h-5">
          <input 
            type="checkbox"
            class="w-4 h-4 rounded cursor-pointer"
            onchange="onChangeCategory('${category}', this.checked)"
            ${selectedCategory.includes(category) ? 'checked' : ''}
          />
        </div>
        <label class="ml-3 text-md text-white cursor-pointer font-medium">${category}</label>
      </div>
    `).join("");
};

const renderRatingFilter = () => {
  ratingFilterEl.innerHTML = [5, 4, 3, 2, 1].map((rating) => `
      <div class="flex items-center gap-2 cursor-pointer" onclick="onChangeRatingHandler(${rating})">
        <div class="flex justify-start">
          ${Array(5).fill().map((_, i) => `
            <svg
              aria-hidden="true"
              class="w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"} ${rating == selectedRating ? "!text-[#ff3d47]" : ""}"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          `).join("")}
        </div>
        <p class="text-gray-400">${rating === 5 ? "5.0" : rating.toFixed(1)} +</p>
      </div>
    `).join("");
};

const renderPriceFilter = () => {
  priceFilterEl.innerHTML = `
      <input type="range" name="price" id="price"
        min="${priceRange.min}" max="${priceRange.max}"
        value="${selectedPrice.max}"
        class="w-full"
        oninput="onChangePrice(this.value)"
      />
      <div class="flex justify-between">
        <span>${priceRange.min}</span>
        <span>${selectedPrice.max}</span>
      </div>
    `;
};

const renderProducts = () => {
  let visibleProducts = getFilterData(products, selectedCategory, selectedRating, selectedPrice, searchTerm);
  visibleProducts = getSortData(visibleProducts, selectedSort);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = visibleProducts.slice(start, end);
  const totalPages = Math.ceil(visibleProducts.length / itemsPerPage);

  productsGridEl.innerHTML = paginatedProducts.map((product) => `
      <div class="col-span-3">
        <div class="rounded-2xl shadow-lg bg-[#1B1B1B]">
          <div class="flex flex-col">
            <img src="${product.image}" alt="${product.title}" class="object-cover rounded-t-2xl z-[1] opacity-90 hover:opacity-100 transition-opacity w-full h-[250px]" />
            <div class="relative p-3 space-y-2 h-48 text-white">
              <h1 class="font-medium text-2xl">${product.title}</h1>
              <div class="flex items-center gap-2">
                <div class="flex justify-start">
                  ${Array(5).fill().map((_, i) => `
                    <svg aria-hidden="true" class="w-5 h-5 ${i < product.rating ? "text-yellow-400" : "text-gray-300"}" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  `).join("")}
                </div>
                (${product.rating})
              </div>
              <p class="max-h-24 overflow-auto">${product.description}</p>
              <div class="absolute bottom-2 w-full flex justify-between items-center pr-6">
                <span class="text-white text-xl">$${product.price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join("");

  renderPagination(totalPages);
};

const renderPagination = (totalPages) => {
  paginationEl.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.className = `px-3 py-1 mx-1 rounded ${i === currentPage ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`;
    button.onclick = () => {
      currentPage = i;
      renderProducts();
    };
    paginationEl.appendChild(button);
  }
};

const clearAllFilters = () => {
  selectedCategory = [];
  selectedRating = 0;
  selectedPrice = {
    min: priceRange.min,
    max: priceRange.max,
    isApplied: false,
  };
  selectedSort = "ratingHightolow";
  currentPage = 1;
  searchTerm = "";
  if (searchInputEl) searchInputEl.value = "";

  // Reset itemsPerPage
  itemsPerPage = 8;
  if (itemsPerPageSelectEl) itemsPerPageSelectEl.value = "8";

  // Reset UI
  renderCategories();
  renderRatingFilter();
  renderPriceFilter();
  sortSelectEl.value = selectedSort;
  renderProducts();
};

document.getElementById("clearFiltersBtn").addEventListener("click", clearAllFilters);

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderRatingFilter();
  renderPriceFilter();
  renderProducts();

  sortSelectEl.addEventListener("change", (event) => {
    selectedSort = event.target.value;
    currentPage = 1;
    renderProducts();
  });

  if (itemsPerPageSelectEl) {
    itemsPerPageSelectEl.value = String(itemsPerPage);
    itemsPerPageSelectEl.addEventListener("change", (e) => {
      const value = parseInt(e.target.value, 10);
      itemsPerPage = isNaN(value) ? 8 : value;
      currentPage = 1;
      renderProducts();
    });
  }

  if (searchInputEl) {
    searchInputEl.addEventListener("input", onSearchInput);
  }
});
