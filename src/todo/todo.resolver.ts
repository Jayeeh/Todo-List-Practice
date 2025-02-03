// These are special tools from GraphQL that help us handle requests
// Resolver is like a traffic controller for GraphQL requests
// Query is for getting data
// Mutation is for changing data
// Args helps us get information from the request
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

// We need our TodoService to do the actual work with the database
// Think of TodoService as our helper that knows how to talk to MongoDB
import { TodoService } from './todo.service';

// We need our Todo model to tell GraphQL what our data looks like
import { Todo } from './todo.model';

// This decorator tells NestJS "This class handles GraphQL operations for Todos"
// It's like saying "When someone asks about Todos, send them here"
@Resolver(() => Todo)
export class TodoResolver {
    // This is like saying "We need TodoService to help us work with Todos"
    // NestJS will automatically give us a TodoService to use
    constructor(private readonly todoService: TodoService) {}

    // This is a Query that gets all todos
    // When someone asks GraphQL for 'todos', this function runs
    @Query(() => [Todo])
    async todos(): Promise<Todo[]> {
        // We ask our TodoService to get all todos from the database
        return this.todoService.getAllTodos();
    }

    // This is a Query that gets one specific todo by its ID
    // The 'nullable: true' means it's okay if we don't find the todo
    @Query(() => Todo, { nullable: true })
    async todo(
        // This says "We need an ID to find the todo"
        @Args('id') id: string
    ): Promise<Todo|null> {
        // We ask TodoService to find the todo with this ID
        const todo = await this.todoService.getTodoById(id);
        // If we don't find it, we return null instead
        return todo || null;
    }

    // This is a Mutation that creates a new todo
    // When someone wants to create a todo, this function runs
    @Mutation(() => Todo)
    async createTodo(
        // We need a title for the new todo - this is required
        @Args('title') title: string,
        // Description is optional - that's why it has nullable: true
        @Args('description', { nullable: true }) description?: string,
    ): Promise<Todo> {
        // We ask TodoService to create a new todo with these details
        return this.todoService.createTodo(title, description);
    }

    // This is a Mutation that updates an existing todo
    // It can return null if the todo doesn't exist
    @Mutation(() => Todo, { nullable: true })
    async updateTodo(
        // We need the ID to know which todo to update
        @Args('id') id: string,
        // All these fields are optional - we only update what's provided
        @Args('title', { nullable: true }) title?: string,
        @Args('description', { nullable: true }) description?: string,
        @Args('completed', { nullable: true }) completed?: boolean,
    ): Promise<Todo|null> {
        // We ask TodoService to update the todo with any new information
        const updatedTodo = await this.todoService.updateTodo(id, title, description, completed);
        // If the update failed (todo not found), we return null
        return updatedTodo || null;
    }

    // This is a Mutation that deletes a todo
    // It can return null if the todo doesn't exist
    @Mutation(() => Todo, { nullable: true })
    async deleteTodo(
        // We need the ID to know which todo to delete
        @Args('id') id: string,
    ): Promise<Todo|null> {
        // We ask TodoService to delete the todo
        const deletedTodo = await this.todoService.deleteTodo(id);
        // If the delete failed (todo not found), we return null
        return deletedTodo || null;
    }
}