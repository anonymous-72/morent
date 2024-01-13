export default function MainLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <div>
                {children}
            </div>
        </div>
    )
}