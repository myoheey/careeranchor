import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "PROFESSOR") {
    redirect("/dashboard/professor");
  } else {
    redirect("/dashboard/student");
  }
}
