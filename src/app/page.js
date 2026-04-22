import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const token = (await cookies()).get("razvi_token")?.value;

  redirect(token ? "/properties" : "/login");
}
