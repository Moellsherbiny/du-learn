type Props = {
  currentIndex: number;
  totalQuestions: number;
};

export function AssessmentProgress({
  currentIndex,
  totalQuestions,
}: Props) {
  const percentage =
    totalQuestions > 0
      ? ((currentIndex + 1) / totalQuestions) * 100
      : 0;

  return (
    <div className="h-1 bg-muted">
      <div
        className="h-full bg-primary transition-[width]"
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
}