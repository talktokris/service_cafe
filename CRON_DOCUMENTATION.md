# Serve Cafe - Cron Jobs Documentation

## Overview

This document lists all current and planned cron jobs for the Serve Cafe application. Cron jobs are automated tasks that run at scheduled intervals to maintain system functionality and process data.

---

## Current Cron Jobs

### 1. Activate Member Package

-   **Route**: `/cron/activate-member-package`
-   **Method**: GET
-   **Controller**: `CronController@activateMemberPackage`
-   **Purpose**: Find free members who have sufficient account balance to upgrade to paid membership
-   **Frequency**: Daily (recommended)
-   **Description**:
    -   Finds the latest active package from `package_offers` table where `status = 1`
    -   Validates that today's date falls between `valid_from_date` and `valid_to_date`
    -   Orders by `id DESC` to get the most recent package
    -   Identifies all free members (`user_type='member'` AND `member_type='free'`)
    -   Calculates account balance for each user using transaction history
    -   Returns list of users eligible for package upgrade
-   **Output**: JSON response with eligible users and package details

### 2. Latest Active Package API

-   **Route**: `/api/latest-active-package`
-   **Method**: GET
-   **Controller**: `CronController@getLatestActivePackage`
-   **Purpose**: Provide latest active package data for UI components
-   **Frequency**: On-demand (API call)
-   **Description**: Returns the most recent active package information
-   **Output**: JSON response with package details

### 3. Leadership Chaque Match Processing

-   **Route**: `/cron/leadership-chaque-match`
-   **Method**: GET
-   **Controller**: `CronController@cronLeadershipChaqueMatch`
-   **Purpose**: Process leadership chaque match for eligible orders
-   **Frequency**: Daily (recommended)
-   **Description**:
    -   Fetches orders from `orders` table with specific criteria:
        -   `customerType` = 'member'
        -   `free_paid_member_status` = 1
        -   `paymentStatus` = 1
        -   `leadership_status` = 0
        -   `chaque_match_status` = 0
        -   `tax_status` = 0
        -   `deleteStatus` = 0 (exclude deleted records)
    -   Orders by ID in ascending order for consistent processing
    -   Provides placeholder for future processing logic (commission calculations, status updates, etc.)
    -   Logs execution details for monitoring and debugging
-   **Output**: JSON response with processed order details and execution statistics
-   **Note**: Requires additional fields in orders table: `free_paid_member_status`, `leadership_status`, `chaque_match_status`, `tax_status`

---

## Planned Future Cron Jobs

### 4. Daily Transaction Processing

-   **Route**: `/cron/process-daily-transactions`
-   **Method**: GET
-   **Controller**: `CronController@processDailyTransactions`
-   **Purpose**: Process pending transactions and update account balances
-   **Frequency**: Every 6 hours
-   **Status**: Planned
-   **Description**:
    -   Process pending transactions
    -   Update user account balances
    -   Generate transaction reports
    -   Send notifications for completed transactions

### 5. Commission Calculation

-   **Route**: `/cron/calculate-commissions`
-   **Method**: GET
-   **Controller**: `CronController@calculateCommissions`
-   **Purpose**: Calculate and distribute referral commissions
-   **Frequency**: Daily at 2 AM
-   **Status**: Planned
-   **Description**:
    -   Calculate referral commissions based on MLM structure
    -   Update commission transactions
    -   Distribute earnings to upline members
    -   Generate commission reports

### 6. Package Expiry Check

-   **Route**: `/cron/check-package-expiry`
-   **Method**: GET
-   **Controller**: `CronController@checkPackageExpiry`
-   **Purpose**: Check and handle expired packages
-   **Frequency**: Daily at midnight
-   **Status**: Planned
-   **Description**:
    -   Identify packages nearing expiry
    -   Send renewal reminders
    -   Downgrade expired packages
    -   Update member status

### 7. Wallet Balance Sync

-   **Route**: `/cron/sync-wallet-balances`
-   **Method**: GET
-   **Controller**: `CronController@syncWalletBalances`
-   **Purpose**: Synchronize wallet balances across the system
-   **Frequency**: Every 4 hours
-   **Status**: Planned
-   **Description**:
    -   Recalculate wallet balances from transactions
    -   Fix any discrepancies
    -   Update wallet records
    -   Generate balance reports

### 8. Order Status Updates

-   **Route**: `/cron/update-order-status`
-   **Method**: GET
-   **Controller**: `CronController@updateOrderStatus`
-   **Purpose**: Update order statuses based on business logic
-   **Frequency**: Every 2 hours
-   **Status**: Planned
-   **Description**:
    -   Update pending orders to processing
    -   Mark completed orders as delivered
    -   Handle cancelled orders
    -   Send status notifications

### 8. MLM Tree Structure Sync

