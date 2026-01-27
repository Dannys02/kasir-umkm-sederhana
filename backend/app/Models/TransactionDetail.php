<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
  protected $fillable = [
    "transaction_id",
    "product_id",
    "product_name",
    "qty",
    "price_at_buy",
  ];

  public function product()
  {
    return $this->belongsTo(Product::class);
  }
}
