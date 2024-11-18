<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $primaryKey = 'tag_id';

    protected $fillable = [
        'name',
    ];

    public function threads()
    {
        return $this->belongsToMany(Thread::class, 'thread_tags', 'tag_id', 'thread_id', 'tag_id', 'thread_id');
    }
}
