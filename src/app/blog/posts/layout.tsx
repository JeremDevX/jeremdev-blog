import "../../globals.css";

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex flex-col w-full">{children}</main>;
}
