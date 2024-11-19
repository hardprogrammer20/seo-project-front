<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{
    /**
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function openTheGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function googleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $user = User::where('email', $googleUser->getEmail())->first();
    
            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => bcrypt(uniqid()),
                ]);
            }
            Auth::login($user);
            if (!Auth::check()) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            $token = $user->createToken('GoogleAuthToken')->plainTextToken;
            return redirect('http://localhost:3000?token='.$token);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage() . ' Unable to authenticate with Google.'], 500);
        }
    }
}
