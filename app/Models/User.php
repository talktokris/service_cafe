<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'user_type',
        'member_type',
        'referral_code',
        'referred_by',
        'branch_id',
        'is_active',
        'first_name',
        'last_name',
        'gender',
        'country',
        'headOfficeId',
        'branchId',
        'createUserId',
        'activeStatus',
        'deleteStatus',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'activeStatus' => 'integer',
            'deleteStatus' => 'integer',
        ];
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['current_wallet_balance'];

    /**
     * Get the roles that belong to the user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    /**
     * Get the branch that the user belongs to.
     */
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Get the user who referred this user.
     */
    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    /**
     * Get the users referred by this user.
     */
    public function referrals()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    /**
     * Get the user's wallet.
     */
    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    /**
     * Get the user's wallet transactions.
     */
    public function walletTransactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }

    /**
     * Get the user's orders.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the user's commission transactions (as upline).
     */
    public function commissionTransactions()
    {
        return $this->hasMany(CommissionTransaction::class, 'upline_user_id');
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole($roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Check if user has any of the given roles.
     */
    public function hasAnyRole($roleNames)
    {
        return $this->roles()->whereIn('name', $roleNames)->exists();
    }

    /**
     * Get the user's primary role.
     */
    public function getPrimaryRoleAttribute()
    {
        return $this->roles()->first();
    }

    /**
     * Get the head office that the user belongs to.
     */
    public function headOffice()
    {
        return $this->belongsTo(OfficeProfile::class, 'headOfficeId');
    }

    /**
     * Get the branch office that the user belongs to.
     */
    public function branchOffice()
    {
        return $this->belongsTo(OfficeProfile::class, 'branchId');
    }

    /**
     * Get the user who created this user.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'createUserId');
    }

    /**
     * Get the users created by this user.
     */
    public function createdUsers()
    {
        return $this->hasMany(User::class, 'createUserId');
    }

    /**
     * Get the menu items created by this user.
     */
    public function createdMenuItems()
    {
        return $this->hasMany(MenuItem::class, 'createUserId');
    }

    /**
     * Get the three stars badge for this user.
     */
    public function badgeThreeStars()
    {
        return $this->hasOne(BadgeThreeStars::class);
    }

    /**
     * Get the five stars badge for this user.
     */
    public function badgeFiveStars()
    {
        return $this->hasOne(BadgeFiveStars::class);
    }

    /**
     * Get the seven stars badge for this user.
     */
    public function badgeSevenStars()
    {
        return $this->hasOne(BadgeSevenStars::class);
    }

    /**
     * Get the mega stars badge for this user.
     */
    public function badgeMegaStars()
    {
        return $this->hasOne(BadgeMegaStars::class);
    }

    /**
     * Get the giga stars badge for this user.
     */
    public function badgeGigaStars()
    {
        return $this->hasOne(BadgeGigaStars::class);
    }

    /**
     * Get transactions where this user is the sender
     */
    public function transactionsFrom()
    {
        return $this->hasMany(Transaction::class, 'transaction_from_id');
    }

    /**
     * Get transactions where this user is the receiver
     */
    public function transactionsTo()
    {
        return $this->hasMany(Transaction::class, 'transaction_to_id');
    }

    /**
     * Get transactions triggered by this user
     */
    public function transactionsTriggered()
    {
        return $this->hasMany(Transaction::class, 'trigger_id');
    }

    /**
     * Get all transactions related to this user
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'transaction_from_id')
            ->orWhere('transaction_to_id', $this->id)
            ->orWhere('trigger_id', $this->id);
    }

    /**
     * Get member upline rank record
     */
    public function memberUplineRank()
    {
        return $this->hasOne(MemberUplineRank::class, 'user_id');
    }

    /**
     * Get upline rank records where this user is a referral
     */
    public function uplineRankAsReferral()
    {
        return $this->hasMany(MemberUplineRank::class, 'refferal_user_id');
    }

    /**
     * Get upline rank records where this user is a three star
     */
    public function uplineRankAsThreeStar()
    {
        return $this->hasMany(MemberUplineRank::class, 'three_star_user_id');
    }

    /**
     * Get upline rank records where this user is a five star
     */
    public function uplineRankAsFiveStar()
    {
        return $this->hasMany(MemberUplineRank::class, 'five_star_user_id');
    }

    /**
     * Get upline rank records where this user is a seven star
     */
    public function uplineRankAsSevenStar()
    {
        return $this->hasMany(MemberUplineRank::class, 'seven_star_user_id');
    }

    /**
     * Get upline rank records where this user is a mega star
     */
    public function uplineRankAsMegaStar()
    {
        return $this->hasMany(MemberUplineRank::class, 'mega_star_user_id');
    }

    /**
     * Get upline rank records where this user is a giga star
     */
    public function uplineRankAsGigaStar()
    {
        return $this->hasMany(MemberUplineRank::class, 'giga_star_user_id');
    }

    /**
     * Scope for active users.
     */
    public function scopeActive($query)
    {
        return $query->where('activeStatus', 1);
    }

    /**
     * Scope for non-deleted users.
     */
    public function scopeNotDeleted($query)
    {
        return $query->where('deleteStatus', 0);
    }

    /**
     * Calculate current wallet balance from transactions
     */
    public function getCurrentWalletBalance()
    {
        $totalCredits = \App\Models\Transaction::where('transaction_to_id', $this->id)
            ->where('debit_credit', 2)
            ->sum('amount');
        
        $totalDebits = \App\Models\Transaction::where('transaction_to_id', $this->id)
            ->where('debit_credit', 1)
            ->sum('amount');
        
        return $totalCredits - $totalDebits;
    }

    /**
     * Get the current wallet balance attribute
     */
    public function getCurrentWalletBalanceAttribute()
    {
        return $this->getCurrentWalletBalance();
    }
}
