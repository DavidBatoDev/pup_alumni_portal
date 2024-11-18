<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ThreadTag extends Pivot
{
    use HasFactory;

    protected $primaryKey = 'thread_tag_id';

    protected $fillable = [
        'thread_id',
        'tag_id',
    ];
}
