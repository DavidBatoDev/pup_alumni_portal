<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterAlumniRequest extends FormRequest
{
    public function authorize()
    {
        // If you want to authorize this request for all users, return true
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:alumni',
            'password' => 'required|string|min:6|confirmed',
        ];
    }
}
