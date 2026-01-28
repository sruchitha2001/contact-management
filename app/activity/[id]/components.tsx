"use client";

import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Stats = {
  title: string;
  logs: string[];
  total: number;
  streak: number;
};

export default function ActivityStatsPage({
  activityId,
}: {
  activityId: number;
}) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch(`/api/activity/${activityId}`)
      .then((res) => res.json())
      .then(setStats);
  }, [activityId]);

  const logDates = useMemo(
    () => stats?.logs.map((d) => new Date(d)) ?? [],
    [stats],
  );

  const now = new Date();

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  // 📊 Counts
  const monthCount = logDates.filter(
    (d) =>
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(),
  ).length;

  const weekCount = logDates.filter((d) => {
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff < 7;
  }).length;

  const yearCount = logDates.filter(
    (d) => d.getFullYear() === now.getFullYear(),
  ).length;

  if (!stats) return <p className="p-6">Loading...</p>;

  return (
    <div
      className="min-h-screen bg-linear-to-br
 from-indigo-100 via-purple-100 to-pink-100 p-6"
    >
      <div className="max-w-xl mx-auto bg-amber-100 rounded-2xl shadow-xl p-6 space-y-6">
        {/* 🔝 Title */}
        <h1 className="text-3xl font-bold text-indigo-700 text-center">
          {stats.title}
        </h1>

        {/* 📅 Calendar (centered) */}
        <div className="flex justify-center">
          <div className="bg-orange-200 rounded-2xl shadow p-4">
            <Calendar
              tileClassName={({ date }) =>
                logDates.some((d) => isSameDay(d, date)) ? "logged-day" : null
              }
            />
          </div>
        </div>

        {/* 📊 Stats (Tracker-style) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-blue-700">{monthCount}</p>
          </div>

          <div className="bg-green-100 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">This Week</p>
            <p className="text-2xl font-bold text-green-700">{weekCount}</p>
          </div>

          <div className="bg-purple-100 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">This Year</p>
            <p className="text-2xl font-bold text-purple-700">{yearCount}</p>
          </div>

          <div className="bg-orange-100 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">Streak 🔥</p>
            <p className="text-2xl font-bold text-orange-700">
              {stats.streak} days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
