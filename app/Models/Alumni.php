<?php

// Alumni.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Alumni extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $table = 'alumni';

    protected $fillable = [
        'first_name', 'last_name', 'email', 'password', 'phone', 'date_of_birth', 
        'gender', 'graduation_year', 'degree', 'major', 'current_job_title', 
        'current_employer', 'linkedin_profile', 'profile_picture'
    ];

    public function address()
    {
        return $this->hasOne(Address::class, 'alumni_id', 'alumni_id');
    }

    // JWT methods
    public function getJWTIdentifier()
    {
        return (string) $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
