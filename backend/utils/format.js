
const formatArray = arr => {
    const formatted = {};
    for (let i = 0; i < arr.length; i++) {
        formatted[arr[i].id] = arr[i];
    }
    return formatted;
};

const formatPost = post => {
    const savedByArray = post.savedBy.map(ob => ob.id);
    post.savedBy = savedByArray;
    return post;
};

const formatPosts = postsArr => {
    const formatted = {};
    for (let i = 0; i < postsArr.length; i++) {
        const post = formatPost(postsArr[i]);
        formatted[post.id] = post;
    }
    return formatted;
};

module.exports = { formatArray, formatPosts, formatPost };