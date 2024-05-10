import { invoke } from "@tauri-apps/api/tauri";
import { useForm } from "react-hook-form";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileSchema, TypeFileSchema } from "@/lib/types/users";
import { toast } from "sonner";

export default function Upload() {
  const [image, setImage] = React.useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<TypeFileSchema>({
    resolver: zodResolver(FileSchema),
  });

  const uploadFile = async (file: File) => {
    const fileBase64 = await convertToBase64(file);
    const response = await invoke("upload_file", {
      fileData: fileBase64,
      name: file.name,
    });
    console.log("response", response);
    setImage(file);
  };

  const convertToBase64 = async (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve((reader.result as string).split(",")[1]);
        } else {
          reject("No result found");
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // const convertToBase64 = async (file:any) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result.split(",")[1]);
  //     reader.onerror = (error) => reject(error);
  //     reader.readAsDataURL(file);
  //   });
  // };

  const onSubmit = async (data: TypeFileSchema) => {
    console.log("data", data);
    let user = data;
    try {
      const response: any = await invoke("create", { user });
      if (response.status === 200) {
        toast.success("User created successfully");
      } else {
        console.error(response);
      }
    } catch (error: any) {
      toast.error("User creation failed, check your inputs and try again");
    }
  };

  const key = "db-edited";
  const value = "localhost";

  const keyValue = async () => {
    try {
      const response: any = await invoke("save_store_value", { key, value });
      toast.success("Successfully");
    } catch (error: any) {
      toast.error("Creation failed, check your inputs and try again");
    }
  };

  const getValue = async () => {
    try {
      const response: any = await invoke("get_store_value", { key });
      toast.success(response);
    } catch (error: any) {
      toast.error("Creation failed, check your inputs and try again");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-5 m-2 bg-white rounded">
          <h1>Upload File</h1>
          <input
            type="file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                uploadFile(file);
              }
            }}
          />
        </div>
        <h1>Preview</h1>
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="w-1/4 h-1/4"
          />
        )}
      </form>
      <div className="flex justify-between gap-4">
        <button
          onClick={keyValue}
          className="p-2 m-2 text-white bg-blue-500 rounded"
        >
          Push
        </button>
        <button
          onClick={getValue}
          className="p-2 m-2 text-white bg-blue-500 rounded"
        >
          Get Value
        </button>
      </div>
    </div>
  );
}
