import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const Connector = () => {
  const [isServer, setIsServer] = useState(true);
  const [serverPort, setServerAddr] = useState("");

  async function broadcastService() {
    const address: string = await invoke("start_server");
    console.log("Server started at:", address);
    setServerAddr(address);
  }
  async function stopbroadcastService() {
    const address: string = await invoke("stop_broadcast");
    console.log("Server stopped at:", address);
  }

  async function scanService() {
    //example serverPort only
    let port = serverPort.split(":")[1];
    let ip = serverPort.split(":")[0];
    //convert to number
    let broadcastPort = parseInt(port);
    console.log("Scanning for servers on port:", broadcastPort);
    console.log("Scanning for servers on ip:", ip);
    // const availableServers: any = await invoke("scan_for_servers", {
    //   broadcastPort,
    // });
    const availableServers: any = await invoke("scan_for_servers", {
      ip,
      broadcastPort,
    });

    // If availableServers is null
    if (!availableServers) {
      console.log("No servers found");
      return;
    }

    console.log("response json:", availableServers);

    // Extract db_url and storage_path
    const { db_url, storage_path } = availableServers;

    if (db_url && storage_path) {
      console.log("Database URL:", db_url);
      console.log("Storage Path:", storage_path);
    } else {
      console.log("Required data not found in the response");
    }
  }

  return (
    <div>
      <h1>{isServer ? "Server Mode" : "Client Mode"}</h1>
      <div className="flex gap-4">
        <button onClick={() => setIsServer(true)}>Set as Server</button>
        <button onClick={() => setIsServer(false)}>Set as Client</button>
        <button
          onClick={isServer ? broadcastService : scanService}
          className="p-4 text-white bg-blue-500 rounded"
        >
          {isServer ? "Start Broadcast Service" : "Start Scan Service"}
        </button>
        <button
          className="p-4 text-white bg-red-500 rounded"
          onClick={stopbroadcastService}
        >
          Stop Broadcasting
        </button>
      </div>
    </div>
  );
};

export default Connector;
