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
import { invoke } from "@tauri-apps/api/tauri";
import { useThemeStore } from "@/lib/store";
import React from "react";

// export function ClosingDialog({ open, onConfirm, onCancel}: any) {
export function ClosingDialog({
  //   open,
  onConfirm,
  onCancel,
}: {
  //   open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const handleConfirm = async () => {
    useThemeStore.setState({ server_running: "" });
    useThemeStore.setState({ permissions: [] });
    useThemeStore.setState({ token: null });

    await invoke("unload_resources");
    onConfirm();
  };

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Closing</DialogTitle>
          <DialogDescription>
            Are you sure you want to close the application? Make sure you have
            saved all your work.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleConfirm}>Close</Button>
          <Button variant="outline" onClick={onCancel}>
            Abort
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
