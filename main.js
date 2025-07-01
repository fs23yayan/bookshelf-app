// Kunci untuk localStorage
const STORAGE_KEY = 'BOOKSHELF_APPS';

// Fungsi untuk memeriksa apakah localStorage didukung oleh browser
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser Anda tidak mendukung local storage');
    return false;
  }
  return true;
}

// Fungsi untuk menyimpan data buku ke localStorage
function saveData(books) {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

// Fungsi untuk memuat data buku dari localStorage
function loadDataFromStorage() {
  if (isStorageExist()) {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
      return data;
    }
  }
  return []; // Mengembalikan array kosong jika tidak ada data
}

// Array untuk menyimpan semua buku
let books = loadDataFromStorage();

// Fungsi untuk membuat objek buku baru
function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
}

// Fungsi untuk menemukan indeks buku berdasarkan ID
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// Fungsi untuk menemukan buku berdasarkan ID
function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

// Fungsi untuk menampilkan buku di rak yang sesuai
function renderBooks() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  // Bersihkan rak buku sebelum merender ulang
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book-item'); // Tambahkan kelas untuk styling
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');

    const titleElement = document.createElement('h3');
    titleElement.setAttribute('data-testid', 'bookItemTitle');
    titleElement.innerText = book.title;

    const authorElement = document.createElement('p');
    authorElement.setAttribute('data-testid', 'bookItemAuthor');
    authorElement.innerText = `Penulis: ${book.author}`;

    const yearElement = document.createElement('p');
    yearElement.setAttribute('data-testid', 'bookItemYear');
    yearElement.innerText = `Tahun: ${book.year}`;

    const buttonContainer = document.createElement('div');

    const toggleCompleteButton = document.createElement('button');
    toggleCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    toggleCompleteButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    toggleCompleteButton.addEventListener('click', function() {
      toggleBookCompletion(book.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.innerText = 'Hapus Buku';
    deleteButton.addEventListener('click', function() {
      deleteBook(book.id);
    });

    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.innerText = 'Edit Buku';
    // Untuk saat ini, tombol edit tidak memiliki fungsionalitas penuh
    // Anda bisa menambahkan fungsionalitas edit di sini jika diperlukan
    editButton.addEventListener('click', function() {
      alert('Fungsionalitas edit belum diimplementasikan.');
    });


    buttonContainer.append(toggleCompleteButton, deleteButton, editButton);
    bookElement.append(titleElement, authorElement, yearElement, buttonContainer);

    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}

// Fungsi untuk menambahkan buku baru
function addBook() {
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;
  const id = +new Date(); // Menggunakan timestamp sebagai ID unik

  const newBook = generateBookObject(id, title, author, year, isComplete);
  books.push(newBook);
  saveData(books);
  renderBooks();
}

// Fungsi untuk mengubah status selesai/belum selesai buku
function toggleBookCompletion(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = !bookTarget.isComplete;
  saveData(books);
  renderBooks();
}

// Fungsi untuk menghapus buku
function deleteBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;

  books.splice(bookIndex, 1);
  saveData(books);
  renderBooks();
}

// Event listener untuk submit form tambah buku
document.addEventListener('DOMContentLoaded', function() {
  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
    bookForm.reset(); // Reset form setelah submit
  });

  // Event listener untuk form pencarian buku
  const searchBookForm = document.getElementById('searchBook');
  searchBookForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
    filterBooks(searchTerm);
  });

  // Render buku saat halaman pertama kali dimuat
  renderBooks();
});

// Fungsi untuk memfilter buku berdasarkan judul
function filterBooks(searchTerm) {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  const allBookItems = document.querySelectorAll('[data-testid="bookItem"]');

  allBookItems.forEach(item => {
    const title = item.querySelector('[data-testid="bookItemTitle"]').innerText.toLowerCase();
    if (title.includes(searchTerm)) {
      item.style.display = 'block'; // Tampilkan buku jika cocok
    } else {
      item.style.display = 'none'; // Sembunyikan buku jika tidak cocok
    }
  });

  // Jika search term kosong, tampilkan semua buku
  if (searchTerm === '') {
    renderBooks();
  }
}

// Tambahkan styling dasar (opsional, bisa dipindahkan ke file CSS terpisah)
const style = document.createElement('style');
style.innerHTML = `
  body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
    color: #333;
  }
  header {
    background-color: #4CAF50;
    color: white;
    padding: 15px 0;
    text-align: center;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  main {
    max-width: 900px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  h1, h2 {
    color: #333;
    text-align: center;
    margin-bottom: 20px;
  }
  form div {
    margin-bottom: 15px;
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  input[type="text"],
  input[type="number"] {
    width: calc(100% - 20px);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  input[type="checkbox"] {
    margin-right: 10px;
  }
  button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-right: 10px;
  }
  button:hover {
    background-color: #45a049;
  }
  .book-item {
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  .book-item h3 {
    margin-top: 0;
    color: #007bff;
  }
  .book-item p {
    margin-bottom: 5px;
  }
  .book-item div button {
    margin-top: 10px;
    padding: 8px 12px;
    font-size: 14px;
  }
  [data-testid="bookItemIsCompleteButton"] {
    background-color: #007bff;
  }
  [data-testid="bookItemIsCompleteButton"]:hover {
    background-color: #0056b3;
  }
  [data-testid="bookItemDeleteButton"] {
    background-color: #dc3545;
  }
  [data-testid="bookItemDeleteButton"]:hover {
    background-color: #c82333;
  }
  [data-testid="bookItemEditButton"] {
    background-color: #ffc107;
    color: #333;
  }
  [data-testid="bookItemEditButton"]:hover {
    background-color: #e0a800;
  }
`;
document.head.appendChild(style);
