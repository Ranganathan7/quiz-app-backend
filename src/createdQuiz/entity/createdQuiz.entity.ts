import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export class QuestionInterface {
  @Prop({ required: true, type: String })
  question: string

  @Prop({ required: true, type: String, unique: true })
  questionId: string

  @Prop({ required: true, type: [String] })
  options: string[]

  @Prop({ required: true, type: [String] })
  answer: string[]
  @Prop({ required: true, type: Number })
  mark: number

  @Prop({ required: true, type: Number })
  negativeMark: number

  @Prop({ required: true, type: Boolean })
  multipleAnswer: boolean
};

@Schema({ collection: 'created_quizzes', timestamps: true })
export class CreatedQuiz extends Document {
  @Prop({ required: true, unique: true, type: String, default: String(Math.random()*Math.random()) })
  quizId: string

  @Prop({ required: true, type: String })
  quizName: string

  @Prop({ required: true, type: [String] })
  quizDescription: string[]

  @Prop({ required: true, type: String })
  createdByEmailId: string

  @Prop({ required: true, type: String })
  createdByUserName: string

  @Prop({ required: true, default: false, type: Boolean })
  active: boolean

  @Prop({ required: true, default: false, type: Boolean })
  protected: boolean

  @Prop({ required: true, default: false, type: Boolean })
  showAnswer: boolean

  @Prop({ required: true, default: 0, type: Number })
  timeLimitSec: number

  @Prop({ required: true, default: 1, type: Number })
  maxAttempts: number

  @Prop({ required: true, default: false, type: Boolean })
  negativeMarking: boolean

  @Prop({ required: true, default: false, type: Boolean })
  shuffleQuestions: boolean

  @Prop({ required: true, default: false, type: Boolean })
  shuffleOptions: boolean

  @Prop({ required: true, type: Array<QuestionInterface> })
  questions: QuestionInterface[]

  @Prop({ required: true, type: Number })
  maxScore: number
}

export const CreatedQuizSchema = SchemaFactory.createForClass(CreatedQuiz);