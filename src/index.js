document.addEventListener("DOMContentLoaded", () => {
  /////////////API STUFF//////////////

  const QUOTES_URL = "http://localhost:3000/quotes/";
  const GET_QUOTES_URL = "http://localhost:3000/quotes?_embed=likes";
  const LIKES_URL = "http://localhost:3000/likes";

  const apiHeaders = {
    "Content-type": "application/json",
    Accept: "application/json",
  };

  //get
  const get = (url) => {
    return fetch(url).then((resp) => resp.json());
  };

  //post
  const post = (url, quote) => {
    return fetch(url, {
      method: "POST",
      headers: apiHeaders,
      body: JSON.stringify(quote),
    }).then((resp) => resp.json());
  };

  //delete
  const deleteQ = (url, quote) => {
    return fetch(url + quote.id, {
      method: "DELETE",
    }).then((resp) => resp.json());
  };

  const API = { get, post, deleteQ };

  /////////////CONSTANTS//////////////
  const quoteList = document.querySelector("#quote-list");

  const quoteForm = document.querySelector("#new-quote-form");
  const quoteLine = document.getElementsByName("quote")[0];
  const quoteAuthor = document.getElementsByName("author")[0];

  /////////////FUNCTIONS//////////////

  const getQuotes = () => {
    API.get(GET_QUOTES_URL).then((quotes) =>
      quotes.forEach((quote) => renderQuote(quote))
    );
  };

  const renderQuote = (quote) => {
    const quoteLi = document.createElement("li");
    quoteLi.classList.add("quote-card");
    quoteLi.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
  </blockquote>
  `;
    const likeButton = document.createElement("button");
    likeButton.classList.add("btn-success");
    likeButton.innerText = "Likes: ";
    const likes = document.createElement("span");
    likes.innerText = quote.likes.length;
    likeButton.appendChild(likes);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn-danger");
    deleteButton.innerText = "Delete";

    quoteList.appendChild(quoteLi);

    quoteLi.querySelector("blockquote").append(likeButton, deleteButton);

    deleteButton.addEventListener("click", () => {
      API.deleteQ(QUOTES_URL, quote).then(() => quoteLi.remove());
    });

    likeButton.addEventListener("click", () => {
      quoteList.innerHTML = "";
      const like = {
        quoteId: quote.id,
        createdAt: Date.now(),
      };
      API.post(LIKES_URL, like).then((resp) => getQuotes());
    });
  };

  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newQuote1 = quoteLine.value;
    const newAuthor = quoteAuthor.value;

    const newQuote = {
      quote: newQuote1,
      author: newAuthor,
    };

    API.post(QUOTES_URL, newQuote).then((resp) => {
      renderQuote(resp);
    });
  });

  ///////////CALL FUNCTION///////////
  getQuotes();
});

