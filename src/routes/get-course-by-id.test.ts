import { test, expect } from 'vitest';
import supertest from 'supertest';
import { server } from '../app.ts';
import { makeCourse } from '../tests/factories/make-course.ts';

test('get a course by id', async () => {
  await server.ready()

  const course = await makeCourse()

  const response = await supertest(server.server)
  .get(`/courses/${course.id}`)
  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    course: {
      id: course.id,
      title: course.title,
      description: course.description,
    },
  })
})

test('return 404 if course not found', async () => {
  await server.ready()

  const response = await supertest(server.server)
  .get(`/courses/4f885f25-4b59-479f-af2c-8e141606d09a`)
  expect(response.status).toEqual(404)
})