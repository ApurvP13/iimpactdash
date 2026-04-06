import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("dashboard-auth")?.value;

  if (auth === "true") {
    redirect("/");
  }

  return <LoginForm />;
}
