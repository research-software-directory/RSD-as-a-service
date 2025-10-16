
/**
 * Invite layout includes article element with white background centered on the page
 * @param param0
 * @returns
 */
export default function InvitePageLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <article className="bg-base-100 p-12 rounded-md mx-auto my-auto md:max-w-[40rem]">
      {children}
    </article>
  )
}
