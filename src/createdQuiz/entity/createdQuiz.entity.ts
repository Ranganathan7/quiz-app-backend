import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export interface QuestionTypeInterface {
  mark: number,
  negativeMark: number,
  multipleAnswer: boolean
}

export interface QuestionsInterface {
  question: string,
  options: string[],
  answer: string[],
  questionType: QuestionTypeInterface
};

export interface AttendeesInterface {
  emailId: string,
  userName: string
}

@Schema({ collection: 'created_quizzes', timestamps: true })
export class CreatedQuiz extends Document {
  @Prop({ required: true, unique: true })
  quizId: string

  @Prop({ required: true, unique: true })
  createdBy: string

  @Prop({ required: true, default: false })
  timed: boolean

  @Prop({ required: true, default: 0 })
  timeLimit: number

  @Prop({ required: true, default: false })
  negativeMarking: boolean

  @Prop({ required: true, default: false })
  shuffleQuestions: boolean

  @Prop({ required: true, default: false })
  shuffleOptions: boolean

  @Prop({ required: true, type: [Object] })
  questions: QuestionsInterface[]

  @Prop({ required: true, type: [Object] })
  attendees: AttendeesInterface[]
}

export const CreatedQuizSchema = SchemaFactory.createForClass(CreatedQuiz);