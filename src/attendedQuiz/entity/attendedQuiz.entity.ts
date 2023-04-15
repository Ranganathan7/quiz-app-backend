import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


export class AnswerInterface {
  @Prop({ required: true, type: String })
  question: string

  @Prop({ required: true, type: String, unique: true })
  questionId: string

  @Prop({ required: true, type: [String] })
  options: string[]

  @Prop({ required: true, type: [String] })
  answer: string[]

  @Prop({ required: true, type: [String] })
  chosenAnswer: string[]

  @Prop({ required: true, type: Boolean })
  attempted: boolean

  @Prop({ required: true, type: Number })
  mark: number

  @Prop({ required: true, type: Number })
  negativeMark: number

  @Prop({ required: true, type: Boolean })
  multipleAnswer: boolean

  @Prop({ required: true, type: Boolean })
  correct: boolean
};

export class AnswersInterface {
  @Prop({ required:true, type: Array<AnswerInterface> })
  answers: AnswerInterface[]

  @Prop({ required: true,  type: Number })
  score: Number

  @Prop({ required:true, type: Date, default: new Date().toISOString() })
  attemptedAt: Date
};

@Schema({ collection: 'attended_quizzes', timestamps: true })
export class AttendedQuiz extends Document {
  @Prop({ required: true, type: String, ref: 'created_quizzes', autopopulate: true })
  quizId: string

  @Prop({ required: true, type: String })
  attendedByEmailId: string

  @Prop({ required: true, type: String })
  attendedByUserName: string

  @Prop({ required: true, type: Number })
  attemptsLeft: number

  @Prop({ required: true, type: Array<AnswersInterface> })
  attempts: AnswersInterface[]
}

export const AttendedQuizSchema = SchemaFactory.createForClass(AttendedQuiz);