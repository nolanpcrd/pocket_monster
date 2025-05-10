const BASE_URL = 'http://localhost:3000';

export const API_ROUTES = {
    AUTH: {
        REGISTER: BASE_URL + '/api/auth/register',
        LOGIN: BASE_URL + '/api/auth/login',
        ME: BASE_URL + '/api/auth/me'
    },
    FRIENDSHIPS: {
        SEND_REQUEST: BASE_URL + '/api/friendships',
        ACCEPT_REQUEST: BASE_URL + '/api/friendships/:id',
        DELETE_REQUEST: BASE_URL + '/api/friendships/:id',
        GET_FRIENDS: BASE_URL + '/api/friendships',
        GET_SENT_REQUESTS: BASE_URL + '/api/friendships/sent',
        SEARCH: BASE_URL + '/api/friendships/search'
    }
};