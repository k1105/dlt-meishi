import {Header} from "@/components/Header";

export default function RootLayout({
  step,
  isPreviewMode,
  isPreviewUpdated,
  setIsPreviewMode,
  setIsPreviewUpdated,
  children,
}: Readonly<{
  step: number;
  isPreviewMode: boolean;
  isPreviewUpdated: boolean;
  setIsPreviewMode: (isPreviewMode: boolean) => void;
  setIsPreviewUpdated: (isPreviewUpdated: boolean) => void;
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header
        step={step}
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        isPreviewUpdated={isPreviewUpdated}
        setIsPreviewUpdated={setIsPreviewUpdated}
      />
      {children}
    </>
  );
}
