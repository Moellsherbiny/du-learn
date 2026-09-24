import { getAssessmentsAction } from "@/actions/assessments/get-assessments";
import AssessmentsClient from "@/components/assessments/assessments-client";

export default async function AssessmentsPage() {
  const assessments = await getAssessmentsAction();

  return <AssessmentsClient assessments={assessments} />;
}
