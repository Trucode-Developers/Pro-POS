"use client";
import Image from "next/image";
import { Inter } from "next/font/google";
import { invoke } from "@tauri-apps/api/tauri";
import Link from "next/link";
import { VscAccount, VscGear, VscWorkspaceTrusted } from "react-icons/vsc";
import { InitialSetUp } from "./initialSetUp";

const inter = Inter({ subsets: ["latin"] });
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, TypeLoginSchema } from "@/lib/types/users";
import CustomInput from "@/components/custom/input";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import { useState } from "react";

export default function Page() {
  const font = useThemeStore((state) => state.fontSize);
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TypeLoginSchema>({
    resolver: zodResolver(LoginSchema),
    // defaultValues: role,
  });

  const onSubmit = async (data: TypeLoginSchema) => {
    //add a demo await for 5 seconds
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // return ;
    let credentials = data;
    try {
      setError("");
      const response = await invoke("login", { credentials });
      reset();
      // console.log(response);
      // return;
      const { permissions, status, user_id }: any = response;
      if (status === 200) {
        const { Ok } = permissions;
        useThemeStore.setState({ permissions: Ok });
        useThemeStore.setState({ token: user_id });
        router.push("/admin/users");
      } else {
        setError("Invalid credentials!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const permissions: string[] = useThemeStore((state) => state.permissions);
  const user_id = useThemeStore((state) => state.token);
  //console log type of permissions
  // console.log(typeof permissions);
  // console.log("permissions", permissions);
  // console.log("user_id", user_id);

  const logOut = async () => {
    useThemeStore.setState({ permissions: [] });
    useThemeStore.setState({ token: null });
  };

  return (
    <main className="relative grid min-h-screen md:grid-cols-2">
      <div className="flex-col items-center justify-center hidden gap-4 px-2 bg-gray-300 md:flex md:px-4">
        <div className="flex flex-col items-center">
          <Image src="/pos.png" alt="main pic" width={180} height={200} />
          <h1 className="text-2xl text-[var(--primary)]">Welcome back: </h1>
          <h1 className="text-2xl text-red-500">Professional Point Of Sale</h1>
          <h3 className={cn("text-center")} style={{ fontSize: `${font}px` }}>
            Is committed to digitize your selling by increasing security and
            efficiency {font}
          </h3>
        </div>
        <div className="flex flex-wrap gap-4 text-2xl [&>*]:text-primary hover:[&>*]:text-secondary [&>*]:underline ">
          <Link href="/admin"> Admin</Link>
          <Link href="/cashier"> Sale</Link>
          {permissions.includes("can-view-user") && (
            <Link href="/admin/users">Users checked</Link>
          )}
          {/* <Link href="/admin/users"> Users</Link> */}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 text-xl ">
        {!user_id && (
          <div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-[var(--primary)] py-5">
                LOGIN
              </h1>
            </div>
            <div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full md:w-[350px] lg:w-[420px]
         
          "
              >
                <div>
                  {error && (
                    <div className="font-bold text-center text-red-500 animate-bounce ">
                      {error}
                    </div>
                  )}
                </div>
                <CustomInput
                  label="Email"
                  type="text"
                  placeholder="user name"
                  innerClass="border-b-4 border-blue-400 rounded-b-xl text-center lowercase "
                  outerClass=""
                  // {...register("email")}  //has to be spread to the input element
                  register={register("email")}
                  error={errors.email}
                />

                <CustomInput
                  label="Password"
                  type="password"
                  placeholder="******"
                  innerClass="border-b-4 border-blue-400 rounded-b-xl text-center lowercase"
                  outerClass="mt-5"
                  // {...register("email")}  //has to be spread to the input element
                  register={register("password")}
                  error={errors.password}
                />
                {/* <input
              type="submit"
              className="bg-[var(--primary)] py-2 text-white hover:bg-blue-500 my-5 outline-double outline-4 cursor-pointer"
            /> */}
                <button
                  className="flex justify-center py-2 my-5 text-white bg-blue-500 cursor-pointer rounded-xl hover:bg-blue-600 outline-double outline-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loading color="#ffffff" width="30" />
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
            <div className="flex items-center gap-4">
              <VscAccount />
              <VscGear />
              <VscWorkspaceTrusted />
            </div>
          </div>
        )}

        {user_id && (
          <div>
            <button
              onClick={logOut}
              className="px-5 py-2 my-5 text-white bg-blue-400 rounded cursor-pointer hover:bg-blue-500 outline-double outline-4"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <div className="absolute p-2 top-2 right-2">
        <InitialSetUp />
      </div>
    </main>
  );
}
