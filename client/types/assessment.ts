
export type AssessmentType =
  | "QUIZ"
  | "EXAM"
  | "PRACTICE";

export type QuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "SHORT_TEXT";

export type AssessmentChoice = {
  id: number | string;
  text: string;
  order: number;
};

export type AssessmentQuestion = {
  id: number | string;
  text: string;
  type: QuestionType;
  points: number | string;
  order: number;
  choices: AssessmentChoice[];
};

export type Assessment = {
  id: number | string;
  course: number | string;
  lesson: number | string | null;
  title: string;
  description: string;
  type: AssessmentType;
  time_limit_minutes: number | null;
  passing_score: number | string;
  max_attempts: number | null;
  shuffle_questions: boolean;
  shuffle_choices: boolean;
  questions: AssessmentQuestion[];
};

export type AssessmentAttempt = {
  id: number | string;
  assessment: number | string;
  student: number | string;
  attempt_number: number;
  status:
    | "IN_PROGRESS"
    | "SUBMITTED"
    | "EXPIRED"
    | "ABANDONED";
  score: number | string;
  max_score: number | string;
  percentage: number | string;
  passed: boolean;
  started_at: string;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  answers: AssessmentAnswer[];
};

export type AssessmentAnswerChoice = {
  id: number | string;
  answer: number | string;
  choice: number | string;
};

export type AssessmentAnswer = {
  id: number | string;
  attempt: number | string;
  question: number | string;
  text_answer: string;
  is_correct: boolean | null;
  points_earned: number | string;
  answered_at: string;
  selected_choices: AssessmentAnswerChoice[];
};

