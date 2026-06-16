export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="studio flex-1 flex flex-col bg-(--studio-bg) text-(--studio-text)">
      {children}
    </div>
  );
}
