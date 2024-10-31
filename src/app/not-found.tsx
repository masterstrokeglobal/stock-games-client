import Link from "next/link"

const PageNotFound = () => {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <FrownIcon className="mx-auto h-24 w-24 text-primary" />
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Oops, page not found!</h1>
                <p className="mt-4 text-muted-foreground">
                   {` The page you're looking for doesn't seem to exist. Let's get you back on track.`}
                </p>
                <div className="mt-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        prefetch={false}
                    >
                        Go Back Home
                    </Link>
                </div>
            </div>
        </div>
    )
}

function FrownIcon({ className }: PropsWithClassName) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
        </svg>
    )
}

export default PageNotFound;