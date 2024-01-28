<?php

namespace App\Http\Controllers\Application;

use App\Http\Controllers\Controller;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthorizationTokenController extends Controller
{
    /**
     * Set authorization token to session
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function set(Request $request): JsonResponse
    {
        $request->validate([
            'authorization_token' => 'required'
        ]);

        /**
         * Store authorization token in session
         */
        $request->session()->put('authorization_token', [
            'token_value' => $request->input('authorization_token'),
            'authorized_action' => $request->input('authorized_action')
        ]);

        return new JsonResponse([
            'data' => [
                'success' => true
            ]
        ]);
    }

    /**
     * Check if application has a valid authorization token stored
     *
     * @param Request $request
     * @return Application|Response|JsonResponse|\Illuminate\Contracts\Foundation\Application|ResponseFactory
     */
    public function check(Request $request): Application|Response|JsonResponse|\Illuminate\Contracts\Foundation\Application|ResponseFactory
    {
        $request->validate([
            'action_id' => 'required'
        ]);

        /**
         * Check if authorization token exists in session
         */
        if (!$token = $request->session()->get('authorization_token')) {
            return response('No authorization token', 401);
        }

        /**
         * Try to decode authorization token and check if it is expired
         */
        try {
            $jwt = (array)JWT::decode($token['token_value'], new Key(config('auth.public_key'), 'RS256'));
        } catch (ExpiredException $e) {
            return response('Authorization token has expired', 401);
        }

        /**
         * Check if authorization token was issued for requested action
         */
        if ($jwt['aci'] !== $request->input('action_id')) {
            return response('Invalid authorization token', 401);
        }

        return new JsonResponse([
            'data' => [
                'success' => true
            ]
        ]);
    }
}
