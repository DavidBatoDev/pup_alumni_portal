<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    use HasFactory;

    protected $primaryKey = 'thread_id';

    protected $fillable = [
        'title',
        'description',
        'author_id',
        'views',
    ];

    public function author()
    {
        return $this->belongsTo(Alumni::class, 'author_id', 'alumni_id');
    }

    public function images()
    {
        return $this->hasMany(ThreadImage::class, 'thread_id', 'thread_id');
    }

    public function votes()
    {
        return $this->hasMany(Vote::class, 'thread_id', 'thread_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'thread_id', 'thread_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'thread_tags', 'thread_id', 'tag_id');
    }
}
