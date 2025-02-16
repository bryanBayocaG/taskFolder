import { LoginForm } from '@/components/signup-form'

function Home() {
    return (
        <div className="grid h-full lg:grid-cols-2 ">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="/MYTlight.png"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:hidden"
                />
                <img
                    src="/MYTdark.png"
                    alt="Image"
                    className="hidden absolute inset-0 h-full w-full object-cover dark:block"
                />
            </div>
        </div>
    )
}

export default Home
