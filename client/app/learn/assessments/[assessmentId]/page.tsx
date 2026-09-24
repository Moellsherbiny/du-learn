
import { notFound, redirect } from "next/navigation";

import { getAssessmentAction } from "@/actions/assessments";
import AssessmentClient from "@/components/assessments/assessment-client";

type Props = {
  params: Promise<{
    assessmentId: string;
  }>;
};

export default async function AssessmentPage({
  params,
}: Props) {
  const { assessmentId } = await params;

  const result = await getAssessmentAction(assessmentId);

  if (!result.success) {
    if (result.status === 401) {
      redirect("/login");
    }

    if (result.status === 403 || result.status === 404) {
      notFound();
    }

    throw new Error(result.message);
  }

  return (
    <AssessmentClient
      assessment={result.data}
    />
  );
}

