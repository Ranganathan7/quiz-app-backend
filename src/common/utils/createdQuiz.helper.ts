import {
  CreateQuizDto,
  QuestionsDto,
} from '../../createdQuiz/dto/createdQuiz.dto';

export const calculateMaxScore = (quiz: QuestionsDto[]): number => {
  let maxScore = 0;
  for (let i = 0; i < quiz.length; i++) {
    maxScore = maxScore + quiz[i].questionType.mark;
  }
  return maxScore;
};

export const createQuizDescription = (quiz: CreateQuizDto): string[] => {
  const quizDescription: string[] = [];
  quizDescription.push(`This Quiz is created by: ${quiz.createdByUserName}.`);
  if (quiz.protected) {
    quizDescription.push(
      `During the quiz, you will not be able to switch to another tab while taking the quiz as it will result in closing(submitting) the quiz,
        and the quiz interface will be displayed in full-screen mode.`,
    );
  }
  if (quiz.timeLimitSec > 0) {
    quizDescription.push(
      `The quiz has a time limit of ${formatTime(
        quiz.timeLimitSec,
      )} for completion.`,
    );
  } else {
    quizDescription.push(`This quiz doesn't have a time limit.`);
  }
  quizDescription.push(
    `This quiz allows a maximum of ${quiz.maxAttempts} attempts.`,
  );
  quizDescription.push(
    `The mark awarded for a correct answer will be shown alongside the respective question.`,
  );
  if (quiz.negativeMarking) {
    quizDescription.push(`The quiz has negative marking for wrong answers.`);
    quizDescription.push(
      `The negative mark obtained for a wrong answer will be shown alongside the respective question.`,
    );
  }
  quizDescription.push(
    `All the questions in this quiz are multiple choice questions.`,
  );
  quizDescription.push(
    `The options for single correct answers will be displayed in radio buttons.`,
  );
  quizDescription.push(
    `The options for multiple correct answers will be displayed in checkboxes.`,
  );
  return quizDescription;
};

export const formatTime = (totalTimeInSeconds: number): string => {
  let hours: number = 0;
  let minutes: number = 0;
  let seconds: number = totalTimeInSeconds;
  if (seconds > 60) {
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
  }
  if (minutes > 60) {
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
  }
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )}:${String(seconds).padStart(2, '0')}[hh:mm:ss]`;
};
