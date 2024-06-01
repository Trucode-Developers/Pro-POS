


"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Triangle, Bars } from "react-loader-spinner";
import { relaunch } from "@tauri-apps/api/process";
import { useThemeStore } from "@/lib/store";
import { toast } from "sonner";
import Success from "@/components/success";
import Info from "@/components/info";
import Error from "@/components/error";

export default function InitialSetUp() {
  const activeDB = useThemeStore((state) => state.activeDb);
  const file_storage = useThemeStore((state) => state.storage);

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [path, setFilePath] = useState("");

  const updateStoragePath = async () => {
    await invoke("update_storage_path", { path })
      .then(
        (response: any) => (
          setOpen(false), //close the dialog
          useThemeStore.setState({ storage: response }),
          toast.success(
            <Success
              title="Success!"
              message={"Storage Path Updated Successfully "}
            />,
            {
              duration: 10000,
              position: "top-right",
            }
          )
        )
      )
      .catch(console.error);
  };

  const changeDatabase = async () => {
    await invoke("change_db", { url })
      .then((response) => refresh_page())
      .catch(console.error);
  };

  const revokeDatabase = async () => {
    setUrl("not set");
    await invoke("change_db", { url })
      .then((response) => refresh_page())
      .catch(console.error);
  };

  const refresh_page = async () => {
    await relaunch();
    // console.log("Relaunched");
  };

  const scanService = async () => {
    const server_running = useThemeStore((state) => state.server_running);
    //example serverPort only
    let port = server_running.split(":")[1];
    let ip = server_running.split(":")[0];
    //convert to number
    let broadcastPort = parseInt(port);
    // console.log("Scanning for servers on port:", broadcastPort);
    // console.log("Scanning for servers on ip:", ip);
    // const availableServers: any = await invoke("scan_for_servers", {
    //   broadcastPort,
    // });
    const availableServers: any = await invoke("scan_for_servers", {
      ip,
      broadcastPort,
    });

    // If availableServers is null
    if (!availableServers) {
      // console.log("No servers found");
      toast.error(
        <Error
          title="Error!!!"
          message="No servers found in the network. Please check your network connection."
        />,
        { duration: 10000, position: "top-right" }
      );
      return;
    }

    // console.log("response json:", availableServers);
    // Extract db_url and storage_path
    const { db_url, storage_path } = availableServers;

    if (db_url && storage_path) {
      // console.log("Database URL:", db_url);
      // console.log("Storage Path:", storage_path);
      toast.info(
        <Info
          title="Connection Established!"
          message={`Connected to database at ${db_url} and storage path at ${storage_path}`}
        />,
        { duration: 10000, position: "top-right" }
      );
    } else {
      console.log("Required data not found in the response");
      toast.error(
        <Error
          title="Error!!!"
          message="No servers found in the network. Please check your network connection."
        />,
        { duration: 10000, position: "top-right" }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <p>postgres://postgres:Server@2244@192.168.0.105:5433/pos</p>
            </div>
            <div className="min-w-[100px]">
              {activeDB === "postgres" ? (
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

        <div>
          <button
            onClick={scanService}
            className="p-4 text-white bg-blue-500 rounded"
          >
            Start Scan Service
          </button>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right">
              Connection
            </Label>
            <div className="flex col-span-3 gap-2 capitalize">
              {activeDB === "postgres" ? "multi-node mode" : "single node mode"}
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
        <div className="flex justify-center gap-8 ">
          {activeDB === "postgres" && (
            <button
              type="button"
              onClick={revokeDatabase}
              className="px-4 py-2 text-white bg-green-700 rounded"
            >
              Switch to single node
            </button>
          )}
          <button
            type="submit"
            onClick={changeDatabase}
            className="px-4 py-2 text-white bg-blue-900 rounded"
          >
            Save changes
          </button>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right">
              File storage:
            </Label>
            <div className="flex flex-wrap items-center col-span-3 gap-2 cursor-default select-none ">
              <div className="font-bold opacity-30">{file_storage} </div>
              <div className="text-sm italic text-primary">
                (Leave empty and save to default to local)
              </div>
            </div>
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="username" className="text-right">
              Set Path:
            </Label>
            <Input
              placeholder="Storage Path"
              className="col-span-3"
              onChange={(e) => setFilePath(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center gap-8 ">
          <button
            type="submit"
            onClick={updateStoragePath}
            className="px-4 py-2 text-white bg-blue-900 rounded"
          >
            Update path
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
