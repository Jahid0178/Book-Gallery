const wishlistWrapper = document.querySelector(".wishlist-wrapper");
const loadingIndicator = document.getElementById("loader");

// Reusable function for getting wishlist data from storage
function getWishlistFromStorage() {
  return JSON.parse(localStorage.getItem("wishlists")) || [];
}

// Reusable function to update wishlist in storage
function updateWishlistInStorage(wishlist) {
  localStorage.setItem("wishlists", JSON.stringify(wishlist));
}

// Reusable function to toggle loading indicator
function toggleLoading(show) {
  loadingIndicator.style.display = show ? "block" : "none";
}

// Fetch book details by book ids
async function fetchBooksByIds(ids) {
  const url = `https://gutendex.com/books?ids=${ids}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

// Render the wishlist items on the page
function renderWishlist(books) {
  wishlistWrapper.innerHTML = ""; // Clear previous content before rendering
  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("wishlist-item");
    bookCard.innerHTML = `
      <img src="${book.formats["image/jpeg"]}" alt="${book.title}" />
      <div class="wishlist-details-wrapper">
        <div>
          <a href="${"/book.html?id=" + book.id}">
            <h2>${book.title}</h2>
          </a>
          <p>Author: ${book.authors[0]?.name || "Unknown"}</p>
          <p>Total Downloads: ${book.download_count}</p>
        </div>
        <div class="wishlist-action-wrapper">
            <button class="remove-btn" data-id="${book.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
      </div>
    `;
    wishlistWrapper.appendChild(bookCard);
  });
}

// Remove a book from the wishlist
async function removeFromWishlist(bookId) {
  wishlistWrapper.innerHTML = "";
  let wishlist = getWishlistFromStorage();
  wishlist = wishlist.filter((id) => id !== bookId);
  updateWishlistInStorage(wishlist);
  if (wishlist.length === 0) {
    wishlistWrapper.innerHTML = ""; // Clear wishlist if empty
    return;
  }
  toggleLoading(true);
  const ids = wishlist.join(",");
  const books = await fetchBooksByIds(ids);
  toggleLoading(false);
  renderWishlist(books);
}

wishlistWrapper.addEventListener("click", (e) => {
  const removeBtn = e.target.closest(".remove-btn");
  if (removeBtn) {
    const bookId = removeBtn.getAttribute("data-id");
    removeFromWishlist(bookId);
  }
});

// Initialize wishlist on page load
document.addEventListener("DOMContentLoaded", async function () {
  const wishlists = getWishlistFromStorage();

  if (wishlists.length > 0) {
    toggleLoading(true);
    const ids = wishlists.join(",");
    const books = await fetchBooksByIds(ids);
    toggleLoading(false);
    renderWishlist(books);
  }

  const createWarnDiv = document.createElement("div");
  createWarnDiv.innerHTML = "No books in wishlist";
  if (wishlistWrapper.innerHTML === "") {
    wishlistWrapper.appendChild(createWarnDiv);
  }
});
