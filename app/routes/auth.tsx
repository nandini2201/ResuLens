import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: 'ResuLens | Auth' },
    { name: 'description', content: 'Sign in to ResuLens' },
])

const  Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = new URLSearchParams(location.search).get("next") || "/";
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, navigate, next])

    return (
        <main className="auth-screen">
            <section className="auth-panel">
                <Link to="/" className="brand-mark">ResuLens</Link>
                <div className="space-y-3 text-center">
                    <p className="eyebrow">Secure workspace</p>
                    <h1>Resume analysis, saved to your account.</h1>
                    <p className="muted-copy">Sign in to upload a PDF, generate an ATS score, and reopen reports later.</p>
                </div>
                {isLoading ? (
                    <button className="auth-button animate-pulse" disabled>
                        Signing in...
                    </button>
                ) : auth.isAuthenticated ? (
                    <button className="auth-button" onClick={auth.signOut}>
                        Log out
                    </button>
                ) : (
                    <button className="auth-button" onClick={auth.signIn}>
                        Continue with Puter
                    </button>
                )}
            </section>
        </main>
    )
}

export default Auth
