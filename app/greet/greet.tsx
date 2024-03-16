"use client";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Greet() {
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
    invoke<string>("greet", { name: "Professional POS" })
      .then(
        (greeting) => setGreeting(greeting),
        (error) => console.error(error)
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

  
  const id = 2;
  const prepare_updating_user = async (email: string) => {
    setActive_id(email);
    //filter user by id and assign to user
    const user = users.filter((user: any) => user.email === email)[0];
    setUser(user);
  };

  const updateUser = async () => {

    await invoke("update", { id, user })
      .then((response) => get_all_users())
      .catch(console.error);
  };
  


  const createUser = async () => {
    console.log(user);
    await invoke("create", { user })
      .then((response) => get_all_users())
      .catch(console.error);
  };

  const deleteUser = async (email: string) => {
    await invoke("delete_user", { email })
      .then((response) => get_all_users())
      .catch(console.error);
  };

  const reset_users = async () => {
    setUser({
      name: "",
      role: 1,
      email: "",
      password: "",
      is_active: true,
    });
    setActive_id("");
  };

  // Necessary because we will have to use Greet as a component later.
  return (
    <div className="w-full h-full bg-blue-200 ">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 p-5">
          <a href="/">← Back to hom now</a>
          <br />
          <h1 className="text-4xl font-bold">Greet</h1>
          <p className="text-2xl">{greeting}</p>
          <h1>Add and Update User form</h1>
          <form className="flex flex-col gap-4">
            <label htmlFor="name">Name</label>
            <Input
              type="text"
              name="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              id="name"
              placeholder="John Doe"
              className="border-2 border-gray-500"
            />
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="email"
              className="border-2 border-gray-500"
            />
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              id="password"
              placeholder="password"
              className="border-2 border-gray-500"
            />
            <label htmlFor="role">Role</label>
            <select
              name="role"
              id="role"
              value={user.role}
              className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              // onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
              <option value="1">Admin</option>
              <option value="2">User</option>
            </select>
            <label htmlFor="is_active">Active</label>
            <select
              name="is_active"
              id="is_active"
              className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) =>
                setUser({ ...user, is_active: e.target.value === "1" })
              }
              value={user.is_active ? "1" : "0"}
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </form>
          <div className="flex flex-wrap gap-4 p-5 justify-evenly">
            {/* <Button className="bg-blue-500 hover:bg-black" >Click me</Button> */}
            {active_id !== "" ? (
              <Button
                className="bg-blue-500 hover:bg-black"
                onClick={updateUser}
              >
                Update User
              </Button>
            ) : (
              <Button
                className="bg-green-500 hover:bg-black"
                onClick={createUser}
              >
                Create User
              </Button>
            )}

            <Button
              className="bg-blue-500 hover:bg-black"
              onClick={reset_users}
            >
              Reset users
            </Button>

            
          </div>
        </div>

        <div className="flex-1">
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
      </div>
    </div>
  );
}
