"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VscGear } from "react-icons/vsc";
import { Switch } from "@/components/ui/switch";
import { invoke } from "@tauri-apps/api/tauri";
import { useContext, useState } from "react";
import { ThemeContext } from "./layout";
import { Triangle, Bars } from "react-loader-spinner";

export function InitialSetUp() {
  const getTheme: any = useContext(ThemeContext);
  const [url, setUrl] = useState("");

  const changeDatabase = async () => {
    await invoke("change_db", { url })
      .then((response) => console.log(response))
      .catch(console.error);
  };

  const revokeDatabase = async () => {
    setUrl("not set");
    await invoke("change_db", { url })
      .then((response) => console.log(response))
      .catch(console.error);
  };

  //  const activeDb = async () => {
  //    setUrl("not set");
  //    await invoke("current_active_db")
  //      .then((response) => console.log(response))
  //      .catch(console.error);
  //  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          //   variant="outline"
          className="text-2xl text-black hover:text-[var(--primary)]"
        >
          <VscGear />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] lg:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>SetUp Database</DialogTitle>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogDescription>
                TruePOS gives you the power to run your business from a single
                node or multiple nodes. Set up your database connection here by
                choosing the mode that suits your business.
              </DialogDescription>
              <p>postgres://postgres:Server@2244@localhost/pos</p>
            </div>
            <div className="min-w-[100px]">
              {getTheme.activeDB === "postgres" ? (
                <Bars
                  height="80"
                  width="80"
                  color="#4fa94d"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              ) : (
                <Triangle
                  visible={true}
                  height="80"
                  width="80"
                  color="#f44336"
                  ariaLabel="triangle-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right">
              Connection
            </Label>
            <div className="flex col-span-3 gap-2 capitalize">
              {getTheme.activeDB === "postgres"
                ? "multi-node mode"
                : "single node mode"}
            </div>
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="username" className="text-right">
              Url
            </Label>
            <Input
              placeholder="connected to network"
              className="col-span-3"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between gap-8 ">
          {getTheme.activeDB === "postgres" && (
            <button
              type="button"
              onClick={revokeDatabase}
              className="px-4 py-2 text-white bg-green-700 rounded"
            >
              Switch to single node
            </button>
          )}
          {/* <button
            type="button"
            onClick={revokeDatabase}
            className="px-4 py-2 text-white bg-green-700 rounded"
          >
            Work remotely
          </button> */}
          <button
            type="submit"
            onClick={changeDatabase}
            className="px-4 py-2 text-white bg-blue-900 rounded"
          >
            Save changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
