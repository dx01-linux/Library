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
    createBook :function(title , content ){
        //set data
        this.books[title] = {} ;
        this.books[title].title = title ;
        this.books[title].content = content;
        //set and add html tag to aside 
        let parent = document.querySelector('#aside').firstElementChild;
        
        let div = document.createElement('div');
        setAttributes(div , {class: 'book' , id : title});
        let p = document.createElement('p');
        setAttributes(p , {innerText :  title});
  
        //append to aside
        div.appendChild(p) 
        parent.appendChild(div);

    } ,
    createNewBookForm: function(){
        //set form 
        let form = document.createElement('form');
        setAttributes(form , {id : 'new-book-form' , method:'get' , action:'#'});

            //create divs
        let fieldDivs = [];
        ["Title" , "Description" , "Submit"].forEach(str =>{
            let div = document.createElement('div');
            div.setAttribute('id' , str);
            fieldDivs.push(div);
        });
            //field divs 
        fieldDivs.forEach(div =>{
            if(div.getAttribute("id") == 'Title' || div.getAttribute("id") == 'Description'){
                //label set
                let label = document.createElement('label');
                label.innerText = div.getAttribute('id');
                div.appendChild(label);

                if(div.getAttribute("id") == 'Title'){
                    let input = document.createElement("input");
                    input.setAttribute('id' , 't');
                    label.setAttribute('for' , 't');
                    div.appendChild(input);
                } else {
                    let textArea = document.createElement("textarea");
                    textArea.setAttribute('id' , 'ta');
                    label.setAttribute('for' , 'ta');
                    div.appendChild(textArea);
                }
            } else {
                let submit = document.createElement('button');
                setAttributes(submit , {innerText:"Add" , type : 'submit'});
                div.appendChild(submit);
            }
        });

            // append them
        fieldDivs.forEach(div=>{
            form.appendChild(div);
        });

            //append form to content
        let content = document.querySelector("#content");
        content.innerText = ''; 
        content.appendChild(form);
        
        return document.querySelector('#new-book-form');
       
    },
    showBookInfo:function(id){
        
        //component
        let div = document.createElement('div');
        div.setAttribute('id' , 'bookInfo');
        let h1 = document.createElement('h1');
        h1.innerText = this.books[id].title;
        div.appendChild(h1);
        let p = document.createElement('p');
        p.innerText = this.books[id].content;
        div.appendChild(p);

        //clean #content 
        document.querySelector("#content").innerText = '';
        //append it
        document.querySelector("#content").appendChild(div);
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
    setEventListeners: function () {
        //switch between light & dark mode  
        let backgroundModeIcon = document.querySelector("#backgroundMode");
        backgroundModeIcon.addEventListener('click', eve => {
            this.switchBackgroundMode(eve.target);
        });

        //add new book
        let addBttn = document.querySelector('#addBttn');  
        addBttn.addEventListener('click' , eve => {
        
            this.createNewBookForm().addEventListener('submit' , eve =>{
                //stop submition
                let form = document.querySelector('#new-book-form');
                eve.preventDefault();

                let inputs = {} ;
                ['Title' , 'Description'].forEach(str => {
                    inputs[str] = document.querySelector(`#${str}`).lastElementChild;
                })
                
                //clone values avoiding reference problems when content being clean
                this.createBook(inputs.Title.value , inputs.Description.value);
                
                //empty content
                document.querySelector('#content').innerText = '';
            });

        });

        //show book info after aside's card was clicked on
        document.querySelector('#aside').firstElementChild.addEventListener('click' , eve=>{
            if(eve.target.getAttribute('class') == 'book'){
                this.showBookInfo(eve.target.getAttribute('id'));
            }
        });

    },

}

app.setEventListeners();
