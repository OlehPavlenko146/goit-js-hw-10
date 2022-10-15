import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const refs = {
  search: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  card: document.querySelector('.country-info'),
};

refs.search.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  let country = evt.target.value.trim();
  if (country === '') {
    refs.list.innerHTML = '';
    refs.card.innerHTML = '';
  }
  fetchCountries(country)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        const markup = createListMarkup(data);
        refs.list.innerHTML = markup;
        refs.card.innerHTML = '';
      } else {
        const markup = createCardMarkup(data);
        refs.list.innerHTML = '';
        refs.card.innerHTML = markup;
      }
    })
    .catch(() => {
      if (country === '') {
        return;
      }
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createCardMarkup(arr) {
  return arr
    .map(
      item => `<div class="card">
  <img src='${item.flags.svg}' alt='${item.name.official}' width=100px />
  <h1 class='card-title'>${item.name.official}</h1>
  <h2>Capital:
    <p>${item.capital}</p>
  </h2>
  <h2>Population:
    <p>${item.population} people</p>
  </h2>
  <h2>Languages:
    <p>${Object.values(item.languages)}</p>
  </h2>
</div>`
    )
    .join('');
}

function createListMarkup(arr) {
  return arr
    .map(
      item => `<li class="list">
  <img src='${item.flags.svg}' alt='${item.name.official}' width=30px, height=15px />
  <h1 class='title'>${item.name.official}</h1>`
    )
    .join('');
}
