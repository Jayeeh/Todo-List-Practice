// This is the main building block of NestJS
// Module helps us organize our application into neat packages
import { Module } from '@nestjs/common';

// This helps us add GraphQL to our application
// GraphQL is like a smart API that lets clients request exactly what they need
import { GraphQLModule } from '@nestjs/graphql';

// This is Apollo - it's the engine that powers our GraphQL server
// Think of it as the brain that understands GraphQL requests
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

// This helps us connect to MongoDB
// MongoDB is our database where we store all our todos
import { MongooseModule } from '@nestjs/mongoose';

// These are our custom Todo components
// TodoService handles all the database operations
// TodoResolver handles all the GraphQL operations
// Todo and TodoSchema define what our data looks like
import { TodoService } from './todo/todo.service';
import { TodoResolver } from './todo/todo.resolver';
import { Todo, TodoSchema } from './todo/todo.model';

// This decorator tells NestJS "Here's how to set up our application"
@Module({
  imports: [
    // This sets up our connection to MongoDB
    // We're connecting to a database called 'todo-app' on our local computer
    MongooseModule.forRoot('mongodb://localhost:27017/todo-app'),

    // This tells MongoDB about our Todo data structure
    // It's like registering our Todo blueprint with the database
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),

    // This sets up GraphQL with Apollo
    // It's like setting up a smart API endpoint that understands GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,     // We're using Apollo to handle GraphQL
      autoSchemaFile: true,     // This automatically creates our GraphQL schema
    })
  ],
  
  // These are the services our application needs
  // NestJS will create these services for us when needed
  providers: [
    TodoService,    // This handles our database operations
    TodoResolver,   // This handles our GraphQL operations
  ],
})
export class AppModule {}