<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Graduate extends Model
{
    use HasFactory;

    // Specify the table name (if it doesn't match the pluralized form of the model name)
    protected $table = 'graduates';

    // Specify fillable fields to allow mass assignment
    protected $fillable = [
        'lastname',
        'firstname',
        'middlename',
        'student_number',
        'program',
        'graduation_date',
        'email_address',
        'contact_number',
        'verified_at',
    ];
}
