import axios from 'axios';

// such kind of memoization is not good for production
// use it like this only for demo purposes,
// normally it is better to have something
// like Redis here
const cache :any= {};

const extractId = url => {
    const found = url.match(/(\d+)\/$/);
    if (found.length) {
        return found[1];
    }

    return null;
};

export default async ids => {
    if (!ids || !ids.length) {
        return [];
    }

    return [];
};