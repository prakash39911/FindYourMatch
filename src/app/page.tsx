import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div>Hello from App</div>
      <div>User Data --</div>
      <div>
        {session ? <p> {JSON.stringify(session.user)}</p> : "Not Signed In"}
      </div>
    </>
  );
}
