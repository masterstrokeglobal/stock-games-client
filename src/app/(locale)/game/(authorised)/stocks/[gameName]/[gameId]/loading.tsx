export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-900 bg-opacity-90 fixed inset-0 z-50">
            <div className="relative h-20 w-20">
                {/* Main Spinner */}
                <div className="h-full w-full animate-spin rounded-full border-4 border-solid border-purple-600 border-t-transparent filter drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]"></div>
                {/* Inner glow / static element */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500 opacity-75 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.7)] animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}