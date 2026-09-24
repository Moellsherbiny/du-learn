"use client";

import type {
  AssessmentQuestion,
} from "@/types/assessment";

import { AssessmentChoice } from "./assessment-choice";
import { AssessmentShortText } from "./assessment-short-text";

type Props = {
  question: AssessmentQuestion;
  answer: string[] | string | undefined;
  onSingleChoice: (
    choiceId: number | string
  ) => void;
  onMultipleChoice: (
    choiceId: number | string
  ) => void;
  onTextChange: (value: string) => void;
};

export function AssessmentQuestion({
  question,
  answer,
  onSingleChoice,
  onMultipleChoice,
  onTextChange,
}: Props) {
  const selectedChoices = Array.isArray(answer)
    ? answer
    : [];

  return (
    <div>
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            السؤال
          </span>

          <span className="text-xs text-muted-foreground">
            {question.points} درجة
          </span>
        </div>

        <h2 className="text-xl font-bold leading-8 sm:text-2xl">
          {question.text}
        </h2>
      </div>

      {question.type === "SHORT_TEXT" ? (
        <AssessmentShortText
          value={
            typeof answer === "string"
              ? answer
              : ""
          }
          onChange={onTextChange}
        />
      ) : (
        <div className="space-y-3">
          {question.choices.map((choice) => (
            <AssessmentChoice
              key={choice.id}
              choice={choice}
              selected={selectedChoices.includes(
                String(choice.id)
              )}
              multiple={
                question.type === "MULTIPLE_CHOICE"
              }
              onClick={() => {
                if (
                  question.type ===
                  "MULTIPLE_CHOICE"
                ) {
                  onMultipleChoice(choice.id);
                } else {
                  onSingleChoice(choice.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}