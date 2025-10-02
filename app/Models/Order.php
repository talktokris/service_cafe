<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class Order extends Model
{
    protected $fillable = [
        'headOfficeId',
        'branchId',
        'createUserId',
        'tableId',
        'tableOccupiedStatus',
        'buyingPrice',
        'sellingPrice',
        'discountAmount',
        'taxAmount',
        'adminProfitAmount',
        'adminNetProfitAmount',
        'userCommissionAmount',
        'customerType',
        'memberUserId',
        'orderStaredDateTime',
        'orderEndDateTime',
        'paymentType',
        'paymentReference',
        'notes',
        'paymentStatus',
        'deleteStatus',
        'leadershipStatus',
        'chaqueMatchStatus',
        'taxStatus'
    ];

    protected $casts = [
        'buyingPrice' => 'decimal:2',
        'sellingPrice' => 'decimal:2',
        'discountAmount' => 'decimal:2',
        'taxAmount' => 'decimal:2',
        'adminProfitAmount' => 'decimal:2',
        'adminNetProfitAmount' => 'decimal:2',
        'userCommissionAmount' => 'decimal:2',
        'orderStaredDateTime' => 'datetime',
        'orderEndDateTime' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($order) {
            if (empty($order->createUserId) && Auth::check()) {
                $order->createUserId = Auth::id();
            }
        });
    }

    // Relationships
    public function headOffice(): BelongsTo
    {
        return $this->belongsTo(OfficeProfile::class, 'headOfficeId');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(OfficeProfile::class, 'branchId');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'createUserId');
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(RestaurantTable::class, 'tableId');
    }

    public function memberUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'memberUserId');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'orderId');
    }
}
