"use client";
import { ThemeToggleBtn } from "@/components/ThemeToggleBtn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { uploadFile } from "@/lib/appwrite";
import { ToastAction } from "@radix-ui/react-toast";
import { X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import UploadBtn from "./UploadBtn";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";

export default function ImageUploadCard() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(Array.from(selectedFiles));

      const urlsPromiseArray: Promise<string>[] = Array.from(selectedFiles).map(
        (imgFile) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                resolve(event.target.result as string);
              }
            };
            reader.readAsDataURL(imgFile);
          });
        }
      );

      Promise.all(urlsPromiseArray).then((urls) => {
        setImageUrls(urls);
      });
    }
  };

  const uploadImages = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsUploading(true);
    const uploadPromises: any = files?.map(async (file) => {
      const response = await uploadFile(file);
      return response;
    });
    Promise.all(uploadPromises)
      .then((responses) => {
        setIsUploading(false);
        setFiles(null);
        setImageUrls([]);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        responses.forEach((response) => {
          toast({
            title: "Uploaded image successfully",
            description: "Copy the link to clipboard",
            action: (
              <ToastAction
                onClick={() => {
                  navigator.clipboard.writeText(
                    window.location.host + "/api/" + response
                  );
                }}
                altText="Copy Url to clipboard"
              >
                Copy
              </ToastAction>
            ),
          });
        });
      })
      .catch((error) => {
        console.error("Error occurred during file upload:", error);
      })
      .finally(() => {
        setIsUploading(false);
        setFiles(null);
        setImageUrls([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
  };

  return (
    <form onSubmit={uploadImages}>
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Upload Image</span>
            <ThemeToggleBtn />
          </CardTitle>
          <CardDescription>
            Accepts png/jpg/svg/gif/heic formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="picture">Picture</Label>
          <Input
            id="picture"
            type="file"
            onChange={showImages}
            multiple
            accept="image/*"
            ref={fileInputRef}
          />
          {files && files.length !== 0 && (
            <div className="grid grid-cols-3 w-full max-h-48 overflow-y-auto p-4 pl-0 mt-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={url + index} className="relative">
                  <div className="aspect-square relative border-2 border-muted rounded-lg overflow-hidden">
                    <Image
                      src={url}
                      alt={`uploaded file ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    size={"icon"}
                    className="absolute top-1 right-1 w-4 h-4"
                    variant={"destructive"}
                    onClick={(e) => {
                      e.preventDefault();
                      setImageUrls((prevUrls) =>
                        prevUrls.filter((_, i) => i !== index)
                      );
                      setFiles(
                        (prevFiles) =>
                          prevFiles?.filter((_, i) => i !== index) || null
                      );
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="gap-4">
          <UploadBtn loading={isUploading} />
          <Button
            variant={"destructive"}
            type="reset"
            onClick={() => setFiles(null)}
            disabled={isUploading}
          >
            Reset
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
