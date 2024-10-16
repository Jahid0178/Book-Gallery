const bookWrapper = document.querySelector(".books-list-wrapper");
const bookFilter = document.querySelector("#topic-filter");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const loadingIndicator = document.getElementById("loader");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");

let currentPage = 1;

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    console.log("timeout", timeoutId);
    console.log("args", args);
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

function toggleLoading(show) {
  loadingIndicator.style.display = show ? "block" : "none";
}

// Reusable function to fetch and render books
async function fetchBooks(page = 1, query = "") {
  try {
    toggleLoading(true);
    bookWrapper.innerHTML = "";

    const baseUrl = `https://gutendex.com/books?page=${page}${query}`;
    const response = await fetch(baseUrl);
    const data = await response.json();

    toggleLoading(false);
    renderBooks(data.results);

    prevBtn.disabled = page === 1;
    nextBtn.disabled = data.results.length === 0;
  } catch (error) {
    toggleLoading(false);
    console.error("Error fetching books:", error);
  }
}

// Render Books
function renderBooks(books) {
  const existingWishlist = JSON.parse(localStorage.getItem("wishlists")) || [];

  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.setAttribute("data-id", book.id);

    // Check if the book is in the wishlist and set the appropriate icon
    const isInWishlist = existingWishlist.includes(book.id.toString());
    const heartIconClass = isInWishlist
      ? "fa-solid fa-heart"
      : "fa-regular fa-heart";

    bookCard.innerHTML = `
      <div class="card-action-wrapper">
        <button class="btn btn-secondary wishlist-btn">
          <i class="${heartIconClass}"></i>
        </button>
      </div>
      <img
        src="${book.formats["image/jpeg"]}"
        alt="${book.title}"
        class="book-cover"
      />
      <a href="/book.html?id=${book.id}">
        <h2 class="book-title">${book.title}</h2>
      </a>
      <div class="book-details">
        <p>Book ID: ${book.id}</p>
        <p>Genre: Fantasy</p>
      </div>
      <div class="author-info">
        <p>Author: ${book.authors[0]?.name || "Unknown"}</p>
      </div>
    `;
    bookWrapper.appendChild(bookCard);
  });
}

// Filter Books
bookFilter.addEventListener("change", async () => {
  currentPage = 1;
  const filterValue = bookFilter.value.toLowerCase();
  localStorage.setItem("filter", filterValue) || "";
  await fetchBooks(currentPage, `&topic=${filterValue}`);
});

// Search Books
searchInput.addEventListener(
  "input",
  debounce(async (e) => {
    currentPage = 1;

    const searchValue = e.target.value.trim();

    // Store the search value in local storage
    localStorage.setItem("search", searchValue) || "";

    await fetchBooks(currentPage, `&search=${searchValue}`);
  }, 1000)
);

// Pagination: Previous and Next Buttons
prevBtn.addEventListener("click", async () => {
  if (currentPage > 1) {
    currentPage--;
    await fetchBooks(currentPage);
  }
});

nextBtn.addEventListener("click", async () => {
  currentPage++;
  await fetchBooks(currentPage);
});

// Add to Wishlist
bookWrapper.addEventListener("click", (e) => {
  const addToWishlistBtn = e.target.closest(".wishlist-btn");

  if (addToWishlistBtn) {
    const bookCard = addToWishlistBtn.closest(".book-card");
    const bookId = bookCard.getAttribute("data-id");

    addToWishlist(bookId, addToWishlistBtn);
  }
});

function addToWishlist(bookId, wishlistBtn) {
  const existingWishlist = JSON.parse(localStorage.getItem("wishlists")) || [];

  if (existingWishlist.includes(bookId)) {
    // Remove from wishlist
    const index = existingWishlist.indexOf(bookId);
    existingWishlist.splice(index, 1);
    localStorage.setItem("wishlists", JSON.stringify(existingWishlist));

    wishlistBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
  } else {
    // Add to wishlist
    existingWishlist.push(bookId);
    localStorage.setItem("wishlists", JSON.stringify(existingWishlist));
    wishlistBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
  }
}

// Init App on Page Load
async function init() {
  console.log("init");
  const filterValue = localStorage.getItem("filter");
  const searchValue = localStorage.getItem("search");

  let queryParams = {};

  if (filterValue) {
    queryParams["topic"] = filterValue;
    bookFilter.value = filterValue;
  }

  if (searchValue) {
    queryParams["search"] = searchValue;
    searchInput.value = searchValue;
  }

  const queryString = Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .join("&");

  await fetchBooks(currentPage, queryString ? `&${queryString}` : "");
}

init();
