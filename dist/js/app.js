class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  // Create Books List
  createList(book) {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td class="t">${book.title}</td>
    <td class="a">${book.author}</td>
    <td class="i">${book.isbn}</td>
    <td><a href="#" class="remove">X</a></td>
    `;
    document.getElementById("tbody").appendChild(row);
  }

  // Clear Fields after Submit
  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }

  // alert Message
  showMessage(msg, color) {
    const alert = document.createElement("div");
    alert.innerHTML = msg;
    alert.className = "alert";
    alert.style.background = color;
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(alert, form);

    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  // Remove Book from List
  removeIcon(target) {
    const element = target.parentElement.parentElement;
    const title = element.querySelector(".t").innerHTML;
    const author = element.querySelector(".a").innerHTML;
    const isbn = element.querySelector(".i").innerHTML;

    const s = new Store();
    target.parentElement.parentElement.remove();
    s.removeFromStorage(title, author, isbn);
  }
}

class Store {
  // load from the Storage at the begining
  loadFromStorage() {
    if (localStorage.getItem("books") !== null) {
      let books = JSON.parse(localStorage.getItem("books"));
      const ui = new UI();
      books.forEach(function(book) {
        ui.createList(book);
      });
    }
  }

  // store Book to LocalStorage
  setItem(book) {
    let books;

    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  // remove from the storage
  removeFromStorage(t, author, isbn) {
    let books = JSON.parse(localStorage.getItem("books"));
    books.forEach(function(book, index) {
      if (book.title === t && book.author === author && book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Load the book list at the begining
new Store().loadFromStorage();

//  get detailes of the book
document.getElementById("book-form").addEventListener("submit", function(e) {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;
  const ui = new UI();
  if (title === "" || author === "" || isbn === "") {
    ui.showMessage("Please fill the fields", "red");
  } else {
    const book = new Book(title, author, isbn);
    const s = new Store();
    s.setItem(book);
    ui.createList(book);
    ui.showMessage("Book Added!", "green");
    ui.clearFields();
  }

  e.preventDefault();
});

// remove
document
  .querySelector("#book-list tbody")
  .addEventListener("click", function(e) {
    if (e.target.className === "remove") {
      const ui = new UI();
      ui.removeIcon(e.target);
    }
    e.preventDefault();
  });
