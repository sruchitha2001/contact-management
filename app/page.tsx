import Link from "next/link";

async function getUsers() {
  // Use the absolute URL for server-side fetching in Next.js
  // or call prisma directly since this is a Server Component.
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/api/register`,
    {
      cache: "no-store", // Ensure we get fresh data
    }
  );

  if (!res.ok) return { users: [] };
  return res.json();
}

export default async function UsersPage() {
  const { users } = await getUsers();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Directory</h1>
        <Link
          href="/register"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add New User
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user: any) => (
          <div
            key={user.id}
            className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-sm text-blue-600 font-medium">
                  {user.occupation}
                </p>
              </div>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                ID: {user.id}
              </span>
            </div>

            <div className="space-y-2 mb-6 text-sm text-gray-600">
              <p>📍 {user.city}</p>
              <p>📞 {user.phone}</p>
              <p>🎨 {user.Hobbies}</p>
            </div>

            <Link
              href={`/user/${user.id}`}
              className="block text-center w-full bg-blue-50 text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
            >
              View Tasks &rarr;
            </Link>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <p>No users found in the database.</p>
        </div>
      )}
    </div>
  );
}
