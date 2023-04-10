import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  emailId: string

  @Prop({ required: true, unique: true })
  userName: string

  @Prop({ required: true })
  password: string

  @Prop({ type: [{type: mongoose.Schema.Types.ObjectId, ref: 'created_quizzes' }] })
  createdQuizzes: Types.ObjectId[]

  @Prop({ type: [{type: mongoose.Schema.Types.ObjectId, ref: 'attended_quizzes' }] })
  attendedQuizzes: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User);