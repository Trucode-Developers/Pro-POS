"use client";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button";
import UserCrud from "./userCrud";
import { closePopUp } from "@/lib/store";

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

  const [active_id, setActive_id] = useState("");

  useEffect(() => {
    invoke<string>("greet", {
      name: "Professional POS: Accessed the backend! ",
    })
      .then(
        (greeting) => setGreeting(greeting),
        (error) => console.error(error)
      )
      .catch(console.error);
    get_all_users();
  }, []);

  const get_all_users = async () => {
    closePopUp();
    await invoke("get_all_users")
      .then((response) => {
        setUsers(response);
        console.log(response);
      })
      .catch(console.error);
  };

  const prepare_updating_user = async (email: string) => {
    setActive_id(email);
    //filter user by id and assign to user
    const user = users.filter((user: any) => user.email === email)[0];
    setUser(user);
  };

  const deleteUser = async (email: string) => {
    await invoke("delete_user", { email })
      .then((response) => get_all_users())
      .catch(console.error);
  };

    

  // Necessary because we will have to use Greet as a component later.
  return (
    <div className="w-full h-full ">
      <a href="/" className="text-2xl">
        ← Back to hom now
      </a>

      <br />
      {/* <h1 className="text-4xl font-bold">Greet</h1> */}
      <p className="py-2 ">{greeting}</p>
      <div className="flex justify-between py-4">
        <h1 className="text-4xl font-bold">Users</h1>
        <UserCrud
          setUser={setUser}
          user={user}
          get_all_users={get_all_users}
          active_id={active_id}
          setActive_id={setActive_id}
        />
      </div>
      <table className="w-full border-2 border-blue-200 table-auto">
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
              <td className="px-4 py-2 border">{user.name}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.role}</td>
              <td className="px-4 py-2 border">
                {user.is_active ? "Yes" : "No"}
              </td>
              <td className="px-4 py-2 border">
                <Button
                  className="bg-blue-500 hover:bg-slate-500"
                  onClick={() => {
                    prepare_updating_user(user.email);
                  }}
                >
                  Edit + {user.email}
                </Button>
                {/* <UserCrud
                  setUser={setUser}
                  user={user}
                  get_all_users={get_all_users}
                  active_id={active_id}
                  setActive_id={setActive_id}
                /> */}
              </td>
              <td className="px-4 py-2 border">
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
  );
}
