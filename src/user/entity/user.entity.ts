import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  emailId: string

  @Prop({ required: true, unique: true })
  userName: string

  @Prop({ required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User);