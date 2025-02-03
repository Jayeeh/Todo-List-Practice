// This line imports special decorators from GraphQL.
// ObjectType helps us define what our Todo looks like in GraphQL
// Field helps us specify which properties should be visible in GraphQL
import { ObjectType, Field } from '@nestjs/graphql';

// This line imports helpers from mongoose that help us define our database structure
// Prop is like a label that says "this is a database field"
// Schema is like a blueprint that says "this is how our data should look"
// SchemaFactory helps us create that blueprint
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// This line imports Document from mongoose
// Think of Document as a special type that gives our Todo extra database powers
import { Document } from 'mongoose';

// This special decorator tells GraphQL "Hey, we're creating a new type called Todo"
// It's like registering our Todo in the GraphQL system
@ObjectType()
// This special decorator tells MongoDB "Hey, here's how our Todo should be stored"
// It's like creating a template for our database
@Schema()
export class Todo extends Document {
    // This tells GraphQL that _id should be treated as a string
    // Every Todo will have this unique identifier
    @Field(() => String)
    _id: string;

    // This tells GraphQL that title is a regular field
    @Field()
    // This tells MongoDB that title is required - we can't create a Todo without it
    @Prop({ required: true })
    title: string;

    // This tells GraphQL that description can be null (optional)
    // It's like saying "it's okay if there's no description"
    @Field({ nullable: true })
    // This tells MongoDB to store the description, but it's not required
    @Prop()
    description?: string;

    // This tells GraphQL that completed is a regular field
    @Field()
    // This tells MongoDB to store completed status
    // If we don't specify it when creating a Todo, it will be false
    @Prop({ default: false })
    completed: boolean;
}

// This creates a special type that combines our Todo with MongoDB's Document
// It helps TypeScript understand what our Todo looks like in the database
export type TodoDocument = Todo & Document;

// This creates the actual MongoDB schema from our Todo class
// Think of it as taking our blueprint (Todo class) and making it real
export const TodoSchema = SchemaFactory.createForClass(Todo);