"use server";

import TrackerPage from "./components";

export default async function Tracker({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id);
  return <TrackerPage params={{ id }} />;
}
