const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let max_likes = -1
  let favorite = null

  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > max_likes) {
      max_likes = blogs[i].likes
      favorite = blogs[i]
    }
  }

  return favorite === null
    ? favorite
    :
    {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
  let counts = {}
  let max = 0
  let mostBlogsAuthor = null

  for (let i = 0; i < blogs.length; i++) {
    if (Object.prototype.hasOwnProperty.call(counts, blogs[i].author)) {
      counts[blogs[i].author] += 1
    } else {
      counts[blogs[i].author] = 1
    }

    if (counts[blogs[i].author] > max) {
      max = counts[blogs[i].author]
      mostBlogsAuthor = blogs[i].author
    }
  }

  return mostBlogsAuthor === null
    ? mostBlogsAuthor
    :
    {
      author: mostBlogsAuthor,
      blogs: max
    }

}

const mostLikes = (blogs) => {
  let counts = {}
  let max = -1
  let mostLikesAuthor = null

  for (let i = 0; i < blogs.length; i++) {
    if (Object.prototype.hasOwnProperty.call(counts, blogs[i].author)) {
      counts[blogs[i].author] += blogs[i].likes
    } else {
      counts[blogs[i].author] = blogs[i].likes
    }

    if (counts[blogs[i].author] > max) {
      max = counts[blogs[i].author]
      mostLikesAuthor = blogs[i].author
    }
  }

  return mostLikesAuthor === null
    ? mostLikesAuthor
    :
    {
      author: mostLikesAuthor,
      likes: max
    }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
