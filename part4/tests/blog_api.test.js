const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/BlogModel')
const User = require('../models/UserModel')

describe('when there is initially some blogs saved', () => {
  let token = null
  let testUser = null

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    testUser = new User({ username: 'testuser', name: 'Test User', passwordHash })
    await testUser.save()

    const userForToken = {
      username: testUser.username,
      id: testUser._id
    }
    token = jwt.sign(userForToken, process.env.SECRET)

    const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: testUser._id }))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    testUser.blogs = blogObjects.map(b => b._id)
    await testUser.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property of the blogs is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert.ok(titles.includes('Canonical string reduction'))
    })

    test('likes property defaults to 0 if missing', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Laurie Voss',
        url: 'http://roland.cl/blog/type-wars/'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(b => b.title === 'Type wars')
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('blog without title is not added and returns 400 Bad Request', async () => {
      const newBlog = {
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 1
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url is not added and returns 400 Bad Request', async () => {
      const newBlog = {
        title: 'Test Title',
        author: 'Test Author',
        likes: 1
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 Unauthorized if token is not provided', async () => {
      const newBlog = {
        title: 'Unauthorized Blog',
        author: 'Unknown Author',
        url: 'http://unauthorized.com',
        likes: 1
      }

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert.ok(result.body.error.includes('token missing'))

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid and user is the creator', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert.ok(!titles.includes(blogToDelete.title))
    })

    test('fails with status code 401 Unauthorized if token is not provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const result = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert.ok(result.body.error.includes('token missing'))

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 Unauthorized if another user attempts deletion', async () => {
      const anotherHash = await bcrypt.hash('secret2', 10)
      const anotherUser = new User({ username: 'another', name: 'Another User', passwordHash: anotherHash })
      await anotherUser.save()

      const userForToken = {
        username: anotherUser.username,
        id: anotherUser._id
      }
      const anotherToken = jwt.sign(userForToken, process.env.SECRET)

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const result = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert.ok(result.body.error.includes('only the creator can delete this blog'))

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with status code 200 and updates likes count if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlogData = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
      assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
