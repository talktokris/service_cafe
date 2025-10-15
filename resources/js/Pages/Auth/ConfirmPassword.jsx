import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, useForm } from "@inertiajs/react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.confirm"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <PublicLayout
            title="Confirm Password - Serve Cafe | Security Verification"
            description="Confirm your password to access this secure area of your Serve Cafe account."
            keywords="confirm password, security verification, serve cafe account, password confirmation kathmandu"
            canonical="https://servecafe.com/confirm-password"
        >
            <Head title="Confirm Password - Serve Cafe" />

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
                        Confirm your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        This is a secure area of the application. Please confirm
                        your password before continuing.
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Enter your password"
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <PrimaryButton
                                    className="w-full"
                                    disabled={processing}
                                >
                                    Confirm
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
