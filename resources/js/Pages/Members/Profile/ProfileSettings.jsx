import { Head, useForm } from "@inertiajs/react";
import MemberDashboardLayout from "../Components/MemberDashboardLayout";
import Breadcrumb from "../Components/Breadcrumb";

export default function ProfileSettings({ auth, user, flash }) {
    const memberType = auth.user.member_type || "free";
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        gender: user.gender || "",
        country: user.country || "Nepal",
        email: user.email || "",
        phone: user.phone || "+977",
        address: user.address || "",
    });

    // Comprehensive list of countries
    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
        "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
        "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon",
        "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
        "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
        "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia",
        "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
        "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
        "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
        "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
        "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
        "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
        "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama",
        "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
        "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
        "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
        "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
        "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
        "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
        "Zambia", "Zimbabwe"
    ];

    // Phone number validation
    const handlePhoneChange = (e) => {
        let value = e.target.value;
        
        // Ensure it starts with +977
        if (!value.startsWith('+977')) {
            value = '+977' + value.replace(/[^0-9]/g, '');
        } else {
            // Keep only +977 and digits after it
            value = '+977' + value.substring(4).replace(/[^0-9]/g, '');
        }
        
        setData("phone", value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update"), {
            onSuccess: () => {
                // Keep the updated values in the form
                // Don't reset the form
            },
        });
    };

    return (
        <MemberDashboardLayout
            title="Profile Settings - Serve Cafe"
            user={auth.user}
            memberType={memberType}
        >
            <Head title="Profile Settings" />

            <div>
                {/* Breadcrumb */}
                <Breadcrumb
                    title="Profile Settings"
                    links={["Home", "Profile Settings"]}
                    icon={
                        <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    }
                />

                {/* Success Message */}
                {flash.success && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-green-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">
                                    {flash.success}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-8 text-gray-900">
                                <form
                                    onSubmit={submit}
                                    className="space-y-6 border border-gray-200 rounded-lg bg-gray-50 p-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* First Name */}
                                        <div>
                                            <label
                                                htmlFor="first_name"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                First Name
                                            </label>
                                            <input
                                                id="first_name"
                                                type="text"
                                                value={data.first_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "first_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                maxLength={255}
                                            />
                                            {errors.first_name && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.first_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Last Name */}
                                        <div>
                                            <label
                                                htmlFor="last_name"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Last Name
                                            </label>
                                            <input
                                                id="last_name"
                                                type="text"
                                                value={data.last_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "last_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                maxLength={255}
                                            />
                                            {errors.last_name && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.last_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Gender */}
                                        <div>
                                            <label
                                                htmlFor="gender"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Gender
                                            </label>
                                            <select
                                                id="gender"
                                                value={data.gender}
                                                onChange={(e) =>
                                                    setData(
                                                        "gender",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="">
                                                    Select Gender
                                                </option>
                                                <option value="male">
                                                    Male
                                                </option>
                                                <option value="female">
                                                    Female
                                                </option>
                                                <option value="other">
                                                    Other
                                                </option>
                                            </select>
                                            {errors.gender && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.gender}
                                                </p>
                                            )}
                                        </div>

                                        {/* Country */}
                                        <div>
                                            <label
                                                htmlFor="country"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Country
                                            </label>
                                            <select
                                                id="country"
                                                value={data.country}
                                                onChange={(e) =>
                                                    setData(
                                                        "country",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            >
                                                <option value="">Select Country</option>
                                                {countries.map((country) => (
                                                    <option key={country} value={country}>
                                                        {country}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.country && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.country}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Email Address *
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                required
                                                maxLength={255}
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label
                                                htmlFor="phone"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Phone Number
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={handlePhoneChange}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="+977XXXXXXXXX"
                                                minLength={13}
                                                maxLength={14}
                                                pattern="\+977[0-9]{9,10}"
                                            />
                                            <div className="mt-1 text-xs text-gray-500">
                                                Format: +977 followed by 9-10 digits
                                            </div>
                                            {errors.phone && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label
                                            htmlFor="address"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Address
                                        </label>
                                        <textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            maxLength={500}
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.address}
                                            </p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            {data.address.length}/500 characters
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex items-center justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center px-4 py-2 bg-amber-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-amber-900 focus:bg-amber-900 active:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-25"
                                        >
                                            {processing
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MemberDashboardLayout>
    );
}
