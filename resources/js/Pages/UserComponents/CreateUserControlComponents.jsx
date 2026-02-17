import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function CreateUserControlComponents({
    onClose,
    onSuccess,
    officeProfiles = [],
}) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        address: "",
        gender: "",
        country: "",
        headOfficeId: "",
        branchId: "",
        role: "",
        user_type: "headoffice",
        activeStatus: 1,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get head offices and branch offices
    const headOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "HeadOffice" && profile.deleteStatus === 0
    );
    const branchOffices = officeProfiles.filter(
        (profile) =>
            profile.profileType === "BranchOffice" && profile.deleteStatus === 0
    );

    // Get role options based on office selection
    const getRoleOptions = () => {
        if (formData.headOfficeId && formData.branchId) {
            return [
                { value: "Branch Admin User", label: "Branch Admin User" },
                { value: "Branch Billing User", label: "Branch Billing User" },
            ];
        } else if (formData.headOfficeId) {
            return [
                { value: "Super User", label: "Super User" },
                { value: "Admin User", label: "Admin User" },
                { value: "Account User", label: "Account User" },
                { value: "Billing User", label: "Billing User" },
            ];
        }
        return [];
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Auto-fill name when first_name or last_name changes
        if (name === "first_name" || name === "last_name") {
            setFormData((prev) => ({
                ...prev,
                name: `${prev.first_name} ${prev.last_name}`.trim(),
            }));
        }

        // Auto-fill user_type based on office selection
        if (name === "headOfficeId" || name === "branchId") {
            setFormData((prev) => {
                let userType = "headoffice";
                if (prev.branchId) {
                    userType = "branchOffice";
                }
                return {
                    ...prev,
                    user_type: userType,
                    role: "", // Reset role when office changes
                };
            });
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name) {
            newErrors.first_name = "First name is required";
        }

        if (!formData.last_name) {
            newErrors.last_name = "Last name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Passwords do not match";
        }

        if (!formData.headOfficeId) {
            newErrors.headOfficeId = "Head Office is required";
        }

        if (!formData.role) {
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Refresh CSRF token before submit to avoid 419 when modal has been open a while
            try {
                const refreshRes = await fetch("/refresh-csrf", {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    credentials: "same-origin",
                });
                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    if (data.csrf_token) {
                        const meta = document.querySelector('meta[name="csrf-token"]');
                        if (meta) meta.setAttribute("content", data.csrf_token);
                        if (window.axios) window.axios.defaults.headers.common["X-CSRF-TOKEN"] = data.csrf_token;
                    }
                }
            } catch (_) {
                // Continue with existing token if refresh fails
            }

            router.post("/users", formData, {
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        console.log(
                            "Success message:",
                            page.props.flash.success
                        );
                    }
                    if (page.props.user) {
                        onSuccess(page.props.user);
                    } else {
                        const newUser = {
                            id: Date.now(),
                            ...formData,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        };
                        onSuccess(newUser);
                    }
                },
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (error) {
            console.error("Error creating user:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Create New User
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        First Name *
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.first_name ? "input-error" : ""
                                    }`}
                                    placeholder="Enter first name"
                                />
                                {errors.first_name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.first_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Last Name *
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.last_name ? "input-error" : ""
                                    }`}
                                    placeholder="Enter last name"
                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.last_name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Full Name
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    className="input input-bordered w-full bg-gray-100"
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Auto-filled from first and last name
                                </p>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Gender</span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Country</span>
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select Country</option>
                                <option value="Afghanistan">Afghanistan</option>
                                <option value="Albania">Albania</option>
                                <option value="Algeria">Algeria</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Armenia">Armenia</option>
                                <option value="Australia">Australia</option>
                                <option value="Austria">Austria</option>
                                <option value="Azerbaijan">Azerbaijan</option>
                                <option value="Bahrain">Bahrain</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="Belarus">Belarus</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Brazil">Brazil</option>
                                <option value="Bulgaria">Bulgaria</option>
                                <option value="Cambodia">Cambodia</option>
                                <option value="Canada">Canada</option>
                                <option value="Chile">Chile</option>
                                <option value="China">China</option>
                                <option value="Colombia">Colombia</option>
                                <option value="Croatia">Croatia</option>
                                <option value="Cyprus">Cyprus</option>
                                <option value="Czech Republic">
                                    Czech Republic
                                </option>
                                <option value="Denmark">Denmark</option>
                                <option value="Egypt">Egypt</option>
                                <option value="Estonia">Estonia</option>
                                <option value="Finland">Finland</option>
                                <option value="France">France</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Germany">Germany</option>
                                <option value="Ghana">Ghana</option>
                                <option value="Greece">Greece</option>
                                <option value="Hungary">Hungary</option>
                                <option value="Iceland">Iceland</option>
                                <option value="India">India</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Iran">Iran</option>
                                <option value="Iraq">Iraq</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Israel">Israel</option>
                                <option value="Italy">Italy</option>
                                <option value="Japan">Japan</option>
                                <option value="Jordan">Jordan</option>
                                <option value="Kazakhstan">Kazakhstan</option>
                                <option value="Kenya">Kenya</option>
                                <option value="Kuwait">Kuwait</option>
                                <option value="Latvia">Latvia</option>
                                <option value="Lebanon">Lebanon</option>
                                <option value="Lithuania">Lithuania</option>
                                <option value="Luxembourg">Luxembourg</option>
                                <option value="Malaysia">Malaysia</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Morocco">Morocco</option>
                                <option value="Nepal">Nepal</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="New Zealand">New Zealand</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="Norway">Norway</option>
                                <option value="Oman">Oman</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="Philippines">Philippines</option>
                                <option value="Poland">Poland</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Qatar">Qatar</option>
                                <option value="Romania">Romania</option>
                                <option value="Russia">Russia</option>
                                <option value="Saudi Arabia">
                                    Saudi Arabia
                                </option>
                                <option value="Singapore">Singapore</option>
                                <option value="Slovakia">Slovakia</option>
                                <option value="Slovenia">Slovenia</option>
                                <option value="South Africa">
                                    South Africa
                                </option>
                                <option value="South Korea">South Korea</option>
                                <option value="Spain">Spain</option>
                                <option value="Sri Lanka">Sri Lanka</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Thailand">Thailand</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Ukraine">Ukraine</option>
                                <option value="United Arab Emirates">
                                    United Arab Emirates
                                </option>
                                <option value="United Kingdom">
                                    United Kingdom
                                </option>
                                <option value="United States">
                                    United States
                                </option>
                                <option value="Vietnam">Vietnam</option>
                            </select>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Contact Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Email *</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.email ? "input-error" : ""
                                    }`}
                                    placeholder="Enter email address"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">Phone</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Address</span>
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered w-full"
                                placeholder="Enter address"
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Office Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Office Assignment
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Head Office *
                                    </span>
                                </label>
                                <select
                                    name="headOfficeId"
                                    value={formData.headOfficeId}
                                    onChange={handleInputChange}
                                    className={`select select-bordered w-full ${
                                        errors.headOfficeId
                                            ? "select-error"
                                            : ""
                                    }`}
                                >
                                    <option value="">Select Head Office</option>
                                    {headOffices.map((office) => (
                                        <option
                                            key={office.id}
                                            value={office.id}
                                        >
                                            {office.companyName}
                                        </option>
                                    ))}
                                </select>
                                {errors.headOfficeId && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.headOfficeId}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Branch Office
                                    </span>
                                </label>
                                <select
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">
                                        Select Branch Office (Optional)
                                    </option>
                                    {branchOffices.map((office) => (
                                        <option
                                            key={office.id}
                                            value={office.id}
                                        >
                                            {office.companyName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Role *</span>
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className={`select select-bordered w-full ${
                                        errors.role ? "select-error" : ""
                                    }`}
                                    disabled={!formData.headOfficeId}
                                >
                                    <option value="">Select Role</option>
                                    {getRoleOptions().map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.role}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        User Type
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="user_type"
                                    value={formData.user_type}
                                    className="input input-bordered w-full bg-gray-100"
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Auto-filled based on office selection
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Password
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Password *
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.password ? "input-error" : ""
                                    }`}
                                    placeholder="Enter password"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text">
                                        Confirm Password *
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full ${
                                        errors.password_confirmation
                                            ? "input-error"
                                            : ""
                                    }`}
                                    placeholder="Confirm password"
                                />
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Status
                        </h3>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="activeStatus"
                                checked={formData.activeStatus === 1}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        activeStatus: e.target.checked ? 1 : 0,
                                    }))
                                }
                                className="checkbox checkbox-primary mr-3"
                            />
                            <span className="text-sm text-gray-700">
                                Active Status
                            </span>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                    Creating...
                                </>
                            ) : (
                                "Create User"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
