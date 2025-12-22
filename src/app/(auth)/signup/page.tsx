import { AuthForm } from '@/components/auth/AuthForm';

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gradient mb-2">EasyStay</h1>
                    <p className="text-secondary font-medium">Join our network of affiliate marketers</p>
                </div>
                <AuthForm type="signup" />
            </div>
        </div>
    );
}
