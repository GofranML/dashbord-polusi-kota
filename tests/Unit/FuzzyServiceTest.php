<?php

namespace Tests\Unit;

use App\Services\FuzzyService;
use Tests\TestCase;

class FuzzyServiceTest extends TestCase
{
    private FuzzyService $fuzzyService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->fuzzyService = new FuzzyService;
    }

    /**
     * Test low pollution inputs yield Low Hazard ("Aman").
     */
    public function test_low_pollution_yields_aman()
    {
        $result = $this->fuzzyService->calculateHazard(5, 50);

        $this->assertArrayHasKey('score', $result);
        $this->assertArrayHasKey('label', $result);
        $this->assertArrayHasKey('color', $result);

        $this->assertEquals('Aman', $result['label']);
        $this->assertLessThanOrEqual(35, $result['score']);
        $this->assertEquals('text-green-400', $result['color']);
    }

    /**
     * Test moderate pollution inputs yield Moderate Hazard ("Waspada").
     */
    public function test_moderate_pollution_yields_waspada()
    {
        $result = $this->fuzzyService->calculateHazard(30, 250);

        $this->assertEquals('Waspada', $result['label']);
        $this->assertGreaterThan(35, $result['score']);
        $this->assertLessThanOrEqual(65, $result['score']);
        $this->assertEquals('text-yellow-400', $result['color']);
    }

    /**
     * Test high pollution inputs yield High Hazard ("Bahaya").
     */
    public function test_high_pollution_yields_bahaya()
    {
        $result = $this->fuzzyService->calculateHazard(150, 600);

        $this->assertEquals('Bahaya', $result['label']);
        $this->assertGreaterThan(65, $result['score']);
        $this->assertEquals('text-red-400', $result['color']);
    }
}
