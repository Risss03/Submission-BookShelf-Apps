document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });

    const serachForm = document.getElementById('searchBook');
    serachForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchBook();
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function searchBook() {
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const filterBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));

    const uncompletedBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    uncompletedBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for (const bookItem of filterBooks) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
            uncompletedBookshelfList.append(bookElement);
        } else {
            completeBookshelfList.append(bookElement)
        }
    }
}





const books = [];
const RENDER_EVENT = 'render-book';

function addBook() {
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const year = parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textTitle, textAuthor, year, isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBookshelfList = document.getElementById('incompleteBookshelfList');
    uncompletedBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
            uncompletedBookshelfList.append(bookElement);
        } else {
            completeBookshelfList.append(bookElement);
        }
    }
});

// Function to create book element
function makeBook(bookObject) {
    const article = document.createElement('article');
    article.classList.add('book_item');

    const h3Title = document.createElement('h3');
    h3Title.innerText = bookObject.title;

    const pAuthor = document.createElement('p');
    pAuthor.innerHTML = `Penulis: ${bookObject.author}`;

    const pYear = document.createElement('p');
    pYear.innerHTML = `Tahun: ${bookObject.year}`;

    const divAction = document.createElement('div');
    divAction.classList.add('action');

    if (!bookObject.isComplete) {
        const buttonComplete = document.createElement('button');
        buttonComplete.classList.add('green');
        buttonComplete.innerText = 'Selesai dibaca';
        buttonComplete.addEventListener('click', function() {
            markAsComplete(bookObject.id);
        });
        divAction.appendChild(buttonComplete);
    } else {
        const buttonIncomplete = document.createElement('button');
        buttonIncomplete.classList.add('green');
        buttonIncomplete.innerText = 'Belum selesai dibaca';
        buttonIncomplete.addEventListener('click', function() {
            markAsIncomplete(bookObject.id);
        });
        divAction.appendChild(buttonIncomplete);
    }

    const buttonRemove = document.createElement('button');
    buttonRemove.classList.add('red');
    buttonRemove.innerText = 'Hapus buku';
    buttonRemove.addEventListener('click', function() {
        removeBook(bookObject.id);
    });
    divAction.appendChild(buttonRemove);

    article.appendChild(h3Title);
    article.appendChild(pAuthor);
    article.appendChild(pYear);
    article.appendChild(divAction);

    return article;
}

// Function to mark book as complete
function markAsComplete(bookId) {
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        books[index].isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

// Function to mark book as incomplete
function markAsIncomplete(bookId) {
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        books[index].isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

// Function to remove book from list
function removeBook(bookId) {
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}


function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist() {
    if (typeof(storage) === undefined) {
        alert('Browser ini tidak mendukung local storage');
        return false;
    }

    return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}