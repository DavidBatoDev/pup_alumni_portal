<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // GET all users
    public function index()
    {
        return User::all();
    }

    // GET a single user by id
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return $user;
    }

    // POST to create a new user
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer',
            'job' => 'required|string|max:255'
        ]);

        $user = User::create($request->all());

        return response()->json($user, 201);
    }

    // PUT/PATCH to update an existing user
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $request->validate([
            'name' => 'string|max:255',
            'age' => 'integer',
            'job' => 'string|max:255'
        ]);

        $user->update($request->all());

        return response()->json($user, 200);
    }

    // DELETE a user by id
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}

