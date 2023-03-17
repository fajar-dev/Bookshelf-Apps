function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isComplete = document.getElementById("isComplete").checked;
  const book = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
  const bookshelfList = isComplete
    ? document.getElementById("completeBookshelfList")
    : document.getElementById("incompleteBookshelfList");
  const bookRow = bookshelfList.insertRow();
  bookRow.setAttribute("data-id", book.id);
  bookRow.innerHTML = `
    <td>${book.title}</td>
    <td><small class="text-muted">${book.author}</small></td>
    <td><small class="text-muted">${book.year}</small></td>
    <td>
      <button class="moveButton btn btn-warning p-1 m-1">Pindahkan</button><br />
      <button class="deleteButton btn btn-danger p-1 m-1">Hapus</button>
    </td>
  `;
  const moveButton = bookRow.querySelector(".moveButton");
  moveButton.addEventListener("click", () => {
    moveBook(book.id, bookshelfList);
    saveBookshelf();
  });
  const deleteButton = bookRow.querySelector(".deleteButton");
  deleteButton.addEventListener("click", () => {
    deleteBook(book.id, bookRow);
    saveBookshelf();
  });
}

function moveBook(id, bookshelfList) {
  const bookRow = bookshelfList.querySelector(`[data-id="${id}"]`);
  const isComplete = bookshelfList === document.getElementById("completeBookshelfList");
  const newBookshelfList = isComplete ? document.getElementById("incompleteBookshelfList") : document.getElementById("completeBookshelfList");
  const newBookRow = newBookshelfList.insertRow();
  newBookRow.setAttribute("data-id", id);
  newBookRow.innerHTML = bookRow.innerHTML;
  bookshelfList.deleteRow(bookRow.rowIndex);
  const moveButton = newBookRow.querySelector(".moveButton");
  moveButton.addEventListener("click", () => {
  moveBook(id, newBookshelfList);
  saveBookshelf();
  });
  const deleteButton = newBookRow.querySelector(".deleteButton");
  deleteButton.addEventListener("click", () => {
  deleteBook(id, newBookRow);
  saveBookshelf();
  });
}

function deleteBook(id, bookRow) {
const bookshelfList = bookRow.parentNode;
bookshelfList.deleteRow(bookRow.rowIndex);
saveBookshelf();
}

function renderBookshelf() {
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  const books = JSON.parse(localStorage.getItem("books")) || [];
  for (const book of books) {
  const bookRow = document.createElement("tr");
  bookRow.setAttribute("data-id", book.id);
  bookRow.innerHTML = `
    <td>${book.title}</td>
    <td><small class="text-muted">${book.author}</small></td>
    <td><small class="text-muted">${book.year}</small></td>
    <td class="text-right">
      <button class="moveButton btn btn-warning p-1 m-1">Pindahkan</button><br />
      <button class="deleteButton btn btn-danger p-1 m-1">Hapus</button>
    </td>
  `;
  const bookshelfList = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
  bookshelfList.appendChild(bookRow);
  const moveButton = bookRow.querySelector(".moveButton");
  moveButton.addEventListener("click", () => {
    moveBook(book.id, bookshelfList);
    saveBookshelf();
  });
  const deleteButton = bookRow.querySelector(".deleteButton");
  deleteButton.addEventListener("click", () => {
    deleteBook(book.id, bookRow);
    saveBookshelf();
  });
  }
}

function saveBookshelf() {
const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
const completeBookshelfList = document.getElementById("completeBookshelfList");
const books = [];
for (const bookRow of incompleteBookshelfList.rows) {
const book = {
  id: bookRow.getAttribute("data-id"),
  title: bookRow.cells[0].textContent,
  author: bookRow.cells[1].textContent,
  year: bookRow.cells[2].textContent,
  isComplete: false,
};
// console.log( bookRow.cells[0].textContent)
books.push(book);
}

for (const bookRow of completeBookshelfList.rows) {
const book = {
  id: bookRow.getAttribute("data-id"),
  title: bookRow.cells[0].textContent,
  author: bookRow.cells[1].textContent,
  year: bookRow.cells[2].textContent,
  isComplete: true,
};
books.push(book);
}
localStorage.setItem("books", JSON.stringify(books));
}

const form = document.getElementById("form");
form.addEventListener("submit", (event) => {
event.preventDefault();
addBook();
saveBookshelf();
form.reset();
});
renderBookshelf();