-   **Route**: `/cron/sync-mlm-tree`
-   **Method**: GET
-   **Controller**: `CronController@syncMlmTree`
-   **Purpose**: Synchronize MLM tree structure and relationships
-   **Frequency**: Daily at 3 AM
-   **Status**: Planned
-   **Description**:
    -   Update MLM relationships
    -   Recalculate tree positions
    -   Fix orphaned members
    -   Generate tree reports

### 9. Database Cleanup

-   **Route**: `/cron/database-cleanup`
-   **Method**: GET
-   **Controller**: `CronController@databaseCleanup`
-   **Purpose**: Clean up old logs and temporary data
-   **Frequency**: Weekly (Sunday at 1 AM)
-   **Status**: Planned
-   **Description**:
    -   Remove old log files
    -   Clean temporary data
    -   Optimize database tables
    -   Archive old records

### 11. Backup Generation

-   **Route**: `/cron/generate-backup`
-   **Method**: GET
-   **Controller**: `CronController@generateBackup`
-   **Purpose**: Generate automated backups
-   **Frequency**: Daily at 4 AM
-   **Status**: Planned
-   **Description**:
    -   Create database backups
    -   Backup uploaded files
    -   Compress backup files
    -   Send backup notifications

---

## Cron Job Setup Instructions

### Server Configuration

Add the following entries to your server's crontab:

```bash
# Serve Cafe Cron Jobs
# Activate Member Package - Daily at 1 AM
0 1 * * * curl -s http://localhost:8000/cron/activate-member-package

# Leadership Chaque Match Processing - Daily at 1:30 AM
30 1 * * * curl -s http://localhost:8000/cron/leadership-chaque-match

# Process Daily Transactions - Every 6 hours
0 */6 * * * curl -s http://localhost:8000/cron/process-daily-transactions

# Calculate Commissions - Daily at 2 AM
0 2 * * * curl -s http://localhost:8000/cron/calculate-commissions

# Check Package Expiry - Daily at midnight
0 0 * * * curl -s http://localhost:8000/cron/check-package-expiry

# Sync Wallet Balances - Every 4 hours
0 */4 * * * curl -s http://localhost:8000/cron/sync-wallet-balances

# Update Order Status - Every 2 hours
0 */2 * * * curl -s http://localhost:8000/cron/update-order-status

# Sync MLM Tree - Daily at 3 AM
0 3 * * * curl -s http://localhost:8000/cron/sync-mlm-tree

# Database Cleanup - Weekly on Sunday at 1 AM
0 1 * * 0 curl -s http://localhost:8000/cron/database-cleanup

# Generate Backup - Daily at 4 AM
0 4 * * * curl -s http://localhost:8000/cron/generate-backup
```

### Laravel Scheduler Alternative

You can also use Laravel's built-in scheduler by adding to `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    $schedule->call(function () {
        // Call your cron routes here
    })->dailyAt('01:00');
}
```

---

## Monitoring and Logging

### Log Files

All cron jobs should log their execution to:

-   `storage/logs/cron.log`
-   Laravel's default log file: `storage/logs/laravel.log`

### Error Handling

Each cron job includes:

-   Try-catch blocks for error handling
-   Detailed error logging
-   JSON response with success/failure status
-   Email notifications for critical failures

### Performance Monitoring

-   Execution time tracking
-   Memory usage monitoring
-   Database query optimization
-   Response time measurement

---

## Security Considerations

### Authentication

-   Consider adding API keys for cron job authentication
-   Implement IP whitelisting for cron endpoints
-   Use middleware to protect sensitive cron routes

### Rate Limiting

-   Implement rate limiting for cron endpoints
-   Prevent abuse of automated endpoints
-   Monitor unusual activity patterns

---

## Testing Cron Jobs

### Manual Testing

Test each cron job manually by visiting the route in your browser:

```
http://localhost:8000/cron/activate-member-package
http://localhost:8000/cron/leadership-chaque-match
```

### Automated Testing

Create test cases for each cron job to ensure they work correctly:

```php
// Example test case
public function test_activate_member_package_cron()
{
    $response = $this->get('/cron/activate-member-package');
    $response->assertStatus(200);
    $response->assertJson(['success' => true]);
}
```

---

## Maintenance

### Regular Updates

-   Review cron job performance monthly
-   Update documentation when adding new cron jobs
-   Monitor server resources and adjust frequency as needed
-   Test cron jobs after system updates

### Troubleshooting

-   Check server cron logs for execution issues
-   Monitor Laravel logs for application errors
-   Verify database connections and permissions
-   Test individual cron jobs manually when issues arise

---

## Contact Information

For questions or issues related to cron jobs:

-   **Developer**: [Your Name]
-   **Email**: [Your Email]
-   **Last Updated**: [Current Date]
-   **Version**: 1.0

---

_This documentation is maintained alongside the codebase and should be updated whenever new cron jobs are added or existing ones are modified._
