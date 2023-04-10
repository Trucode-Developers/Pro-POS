import React from "react";
import { data } from "@/components/layouts/admin/services_data";
import Link from "next/link";
import Image from "next/image";

export default function LeftMenu() {
  return (
    <div className="flex flex-col min-h-screen overflow-y-scroll justify-between p-2">
      <div>Header</div>
      <div>
        {data.map(
          (item) =>
            item.children.length > 0 && (
              <div key={item.id} className="flex flex-col">
                <div className="text-secondary text-2xl font-bold">
                  {item.title}
                </div>
                {item.children.map((sub) => (
                  <Link href={sub.link} key={sub.id} className="flex flex-col">
                    <div className="flex items-center gap-2 hover:text-secondary">
                      <Image
                        src={sub.image}
                        width={50}
                        height={50}
                        alt="service image"
                      />
                      <div>
                        <div>{sub.title}</div>
                        <div>{sub.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
        )}
      </div>
      <div>footer</div>
    </div>
  );
}
