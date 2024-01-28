<?php

namespace App\Http\Middleware;

use App\Contracts\Repository\RefreshTokenRepositoryInterface;
use App\Http\Controllers\Application\ApiController;
use App\Services\AccessTokenService;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Closure;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RefreshAccessToken
{
    /**
     * @var AccessTokenService
     */
    private AccessTokenService $accessTokenService;

    /**
     * @var RefreshTokenRepositoryInterface
     */
    private RefreshTokenRepositoryInterface $refreshTokenRepository;

    public function __construct(
        AccessTokenService              $accessTokenService,
        RefreshTokenRepositoryInterface $refreshTokenRepository
    )
    {
        $this->accessTokenService = $accessTokenService;
        $this->refreshTokenRepository = $refreshTokenRepository;
    }

    /**
     * Handle an incoming request.
     * Get new access token if token is already expired or about to expire
     *
     * @param Request $request
     * @param Closure(Request): (Response) $next
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $accessToken = $request->session()->get('access_token');
        $jwt = $request->cookie('user_session');
        if (!$jwt) {
            return (new ApiController($this->refreshTokenRepository, $this->accessTokenService))->requestAuthorization($request);
        }
        try {
            $user = (array)JWT::decode($request->cookie('user_session'), new Key(config('auth.public_key'), 'RS256'));
        } catch (Exception $e) {
            return (new ApiController($this->refreshTokenRepository, $this->accessTokenService))->requestAuthorization($request);
        }
        try {
            $refreshToken = $this->refreshTokenRepository->getUsingUserId($user['sub']);
            if ($accessToken['token_expiry'] instanceof CarbonInterface) {
                if ($accessToken['token_expiry']->isBefore(CarbonImmutable::now()->addMinute()) || $accessToken['token_expiry']->eq(CarbonImmutable::now()->addMinute())) {
                    $this->accessTokenService->usingRefreshToken($request, $refreshToken);
                }
            }
        } catch (Exception) {
            return $next($request);
        }
        return $next($request);
    }
}
