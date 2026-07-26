const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const blogs = [];
        const result = listHelper.totalLikes(blogs);
        assert.strictEqual(result, 0);
    })

    test('when the list has only one blog equals the likes of that blog', () => {
        const blogs = [
            {
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                id: "5a422aa71b54a676234d17f8"
            }
        ];
        const result = listHelper.totalLikes(blogs);
        assert.strictEqual(result, 7);
    })

    test('of a bigger list is calculated correctly', () => {
        const blogs = [
            {
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                id: "5a422aa71b54a676234d17f8"
            },
            {
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                id: "5a422aa71b54a676234d17f9"
            },
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 12,
                id: "5a422aa71b54a676234d17fa"
            }
        ];
        const result = listHelper.totalLikes(blogs);
        assert.strictEqual(result, 24);
    })
})
