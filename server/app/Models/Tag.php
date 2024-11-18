<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $primaryKey = 'comment_id';

    protected $fillable = [
        'thread_id',
        'alumni_id',
        'parent_comment_id',
        'content',
    ];

    public function thread()
    {
        return $this->belongsTo(Thread::class, 'thread_id', 'thread_id');
    }

    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_comment_id', 'comment_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_comment_id', 'comment_id');
    }
}
