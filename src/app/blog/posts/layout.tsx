export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="post">{children}</main>;
}
