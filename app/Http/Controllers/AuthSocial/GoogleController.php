<?php

namespace App\Http\Controllers\AuthSocial;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Auth;        
use Exeption;

class GoogleController extends Controller
{
    public function googlepage()
    {
        return Socialite::driver('google')->redirect();
    }
    public function googleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $user = User::updateOrCreate([
                'google_id' => $googleUser->id,
            ], [
                'name' => $googleUser->name,
                'email' => $googleUser->email,
            ]);
            Auth::login($user);
            return redirect('/dashboard');
        } catch (Exception $exception) {
            return response()->json($exception->getMessage(), $exception->getStatusCode());
        }
    }
}
