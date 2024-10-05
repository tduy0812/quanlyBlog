const fs = require('fs');
const filePath = 'posts.json';

const readFile = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
};

const writeFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const createPost = (title, content, username, status, type) => {
    const posts = readFile();
    const newPost = {
        id: new Date().getTime(),
        title,
        content,
        createAt: new Date(),
        username,
        status,
        type,
    };
    posts.push(newPost);
    writeFile(posts);

    return newPost;
};

const getPosts = () => {
    return readFile();
};

const getPostById = (id) => {
    const posts = readFile();
    return posts.find(post => post.id === id);
};

const updatePost = (id, updatedData) => {
    const posts = readFile();
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
        posts[index] = { ...posts[index], ...updatedData };
        writeFile(posts);
        return posts[index];
    }
    return null;
};


///////////////
const deletePost = (id, username) => {
    const posts = readFile();
    const index = posts.findIndex(post => post.id === id);
    if (index !== -1) {
        if (posts[index].username !== username) {
            return null; // Người dùng không phải chủ bài viết
        }
        const deletedPost = posts.splice(index, 1);
        writeFile(posts);
        return deletedPost;
    }
    return null;
};
//tìm bài viết theo từ khóa tiêu đề, nội dung
const searchPosts = (keyword) => {
    const posts = readFile();
    // Lọc bài viết theo từ khóa tìm kiếm (có thể nằm trong tiêu đề hoặc nội dung)
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(keyword.toLowerCase()) || // Tìm kiếm trong tiêu đề
        post.content.toLowerCase().includes(keyword.toLowerCase()) // Tìm kiếm trong nội dung
    );
    return filteredPosts;
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
