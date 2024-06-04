//pubSub
const PubSub = (() => {
    //contain events[] with each method to load
    let events =  {
            
    }

    let getEvents = () => {
        let keys = Object.keys(events);
        keys.forEach(key=>{
            console.log(key);
        })
    }
    //subscribe a module to a certain event & accept a function
    let subscribe = (ev , fn) => {
        if(events[ev] == undefined){
            events[ev] = [];
            events[ev].push(fn);
        } 
        else {
            events[ev].push(fn);
        } 
    }
    //publish data an call all the modules who need it
    let publish = (ev , data) => {
        //call all the functions with value
        events[ev].forEach(fn => {
            fn(data);
        })
    }

    //emit an event and notify modules subscribed
    let emit = (eve) => {
        events[eve].forEach(fn=>{
            fn();
        })
    }

    return {
        subscribe , publish , emit , getEvents
    }
})





//brain pubSub pattern
const events = PubSub();

//modify User Section at Nav
const User = (() => {
    //user name 
    let _user = 'annonymus';
    // update #userNameText using _user var
    let _renderUsrName = () => {
        let element = document.querySelector('#userName');
        element.innerText = _user ;
    }
    // update _user variable & render it
    let setUsrName = (name) => {
        //check if name is defined
        _user = name +='@';
        _renderUsrName();
    }
    let init = () => {
        setUsrName(_user); 
    }
    //init module
    init();
});
//nav-bttn events
const NavBttns = (() => {
    let nav =  document.querySelector('#nav');
    //animate a bttn
    let animateBttn = (bttn , animationClass) => {
        //add animation
        if(!bttn.classList.contains(animationClass)){
            bttn.classList.add(animationClass);
        } else {
            //clone elemet 
            let clone  = bttn.cloneNode(true);
            //repleace it into parent
            bttn.parentElement.replaceChild(clone , bttn);
        }
        
    }
    //event to listen
    let setEvents = () => {
        nav.addEventListener('click' , eve=>{
            //click on bttns
            if(eve.target.id == 'addBttn' || eve.target.id == 'delBttn'){
                //animate bttn
                animateBttn(eve.target , "animate-bttn"); 

                //tell subscribers of eve to act
                if(eve.target.id == 'addBttn'){
                    events.emit('renderAddForm');
                }
                //tell subscribers of eve to act
                else if(eve.target.id =='delBttn'){
                    events.emit('renderDelForm');
                }
            }
        });
    }

    //init module
    let init = () => {
        setEvents();
    } 

    init();

});
//modify content 
const Content = (()=>{
    let content = document.querySelector('#content');
   
    //Data-management : 

    //storage form's input data on submit
    let data = {};
    //take forms data & publish under addBook || delBook event
    let getDataForm = (formId) => {
        //select form
        let form = document.querySelector(`#${formId}`);
        //get data after submit
        form.addEventListener('submit' , eve => {
            //stop submition for being triggered
            eve.preventDefault();
            //clean _data
            data = {} ;
            //get new data from inputs
            document.querySelectorAll('input').forEach(input=>{
                let value = input.value ; 
                let id = input.getAttribute('id');
                data[id] = value;
            })
            //get new data from textarea if there is one
            if(document.querySelector('textarea')){
                let textarea = document.querySelector('textarea');
                data[textarea.getAttribute('id')] = textarea.value;
            }

            //clean event listener
            let clone = form.cloneNode(true);
            form.parentElement.replaceChild(clone , form);

            //publish data
            if(formId == 'new-book-form'){
                events.publish('addBook' , data);
            } else if (formId == 'del-book-form'){
                events.publish('delBook' , data);
            }
            
            //clean content
            content.innerHTML = '';
        });
    };
    
    //render stuff
    let templates = {
        addBook :
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
                <button type = 'submit'class="bttn bttn--mediumSize bttn--greenTheme">Add to Collection</button>
            </div>    
            </form>`,
        delBook : 
            `<form id="del-book-form" action='#' method="#">
            <div class = 'form__section'>
                <label for="titel" class="form__section__label label--redTheme"> Title*</label>
                <input type="text" name="title" id="title">
            </div>
            <div class = "form__section">
                <button type = 'submit' class = "bttn bttn--mediumSize bttn--redTheme">Delete Book</button>
            </div> 
            </form>`,
        
    };
    let render = (component) =>{
        //clean
        content.innerText = '';
        //render component
        content.innerHTML = component;
    };
    let renderAddForm = () => {
        render(templates.addBook);
        getDataForm('new-book-form');
        
    };
    let renderDelForm = () => {
        render(templates.delBook);
        getDataForm('del-book-form');
    };
    let renderBookInfo = (obj) => {
        let bookInfo =
            `<div id = 'bookInfo'>
                <div class="bookInfo__section bookInfo__section--headers">
                    <p>Title:${obj.title}</p>
                    <p>Author:${obj.author}</p>
                    <p>Year:${obj.year}</p>
                </div>
                <div class = 'bookInfo__section bookInfo__section--content'>
                    <p>${obj.content}</p>
                </div>
            </div>`;
        render(bookInfo);
    }

    //init method
    let init = () => {
        events.subscribe('renderAddForm' , renderAddForm);
        events.subscribe('renderDelForm' , renderDelForm);
        events.subscribe('renderBookInf' , renderBookInfo)
    };

    init();
});
//modify aside
const Aside = (()=> {
 
   //add or del book component from container 
   //storage & delete each book data
   //share book data 
   
   //data-management
   let booksData = {} ;

   let setBookData = (obj) => {
        //get obj keys
        let keys = Object.keys(obj);

        //add newBookData to booksData
            //avoid reference error ,cant add properties to undefined
        booksData[obj.title] = {} ;
            //add data to new booksData.bookTitle
        keys.forEach(key => {
            let value = obj[key];
            booksData[obj.title][key] = value ;
        })
   }
   let delBookData = (bookTitle) => {
        let bookData = booksData[bookTitle];    
        delete bookData ;
   }

   //render stuff
   let collection = document.querySelector('#collection');

   let renderNewBook = (title) => {
        let component = 
        `<div class="collection__card card--layout" id = "${title}">
                <p>${title}</p>
        </div>`;

        collection.innerHTML += component;
   }
   let renderDelBook = (title) => {
        let book = document.querySelector(`#${title}`);
        book.parentElement.removeChild(book);
   }

   //events listeners
   let eve = () => {
        collection.addEventListener('click' , eve => {
            if(eve.target.classList.contains('collection__card')){
                //get book id 
                let bookId = eve.target.getAttribute('id');
                //publish it
                events.publish("renderBookInf" , booksData[bookId]);
            }
        });
   }

   let init = () => {
        //subscribe to addBook
        //subscribe to deleteBook
        events.subscribe('addBook' , (obj)=>{
            setBookData(obj);
            renderNewBook(obj.title);
        });
        events.subscribe('delBook' , (obj)=>{
            delBookData(obj.title);
            renderDelBook(obj.title);
        })
        //events liseners
        eve();
        //render test book
        setBookData({
            title : 'test' ,
            year : 2024 ,
            author : 'me' ,
            content : "lore lore upsu"
        });
        renderNewBook('test');

        //publish to renderBookInfo if book is click on
        
   }

   init();
      
});





//// 
const user = User();
const navBttns = NavBttns();
const content = Content();
const aside = Aside();


