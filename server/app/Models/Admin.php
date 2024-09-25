<?php
// server/app/Models/Admin.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Admin extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $table = 'admin'; // Specify the table name

    protected $primaryKey = 'admin_id'; // Specify the primary key

    protected $fillable = [
        'first_name', 'last_name', 'email', 'password', 'phone', 'role'
    ];

    // JWT methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
