import PrimaryButton from "@/Components/PrimaryButton";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <PublicLayout
            title="Email Verification - Serve Cafe | Verify Your Account"
            description="Verify your Serve Cafe account email address to complete registration and access all features."
            keywords="email verification, verify account, serve cafe registration, account activation, email confirmation kathmandu"
            canonical="https://servecafe.com/email/verify"
        >
            <Head title="Email Verification - Serve Cafe" />

            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center mb-8">
                        <img
                            src="/assets/logo.png"
                            alt="Serve Cafe Logo"
                            className="h-16 w-16 object-contain"
                        />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verify your email address
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Thanks for signing up! Before getting started, could you
                        verify your email address by clicking on the link we
                        just emailed to you? If you didn't receive the email, we
                        will gladly send you another.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {status === "verification-link-sent" && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                A new verification link has been sent to the
                                email address you provided during registration.
                            </div>
                        )}

                        <div className="space-y-4">
                            <form onSubmit={submit}>
                                <PrimaryButton
                                    className="w-full"
                                    disabled={processing}
                                >
                                    Resend Verification Email
                                </PrimaryButton>
                            </form>

                            <div className="text-center">
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="underline text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
