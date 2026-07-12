<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{User, Role};
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();
        
        // 1. Create the Main Super Admin (Your primary account)
        $admin = User::firstOrCreate([
            'id' => (string) Str::uuid(),
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'password' => 'password',
            'is_active' => true,
        ]);

        $superAdminRole = Role::where('name', 'SUPER_ADMIN')->first();
        if ($superAdminRole) {
            $admin->roles()->attach($superAdminRole->id);
        }

        // 2. Get all available roles to assign randomly to others
        $roles = Role::where('name', '!=', 'SUPER_ADMIN')->get();

        // 3. Generate 40 Mock Users
        for ($i = 0; $i < 40; $i++) {
            $user = User::firstOrCreate([
                'id' => (string) Str::uuid(),
                'first_name' => $faker->firstName,
                'last_name' => $faker->lastName,
                'email' => $faker->unique()->safeEmail,
                'password' => 'password',
                'is_active' => $faker->boolean(80), // 80% chance of being active
                'created_at' => $faker->dateTimeBetween('-6 months', 'now'),
            ]);

            // Assign 1 to 3 random roles to each user to test your UI badges
            if ($roles->count() > 0) {
                $randomRoles = $roles->random(rand(1, min(3, $roles->count())))->pluck('id');
                $user->roles()->attach($randomRoles);
            }
        }
    }
}