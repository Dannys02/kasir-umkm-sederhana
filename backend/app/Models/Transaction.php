<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
  protected $fillable = ["reference_no", "total_price"];

  public function details()
  {
    return $this->hasMany(TransactionDetail::class);
  }
}
