const bookWrapper = document.querySelector(".books-list-wrapper");
const bookFilter = document.querySelector("#topic-filter");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const addToWishlistBtn = document.querySelector("#wishlist-btn");
const loadingIndicator = document.getElementById("loader");

// Render Books
function renderBooks(books) {
  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.setAttribute("data-id", book.id);
    bookCard.innerHTML = `
      <div class="card-action-wrapper">
        <button class="btn btn-secondary wishlist-btn"><i class="fa-regular fa-heart"></i></button>
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
async function filterBooks() {
  const filterValue = bookFilter.value.toLowerCase();

  // Show Loading
  loadingIndicator.style.display = "block";

  // Clear Books
  bookWrapper.innerHTML = "";

  // Filter Books
  const baseUrl = `https://gutendex.com/books?topic=${filterValue}`;
  const response = await fetch(baseUrl);
  const data = await response.json();

  loadingIndicator.style.display = "none";

  renderBooks(data.results);
}

bookFilter.addEventListener("change", filterBooks);

// Search Books
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchValue = searchInput.value.trim();

  if (!searchValue) {
    return;
  }

  console.log(searchValue);

  // Show Loading
  loadingIndicator.style.display = "block";

  // Clear Books
  bookWrapper.innerHTML = "";

  const baseUrl = `https://gutendex.com/books?search=${searchValue}`;
  const response = fetch(baseUrl);
  response
    .then((response) => response.json())
    .then((data) => {
      loadingIndicator.style.display = "none";

      renderBooks(data.results);
    });
});

// Add to Wishlist
function addToWishlist(bookId, wishlistBtn) {
  const existingWishlist = JSON.parse(localStorage.getItem("wishlists")) || [];

  if (existingWishlist.includes(bookId)) {
    // removed from local storange
    const index = existingWishlist.indexOf(bookId);
    existingWishlist.splice(index, 1);
    localStorage.setItem("wishlists", JSON.stringify(existingWishlist));

    wishlistBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    return;
  }

  existingWishlist.push(bookId);
  localStorage.setItem("wishlists", JSON.stringify(existingWishlist));
  wishlistBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
}

bookWrapper.addEventListener("click", (e) => {
  const addToWishlistBtn = e.target.closest(".wishlist-btn");

  if (addToWishlistBtn) {
    const bookCard = addToWishlistBtn.closest(".book-card");
    const bookId = bookCard.getAttribute("data-id");

    addToWishlist(bookId, addToWishlistBtn);
  }
});

// Init App
(async function init() {
  loadingIndicator.style.display = "block";

  const response = await fetch(
    "https://gutendex.com/books?page=1&language=en&per_page=10"
  );

  const data = await response.json();
  renderBooks(data.results);
  loadingIndicator.style.display = "none";
})();
