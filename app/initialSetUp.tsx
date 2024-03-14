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
import { useEffect, useState } from "react";

export function InitialSetUp() {
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
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>SetUp Database</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
          <p>postgres://postgres:Server@2244@localhost/pos</p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="name" className="text-right">
              Connection
            </Label>
            <div className="flex col-span-3 gap-2">
              <Switch />
              <p>Connect to network database?</p>
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
          <button
            type="button"
            onClick={revokeDatabase}
            className="px-4 py-2 text-white bg-green-700 rounded"
          >
            Work remotely
          </button>
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
