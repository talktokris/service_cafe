<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Branch;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = [
            [
                'name' => 'Main Branch - Downtown',
                'code' => 'BR001',
                'address' => '123 Main Street, Downtown, City Center',
                'phone' => '+1-555-0101',
                'email' => 'downtown@servecafe.com',
                'manager_name' => 'John Smith',
                'commission_rate' => 5.00, // 5% commission rate
            ],
            [
                'name' => 'Mall Branch',
                'code' => 'BR002',
                'address' => '456 Shopping Mall, West Side',
                'phone' => '+1-555-0102',
                'email' => 'mall@servecafe.com',
                'manager_name' => 'Sarah Johnson',
                'commission_rate' => 4.50, // 4.5% commission rate
            ],
            [
                'name' => 'Airport Branch',
                'code' => 'BR003',
                'address' => '789 Airport Terminal, Gate A12',
                'phone' => '+1-555-0103',
                'email' => 'airport@servecafe.com',
                'manager_name' => 'Mike Davis',
                'commission_rate' => 6.00, // 6% commission rate (higher for airport location)
            ],
            [
                'name' => 'University Branch',
                'code' => 'BR004',
                'address' => '321 University Campus, Student Center',
                'phone' => '+1-555-0104',
                'email' => 'university@servecafe.com',
                'manager_name' => 'Lisa Wilson',
                'commission_rate' => 4.00, // 4% commission rate
            ],
        ];

        foreach ($branches as $branch) {
            Branch::create($branch);
        }
    }
}
