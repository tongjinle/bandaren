import { BASE_URL } from '../config/index.js';
const api = {
  user:{
    getToken: () => `${BASE_URL}/getToken`
  },
  game:{
    current: () => `${BASE_URL}/game/currentIndex`,
    list:()=>`${BASE_URL}/game/list`
  }
}

module.exports = api;