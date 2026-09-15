<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserGroup extends Model
{
    protected $connection = 'landlord';
    
    public $timestamps = false;
    protected $fillable = [
        'name',
        'description',        
    ];
}
