// This line says we want to use a special helper called "Injectable" from a library called "@nestjs/common".
// Think of it like a special power that helps our code work better.
import { Injectable } from '@nestjs/common';

// This line says we want to use another special helper called "InjectModel" from a library called "@nestjs/mongoose".
// This helper helps us talk to a special kind of database called MongoDB.
import { InjectModel } from '@nestjs/mongoose';

// This line says we want to use a special type called "Model" from a library called "mongoose".
// Think of it like a blueprint for our database
import { Model } from 'mongoose';

// This line says we want to use some special types called "Todo" and "TodoDocument" from a file called "todo.model".
// These types help us understand what our todo list items look like.
import { Todo, TodoDocument } from './todo.model';

// This line says we're creating a new class called "TodoService" and we want to use the "Injectable" power.
// This class is like a special helper that does all the work for our todo list.
@Injectable()
export class TodoService {

    // This line says we're creating a new constructor function for our class
    // A constructor is like a setup fnction that happens when we create a new instance of our class.
    constructor(
        // This line says we want to inject a special model called "Todo" into our constructor.
        // We're using the "InjectModel" helper to talk to our MongoDB database.
        @InjectModel(Todo.name) private todoModel: Model<TodoDocument>
    ) {}

    // This line says we're creating a new function called "getAllTodos" that return a promise.
    // A promise is like a special box that holds a value that we'll get later.
    // This function gets all the todo items from our database
    async getAllTodos(): Promise<Todo[]> {
        try {
            // This line says we're trying to find all the todo items in our database.
            // We're using the "find" method to look for all the items, and "lean" to make data smaller.
            const todos = await this.todoModel.find().lean().exec();
            // This line says we're returning the list of todo items we found.
            return todos;
        } catch (error) {
            // This line says if something goes wrong, we're throwing a new error with a message
            throw new Error(`Failed to fetch todos: ${error.message}`);
        }
    }

    // This line says we're creating a new function called "getTodoById" that returns a promise.
    // This function gets a single todo item from our database by it's ID.
    async getTodoById(id: string): Promise<Todo|null> {
        try {
            // THis line says we're trying to find one todo item in our database by its ID.
            // We're using the "findById" method to look for the item, and "lean" to make the data smaller.
            const todo = await this.todoModel.findById(id).lean().exec();
            return todo;
        } catch (error) {
            // This line says if something goes wrong, we're throwing a new error with a message.
            throw new Error(`Failed to fetch todo: ${error.message}`);
        }
    }

    // This line says we're creating a new function called "createTodo" that returns a promise.
    // This function creates a new todo item in our database.
    async createTodo(title: string, description?: string): Promise<Todo> {
        try {
            // This line says we're creating a new todo item with the given title and description.
            const newTodo = new this.todoModel({
                title,
                description,
                completed: false,
            });
            // This line says we're saving the new todo item to our database.
            const savedTodo = await newTodo.save();
            // This line says we're returning the new todo item we saved.
            return savedTodo.toObject();
        } catch (error) {
            // This line says if something goes wrong, we're throwing a new error with a message.
            throw new Error(`Failed to create todo: ${error.message}`);
        }
    }

    // This line sayas we're creating a new function called "updateTodo" that returns a promise
    // This function updates a todo item in our database.
    async updateTodo(
        // This is the ID of the todo item we want to update.
        id: string,
        // This is the new title of the todo item, if we want to change it.
        title?: string,
        // This is the new description of the todo item, if we want to change it.
        description?: string,
        // This is the new completion status of the todo item, if we want to change it.
        completed?: boolean
    ): Promise<Todo|null> {
        try {
            // This line says we're trying to find the todo item we want to update by its ID and update it's fields.
            const updatedTodo = await this.todoModel.findByIdAndUpdate(
                // This is the ID of the todo item we want to update.
                id,
                // This is an object that contains the new fields we want to update.
                {
                    // If we have a new title, add it to the update object.
                    ...(title && { title }),
                    // If we have a new description, add it to the update object.
                    ...(description && { description }),
                    // If we have a new completion status, add it to the update object.
                    ...(completed !== undefined && { completed }),
                },
                // This is an options object that tells mongoose what to do after the update.
                // "new: true" means we want to return the updated todo item, not the original one.
                // "lean: true" means we want to return a plain JavaScript object, not a mongoose model.
                { new: true, lean: true }
            // This line says we're executing the update query.
            ).exec();
            // This line says we're returning the updated todo item.
            return updatedTodo;
        } catch (error) {
            // This line says if something goes wrong, we're throwing a new error with a message.
            throw new Error(`Failed to update todo: ${error.message}`);
        }
    }

    // This line says we're creating a new function called "deleteTodo" that returns a promise.
    // This function deletes a todo item from our database.
    async deleteTodo(
        // This is the ID of the todo item we want to delete.
        id: string
    ): Promise<Todo|null> {
        try {
            // This line says we're trying to find the todo item we want to delete by its ID and delete it.
            const deletedTodo = await this.todoModel
                // This is a mongoose method that finds a document by its ID and deletes it.
                .findByIdAndDelete(id)
                // This line says we want to return a plain JavaScript object, not a mongoose model.
                .lean()
                // This line says we're executing the delete query.
                .exec();
            // This line says we're returning the deleted todo item.
            return deletedTodo;
        } catch (error) {
            // This line sayas if something goes wrong, we're throwing a new error with a message.
            throw new Error(`Failed to delete todo: ${error.message}`);
        }
    }

}