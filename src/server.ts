import { server } from './app.ts';

server.listen({port: 3000}).then(()=> {
  console.log('Server is running on port 3000');
});