# Books Gallery 📚

This project is a Book Finder App that allows users to search, filter, and explore books from the Gutendex API. Users can search books by title, filter them based on topics/genres, and also add books to their wishlist. The app dynamically fetches books with each user interaction, ensuring a smooth and interactive experience.

## Features 🌟

- **_Search Functionality:_** Users can search for books by typing a keyword in the search bar. Results are displayed in real-time using an optimized search with a debounce mechanism to reduce API calls.
- **_Filter Books by Genre:_** Users can filter books by selecting different genres/topics from the dropdown filter.
- **_Pagination:_** Navigate between pages to explore more books using the Previous and Next buttons.
- **_Wishlist:_** Users can add or remove books from their wishlist. The wishlist status is stored locally in the browser, so it remains persistent even after page reloads.
- **_Dynamic Query Management:_** The app remembers the user’s search and filter preferences using localStorage. Upon reload, it applies the saved search and filter values automatically.

## Tech Stack 💻

- **HTML5**, **CSS3**, and **JavaScript**: Core technologies used for building the user interface and interaction.
- **Fetch API**: Used for fetching book data from the Gutendex Library.
- **LocalStorage**: To store user preferences (search terms, filters, and wishlist items).
- **Debounce**: Implemented for the search input to optimize API requests and improve performance.

## How it Works ⚙️

### Searching for Books:

- Users can input keywords in the search bar.
- Search requests are optimized using a **debouncer**, which delays the API calls to prevent multiple requests as the user types.

### Filtering Books:

- Users can filter books by selecting a genre from the dropdown list.
- The selected filter is applied dynamically and stored in **localStorage** for persistence across sessions.

### Wishlist:

- Users can click the heart icon to add/remove books from their wishlist.
- The wishlist is stored in **localStorage**, and icons are dynamically updated based on whether the book is in the wishlist or not.

### Pagination:

- The app displays **Previous** and **Next** buttons for navigation between pages.
- The app disables the **Previous** button on the first page and the **Next** button when no more results are available.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Jahid0178/Book-Gallery.git
```

Go to the project directory

```bash
  cd Books-Gallery
```

Start the server

```bash
  run Live Server
```
