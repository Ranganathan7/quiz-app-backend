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

@Schema({ collection: 'created_quizzes', timestamps: true })
export class CreatedQuiz extends Document {
  @Prop({ required: true, unique: true })
  quizId: string

  @Prop({ required: true })
  quizName: string

  @Prop({ required: true })
  quizDescription: string[]

  @Prop({ required: true })
  createdByEmailId: string

  @Prop({ required: true })
  createdByUserName: string

  @Prop({ required: true, default: false })
  active: boolean

  @Prop({ required: true, default: false })
  protected: boolean

  @Prop({ required: true, default: false })
  showAnswer: boolean

  @Prop({ required: true, default: 0 })
  timeLimitSec: number

  @Prop({ required: true, default: 1 })
  maxAttempts: number

  @Prop({ required: true, default: false })
  negativeMarking: boolean

  @Prop({ required: true, default: false })
  shuffleQuestions: boolean

  @Prop({ required: true, default: false })
  shuffleOptions: boolean

  @Prop({ required: true, type: [Object] })
  questions: QuestionsInterface[]

  @Prop({ required: true })
  maxScore: number
}

export const CreatedQuizSchema = SchemaFactory.createForClass(CreatedQuiz);