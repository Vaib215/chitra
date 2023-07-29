"use client";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export default function UploadBtn({
  loading,
}: {
  loading: boolean;
}) {
  return (
    <Button type="submit" disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Upload
    </Button>
  );
}
