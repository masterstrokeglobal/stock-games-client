import LoginForm from "@/components/auth/login-form";

const LoginPage = () => {
    return (
        <div className="w-full lg:grid min-h-screen lg:grid-cols-2 ">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid max-w-md gap-6">
                    <div className="grid gap-2 ">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted bg-cover bg-[url('/images/placeholder.jpg')] lg:block" />
        </div>
    )
}

export default LoginPage;