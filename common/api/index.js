import { BASE_URL } from "../config/index.js";
const api = {
  user: {
    getToken: () => `${BASE_URL}/getToken`,
    getUpvote: () => `${BASE_URL}/game/myUpvote`,
    getPoint: () => `${BASE_URL}/game/myPoint`
  },
  game: {
    reward: () => `${BASE_URL}/game/reward`,
    current: () => `${BASE_URL}/game/currentIndex`,
    list: () => `${BASE_URL}/game/list`,
    upvote: () => `${BASE_URL}/game/upvote`,
    addPoint: () => `${BASE_URL}/game/addPoint`,
    myAddPoint: () => `${BASE_URL}/game/myAddPoint`,
    gallery: () => `${BASE_URL}/game/gallery`,
    galleryCount: () => `${BASE_URL}/game/galleryCount`
  },
  common: {
    setUserInfo: () => `${BASE_URL}/common/setUserInfo`
  }
};

module.exports = api;
