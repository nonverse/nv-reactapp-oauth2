<?php

namespace App\Http\Controllers\Application;

use App\Contracts\Repository\RefreshTokenRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Services\AccessTokenService;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    /**
     * @var RefreshTokenRepositoryInterface
     */
    private RefreshTokenRepositoryInterface $refreshTokenRepository;

    /**
     * @var AccessTokenService
     */
    private AccessTokenService $accessTokenService;

    public function __construct(
        RefreshTokenRepositoryInterface $refreshTokenRepository,
        AccessTokenService              $accessTokenService
    )
    {
        $this->refreshTokenRepository = $refreshTokenRepository;
        $this->accessTokenService = $accessTokenService;
    }

    /**
     * Initialise the applications
     * This will authenticate the application with the authentication server and
     * Get the tokens that are necessary to communicate with the API
     *
     * @param Request $request
     * @return JsonResponse|array|string
     */
    public function initialize(Request $request): JsonResponse|array|string
    {
        /**
         * Get user authentication cookie (Managed by auth server)
         */
        $jwt = $request->cookie('user_session');

        /**
         * If cookies is not found, request authorization
         * The auth server will automatically request the user to login if not already before authorizing the application
         */
        if (!$jwt) {
            return $this->requestAuthorization($request);
        }

        try {
            /**
             * Decode JWT containing user authentication details
             */
            $user = (array)JWT::decode($jwt, new Key(config('auth.public_key'), 'RS256'));

            /**
             * If an unexpired access token exists in session already, no need to get new access token
             */
            if ($accessToken = $request->session()->get('access_token')) {
                if ($accessToken['token_expiry'] instanceof CarbonInterface && $accessToken['token_expiry']->isAfter(CarbonImmutable::now()->addMinute())) {
                    $decodedToken = (array)JWT::decode($accessToken['token_value'], new Key(config('auth.public_key'), 'RS256'));
                    if ($decodedToken['sub'] === $user['sub']) {
                        return new JsonResponse([
                            'success' => true
                        ]);
                    }
                }
            }

            /**
             * Get user's refresh token from database
             */
            $refreshToken = $this->refreshTokenRepository->getUsingUserId($user['sub']);
            return new JsonResponse($this->accessTokenService->usingRefreshToken($request, $refreshToken));
        } catch (ExpiredException $e) {
            /**
             * If authentication is invalid (expired), request authorization
             * The auth server will automatically request the user to login if not already before authorizing the application
             */
            return $this->requestAuthorization($request);
        } catch (ModelNotFoundException $e) {
            /**
             * If a refresh token is not found...
             */
            if ($request->input('code')) {
                /**
                 * If an authorization code is present in the request, get access token using authorization code
                 */
                return new JsonResponse($this->accessTokenService->usingAuthCode($request));
            } else {
                /**
                 * If an authorization code is not found, request authorization
                 * It is assumed that the user is logged in at this point. The auth server will still check for an
                 * authenticated user but it is expected that the application will be authorized without requiring login
                 */
                return $this->requestAuthorization($request);
            }
        }
    }

    /**
     * Return the authorization request url.
     * The front-end application will handle the redirect
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function requestAuthorization(Request $request): JsonResponse
    {
        $query = http_build_query([
            'response_type' => 'code',
            'client_id' => env('OAUTH_CLIENT_ID'),
            'redirect_uri' => env('APP_URL'),
            'scope' => implode(" ", config('auth.scopes')),
        ]);

        $request->session()->invalidate();
        $request->session()->regenerateToken();


        return new JsonResponse([
            'success' => false,
            'data' => [
                'auth_url' => env('VITE_AUTH_SERVER') . 'oauth/authorize?' . $query
            ],
            'error' => 'unauthenticated'
        ], 401);
    }
}
