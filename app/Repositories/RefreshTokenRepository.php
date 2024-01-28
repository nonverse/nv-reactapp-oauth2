<?php

namespace App\Repositories;

use App\Contracts\Repository\RefreshTokenRepositoryInterface;
use App\Models\RefreshToken;
use Illuminate\Database\Eloquent\Model;

class RefreshTokenRepository extends Repository implements RefreshTokenRepositoryInterface
{

    public function model(): string
    {
        return RefreshToken::class;
    }

    public function getUsingUserId(string $userId): Model
    {
        return $this->getBuilder()->where('user_id', $userId)->firstOrFail();
    }
}
