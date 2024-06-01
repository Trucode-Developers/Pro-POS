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
import { useState } from "react";
import { Triangle, Bars } from "react-loader-spinner";
import { invoke } from "@tauri-apps/api/tauri";
import { relaunch } from "@tauri-apps/api/process";
import { useThemeStore } from "@/lib/store";
import { toast } from "sonner";
import Success from "@/components/success";
import Info from "@/components/info";
import Error from "@/components/error";
import { Switch } from "@/components/ui/switch";

interface ServerInfo {
  db_url: string;
  storage_path: string;
}
export default function InitialSetUp() {
  const activeDB = useThemeStore((state) => state.activeDb);
  const file_storage = useThemeStore((state) => state.storage);
  const server_running = useThemeStore((state) => state.server_running);
  const [serverIP, setServerIP] = useState(server_running);
  const [singleNode, setSingleNode] = useState(
    activeDB === "postgres" ? true : false
  );
  // const [singleNode, setSingleNode] = useState(false);

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [path, setFilePath] = useState("");

  const handleSwitchChange = (event: any) => {
    console.log(singleNode);
    setSingleNode(!singleNode);
    console.log(singleNode);
    // if (event.target.checked) {
    //   invoke("change_db", { url: "not set" });
    //   refresh_page();
    // } else {
    //   invoke("change_db", { url: "postgres://postgres:Server@2244@localhost/pos" });
    //   refresh_page();
    // }
  };

  const updateStoragePath = async () => {
    changeDatabase();
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
    try {
      await invoke("change_db", { url });
      refresh_page();
    } catch (error) {
      console.error(error);
    }
  };

  const revokeDatabase = async () => {
    setUrl("not set");
    try {
      await invoke("change_db", { url });
      refresh_page();
    } catch (error) {
      console.error(error);
    }
  };

  const refresh_page = async () => {
    await relaunch();
  };

  const scanService = async () => {
    try {
      const [ip, port] = serverIP.split(":");
      const broadcastPort = parseInt(port, 10);
      //if serverIp is not set
      if (!broadcastPort) {
        toast.error(
          <Error
            title="Error!!!"
            message="Server IP not set. Please start the broadcast service."
          />,
          { duration: 10000, position: "top-right" }
        );
        return;
      }

      const availableServers = await invoke<ServerInfo>("scan_for_servers", {
        ip,
        broadcastPort,
      });

      if (!availableServers) {
        toast.error(
          <Error
            title="Error!!!"
            message="No servers found in the network. Please check your network connection."
          />,
          { duration: 10000, position: "top-right" }
        );
        return;
      }

      const { db_url, storage_path } = availableServers;

      if (db_url && storage_path) {
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
    } catch (error) {
      console.error(error);
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
              {/* <p>postgres://postgres:Server@2244@localhost/pos</p>
              <p>postgres://postgres:Server@2244@192.168.0.105:5433/pos</p> */}
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

        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right">
              Switch Mode:
            </Label>
            <div className="flex items-center col-span-3 gap-2 capitalize">
              <Switch
                id="switch"
                checked={singleNode}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="switch">
                {singleNode ? "Switch to Single Node" : "Switch to Multi Node"}
              </Label>
              {/* {activeDB} */}
            </div>
          </div>

          {/* if its in multi node */}
          {!singleNode ? (
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="name" className="text-right">
                {/* Server IP: */}
              </Label>
              <div className="flex items-center col-span-3 gap-2 capitalize">
                <button
                  type="button"
                  onClick={revokeDatabase}
                  className="px-4 py-2 text-white bg-green-700 rounded"
                >
                  Switch to single node
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="name" className="text-right">
                  {/* heading: */}
                </Label>
                <div className="flex items-center col-span-3 gap-2 mt-10 font-bold capitalize">
                  Scan for available servers in the network
                </div>
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="name" className="text-right">
                  Server IP:
                </Label>
                <div className="flex items-center col-span-3 gap-2 capitalize">
                  <Input
                    type="search"
                    placeholder="e.g: 192.168.0.105:3030"
                    className="col-span-3"
                    value={serverIP}
                    onChange={(e) => setServerIP(e.target.value)}
                  />
                  {/* {serverIP && (
                    <button
                      onClick={scanService}
                      className="w-full p-4 text-white bg-blue-500 rounded"
                    >
                      Scan for Server
                    </button>
                  )} */}
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-2">
                {serverIP && (
                  <button
                    type="submit"
                    onClick={scanService}
                    className="px-4 py-2 text-white duration-300 rounded bg-primary hover:scale-105"
                  >
                    Scan for Server
                  </button>
                )}
              </div>

              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="name" className="text-right">
                  {/* heading: */}
                </Label>
                <div className="flex items-center col-span-3 gap-2 mt-10 font-bold capitalize">
                  or Enter the connection details manually
                </div>
              </div>

              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="name" className="text-right">
                  Connection
                </Label>
                <div className="flex col-span-3 gap-2 text-gray-600 text-opacity-50">
                  e.g: postgres://postgres:Server@2244@192.168.0.105:5433/pos
                </div>
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="username" className="text-right">
                  Postgres Url
                </Label>
                <Input
                  placeholder="e.g: postgres://postgres:Server@2244@localhost/pos"
                  className="col-span-3"
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              {/* <div className="flex justify-center gap-8 ">
                <button
                  type="submit"
                  onClick={changeDatabase}
                  className="px-4 py-2 text-white bg-blue-900 rounded"
                >
                  Save changes
                </button>
              </div> */}

              <div className="grid gap-4 py-4">
                <div className="grid items-center grid-cols-4 gap-4">
                  <Label htmlFor="name" className="text-right">
                    Path:
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
                    Chosen Path:
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
                  className="px-4 py-2 text-white duration-300 rounded bg-primary hover:scale-105"
                >
                  Update path
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
