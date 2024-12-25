import { ApolloDriver } from '@nestjs/apollo';
import { GqlModuleOptions } from '@nestjs/graphql';

export const graphqlConfig: GqlModuleOptions = {
  driver: ApolloDriver,      
  autoSchemaFile: 'schema.gql', 
  sortSchema: true,            
  debug: true,                 
  introspection: true,         
};
