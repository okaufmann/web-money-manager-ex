<?php

use Illuminate\Database\Seeder;

class TransactionStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('transaction_status')->insert([
            'name' => 'Reconciled',
            'slug' => 'R',
        ]);

        DB::table('transaction_status')->insert([
            'name' => 'Void',
            'slug' => 'V',
        ]);

        DB::table('transaction_status')->insert([
            'name' => 'Follow Up',
            'slug' => 'F',
        ]);

        DB::table('transaction_status')->insert([
            'name' => 'Duplicate',
            'slug' => 'D',
        ]);
    }
}
