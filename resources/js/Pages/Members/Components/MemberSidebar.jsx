import React from "react";
import PaidMemberSidebar from "./PaidMemberSidebar";
import FreeMemberSidebar from "./FreeMemberSidebar";

export default function MemberSidebar({ isOpen, onClose, user, memberType }) {
    // Conditionally render the appropriate sidebar based on member type
    if (memberType === "paid") {
        return (
            <PaidMemberSidebar isOpen={isOpen} onClose={onClose} user={user} />
        );
    }

    // Default to free member sidebar
    return <FreeMemberSidebar isOpen={isOpen} onClose={onClose} user={user} />;
}
