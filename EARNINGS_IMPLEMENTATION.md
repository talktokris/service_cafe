# Earnings System Implementation

## Overview

A comprehensive earnings management system for paid members that allows them to view their earnings history, track withdrawals, and create withdrawal requests.

## Features Implemented

### 1. Earnings Page (`/member-earnings`)

-   **Access**: Paid members only
-   **Default View**: Current month's records
-   **Features**:
    -   Date range search (from/to date)
    -   Transaction type filter (Earning, Withdrawal, Redistribution)
    -   Summary cards showing:
        -   Total Earnings (all time + this month)
        -   Total Withdrawals (all time + this month)
        -   Total Redistributions (all time + this month)
        -   Current Earning Balance (available for withdrawal)

### 2. Withdrawal Component (`WithdrawComponent.jsx`)

-   **Modal-based withdrawal request form**
-   **Features**:
    -   Shows current earning balance
    -   Input validation for withdrawal amount
    -   Minimum withdrawal amount validation (₹1000)
    -   Maximum withdrawal validation (cannot exceed balance)
    -   Processing status indicator

### 3. Database Schema

Added new fields to `earnings` table:

-   `debit_credit` (1=debit, 2=credit)
-   `transation_type` (1=earning, 2=withdrawal, 3=redistribution)
-   `withdrawal_status` (0=pending, 1=done)
-   `redistribution_status` (0=not distributed, 1=distributed)

## Files Created/Modified

### Frontend Components

1. **`resources/js/Pages/Members/PaidMember/Earnings.jsx`**

    - Main earnings page component
    - Summary cards, search/filter functionality
    - Data table with transaction history

2. **`resources/js/Pages/Members/PaidMember/WithdrawComponent.jsx`**

    - Withdrawal request modal
    - Form validation and submission

3. **`resources/js/Pages/Members/Components/PaidMemberSidebar.jsx`**
    - Added "Earnings" menu item

### Backend Components

1. **`app/Http/Controllers/EarningsController.php`**

    - `index()`: Display earnings page with data
    - `createWithdrawal()`: Process withdrawal requests
    - `getEarnings()`: API endpoint for AJAX requests
    - `calculateEarningsSummary()`: Calculate summary statistics

2. **`app/Models/Earning.php`**

    - Updated fillable fields and casts for new columns

3. **`routes/web.php`**
    - Added earnings routes with proper middleware protection

### Database

1. **Migration**: `2025_10_04_032216_add_debit_credit_and_status_fields_to_earnings_table.php`

    - Added new fields to earnings table

2. **Environment Configuration**
    - Added `WITHDRAWAL_MIN_AMOUT=1000` to `.env`

## API Endpoints

### GET `/member-earnings`

-   **Purpose**: Display earnings page
-   **Access**: Paid members only
-   **Parameters**:
    -   `from_date` (optional): Start date filter
    -   `to_date` (optional): End date filter
    -   `type` (optional): Transaction type filter (1=earning, 2=withdrawal, 3=redistribution)

### POST `/withdrawal/create`

-   **Purpose**: Create withdrawal request
-   **Access**: Paid members only
-   **Parameters**:
    -   `amount` (required): Withdrawal amount

### GET `/api/member-earnings`

-   **Purpose**: AJAX endpoint for earnings data
-   **Access**: Paid members only
-   **Parameters**: Same as `/member-earnings`

## Security Features

1. **Middleware Protection**:

    - `auth`: User must be logged in
    - `user.type:member`: User must be a member
    - `user.type:paid`: User must be a paid member (for earnings routes)

2. **Data Validation**:

    - Withdrawal amount validation
    - Minimum withdrawal amount check
    - Balance verification
    - Input sanitization

3. **Error Handling**:
    - Comprehensive error messages
    - Logging for debugging
    - Graceful failure handling

## Usage Instructions

### For Paid Members:

1. Navigate to "Earnings" from the sidebar menu
2. View current month's earnings by default
3. Use date filters to view specific periods
4. Use type filter to view specific transaction types
5. Click "Create Withdrawal" to request a withdrawal
6. Enter withdrawal amount (minimum ₹1000)
7. Submit request (processed within 1-2 business days)

### For Administrators:

-   Withdrawal requests are logged in the `earnings` table
-   Status can be updated manually in the database
-   All transactions are tracked with proper audit trail

## Testing

-   ✅ Routes registered successfully
-   ✅ Database migration executed
-   ✅ 384 existing earnings records found
-   ✅ 28 paid members available for testing
-   ✅ No linting errors in created files

## Future Enhancements

1. Admin panel for managing withdrawal requests
2. Email notifications for withdrawal status updates
3. Automated withdrawal processing
4. Advanced reporting and analytics
5. Export functionality for earnings data
