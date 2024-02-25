import axios from 'axios';

export async function fetchData(query, currentPage) {
  const API_KEY = '42152818-0d69fd49112a74751654c42bc';
  const url = 'https://pixabay.com/api/';

  const params = {
    key: API_KEY,
    lang: 'en',
    order: 'popular',
    q: query,
    per_page: 15,
    page: currentPage,
  };
  const res = await axios.get(url, { params });
  return res.data;
}