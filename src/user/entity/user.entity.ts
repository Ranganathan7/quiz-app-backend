import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ collection: 'users', timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, type: String })
  emailId: string

  @Prop({ required: true, unique: true, type: String })
  userName: string

  @Prop({ required: true, type: String })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User);