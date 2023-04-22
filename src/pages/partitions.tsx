import Layout from "@/components/layouts/partitioned-tabs";
import React from "react";
import Link from "next/link";

export default function Partitions() {
  return (
    <Layout>
      <div>partitions</div>
      <Link href="/" className="bg-yellow-500 px-4 py-2 rounded-xl">
        Back home
      </Link>
    </Layout>
  );
}
