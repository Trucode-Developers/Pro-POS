"use client";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useThemeStore } from "@/lib/store";
import { toast } from "sonner";
import Info from "@/components/info";

const Server = () => {
  // const [serverPort, setServerAddr] = useState("");
  const server_running = useThemeStore((state) => state.server_running);

  async function broadcastService() {
    const address: string = await invoke("start_server");
    useThemeStore.setState({ server_running: address }),
      // console.log("Server started at:", address);
      // setServerAddr(address);
    toast.info(
      <Info
        title="Server Started!"
        message={`Server started and broadcasting on the network at port ${address}`}
      />,
      { duration: 10000, position: "top-right" }
    );
  }
  async function stopBroadCastService() {
    const address: string = await invoke("stop_broadcast");
    useThemeStore.setState({ server_running: "" });
    toast.info(
      <Info
        title="Server Stopped!"
        message={`Server stopped broadcasting on the network`}
      />,
      { duration: 10000, position: "top-right" }
    );
  }

  return (
    <div>
      <div className="flex gap-4">
        {server_running ? (
          <div>
            <button
              className="p-4 text-white bg-red-500 rounded"
              onClick={stopBroadCastService}
            >
              Stop Broadcasting
            </button>
            <div>
              <p className="text-xl">
                Server running on: {" "} 
                <span className="text-primary">
                  {server_running}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <button
            onClick={broadcastService}
            className="p-4 text-white bg-blue-500 rounded"
          >
            Start Broadcast Service
          </button>
        )}
      </div>
    </div>
  );
};

export default Server;
