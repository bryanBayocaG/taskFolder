import { LoginForm } from '@/components/signup-form'
import { useAuthStore, useColumnStore } from '@/store'

function Home() {
    const columns = useColumnStore((state) => state.columns)
    const currentAuth = useAuthStore((state) => state.currentAuth)
    console.log("outside", columns, currentAuth)
    return (
        <div className="grid h-full lg:grid-cols-2 ">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block z-10">
                <img
                    src="/MYTlight.png"
                    alt="Image"
                    className="absolute h-full w-full object-cover dark:hidden"
                />
                <img
                    src="/MYTdark.png"
                    alt="Image"
                    className="hidden absolute  h-full w-full object-cover dark:block"
                />
            </div>
        </div>
    )
}

export default Home
