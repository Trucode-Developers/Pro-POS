"use client";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserManagement } from "./manageUsers";

export default function Page() {
  const [greeting, setGreeting] = useState("");
  const [users, setUsers] = useState({} as any);
  const [user, setUser] = useState({
    name: "sample name",
    role: 1,
    email: "",
    password: "",
    is_active: true,
  });



  useEffect(() => {
    invoke<string>("greet", { name: "Professional POS" })
      .then(
        (greeting) => setGreeting(greeting),
        (error) => console.error(error)
        // console.log(greeting)
      )
      .catch(console.error);
    get_all_users();
  }, []);

  // const user = {
  //   name: "John editing from frontend ...",
  //   role: 1,
  //   email: "john5@yahoo.com",
  //   password: "john5@yahoo.com",
  //   is_active: true,
  // };

  const get_all_users = async () => {
    await invoke("get_all_users")
      .then((response) => {
        setUsers(response);
        console.log(response);
      })
      .catch(console.error);
  };
  
  const deleteUser = async (email: string) => {
    await invoke("delete_user", { email })
      .then((response) => get_all_users())
      .catch(console.error);
  };

  // Necessary because we will have to use Greet as a component later.
  return (
    <div className=" bg-blue-200 h-full min-w-full">
      <div className="flex gap-4  flex-wrap">
        <div className="flex-1">
          <div className="p-5 flex-1">
            <Link href="/">← Back to hom now</Link>
            <br />
            <h1 className="text-4xl font-bold">Greet</h1>
            <p className="text-2xl">{greeting}</p>
            <h1>Add and Update User form</h1>
          </div>
          <h1 className="text-4xl font-bold">Users</h1>
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(users).map((user: any, index: number) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">
                    {user.is_active ? "Yes" : "No"}
                  </td>
                  <td className="border px-4 py-2">
                    {/* <Button
                      className="bg-blue-500 hover:bg-slate-500"
                      onClick={() => {
                        // prepare_updating_user(user.email);
                      }}
                    >
                      Edit + {user.email}
                    </Button> */}
                    <UserManagement
                      users={users}
                      user={user}
                      setUser={setUser}
                      get_all_users={get_all_users}
                      active_id={user.email}
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <Button
                      className="bg-red-500 hover:bg-black"
                      onClick={() => deleteUser(user.email)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
