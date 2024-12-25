import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import 'tsconfig-paths/register'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the client URL with apollo configuration
  app.enableCors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,POST,PUT',  
    allowedHeaders: 'Content-Type, Authorization, x-apollo-operation-name',
  });
  
  // Enable file upload handling for GraphQL
  app.use(graphqlUploadExpress()); 

  // Start the server on the specified port
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
