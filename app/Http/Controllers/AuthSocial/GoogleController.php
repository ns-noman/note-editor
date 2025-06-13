<?php

namespace App\Http\Controllers\frontend;

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
    public function googleredirect()
    {
        try {
    
            $user = Socialite::driver('google')->user();
            $isUser = User::where('google_id', $user->id)->first();
     
            if($isUser){
                Auth::login($isUser);
                return redirect('user/profile');
            }else{
                
                $data['name'] = $user->name;
                $data['google_id'] = $user->id;
                $data['password'] = encrypt('4444');
                
                $emailExist = User::where('email', $user->email)->first();
                if(!$emailExist){
                    $data['email'] = $user->email;
                    $createUser = User::create($data);
                    Auth::login($createUser);
                }else{
                    $emailExist->update($data);
                    Auth::login($emailExist);
                }
                
                return redirect('user/profile');
            }
    
        } catch (Exception $exception) {
            dd($exception->getMessage());
        }
    }
}
