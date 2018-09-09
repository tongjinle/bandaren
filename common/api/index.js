import { BASE_URL } from '../config/index.js';
const api = {
  user:{
    getToken: () => `${BASE_URL}/getToken`,
    getUpvote: () => `${BASE_URL}/game/myUpvote`,
    getPoint: () => `${BASE_URL}/game/myPoint`
  },
  game:{
    current: () => `${BASE_URL}/game/currentIndex`,
    list:()=>`${BASE_URL}/game/list`,
    upvote: () => `${BASE_URL}/game/upvote`,
    addPoint: () => `${BASE_URL}/game/addPoint`
  }
}

module.exports = api;