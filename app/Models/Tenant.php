<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Multitenancy\Models\Tenant as BaseTenant;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Connection;
use Illuminate\Database\Eloquent\Attributes\Hiiden;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'code', 'database', 'identifier', 'status', 'secret_key', 'public_key', 'api_key'])]
#[Hidden(['secret_key', 'public_key', 'api_key', 'database'])]
#[Connection('landlord')]
class Tenant extends BaseTenant
{
    use SoftDeletes;
    public static $currentTenantId;
    
    
  
     public static function boot()
    {
        parent::boot();

        static::creating(function (Tenant $tenant) {
            $lastId = static::max('id') ?? 0;
            $datePart = date('dm');
            $numberPart = str_pad($lastId + 1, 6, '0', STR_PAD_LEFT);            
            $tenantId = optional(Tenant::current())->id 
                ?? Tenant::latest()->first()?->id ?? 0;
            $model->code = 'S'.$tenantId . $datePart . $numberPart;


        });
    }

    public function tenant_users(){
        return $this->hasMany(TenantUser::class);
    }

    public function users(){
        return $this->hasMany(User::class);
    }   

}
