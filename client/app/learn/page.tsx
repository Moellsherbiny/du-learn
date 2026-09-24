
import { getLearnHome } from "@/actions/learn/get-learn-home";
import { LearnClient } from "@/components/learn/home/learn-client";

export default async function LearnPage() {
  const data = await getLearnHome();

  return <LearnClient data={data} />;
}

