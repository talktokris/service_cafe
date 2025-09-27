<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PackageOffer;

class PackageOfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'package_name' => 'Basic Package',
                'package_amount' => 5000,
                'valid_from_date' => now()->toDateString(),
                'valid_to_date' => now()->addMonths(6)->toDateString(),
                'status' => 1,
            ],
            [
                'package_name' => 'Premium Package',
                'package_amount' => 10000,
                'valid_from_date' => now()->toDateString(),
                'valid_to_date' => now()->addMonths(12)->toDateString(),
                'status' => 1,
            ],
            [
                'package_name' => 'Enterprise Package',
                'package_amount' => 25000,
                'valid_from_date' => now()->toDateString(),
                'valid_to_date' => now()->addMonths(24)->toDateString(),
                'status' => 1,
            ],
            [
                'package_name' => 'Starter Package',
                'package_amount' => 2500,
                'valid_from_date' => now()->toDateString(),
                'valid_to_date' => now()->addMonths(3)->toDateString(),
                'status' => 0,
            ],
            [
                'package_name' => 'VIP Package',
                'package_amount' => 50000,
                'valid_from_date' => now()->addDays(30)->toDateString(),
                'valid_to_date' => now()->addMonths(12)->toDateString(),
                'status' => 1,
            ],
        ];

        foreach ($packages as $package) {
            PackageOffer::create($package);
        }
    }
}