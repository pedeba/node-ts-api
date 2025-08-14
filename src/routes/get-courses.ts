import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/client.ts';
import { courses } from '../database/schema.ts';
import { z } from 'zod';

export const getCousesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses', {
    schema: {
      tags: ['courses'],
      summary: 'Get all courses',
      response: {
        200: z.object({
          courses: z.array(z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable()
          })),
        }),
      },
    }
  }, async (req, reply) => {
    const result = await db.select().from(courses);
    return reply.status(200).send({courses: result});
  });  
}