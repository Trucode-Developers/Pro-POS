"use client";
import Image from "next/image";
// import { Inter } from "next/font/google";
import { invoke } from "@tauri-apps/api/tauri";
import Link from "next/link";
import { VscAccount, VscGear, VscWorkspaceTrusted } from "react-icons/vsc";
import { InitialSetUp } from "./initialSetUp";
import logo from "@/public/pos.png";

// const inter = Inter({ subsets: ["latin"] });
import { cn } from "@/lib/utils";
import { useThemeStore, logOut } from "@/lib/store";
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
      const { permissions, status, serial_number }: any = response;
      if (status === 200) {
        const { Ok } = permissions;
        useThemeStore.setState({ permissions: Ok });
        useThemeStore.setState({ token: serial_number });
        reset();
        router.push("/admin/users");
      } else {
        setError("Invalid credentials!");
        console.error(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const permissions: string[] = useThemeStore((state) => state.permissions);
  const token = useThemeStore((state) => state.token);

  // const logOut = async () => {
  //   useThemeStore.setState({ permissions: [] });
  //   useThemeStore.setState({ token: null });
  // };

  return (
    <main className="relative grid min-h-screen md:grid-cols-2">
      <div className="flex-col items-center justify-center hidden gap-4 px-2 bg-gray-300 md:flex md:px-4">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 md:h-40 md:w-40">
            <Image
              src={logo}
              alt="main pic"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <h1 className="text-2xl text-[var(--primary)]">Welcome Back </h1>
          <h1 className="text-2xl text-red-500">Professional Point Of Sale</h1>
          <h3
            className={cn("text-center px-5 md:px-10 lg:px-24 italic")}
            style={{ fontSize: `${font}px` }}
          >
            We are committed to digitize your selling by increasing{" "}
            <span className="font-bold text-blue-500 capitalize">security</span>{" "}
            and {" "}
            <span className="font-bold text-blue-500 capitalize">
              efficiency
            </span>
            .
          </h3>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 text-xl ">
        {!token && (
          <div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-[var(--primary)] py-5">
                LOGIN
              </h1>
            </div>
            <div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full md:w-[350px] lg:w-[420px]"
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

        {token && (
          <div>
            <button
              onClick={logOut}
              className="px-5 py-2 my-5 text-white bg-blue-400 rounded cursor-pointer hover:bg-blue-500 outline-double outline-4"
            >
              Logout
            </button>
            <div className="flex flex-wrap gap-4 text-2xl [&>*]:text-primary hover:[&>*]:text-secondary [&>*]:underline ">
              <Link href="/admin"> Admin</Link>
              <Link href="/cashier"> Sale</Link>
              {permissions.includes("can-view-user") && (
                <Link href="/admin/users">Users checked</Link>
              )}
            </div>
          </div>
        )}
        <div>{token}</div>
      </div>
      <div className="absolute p-2 top-2 right-2">
        <InitialSetUp />
      </div>
    </main>
  );
}
