import { HttpException, HttpStatus } from '@nestjs/common';
import { AnswerDto } from '../../attendedQuiz/dto/attendedQuiz.dto';
import {
  AnswerInterface,
  AnswersInterface,
} from '../../attendedQuiz/entity/attendedQuiz.entity';
import { QuestionInterface } from '../../createdQuiz/entity/createdQuiz.entity';

export const calculateScore = (
  questions: Array<QuestionInterface>,
  answers: Array<AnswerDto>,
  requestId: string,
): AnswersInterface => {
  const updatedAnswers: Array<AnswerInterface> = [];
  let score = 0;
  //sorting the arrays with questionId for making it easy for comparison
  questions.sort((a, b) => a.questionId.localeCompare(b.questionId));
  answers.sort((a, b) => a.questionId.localeCompare(b.questionId));
  for (let i = 0; i < answers.length; i++) {
    if (questions[i].questionId !== answers[i].questionId) {
      throw new HttpException(
        {
          message: `No question found with questionId: ${answers[i].questionId} [OR] the quiz you are trying to submit has been edited.`,
          requestId: requestId,
        },
        HttpStatus.CONFLICT,
      );
    }
    //sorting the answer array to make it easy for comparison
    questions[i].answer.sort();
    answers[i].chosenAnswer.sort();
    //adding mark if correct
    //subtracting negative mark if attempted and incorrect (negative mark 0 if negativeMarking is false)
    if (
      JSON.stringify(questions[i].answer) ===
      JSON.stringify(answers[i].chosenAnswer)
    ) {
      score = score + questions[i].mark;
    } else {
      if (answers[i].chosenAnswer.length !== 0)
        score = score - questions[i].negativeMark;
    }
    updatedAnswers.push({
      question: questions[i].question,
      questionId: questions[i].questionId,
      options: questions[i].options,
      answer: questions[i].answer,
      chosenAnswer: answers[i].chosenAnswer,
      mark: questions[i].mark,
      negativeMark: questions[i].negativeMark,
      multipleAnswer: questions[i].multipleAnswer,
      attempted: answers[i].chosenAnswer.length !== 0,
      correct:
        JSON.stringify(questions[i].answer) ===
        JSON.stringify(answers[i].chosenAnswer),
    });
  }
  return { answers: updatedAnswers, score: score, attemptedAt: new Date() };
};
