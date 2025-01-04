import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "../../components/Navbar";
import TaskGrid from "../../components/tasks/TaskGrid";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/en/login`);
  }

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <TaskGrid />
      </main>
    </div>
  );
} 