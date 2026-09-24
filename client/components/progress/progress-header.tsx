type ProgressHeaderProps = {
  title: string;
  description: string;
};

export function ProgressHeader({
  title,
  description,
}: ProgressHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}