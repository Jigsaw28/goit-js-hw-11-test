import axios from 'axios';
import Notiflix from 'notiflix';
// import { fetchImage } from './api';
import SearchImageService from './api';

const formEl = document.querySelector('.search-form');
const listEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const searchImageService = new SearchImageService();

loadMoreBtn.style.display = 'none';

formEl.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmitForm(e) {
  e.preventDefault();
  listEl.innerHTML = '';
  loadMoreBtn.style.display = 'none';

  const form = e.target;
  searchImageService.query = form.elements.searchQuery.value;
  searchImageService.resetPage();
  const newCard = await searchImageService.fetchImage();

  loadMoreBtn.style.display = 'block';
    const { hits, totalHits } = newCard;
  try {
    if (hits.length === 0) {
      return error;
    }
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    appendMarkup(hits);
  } catch (error) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  form.reset();
}

async function onLoadMore() {
  const newCard = await searchImageService.fetchImage();
  appendMarkup(newCard.hits);
}

function renderCards(cards) {
  return cards
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return ` <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width='360' height='260' />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
}

function appendMarkup(card) {
  listEl.insertAdjacentHTML('beforeend', renderCards(card));
}
