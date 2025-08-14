import fastify from 'fastify';
import scalarApiReference from '@scalar/fastify-api-reference'
import { fastifySwagger } from '@fastify/swagger';
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { getCousesRoute } from './src/routes/get-courses.ts';
import { createCourseRoute } from './src/routes/create-course.ts';
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts';

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

if (process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'api-main',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });
  
  server.register(scalarApiReference, {
    routePrefix: '/docs',
    configuration: {
      theme: 'kepler'
    }
  })
}

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(getCousesRoute);
server.register(createCourseRoute);
server.register(getCourseByIdRoute);

server.listen({port: 3000}).then(()=> {
  console.log('Server is running on port 3000');
});