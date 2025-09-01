import { Head, Link, useForm } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <PublicLayout title="Login - Serve Cafe">
            <div className="hero min-h-[calc(100vh-200px)] bg-base-200">
                <div className="hero-content">
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div className="card-body">
                            <div className="text-center mb-6">
                                <div className="flex justify-center mb-4">
                                    <img
                                        src="/assets/logo.png"
                                        alt="Serve Cafe Logo"
                                        className="w-16 h-16 object-contain"
                                    />
                                </div>
                                <h2 className="card-title justify-center text-2xl">
                                    Sign In
                                </h2>
                                <p className="text-base-content/70">
                                    Enter your credentials to continue
                                </p>
                            </div>

                            {status && (
                                <div className="alert alert-success mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="stroke-current shrink-0 h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <span>{status}</span>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Email
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="Enter your email"
                                        className={`input input-bordered w-full ${
                                            errors.email ? "input-error" : ""
                                        }`}
                                        autoComplete="username"
                                        autoFocus
                                    />
                                    {errors.email && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                {errors.email}
                                            </span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">
                                            Password
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        className={`input input-bordered w-full ${
                                            errors.password ? "input-error" : ""
                                        }`}
                                        autoComplete="current-password"
                                    />
                                    {errors.password && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                {errors.password}
                                            </span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control">
                                    <label className="label cursor-pointer justify-start gap-3">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked
                                                )
                                            }
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text">
                                            Remember me
                                        </span>
                                    </label>
                                </div>

                                <div className="form-control mt-6">
                                    <button
                                        type="submit"
                                        className={`btn bg-amber-800 hover:bg-amber-700 text-white w-full ${
                                            processing ? "loading" : ""
                                        }`}
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Signing in..."
                                            : "Sign In"}
                                    </button>
                                </div>

                                {canResetPassword && (
                                    <div className="text-center">
                                        <Link
                                            href={route("password.request")}
                                            className="link text-amber-800 hover:text-amber-700 text-sm"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                )}

                                <div className="divider">OR</div>

                                <div className="text-center">
                                    <p className="text-sm text-base-content/70 mb-3">
                                        Don't have an account?
                                    </p>
                                    <Link
                                        href={route("register")}
                                        className="btn btn-outline border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white w-full"
                                    >
                                        Create Account
                                    </Link>
                                </div>
                            </form>

                            {/* Test Users Info */}
                            <div className="collapse collapse-arrow bg-base-200 mt-4">
                                <input type="checkbox" />
                                <div className="collapse-title text-sm font-medium">
                                    🧪 Test User Credentials
                                </div>
                                <div className="collapse-content">
                                    <div className="text-xs space-y-2">
                                        <p className="font-semibold">
                                            HeadOffice:
                                        </p>
                                        <p>
                                            • super@servecafe.com (Super Admin)
                                        </p>
                                        <p>
                                            • admin@servecafe.com (System Admin)
                                        </p>
                                        <p className="font-semibold mt-2">
                                            BrandOffice:
                                        </p>
                                        <p>
                                            • branch.admin@servecafe.com (Branch
                                            Manager)
                                        </p>
                                        <p className="font-semibold mt-2">
                                            Members:
                                        </p>
                                        <p>• john@example.com (Paid Member)</p>
                                        <p>• bob@example.com (Free Member)</p>
                                        <p className="text-amber-800 font-semibold mt-2">
                                            Password: password
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
