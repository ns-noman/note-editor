<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoteList extends Model
{
    protected $fillable = 
    [
        'user_id',
        'title',
        'details',
        'note_date',
    ];
}
