const bookDetailsWrapper = document.querySelector(".book-details-wrapper");
const loadingIndicator = document.getElementById("loader");

function getQueryParams(params) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(params);
}

async function renderBookDetails() {
  const bookId = getQueryParams("id");
  console.log("book_id: ", bookId);
  loadingIndicator.style.display = "block";

  const response = await fetch(`https://gutendex.com/books/${bookId}`);
  const data = await response.json();
  console.log(data);
  loadingIndicator.style.display = "none";

  bookDetailsWrapper.innerHTML = `
    <div class="book-detail-cover-wrapper">
      <img src="${data.formats["image/jpeg"]}" alt="${
    data.title
  }" class="book-cover" />
    </div>
    <div class="book-details">
      <div class="book-title-wrapper">
        <h2>${data.title}</h2>
        <strong><p>Author: ${data.authors[0].name}</p></strong>
      </div>
      <p>Total Downloads: ${data.download_count}</p>
      <div class="book-details-wrapper">
        <h3>Translators</h3>
        <ul>
          ${
            data.translators > 0
              ? data.translators
                  .map((translator) => `<li>${translator.name}</li>`)
                  .join("")
              : "No translators"
          }
        </ul>
      </div>
      <div class="book-details-wrapper">
        <h3>Subjects</h3>
        <ul>
          ${data.subjects.map((subject) => `<li>${subject}</li>`).join("")}
        </ul>
      </div>
      <div class="book-details-wrapper">
        <h3>Book Shelves</h3>
        <ul>
          ${data.bookshelves.map((subject) => `<li>${subject}</li>`).join("")}
        </ul>
      </div>
      <div class="book-details-wrapper">
          <h3>Book Formats</h3>
          <ul>
            ${Object.entries(data.formats)
              .map(([key, value]) => {
                console.log(key);
                return `<li>${key} - <a href="${value}" target="_blank">${value}</a></li>`;
              })
              .join("")}
          </ul>
      </div>
      <p>Copyright Status: ${data.copyright ? "Yes" : "No"}</p>
    </div>
  `;
}

renderBookDetails();
