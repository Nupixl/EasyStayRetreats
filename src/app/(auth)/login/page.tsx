import { AuthForm } from '@/components/auth/AuthForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gradient mb-2">EasyStay</h1>
                    <p className="text-secondary font-medium">Log in to your affiliate dashboard</p>
                </div>
                <AuthForm type="login" />
            </div>
        </div>
    );
}
