<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;

class Customer extends Model
{
    use HasFactory;
    use SoftDeletes;

    const LOCATION_BASE_URL = 'https://alamat.thecloudalert.com/api/';

    protected $fillable = [
        'code',
        'name',
        'province',
        'province_id',
        'regency',
        'regency_id',
        'district',
        'district_id',
        'village',
        'village_id',
        'address',
        'postal_code',
    ];

    public function transactionHeaders()
    {
        return $this->hasMany(TransactionHeader::class, 'customer_id');
    }

    public function scopeThisMonth($query)
    {
        return $query->whereBetween('created_at', [
            now()->startOfMonth(),
            now()->endOfMonth(),
        ]);
    }

    public function scopeLastMonth($query)
    {
        return $query->whereBetween('created_at', [
            now()->subMonth()->startOfMonth(),
            now()->subMonth()->endOfMonth(),
        ]);
    }

    public static function getProvinces()
    {
        $response = Http::get(self::LOCATION_BASE_URL . 'provinsi/get/');
        return self::getLocationResponse($response);
    }

    public static function getRegencies($provinceId)
    {
        $response = Http::get(self::LOCATION_BASE_URL . 'kabkota/get/', [
            'd_provinsi_id' => $provinceId
        ]);
        return self::getLocationResponse($response);
    }

    public static function getDistricts($regencyId)
    {
        $response = Http::get(self::LOCATION_BASE_URL . 'kecamatan/get/', [
            'd_kabkota_id' => $regencyId
        ]);
        return self::getLocationResponse($response);
    }

    public static function getVillages($districtId)
    {
        $response = Http::get(self::LOCATION_BASE_URL . 'kelurahan/get/', [
            'd_kecamatan_id' => $districtId
        ]);
        return self::getLocationResponse($response);
    }

    public static function getPostalCodes($regencyId, $districtId)
    {
        $response = Http::get(self::LOCATION_BASE_URL . 'kodepos/get/', [
            'd_kabkota_id' => $regencyId,
            'd_kecamatan_id' => $districtId
        ]);
        return self::getLocationResponse($response);
    }

    protected static function getLocationResponse($response)
    {
        if ($response->successful()) {
            $json = $response->json();
            return $json['result'] ?? [];
        }
        return [];
    }
}
