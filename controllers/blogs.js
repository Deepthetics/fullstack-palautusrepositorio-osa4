const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (!Object.prototype.hasOwnProperty.call(request.body, 'title') && !Object.prototype.hasOwnProperty.call(request.body, 'url')) {
    response.status(400).end()
  }

  const body = request.body
  if (!Object.prototype.hasOwnProperty.call(body, 'likes')) {
    body.likes = 0
  }

  const user = request.user
  body.user = user.id

  const blog = new Blog(body)
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!(blog.user.toString() === request.user.id)) {
    return response.status(401).json({ error: 'unauthorized action' })
  }

  await Blog.findByIdAndRemove(request.params.id)

  const user = await User.findById(request.user.id)
  user.blogs.splice(user.blogs.indexOf(request.params.id))
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    url: body.url,
    title: body.title,
    author: body.author,
    user: body.user,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1, id: 1 })
  response.json(updatedBlog)
})

module.exports = blogsRouter
