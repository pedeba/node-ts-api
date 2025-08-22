import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/client.ts';
import { courses, enrollments } from '../database/schema.ts';
import { z } from 'zod';
import { ilike, asc, eq, count} from 'drizzle-orm';

export const getCousesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses', {
    schema: {
      tags: ['courses'],
      summary: 'Get all courses',
      querystring: z.object({
        search: z.string().optional(),
        orderBy: z.enum(['title']).optional().default('title'),
        page: z.coerce.number().optional().default(1)
      }),
      response: {
        200: z.object({
          courses: z.array(z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable(),
            enrollments: z.number()
          })),
          total: z.number()
        }),
      },
    }
  }, async (req, reply) => {
    const { search, orderBy, page } = req.query;

    const [result, total] = await Promise.all([
      db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        enrollments: count(enrollments.id)
      })
      .from(courses)
      .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
      .groupBy(courses.id)
      .orderBy(asc(courses[orderBy]))
      .offset((page - 1) * 2)
      .limit(10)
      .where(
        search ? ilike(courses.title, `%${search}%`) : undefined
      ),
      db.$count(courses, search ? ilike(courses.title, `%${search}%`) : undefined)
    ])
    return reply.status(200).send({courses: result, total});
  });  
}