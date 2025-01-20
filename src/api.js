import axios from 'axios';

const API_KEY = '35061241-cc64e28d246336ea3caedb193';
const URL = 'https://pixabay.com/api/';

// export async function fetchImage(searchQuery, page) {
//   const url = `${URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=4`;
//   const response = await axios(url);
//   const cards = await response.data;
//   return cards;
// }

export default class SearchImageService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchImage() {
    const url = `${URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
    const response = await axios(url);
    const cards = await response.data;
    this.incrementPage()
    return cards;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
