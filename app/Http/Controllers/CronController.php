<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CronController extends Controller
{
    // This controller is now empty as the cron functionality has been moved to:
    // - CronLeadershipChaqueMatchController for leadership chaque match cron jobs
    // - CronMemberActivationController for member activation cron jobs
    // - CronDistributionController for redistribution distribution cron jobs
    
    // If you need to add new cron jobs here, you can do so.
}