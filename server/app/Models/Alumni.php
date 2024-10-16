<?php

// app/Models/Alumni.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Alumni extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $table = 'alumni';

    protected $primaryKey = 'alumni_id';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = true;

    protected $fillable = [
        'first_name', 'last_name', 'email', 'password', 'phone', 'date_of_birth',
        'gender', 'graduation_year', 'degree', 'major', 'current_job_title',
        'current_employer', 'linkedin_profile', 'profile_picture'
    ];

    // Define relationship to Address model
    public function address()
    {
        return $this->hasMany(Address::class, 'alumni_id', 'alumni_id');
    }

    // Define relationship to EmploymentHistory model
    public function employmentHistory()
    {
        return $this->hasMany(EmploymentHistory::class, 'alumni_id', 'alumni_id');
    }

    // Define relationship to EducationHistory model
    public function educationHistory()
    {
        return $this->hasMany(EducationHistory::class, 'alumni_id', 'alumni_id');
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
