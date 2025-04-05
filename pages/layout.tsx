import {Header} from "@/components/Header";

export default function RootLayout({
  step,
  isPreviewMode,
  setIsPreviewMode,
  children,
}: Readonly<{
  step: number;
  isPreviewMode: boolean;
  setIsPreviewMode: (isPreviewMode: boolean) => void;
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header
        step={step}
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
      />
      {children}
    </>
  );
}
