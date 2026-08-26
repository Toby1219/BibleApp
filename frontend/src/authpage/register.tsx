import { useState } from "react";
import { BookOpen, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import "./register.css";

import { apiRequest } from "../axiosinit";
import { useNavigate } from "react-router-dom";
import { useGlobalVar } from "../globalvar";

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erromsg, setErrormsg] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();
    const setUserData = useGlobalVar((state)=>state.setUserData);


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try{
            await apiRequest("post", "/auth/register", {username:name, email:email, password:password});
            const loginResponse = await apiRequest("post", "/auth/login", {email:email, password:password});
            if (loginResponse.status === 200){
                const meResponse = await apiRequest("get", "/auth/me");
                setUserData(meResponse.data);
                navigate("/")
            }
            
        }catch (err: any){
            setIsError(true);
            setErrormsg(err.response.data.detail);
        }
        
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#FAF7F1] px-4 py-12">
            <style>{`
        
      `}</style>

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

                    <p className="bh-mono text-[13px] uppercase text-stone-400 text-center mb-2">
                        Begin reading
                    </p>
                    <h1 className="bh-display text-2xl sm:text-3xl text-stone-900 text-center mb-8">
                        Create your account
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="bh-mono text-[11px] uppercase text-stone-500 block mb-2"
                            >
                                Full name
                            </label>
                            <div className="relative">
                                <User
                                    size={15}
                                    strokeWidth={2}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                                />
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    className="bh-body w-full text-sm pl-10 pr-3 py-3 rounded-sm border border-stone-200 bg-stone-50 text-stone-800 placeholder:text-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2942] focus-visible:border-[#7B2942] transition-colors"
                                />
                            </div>
                        </div>

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
                            <label
                                htmlFor="password"
                                className="bh-mono text-[11px] uppercase text-stone-500 block mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={14}
                                    strokeWidth={1.5}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                                />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 8 characters"
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
                        
                        {isError && <span className="text-red-600 text-sm"> {erromsg} </span>}
                          
                        <button
                            type="submit"
                            className="w-full bh-mono text-[13px] uppercase tracking-widest py-3.5 mt-2 bg-[#7B2942] text-white hover:bg-[#6A2338] transition-colors rounded-sm"
                        >
                            Create account
                        </button>
                    
                        <p className="bh-body text-[11px] text-stone-400 text-center pt-1">
                            By continuing you agree to Holy Bible's Terms and Privacy Policy.
                        </p>
                    </form>
                </div>

                <p className="bh-body text-sm text-stone-500 text-center mt-7">
                    Already have an account?{" "}
                    <a
                        onClick={() => navigate("/login")}
                        className="text-[#7B2942] hover:opacity-70 transition-opacity"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
