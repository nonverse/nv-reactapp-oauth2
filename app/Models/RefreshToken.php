<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefreshToken extends Model
{
    use HasFactory;

    /**
     * @var string[]
     */
    public $fillable = [
        'user_id',
        'token'
    ];
}
