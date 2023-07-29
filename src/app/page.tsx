import ImageUploadCard from "@/components/ImageUploadCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-2 items-center md:justify-center p-4 bg-background">
      <ImageUploadCard/>
    </main>
  );
}
