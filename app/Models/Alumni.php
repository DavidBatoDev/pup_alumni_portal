<?php
// app/Models/Alumni.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Alumni extends Authenticatable implements JWTSubject
{
    use HasFactory;

    // Specify the table name
    protected $table = 'alumni';

    // Specify the primary key field
    protected $primaryKey = 'alumni_id';

    // Indicate if the primary key is auto-incrementing (true by default)
    public $incrementing = true;

    // Specify the key type if it's not 'int' (but it's 'int' in your case)
    protected $keyType = 'int';

    // If your table has timestamps (created_at, updated_at), ensure it's set to true (default behavior)
    public $timestamps = true;

    // Fillable fields
    protected $fillable = [
        'first_name', 'last_name', 'email', 'password', 'phone', 'date_of_birth',
        'gender', 'graduation_year', 'degree', 'major', 'current_job_title',
        'current_employer', 'linkedin_profile', 'profile_picture'
    ];

    // Define relationship to Address model
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
