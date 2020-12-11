'use strict';

const apiKey = "4f45305cdccd81347205c0028a7f11c3201988c0";


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

const searchURL = (user, max) => {
  const params = {
    pageSize: max
  };
  const queryString = formatQueryParams(params)
  return `https://api.github.com/users/${user}/repos?${queryString}`;
}

function displayResults(responseJson, maxResults) {
  console.log(responseJson[0]);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.length & i<maxResults ; i++){
    $('#results-list').append(
      `<li><h3><a href="${responseJson[i].url}">${responseJson[i].name}</a></h3>
      <p>${responseJson[i].description}</p>
      </li>`
    )}; 
  $('#results').removeClass('hidden');
};

function getNews(query, maxResults=10) {
  const url = searchURL(query, maxResults)
    
  console.log(url);
  
  const options = {
    headers: new Headers({
      "x-rapidapi-key": apiKey})
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      
      }
      console.log("Error");
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNews(searchTerm, maxResults);
  });
}

$(watchForm);