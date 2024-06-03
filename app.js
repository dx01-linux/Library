function setAttributes(tag, atributes = { id: 'an id', class: 'a class name' }) {
    let keys = Object.keys(atributes);
    for (key of keys) {
        if (key != 'innerText') {
            tag.setAttribute(key, atributes[key]);
        }
        //exceptions
        else {
            //inner Text
            if (key == 'innerText') {
                tag.innerText = atributes[key];
            }
            //class name , use class atribute in atributes object
            else if (key == 'class') {
                tag.classList.add(atributes[key]);
            }
        }
    }
}

const app = {
    books: {

    },
    //utilities
    setBook: function (title, author , year , content ) {
        //set data
        this.books[title] = {};
        this.books[title].title = title;
        this.books[title].author = author;
        this.books[title].year = year ;
        this.books[title].content = content;
        //set and add html tag to aside 
        let parent = document.querySelector('#aside').lastElementChild;

        //component 
        let component =
            `<div class="collection__card card--layout" id = "${title}">
                <p>${title}</p>
            </div>`;

        parent.innerHTML += component;

    },
    setNewBookForm: function () {
        //set form
        let component =
            `<form action="#" method = "get" id="new-book-form">
            <div class="form__section">
                    <label for="title" class="form__section__label label--greenTheme">Title*</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="title" 
                        placeholder="Title*"
                        required
                    >
            </div>
            <div class="form__section">
                    <label for="title" class="form__section__label label--greenTheme">Year*</label>
                    <input 
                        type="text" 
                        name="year" 
                        id="year"
                        placeholder="Year*" 
                        required
                    >
            </div>
            <div class="form__section">
                    <label for="author" class="form__section__label label--greenTheme">Author*</label>
                    <input 
                        type="text" 
                        name="autor" 
                        id="author"
                        placeholder="Author*" 
                        required
                    >
            </div>
            <div class="form__section">
                <label for="description" class="form__section__label label--greenTheme">Description*</label>
                <textarea 
                    type="text" 
                    name="description" 
                    id="description" 
                    placeholder="Description*"
                    required       
                >
                </textarea>
            </div>
            <div class="form__section">
                <button class="bttn bttn--mediumSize bttn--greenTheme">Add to Collection</button>
            </div>    
        </form>`;

        //append form to content
        let content = document.querySelector("#content");
        content.innerText = '';
        content.innerHTML = component;

        return document.querySelector('#new-book-form');
    },
    setDelBookForm: function () {
        //component
        let component = 
        `<form id="del-book-form">
        <div class = 'form__section'>
            <label for="titel" class="form__section__label label--redTheme"> Title*</label>
            <input type="text" name="title" id="title">
        </div>
        <div class = "form__section">
            <button class = "bttn bttn--mediumSize bttn--redTheme">Delete Book</button>
        </div> 
        </form>`;
        //add to doom
        let content = document.querySelector('#content');
        content.innerText = '';
        content.innerHTML = component;

        return document.querySelector('#del-book-form');
    },
    switchBackgroundMode: function (tag) {
        //what mode is right now , what mode should change
        function mode(tag) {
            if (tag.classList.contains('fa-moon')) {
                return 'dark';
            }
            else if (tag.classList.contains('fa-sun')) {
                return 'light';
            }
        }
        function switchCssVal(element, val, value) {
            element.style.setProperty(val, value);
        }
        function switchFontAwesomeIconClass(element, oldClass, newClass) {
            if (element.classList.contains(oldClass)) {
                element.classList.remove(oldClass);
            }
            element.classList.add(newClass);
        }

        const root = document.querySelector(':root');

        if (mode(tag) == "light") {
            //change background
            switchCssVal(root, "--background-color", 'white');
            //change font color 
            switchCssVal(root, '--fontColor', "black");
            //switch icon 
            switchFontAwesomeIconClass(tag, 'fa-sun', 'fa-moon');
        }
        else if (mode(tag) == 'dark') {
            //change background
            switchCssVal(root, "--background-color", 'black');
            //change font color 
            switchCssVal(root, '--fontColor', "gray")
            //switch icon 
            switchFontAwesomeIconClass(tag, 'fa-moon', 'fa-sun');
        }
    },

    //methods for events
    showBookInfo: function (id) {
        //set component
        let component = `
        <div id = 'bookInfo'>
            <div class="bookInfo__section bookInfo__section--headers">
                <p>Title:${this.books[id].title}</p>
                <p>Author:${this.books[id].author}</p>
                <p>Year:${this.books[id].year}</p>
            </div>
            <div class = 'bookInfo__section bookInfo__section--content'>
                <p>${this.books[id].content}</p>
            </div>
        </div>
        `;
        //clean #content 
        document.querySelector("#content").innerText = '';
        //append it
        document.querySelector("#content").innerHTML = component;
    },
    addBook: function () {
        this.setNewBookForm().addEventListener('submit', eve => {
            //stop submition
            eve.preventDefault();
            //get and save form input values
            let inputs = {};
            ['title', 'description' , 'year' , 'author'].forEach(str => {
                inputs[str] = document.querySelector(`#${str}`);
            })
            //create new book 
            this.setBook(inputs.title.value, inputs.author.value , inputs.year.value , inputs.description.value);

            //empty content
            document.querySelector('#content').innerText = '';
        });
    },
    delBook: function () {
        this.setDelBookForm().addEventListener('submit', eve => {
            //stop submition
            eve.preventDefault();

            //if book exist remove from books object and aside 
            let title = document.querySelector('#title');
            if (this.books[title.value] != undefined) {
                // then remove for aside 
                let asideBook = document.querySelector(`#${title.value}`);
                asideBook.parentElement.removeChild(asideBook);
                //then remove from books
                delete this.books[title.value];
            }
            //empty content
            document.querySelector('#content').innerText = '';
            
        });
    },
    setEventListeners: function () {

        let nav = document.querySelector('#nav');
        let aside = document.querySelector('#aside');
        let content = document.querySelector('#content');

        //navigation var events
        nav.addEventListener('click', eve => {
            switch (eve.target.id) {
                //add book
                case "addBttn":
                    this.addBook();
                    break;
                //switch background mode 
                case 'backgroundMode':
                    this.switchBackgroundMode(eve.target);
                    break;
                //del book
                case 'delBttn':
                    this.delBook();
                    break;
            }
        })

        //main-> aside events
        aside.addEventListener('click', eve => {
            if(eve.target.classList.contains("collection__card")) {
                //show book info
                this.showBookInfo(eve.target.getAttribute('id'));
            }
        });

        // main-> content events
        content.addEventListener("click", eve => {

        })
    },

}
app.setEventListeners();

