<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddAuthorizationToken
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $data = $request->input('data');
        if ($data && array_key_exists('requires_authorization', $data)) {
            if (!$token = $request->session()->get('authorization_token')) {
                return $next($request);
            }
            $data['authorization_token'] = $token['token_value'];
            $request->merge(['data' => $data]);
        }
        return $next($request);
    }
}
