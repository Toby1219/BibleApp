import { useState } from "react";
import { BookOpen, Eye, EyeOff, Mail, Lock } from "lucide-react";
import "./login.css";

import { apiRequest } from "../axiosinit";
import { useNavigate } from "react-router-dom";
import { useGlobalVar } from "../globalvar";


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const setUserData = useGlobalVar((state)=>state.setUserData);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await apiRequest("post", "/auth/login", {email:email, password:password})
        if (response.status === 200){
            const meResponse = await apiRequest("get", "/auth/me")
            setUserData(meResponse.data);
            navigate("/")
        }
            
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#FAF7F1] px-4 py-12">
            <div className="w-full max-w-sm bh-fade-in">
                {/* Wordmark */}
                <div className="flex items-center justify-center gap-2.5 mb-10">
                    <BookOpen size={20} className="text-[#7B2942]" strokeWidth={1.5} />
                    <span className="bh-mono text-xs uppercase text-stone-900">
                        Holy Bible
                    </span>
                </div>

                {/* Card */}
                <div className="relative bg-white border border-stone-200 px-7 sm:px-9 py-9 sm:py-10">
                    <span className="bh-corner bh-corner-tl border-[#7B2942]/30" />
                    <span className="bh-corner bh-corner-tr border-[#7B2942]/30" />
                    <span className="bh-corner bh-corner-bl border-[#7B2942]/30" />
                    <span className="bh-corner bh-corner-br border-[#7B2942]/30" />

                    <p className="bh-mono text-[12px] uppercase text-stone-400 text-center mb-2">
                        Welcome back
                    </p>
                    <h1 className="bh-display text-2xl sm:text-3xl text-stone-900 text-center mb-8">
                        Sign in to Bible App
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="bh-mono text-[11px] uppercase text-stone-500 block mb-2"
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={15}
                                    strokeWidth={2}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                                />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="bh-body w-full text-sm pl-10 pr-3 py-3 rounded-sm border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2942] focus-visible:border-[#7B2942] transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="password"
                                    className="bh-mono text-[11px] uppercase text-stone-500"
                                >
                                    Password
                                </label>
                                <a
                                    href="#forgot"
                                    className="bh-mono text-[9px] uppercase text-[#7B2942] hover:opacity-70"
                                >
                                    Forgot?
                                </a>
                            </div>
                            <div className="relative">
                                <Lock
                                    size={15}
                                    strokeWidth={2}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                                />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="bh-body w-full text-sm pl-10 pr-10 py-3 rounded-sm border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2942] focus-visible:border-[#7B2942] transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#7B2942] transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={15} strokeWidth={2} />
                                    ) : (
                                        <Eye size={15} strokeWidth={2} />
                                    )}
                                </button>
                            </div>
                        </div>
                    
                        <button
                            type="submit"
                            className="w-full bh-mono text-[13px] uppercase tracking-widest py-3.5 mt-2 bg-[#7B2942] text-white hover:bg-[#6A2338] transition-colors rounded-sm"
                        >
                            Sign in
                        </button>
                    </form>
                </div>

                <p className="bh-body text-sm text-stone-500 text-center mt-7">
                    New to Folio?{" "}
                    <a
                        href="#signup"// link to signup page using Routes
                        className="text-[#7B2942] hover:opacity-70 transition-opacity"
                    >
                        Create an account
                    </a>
                </p>
            </div>
        </div>
    );
}
