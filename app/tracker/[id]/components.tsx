"use client";

import {
  BriefcaseBusiness,
  Cake,
  CalendarCheck2,
  Check,
  CircleUserRound,
  Globe,
  Pencil,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// ✅ Icon wrapper (OPTION 1)
function IconCircle({
  children,
  bg = "bg-indigo-100",
  color = "text-indigo-600",
}: {
  children: React.ReactNode;
  bg?: string;
  color?: string;
}) {
  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color}`}
    >
      {children}
    </div>
  );
}

interface Activity {
  id: number;
  title: string;
  createdAt: string;
  dates: string[];
}

export default function TrackerPage({ params }: { params: { id: number } }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userName, setUserName] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [occupation, setOccupation] = useState("");
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loggedDates, setLoggedDates] = useState<Date[]>([]);
  const router = useRouter();

  const [stats, setStats] = useState({
    todayCount: 0,
    weekCount: 0,
    monthCount: 0,
    streak: 0,
    todayActivity: [] as any,
  });

  const [mounted, setMounted] = useState(false);

  const [userIdState, setUserIdState] = useState("0");
  useEffect(() => {
    const userId = localStorage.getItem("userId") || "5";
    if (userId) {
      setUserIdState(userId);
    }
  }, []);

  // Load activities
  useEffect(() => {
    loadActivities();
    loadUsers();
    loadStats();
  }, [params.id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function loadUsers() {
    const url = new URL("/api/users", window.location.origin);
    console.log(userIdState);
    url.searchParams.set("userId", params.id.toString());
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.user.Hobbies);

    setUserName(data.user.name);
    setAge(data.user.age);
    setHobbies(data.user.Hobbies);
    setOccupation(data.user.occupation);
  }

  async function loadActivities() {
    const url = new URL("/api/activity", window.location.origin);
    console.log(userIdState);
    url.searchParams.set("userId", params.id.toString());
    const res = await fetch(url);
    const data = await res.json();

    setActivities(data.activities);

    // 👇 collect all logged dates
    const dates: Date[] = [];
    data.activities.forEach((a: any) => {
      a.dates?.forEach((d: string) => {
        dates.push(new Date(d));
      });
    });

    setLoggedDates(dates);
  }

  async function loadStats() {
    const res = await fetch(`/api/activity/stats?userId=${params.id}`);
    const data = await res.json();
    setStats(data);
  }

  async function addOrEditActivity(e: any) {
    e.preventDefault();

    if (editId) {
      await fetch("/api/activity", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, title }),
      });
      setEditId(null);
    } else {
      await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: params.id, title }),
      });
    }

    setTitle("");
    loadActivities();
  }

  async function deleteActivity(id: number) {
    await fetch("/api/activity", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadActivities();
  }

  async function logToday(activityId: number) {
    await fetch("/api/activity/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId, userIdState: params.id }),
    });

    // refresh UI
    loadActivities();
    loadStats();
  }

  console.log(stats.todayActivity);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-xl mx-auto bg-red-100 rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">
          Daily Activity Tracker
        </h1>

        {/* TEMP CALENDAR TEST
        <div className="mb-6">
          {mounted && (
            <Calendar
              tileClassName={({ date }) => {
                const isLogged = loggedDates.some(
                  (d) => d.toDateString() === date.toDateString(),
                );
                return isLogged ? "logged-day" : null;
              }}
            />
          )}
        </div> */}

        <div className="rounded-2xl bg-amber-100 mb-2">
          {/* Name */}
          <div className="text-sm text-black rounded-t-lg bg-white flex items-center my-1">
            <div className="p-4">
              <div
                className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 
                      flex items-center justify-center"
              >
                <CircleUserRound size={20} />
              </div>
            </div>
            <div className="p-2">
              <div className="font-bold text-base">Name</div>
              <div className="text-sm text-gray-500">{userName}</div>
            </div>
          </div>

          {/* Age */}
          <div className="text-sm text-black flex items-center bg-white my-1">
            <div className="p-4">
              <div
                className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 
                      flex items-center justify-center"
              >
                <Cake size={20} />
              </div>
            </div>
            <div className="p-2">
              <div className="font-bold text-base">Age</div>
              <div className="text-sm text-gray-500">{age}</div>
            </div>
          </div>

          {/* Occupation */}
          <div className="text-sm text-black flex items-center bg-white my-1">
            <div className="p-4">
              <div
                className="w-12 h-12 rounded-full bg-green-100 text-green-600 
                      flex items-center justify-center"
              >
                <BriefcaseBusiness size={20} />
              </div>
            </div>
            <div className="p-2">
              <div className="font-bold text-base">Occupation</div>
              <div className="text-sm text-gray-500">{occupation}</div>
            </div>
          </div>

          {/* Hobbies */}
          <div className="text-sm text-black flex items-center bg-white rounded-b-lg">
            <div className="p-4">
              <div
                className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 
                      flex items-center justify-center"
              >
                <Globe size={20} />
              </div>
            </div>
            <div className="p-2">
              <div className="font-bold text-base">Hobbies</div>
              <div className="text-sm text-gray-500">{hobbies}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">Today</p>
            <p className="text-2xl font-bold text-blue-700">
              {stats.todayCount}
            </p>
          </div>

          <div className="bg-green-100 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">This Week</p>
            <p className="text-2xl font-bold text-green-700">
              {stats.weekCount}
            </p>
          </div>

          <div className="bg-purple-100 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-purple-700">
              {stats.monthCount}
            </p>
          </div>

          <div className="bg-orange-100 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-600">Streak 🔥</p>
            <p className="text-2xl font-bold text-orange-700">
              {stats.streak} days
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={addOrEditActivity} className="flex gap-2 mb-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What did you do today?"
            className="flex-1 px-4 py-2 border rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            {editId ? "Update" : "Add"}
          </button>
        </form>

        {/* List */}
        {activities.length === 0 ? (
          <p className="text-gray-400 italic">No activities yet</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((a) => (
              <li
                key={a.id}
                className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg"
              >
                <div
                  onClick={() => router.push(`/activity/${a.id}`)}
                  className="cursor-pointer"
                >
                  <p className="font-medium text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  {/* Log */}
                  <button
                    onClick={() => logToday(a.id)}
                    className="w-10 h-10 rounded-full bg-green-100 text-green-600 
               flex items-center justify-center hover:bg-green-200"
                  >
                    {stats.todayActivity.some(
                      (logged: any) => logged.activityId === a.id,
                    ) ? (
                      <Check size={18} />
                    ) : (
                      <CalendarCheck2 size={18} />
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    title="Edit activity"
                    onClick={() => {
                      setEditId(a.id);
                      setTitle(a.title);
                    }}
                    className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 
               flex items-center justify-center hover:bg-blue-200"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* Delete */}
                  <button
                    title="Delete activity"
                    onClick={() => deleteActivity(a.id)}
                    className="w-10 h-10 rounded-full bg-red-100 text-red-600 
               flex items-center justify-center hover:bg-red-200"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
