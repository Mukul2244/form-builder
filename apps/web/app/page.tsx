"use client";
import { trpc } from "~/trpc/client";

export default  function Home() {
  // const { message } = await api.test.query({ email: "mukul@gmail.com" });
  const { data } =  trpc.test.useQuery({ email: "mukul@gmail.com" });
  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Streamyst - Stream in Style</h1>
        <h2>Server Status: {data?.message}</h2>
      </div>
    </main>
  );
}
