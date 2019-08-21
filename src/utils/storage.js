//这个板块写本地储存的方法
const USER_KEY = 'user';

function getItem() {
    return JSON.parse(localStorage.getItem(USER_KEY))
}

function setItem(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function removeItem() {
    localStorage.removeItem(USER_KEY);
}

export {
    getItem,
    setItem,
    removeItem
}