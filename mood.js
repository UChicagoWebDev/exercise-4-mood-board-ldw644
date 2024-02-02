const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  // TODO: Clear the results pane before you run a new search

  openResultsPane();
  
  var inputValue = document.getElementById("inputValue").value;
  document.getElementById("resultsImageContainer").innerHTML = '';
  var bing_query = bing_api_endpoint + "?q=" + inputValue;
  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.

  let request = new XMLHttpRequest();
  request.addEventListener("load", requestListener);
  request.open("GET", bing_query);
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.responseType = 'json';
  request.send();


  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  // TODO: Send the request

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function requestListener(e){
  var imageList = e.target.response.value;

  var suggestionContainer = document.getElementById("suggestions");

  var suggestionChild = suggestionContainer.querySelector('ul');

  suggestionContainer.removeChild(suggestionChild);

  var suggestionList = e.target.response.relatedSearches;

  var ul = document.createElement("ul");
  
  for(let i in suggestionList) {
    var suggestion = suggestionList[i].displayText;
    var link = suggestionList[i].webSearchUrl;

    var li = document.createElement("li");
    li.textContent = suggestion;
    li.onclick = (function(suggestionCopy) {
      return function() {
        newSearch(suggestionCopy);
      };
    })(suggestion);
    ul.appendChild(li);
  }

  suggestionContainer.appendChild(ul);

  for(let i in imageList) {
    if (i>17) break;
    var imageSrc = imageList[i].thumbnailUrl;
    var imageContainer = document.getElementById("resultsImageContainer");

    var div = document.createElement("div");
    div.className = "resultImage";
    div.onclick = (function(imageSrcCopy) { 
      return () => {
        saveImage(imageSrcCopy);
      };
    })(imageSrc);

    var img = document.createElement("img");
    img.src = imageSrc;

    div.appendChild(img);
    imageContainer.appendChild(div);
  }

}

function newSearch(suggestion){
  document.getElementById("inputValue").value = suggestion;
  runSearch();
}

function saveImage(link){
  div = document.createElement("div");
  div.className = "savedImage";
  img = document.createElement("img");
  img.src = link;

  div.appendChild(img);

  document.getElementById("board").appendChild(div);
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
