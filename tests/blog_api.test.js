const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
//const bcrypt = require('bcrypt')
//const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
//const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('returned blogs have a field called "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
    expect(response.body[response.body.length-1].id).toBeDefined()
  })

  describe('addition of a new blog', () => {

    test('works correctly with valid data', async () => {
      const token = await helper.createToken()
      const newBlog = {
        title: 'Cool Title',
        author: 'Cool Author',
        url: 'http://thisiscoolblog.com',
        likes: 1000
      }

      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length+1)

      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).toContain('Cool Title')
    })

    test('sets the value of field "likes" to 0 if missing that field', async () => {
      const token = await helper.createToken()
      const newBlog = {
        title: 'Cool Title',
        author: 'Cool Author',
        url: 'http://thisiscoolblog.com'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd[blogsAtEnd.length-1].likes).toBe(0)
    })

    test('fails if missing fields "title" and "url"', async () => {
      const token = await helper.createToken()
      const newBlog = {
        author: 'Cool Author',
        likes: 1000
      }

      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {

    test('works correctly with valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogId = blogsAtStart[0].id

      await api
        .delete(`/api/blogs/${blogId}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length-1)

      const ids = blogsAtEnd.map(blog => blog.id)
      expect(ids).not.toContain(blogId)
    })
  })

  describe('update of a blog', () => {

    test('works correctly with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 1000
      }

      await api
        .put(`/api/blogs/${blogsAtStart[0].id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd[0].likes).toBe(1000)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
