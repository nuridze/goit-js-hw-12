'use strict';

import axios from "axios";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export default async function getImages(userImgTag, currentPage) {
  const API_KEY = `?key=42244518-9742bcd26a7acdceb08ce98f6`;
  const BASE_URL = 'https://pixabay.com/api/';
  const END_POINT = `&q=${userImgTag}&image_type=photo&orientation=horizontal&safesearch=true`;
  const url = `${BASE_URL}${API_KEY}${END_POINT}`;

  const params = {
    page: currentPage,
    per_page: 15
  }

  try {
    const res = await axios.get(url, { params });
    const data = res.data;

    if (data.hits && data.hits.length > 0) {
      return data;
    } else {
      noImageError();
    } 
  } catch (error) {
    console.error(error.message);
  }
}

const noImageError = () => 
  iziToast.error({
    message: 'Sorry, there are no images matching your search query. Please try again!',
    titleColor: 'white',
    titleSize: '16px',
    messageColor: 'white',
    messageSize: '16px',
    backgroundColor: '#ef4040',
    iconUrl: '/img/error.svg',
    iconColor: 'white',
    position: 'topRight',
    maxWidth: '432px',
  });