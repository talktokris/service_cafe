<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get a paid member user to create transactions for
        $paidMember = User::where('user_type', 'member')
            ->where('member_type', 'paid')
            ->first();

        if (!$paidMember) {
            // Create a paid member if none exists
            $paidMember = User::create([
                'name' => 'Test Paid Member',
                'first_name' => 'Test',
                'last_name' => 'Paid Member',
                'email' => 'paidmember@test.com',
                'password' => bcrypt('password'),
                'user_type' => 'member',
                'member_type' => 'paid',
                'referral_code' => 'paidtest123',
            ]);
        }

        // Create sample transactions
        $transactions = [
            [
                'transaction_nature' => 'Commission Payment',
                'transaction_type' => 'Referral Commission',
                'debit_credit' => 2, // Credit
                'matching_date' => Carbon::now()->subDays(1),
                'transaction_from_id' => null,
                'transaction_to_id' => $paidMember->id,
                'trigger_id' => null,
                'amount' => 50.00,
                'transaction_date' => Carbon::now()->subDays(1),
                'status' => 1,
                'countStatus' => 0,
            ],
            [
                'transaction_nature' => 'Wallet Top-up',
                'transaction_type' => 'Deposit',
                'debit_credit' => 2, // Credit
                'matching_date' => Carbon::now()->subDays(2),
                'transaction_from_id' => null,
                'transaction_to_id' => $paidMember->id,
                'trigger_id' => $paidMember->id,
                'amount' => 100.00,
                'transaction_date' => Carbon::now()->subDays(2),
                'status' => 1,
                'countStatus' => 0,
            ],
            [
                'transaction_nature' => 'Service Fee',
                'transaction_type' => 'Platform Fee',
                'debit_credit' => 1, // Debit
                'matching_date' => Carbon::now()->subDays(3),
                'transaction_from_id' => $paidMember->id,
                'transaction_to_id' => null,
                'trigger_id' => null,
                'amount' => 5.00,
                'transaction_date' => Carbon::now()->subDays(3),
                'status' => 1,
                'countStatus' => 0,
            ],
            [
                'transaction_nature' => 'Commission Payment',
                'transaction_type' => 'Level 2 Commission',
                'debit_credit' => 2, // Credit
                'matching_date' => Carbon::now()->subDays(4),
                'transaction_from_id' => null,
                'transaction_to_id' => $paidMember->id,
                'trigger_id' => null,
                'amount' => 25.00,
                'transaction_date' => Carbon::now()->subDays(4),
                'status' => 1,
                'countStatus' => 0,
            ],
            [
                'transaction_nature' => 'Withdrawal',
                'transaction_type' => 'Cash Out',
                'debit_credit' => 1, // Debit
                'matching_date' => Carbon::now()->subDays(5),
                'transaction_from_id' => $paidMember->id,
                'transaction_to_id' => null,
                'trigger_id' => $paidMember->id,
                'amount' => 75.00,
                'transaction_date' => Carbon::now()->subDays(5),
                'status' => 1,
                'countStatus' => 0,
            ],
            [
                'transaction_nature' => 'Commission Payment',
                'transaction_type' => 'Direct Referral',
                'debit_credit' => 2, // Credit
                'matching_date' => Carbon::now()->subDays(6),
                'transaction_from_id' => null,
                'transaction_to_id' => $paidMember->id,
                'trigger_id' => null,
                'amount' => 30.00,
                'transaction_date' => Carbon::now()->subDays(6),
                'status' => 1,
                'countStatus' => 0,
            ],
            [
                'transaction_nature' => 'Bonus Payment',
                'transaction_type' => 'Monthly Bonus',
                'debit_credit' => 2, // Credit
                'matching_date' => Carbon::now()->subDays(7),
                'transaction_from_id' => null,
                'transaction_to_id' => $paidMember->id,
                'trigger_id' => null,
                'amount' => 40.00,
                'transaction_date' => Carbon::now()->subDays(7),
                'status' => 1,
                'countStatus' => 0,
            ],
            [
                'transaction_nature' => 'Service Fee',
                'transaction_type' => 'Transaction Fee',
                'debit_credit' => 1, // Debit
                'matching_date' => Carbon::now()->subDays(8),
                'transaction_from_id' => $paidMember->id,
                'transaction_to_id' => null,
                'trigger_id' => null,
                'amount' => 2.50,
                'transaction_date' => Carbon::now()->subDays(8),
                'status' => 1,
                'countStatus' => 0,
            ],
        ];

        foreach ($transactions as $transactionData) {
            Transaction::create($transactionData);
        }

        $this->command->info('Sample transactions created successfully!');
    }
}