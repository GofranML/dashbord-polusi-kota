<?php

namespace App\Http\Middleware;

use App\Models\Device;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IotDeviceAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. No token provided.',
            ], 401);
        }

        $device = Device::where('api_token', $token)->first();

        if (! $device) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Invalid token.',
            ], 401);
        }

        // Update device status and last_seen_at
        $device->update([
            'status' => 'online',
            'last_seen_at' => now(),
        ]);

        // Attach device to the request
        $request->merge(['device' => $device]);

        return $next($request);
    }
}
