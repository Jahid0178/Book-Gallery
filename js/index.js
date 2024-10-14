const bookWrapper = document.querySelector(".books-list-wrapper");
const bookFilter = document.querySelector("#topic-filter");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");
const loadingIndicator = document.getElementById("loader");

// Render Books
function renderBooks(books) {
  books.forEach((book) => {
    const bookLink = document.createElement("a");
    bookLink.href = `./book.html/${book.id}`;
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.innerHTML = `
      <img
        src="${book.formats["image/jpeg"]}"
        alt="${book.title}"
        class="book-cover"
      />
      <h2 class="book-title">${book.title}</h2>
      <div class="book-details">
        <p>Book ID: ${book.id}</p>
        <p>Genre: Fantasy</p>
      </div>
      <div class="author-info">
        <p>Author: ${book.authors[0]?.name || "Unknown"}</p>
      </div>
    `;
    bookLink.appendChild(bookCard);
    bookWrapper.appendChild(bookLink);
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

const response = fetch(
  "https://gutendex.com/books?page=1&language=en&per_page=10"
);

response
  .then((response) => response.json())
  .then((data) => {
    renderBooks(data.results);
  });
