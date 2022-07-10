let search = document.getElementById("search");
let searchBy = document.getElementById("searchBy");
let searchBtn = document.getElementById("searchBtn");
let cardsContainer = document.getElementsByClassName("cards-container")[0];
let loader = document.getElementsByClassName("loader-container")[0];
// pegination 
let resultNum = document.getElementById("resultNum");
let prevPage = document.getElementById("prevPage");
let nextPage = document.getElementById("nextPage");
let pageNum = document.getElementById("pageNum");
// add additional data to HTML element
//1 in HTML -> data-index="some value"
//2 in DOM get-> dataset.index => "some value"

prevPage.addEventListener("click", function () {
     if (!Number(pageNum.dataset.index)) {
          return;
     }
     pageNum.innerText = Number(pageNum.innerText) - 1;
     pageNum.dataset.index = Number(pageNum.dataset.index) - 10;
     fetchData();

})
nextPage.addEventListener("click", function () {
     pageNum.innerText = Number(pageNum.innerText) + 1;
     pageNum.dataset.index = Number(pageNum.dataset.index) + 10;
     fetchData();

})

searchBtn.addEventListener("click", function () {
     pageNum.innerText = 1;
     pageNum.dataset.index = 0;
     fetchData();

});


function addloader() {
     let loaderWrapper = document.createElement("div");
     loaderWrapper.className = "loader-container";
     let loader = document.createElement("div");
     loader.className = "loader";
     loaderWrapper.append(loader);
     return loaderWrapper;
}



function fetchData() {
     // 1. clear wrapper and add loading animation
     cardsContainer.innerHTML = "";
     let loader = addloader();
     cardsContainer.append(loader);

     let inputText = search.value;
     let qParam = `in${searchBy.value}`; //title / author / publisher

     // 2. Fetch url validation !!!! CARE with SPACE char
     if (typeof inputText == 'undefined' || inputText.length < 3) {
          alert(`You have to enter min 3 chars to search!`);
          return;
     }
     console.log(`input:${inputText}`);
     console.log(`qParam:${qParam}`);
     console.log(`(for pagination)data.index:${pageNum.dataset.index}`);
     // fix searching title need "" because of ENCODING SPACE 
     if (qParam == "intitle") {
          inputText = `\"${inputText}\"`;
          console.log(`!!! ${inputText}`);
     }
     else if (inputText.includes(" ")) {
          inputText = inputText.replaceAll(" ", "-")
     }
     // 3 fetch data
     fetch(`https://www.googleapis.com/books/v1/volumes?q=${qParam}:${inputText}&printType=books&startIndex=${pageNum.dataset.index}&maxResults=10`)
          .then(res => res.json())
          .then(data => {
               console.log(data);
               // print total result
               resultNum.innerText = `${data.kind.slice(6)} ${data.totalItems}`;

               if (data.totalItems == 0) {
                    let notfound = document.createElement("div");
                    notfound.innerText = `Sorry, there isn't any valume with "${inputText}" ${searchBy.value}`;
                    notfound.className = "notFound";
                    cardsContainer.append(notfound);
                    return;
               }
               // add curr card
               for (let i = 0; i < data.items.length; i++) {
                    let currBook = data.items[i];
                    createAppendCard(currBook);
               }
          })
          .then(() => {
               // clear loading animation
               loader.remove();;

          }
          )
}

function createAppendCard(currBook) {
     let title = currBook.volumeInfo.title;
     let authors = currBook.volumeInfo.authors;
     if (Array.isArray(authors)) {
          authors = authors.join(", ");
     }
     else if (authors == 'undefined') {
          authors = "no infromation";
     }

     let description = currBook.volumeInfo.description;
     let year = currBook.volumeInfo.publishedDate;
     let fetchSrc = currBook.volumeInfo.imageLinks;
     if (!fetchSrc) {
          fetchSrc = "https://storiavoce.com/wp-content/plugins/lightbox/images/No-image-found.jpg";
     }
     else {
          fetchSrc = currBook.volumeInfo.imageLinks["thumbnail"];
     }

     let src = fetchSrc ? fetchSrc : "none";

     let cardContainer = document.createElement("div");
     cardContainer.className = "card";

     let cardImg = document.createElement("img");
     cardImg.src = src;
     cardImg.className = "card-img";

     let cardBodyDesc = document.createElement("div");
     cardBodyDesc.className = "card-title-desc";

     let cardTitle = document.createElement("h5");
     cardTitle.className = "card-title";
     cardTitle.innerText = title;

     let cardText = document.createElement("p");
     cardText.className = "card-text";
     cardText.innerText = description ? description : "no description";


     cardBodyDesc.append(cardTitle, cardText);

     let cardUl = document.createElement("ul");
     cardUl.className = "card-author-year";
     let cardYear = document.createElement("li");
     cardYear.innerText = "year: " + (year ? year.slice(0, 4).trim() : "-");
     let cardAuthor = document.createElement("li");
     cardAuthor.innerText = "author: " + (authors ? authors.trim() : "-");
     cardUl.append(cardAuthor, cardYear);

     let cardLinksContainer = document.createElement("div");
     cardLinksContainer.className = "card-buttons";
     let cardLink1 = document.createElement("button");
     cardLink1.className = "card-link";
     cardLink1.innerText = "Like";

     let cardLink2 = document.createElement("button");
     cardLink2.innerText = "Dislike";

     cardLinksContainer.append(cardLink1, cardLink2);

     cardContainer.append(cardImg, cardBodyDesc, cardUl, cardLinksContainer)

     cardsContainer.append(cardContainer)
}

// hash ruter
let wrapper = document.getElementById("wrapper");
let searchContainer = document.getElementById("search-container");
window.addEventListener("hashchange", function () {

     let hash = location.hash.slice(1);
     switch (hash) {
          case "Home":
               wrapper.style.display = "flex";
               searchContainer.style.display = "block"
               break;
          case "Favourites":
               wrapper.style.display = "none";
               searchContainer.style.display = "none"
               break;
     }
});

