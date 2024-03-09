document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });

    const books = [];
    const RENDER_EVENT = 'render-book';

    function addBook() {
        const textBook1 = document.getElementById('inputBookTitle').value;
        const textBook2 = document.getElementById('inputBookAuthor').value;
        const timestamp = document.getElementById('inputBookYear').value;
        const isComplete = document.getElementById('inputBookIsComplete').checked;

        const generatedID = generateId();
        const bookObject = generateBookObject(generatedID, textBook1, textBook2, timestamp, isComplete);
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
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
        }
    }

    // Function to mark book as incomplete
    function markAsIncomplete(bookId) {
        const index = books.findIndex(book => book.id === bookId);
        if (index !== -1) {
            books[index].isComplete = false;
            document.dispatchEvent(new Event(RENDER_EVENT));
        }
    }

    // Function to remove book from list
    function removeBook(bookId) {
        const index = books.findIndex(book => book.id === bookId);
        if (index !== -1) {
            books.splice(index, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
        }
    }
});