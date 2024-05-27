function setAttributes (tag , atributes = { id : 'an id' , class : 'a class name'}) {
    let keys = Object.keys(atributes);
    for(key of keys ){
        if(key != 'innerText'){
            tag.setAttribute(key , atributes[key]);
        } 
        //exceptions
        else {
            //inner Text
            if(key == 'innerText'){
                tag.innerText = atributes[key];
            } 
            //class name , use class atribute in atributes object
            else if (key == 'class'){
                tag.classList.add(atributes[key]);
            }
        }
    }
}

const app = {
    books : {

    } ,
    //utilities
    setBook :function(title , content){
        //set data
        this.books[title] = {} ;
        this.books[title].title = title ;
        this.books[title].content = content;
        //set and add html tag to aside 
        let parent = document.querySelector('#aside').firstElementChild;

       //component 
        let component = 
        `   <div class="book" id = "${title}">
                <p>${title}</p>
            </div>
        `;

        parent.innerHTML += component;

    } ,
    setNewBookForm: function(){
            //set form
        let component = 
        `
        <form action="#" method="get" id = 'new-book-form'>
            <div id = 'Title'>
                <label for="title"> Title* </label>
                <input type="text" id = 'title' required>
            </div>
            <div id = 'Description'>
                <label for="desc"> Description* </label>
                <textarea id="desc" required></textarea>
            </div>
            <div id = 'Submit'>
                <button type = 'submit'>Add</button>
            </div>
        </form>
        `;

            //append form to content
        let content = document.querySelector("#content");
        content.innerText = ''; 
        content.innerHTML = component ;
        
        return document.querySelector('#new-book-form'); 
    },
    setDelBookForm : function(){
        //component
        let component = `
        <form action="#" method="#" id = 'del-book-form'>
            <div>
                <label for="title"> Title* </label>
                <input type="text" id = 'title'>
            </div>
            <div>
                <button type = 'submit'>Delete Book</button>
            </div>
            <div>
                <p>Caution book will be erased*</p>
            </div>
        </form>
        `;
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
    showBookInfo:function(id){
        //set component
        let component = `
            <div id = 'bookInfo'>
                <h1>${this.books[id].title}</h1>
                <p>${this.books[id].content}</p>
            </div>
        `;
        //clean #content 
        document.querySelector("#content").innerText = '';
        //append it
        document.querySelector("#content").innerHTML = component;
    },
    addBook : function(){
        this.setNewBookForm().addEventListener('submit' , eve =>{
            //stop submition
            eve.preventDefault();
            //get and save form input values
            let inputs = {} ;
            ['Title' , 'Description'].forEach(str => {
                inputs[str] = document.querySelector(`#${str}`).lastElementChild;
            })
            //create new book 
            this.setBook(inputs.Title.value , inputs.Description.value);
        
            //empty content
            document.querySelector('#content').innerText = '';
        });
    },
    delBook : function(){
        this.setDelBookForm().addEventListener('submit' , eve =>{
            //stop submition
            eve.preventDefault();
            
            //if book exist remove from books object and aside 
            let title = document.querySelector('#title');
            if(this.books[title.value] != undefined){
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
        let aside =  document.querySelector('#aside');
        let content =  document.querySelector('#content');

        //navigation var events
        nav.addEventListener('click' , eve =>{
            switch(eve.target.id){
                //add book
                case "addBttn" :
                    this.addBook();
                break;
                //switch background mode 
                case 'backgroundMode' :
                    this.switchBackgroundMode(eve.target);
                break;
                //del book
                case 'delBttn':
                    this.delBook();
                break;
            }
        })

        //main-> aside events
        aside.addEventListener('click' , eve =>{
            switch(eve.target.getAttribute('class')){
                //show book info 
                case  'book' :
                    this.showBookInfo(eve.target.getAttribute('id'));
                break;
            }
        });

        // main-> content events
        content.addEventListener("click" , eve =>{

        })
    },

}

app.setEventListeners();
