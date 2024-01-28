<?php

namespace App\Http\Controllers\Application;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ForwardRequestController extends Controller
{
    public function forward(Request $request)
    {
        $accessToken = $request->session()->get('access_token')['token_value'];

        if ($request->input('target') === 'api') {

            if ($request->input('method') === 'GET') {
                $response = Http::withToken($accessToken)->get(env('VITE_API_SERVER') . $request->input('url'));
                if ($response->clientError() || $response->serverError()) {
                    return response($response->body(), $response->status());
                }
                return response($response->body())->withHeaders($response->headers());
            }

            if ($request->input('method') === 'POST') {
                $response = Http::withToken($accessToken)->post(env('VITE_API_SERVER') . $request->input('url'), $request->input('data'));
                if ($response->clientError() || $response->serverError()) {
                    return response($response->body(), $response->status());
                }
                return response($response->body())->withHeaders($response->headers());
            }
        } else if ($request->input('target') === 'auth') {

            if ($request->input('method') === 'GET') {
                $response = Http::withToken($accessToken)->get(env('VITE_AUTH_SERVER') . $request->input('url'));
                if ($response->clientError() || $response->serverError()) {
                    return response($response->body(), $response->status());
                }
                return response($response->body())->withHeaders($response->headers());
            }

            if ($request->input('method') === 'POST') {
                $response = Http::withToken($accessToken)->post(env('VITE_AUTH_SERVER') . $request->input('url'), $request->input('data'));
                if ($response->clientError() || $response->serverError()) {
                    return response($response->body(), $response->status());
                }
                return response($response->body())->withHeaders($response->headers());
            }
        }
    }
}