//example book
let content = 
`Robin Hood is a legendary heroic outlaw originally depicted in English folklore and subsequently featured in literature, theatre, and cinema. According to legend, he was a highly skilled archer and swordsman.[1] In some versions of the legend, he is depicted as being of noble birth, and in modern retellings he is sometimes depicted as having fought in the Crusades before returning to England to find his lands taken by the Sheriff. In the oldest known versions, he is instead a member of the yeoman class. Traditionally depicted dressed in Lincoln green, he is most famous for his attribute of stealing from the rich to give to the poor.
Through retellings, additions, and variations, a body of familiar characters associated with Robin Hood has been created. These include his lover, Maid Marian; his band of outlaws, the Merry Men; and his chief opponent, the Sheriff of Nottingham. The Sheriff is often depicted as assisting Prince John in usurping the rightful but absent King Richard, to whom Robin Hood remains loyal. He became a popular folk figure in the Late Middle Ages, and his partisanship of the common people and opposition to the Sheriff are some of the earliest-recorded features of the legend, whereas his political interests and setting during the Angevin era developed in later centuries. The earliest known ballads featuring him are from the 15th century.
There have been numerous variations and adaptations of the story over the subsequent years, and the story continues to be widely represented in literature, film, and television media today. Robin Hood is considered one of the best-known tales of English folklore. In popular culture, the term "Robin Hood" is often used to describe a heroic outlaw or rebel against tyranny.
The origins of the legend as well as the historical context have been debated for centuries. There are numerous references to historical figures with similar names that have been proposed as possible evidence of his existence, some dating back to the late 13th century. At least eight plausible origins to the story have been mooted by historians and folklorists, including suggestions that "Robin Hood" was a stock alias used by or in reference to bandits.`;
let title = 'Robin Hood';
let author = 'Anonymous balladeers';
let year = '1300';
app.setBook(title, author , year , content);