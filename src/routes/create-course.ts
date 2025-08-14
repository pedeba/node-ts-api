import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';
import { z } from 'zod';

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses', {
    schema: {
      tags: ['courses'],
      summary: 'Create a new course',
      description: 'Create a new course with a title and an optional description',
      body: z.object({
        title: z.string().min(3),
        description: z.string().optional(),
      }),
      response: {
        201: z.object({
          courseId: z.uuid(),
        }).describe('Course created successfully')
      },
    }
  }, async (req, reply) => {
  
    const {title, description} = req.body;
  
    const [result] = await db.insert(courses).values({title, description}).returning();
  
    return reply.status(201).send({courseId: result.id});
  });
}