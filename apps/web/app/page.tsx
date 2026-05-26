"use client";
import { useUser } from "~/hooks/api/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && user.id) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [user, router]);
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>{JSON.stringify(user, null, 2)}</div>
    </main>
  );
}
