import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
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

  if (searchImageService.query === '') {
    return Notiflix.Notify.info('Enter something');
  }

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
  try {
    const { totalHits, hits } = await searchImageService.fetchImage();
    const totalPage = totalHits / searchImageService.page;
    if (searchImageService.page > totalPage) {
      return error;
    }
    appendMarkup(hits);
    scrollOptimization();
  } catch (error) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function renderCards(cards) {
  return cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return ` <div class="photo-card">
 <a href=${largeImageURL}> <img src="${webformatURL}" alt="${tags}" loading="lazy" width='360' height='260' /></a>
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
      }
    )
    .join('');
}

function appendMarkup(card) {
  listEl.insertAdjacentHTML('beforeend', renderCards(card));
  lightbox.refresh();
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

function scrollOptimization() {
  const { height: cardHeight } =
    listEl.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
