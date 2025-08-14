import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses/:id', {
    schema: {
      tags: ['courses'],
      summary: 'Get a course by id',
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable(),
          }),
        }),
        404: z.null().describe('Course not found'),
      },
    }
  }, async (req, reply) => {
    const {id} = req.params;
  
   const result = await db.select().from(courses).where(eq(courses.id, id))
  
    if (!result.length) {
      return reply.status(404).send();
    }
    return reply.status(200).send({course: result[0]});
  });
}