"use server";

import ActivityStatsPage from "./components";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const activityId = parseInt((await params).id);
  return <ActivityStatsPage activityId={activityId} />;
}
