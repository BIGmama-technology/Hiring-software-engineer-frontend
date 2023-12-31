import AuthForm from '@/components/auth-form'
import "./global.css"

export default function Home() {

    return (
        <div className="flex flex-col items-center justify-center h-[100svh] gap-y-5">
            <h1 className="landingTitle text-center">
                Real-Time document collaboration platform
            </h1>
            <AuthForm />
        </div>
    )
}