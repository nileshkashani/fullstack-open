const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    let sumOfLikes = 0;
    
    for (let blog of blogs) {
        sumOfLikes += blog.likes;
    }
    return sumOfLikes;
}
module.exports = {
  dummy, totalLikes
}

const mostBlogs = (blogs) => {
    let maxBlogs = blogs[0].blogs;
    for (let blog of blogs){
        if(blog.blogs > maxBlogs){
            maxBlogs = blog.blogs
        }
    }
    return maxBlogs;
}
const mostLikes = (blogs) => {
    let blogger = blogs[0].author, maxLikes = blogs[0].likes;
    for (let blog of blogs){
        if(blog.likes > maxLikes){
            maxLikes = blog.likes;
            blogger = blog.author;
        }
    }
    return {blogger, maxLikes};
}