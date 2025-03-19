import {Header} from "@/components/Header";

export default function RootLayout({
  step,
  children,
}: Readonly<{
  step: number;
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header step={step} />
      {children}
    </>
  );
}
