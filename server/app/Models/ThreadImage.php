<?php
// server/app/Models/ThreadImage.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThreadImage extends Model
{
    use HasFactory;

    protected $primaryKey = 'thread_image_id';

    protected $fillable = [
        'thread_id',
        'image_path',
    ];

    public function thread()
    {
        return $this->belongsTo(Thread::class, 'thread_id', 'thread_id');
    }
}
