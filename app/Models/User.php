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
}
