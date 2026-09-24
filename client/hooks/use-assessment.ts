"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  Assessment,
  AssessmentAttempt,
  AssessmentQuestion,
} from "@/types/assessment";

import { startAttemptAction } from "@/actions/assessments/start-attempt";
import { answerQuestionAction } from "@/actions/assessments/answer-question";
import { submitAttemptAction } from "@/actions/assessments/submit-attempt";

type AnswerValue = string[] | string;

type AssessmentResult = {
  score: number | string;
  max_score: number | string;
  percentage: number | string;
  passed: boolean;
};

type UseAssessmentOptions = {
  assessment: Assessment;
};

export function useAssessment({
  assessment,
}: UseAssessmentOptions) {
  const [attempt, setAttempt] =
    useState<AssessmentAttempt | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<
    Record<string, AnswerValue>
  >({});

  const [isStarting, setIsStarting] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [result, setResult] =
    useState<AssessmentResult | null>(null);

  const questions = useMemo<AssessmentQuestion[]>(
    () =>
      [...assessment.questions].sort(
        (a, b) => a.order - b.order
      ),
    [assessment.questions]
  );

  const currentQuestion = questions[currentIndex] ?? null;

  const currentAnswer = currentQuestion
    ? answers[String(currentQuestion.id)]
    : undefined;

  const isFirstQuestion = currentIndex === 0;

  const isLastQuestion =
    currentIndex === questions.length - 1;

  const isAnswered = useMemo(() => {
    if (currentAnswer === undefined) {
      return false;
    }

    if (Array.isArray(currentAnswer)) {
      return currentAnswer.length > 0;
    }

    return currentAnswer.trim().length > 0;
  }, [currentAnswer]);

  const hydrateAnswers = useCallback(
    (attempt: AssessmentAttempt) => {
      const initialAnswers: Record<
        string,
        AnswerValue
      > = {};

      for (const answer of attempt.answers ?? []) {
        if (answer.selected_choices?.length) {
          initialAnswers[String(answer.question)] =
            answer.selected_choices.map((item) =>
              String(item.choice)
            );

          continue;
        }

        initialAnswers[String(answer.question)] =
          answer.text_answer ?? "";
      }

      setAnswers(initialAnswers);
    },
    []
  );

  const startAttempt = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    setResult(null);
    setCurrentIndex(0);
    setAnswers({});

    try {
      const response = await startAttemptAction(
        assessment.id
      );

      if (!response.success) {
        setError(response.message);
        return false;
      }

      setAttempt(response.data);
      hydrateAnswers(response.data);

      return true;
    } catch (error) {
      console.error("Start assessment error:", error);

      setError("تعذر بدء الاختبار.");

      return false;
    } finally {
      setIsStarting(false);
    }
  }, [assessment.id, hydrateAnswers]);

  useEffect(() => {
    startAttempt();
  }, [startAttempt]);

  const updateAnswer = useCallback(
    (questionId: string | number, value: AnswerValue) => {
      setAnswers((previous) => ({
        ...previous,
        [String(questionId)]: value,
      }));

      setError(null);
    },
    []
  );

  const selectSingleChoice = useCallback(
    (choiceId: string | number) => {
      if (!currentQuestion) return;

      updateAnswer(currentQuestion.id, [
        String(choiceId),
      ]);
    },
    [currentQuestion, updateAnswer]
  );

  const toggleMultipleChoice = useCallback(
    (choiceId: string | number) => {
      if (!currentQuestion) return;

      const current = Array.isArray(currentAnswer)
        ? currentAnswer
        : [];

      const id = String(choiceId);

      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      updateAnswer(currentQuestion.id, next);
    },
    [currentAnswer, currentQuestion, updateAnswer]
  );

  const updateTextAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion) return;

      updateAnswer(currentQuestion.id, value);
    },
    [currentQuestion, updateAnswer]
  );

  /**
   * Save the currently selected answer to the backend.
   *
   * Important:
   * Selecting an answer only changes local state.
   * The API request happens when the user clicks Next
   * or Submit.
   */
  const saveCurrentAnswer = useCallback(async () => {
    if (!attempt || !currentQuestion) {
      return false;
    }

    const answer = answers[String(currentQuestion.id)];

    if (answer === undefined) {
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const payload =
        typeof answer === "string"
          ? {
              question: currentQuestion.id,
              text_answer: answer,
            }
          : {
              question: currentQuestion.id,

              // IMPORTANT:
              // The backend view reads validated_data["choices"].
              choices: answer,
            };

      const response = await answerQuestionAction(
        attempt.id,
        payload
      );

      if (!response.success) {
        setError(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Save answer error:", error);

      setError("تعذر حفظ الإجابة.");

      return false;
    } finally {
      setIsSaving(false);
    }
  }, [answers, attempt, currentQuestion]);

  const goNext = useCallback(async () => {
    if (isLastQuestion) {
      return;
    }

    const saved = await saveCurrentAnswer();

    if (!saved) {
      return;
    }

    setCurrentIndex((index) => index + 1);
  }, [isLastQuestion, saveCurrentAnswer]);

  const goPrevious = useCallback(() => {
    if (isFirstQuestion) {
      return;
    }

    setCurrentIndex((index) => index - 1);
  }, [isFirstQuestion]);

  const submit = useCallback(async () => {
    if (!attempt || !currentQuestion) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const saved = await saveCurrentAnswer();

      if (!saved) {
        return;
      }

      const response = await submitAttemptAction(
        attempt.id
      );

      if (!response.success) {
        setError(response.message);
        return;
      }

      setAttempt(response.data);

      setResult({
        score: response.data.score,
        max_score: response.data.max_score,
        percentage: response.data.percentage,
        passed: response.data.passed,
      });
    } catch (error) {
      console.error(
        "Submit assessment error:",
        error
      );

      setError("تعذر إرسال الاختبار.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    attempt,
    currentQuestion,
    saveCurrentAnswer,
  ]);

  const retry = useCallback(async () => {
    await startAttempt();
  }, [startAttempt]);

  return {
    attempt,
    questions,
    currentQuestion,
    currentIndex,
    currentAnswer,

    result,
    error,

    isStarting,
    isSaving,
    isSubmitting,

    isFirstQuestion,
    isLastQuestion,
    isAnswered,

    selectSingleChoice,
    toggleMultipleChoice,
    updateTextAnswer,

    goNext,
    goPrevious,
    submit,
    retry,
  };
}