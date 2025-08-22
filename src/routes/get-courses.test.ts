import { test, expect } from 'vitest';
import { randomUUID } from 'node:crypto';
import supertest from 'supertest';
import { server } from '../app.ts';
import { makeCourse } from '../tests/factories/make-course.ts';

test('get a course by id', async () => {
  await server.ready()

  const title = randomUUID()

  const course = await makeCourse(title)

  const response = await supertest(server.server)
  .get(`/courses?search=${title}`)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    total: 1,
    courses: [
      {
        id: course.id,
        title: course.title,
        description: course.description,
        enrollments: 0,
      },
    ],
  })
})