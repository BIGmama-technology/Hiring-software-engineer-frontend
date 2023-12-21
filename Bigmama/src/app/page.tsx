import AuthForm from '@/components/auth-form'
import "./global.css"

export default function Home() {
    return (
        <div className="row">
            <div className="col-6">
                <h1 className="landingTitle">
                    Real-Time document collaboration platform
                </h1>
            </div>
            <div className="col-6 auth-widget">
                <AuthForm />
            </div>
        </div>
    )
}