<?php

namespace App\Services;

class FuzzyService
{
    /**
     * Membership function for PM2.5
     */
    public function pm25Membership($x)
    {
        return [
            'good' => $this->trapezoid($x, 0, 0, 12, 20),
            'moderate' => $this->triangle($x, 15, 30, 45),
            'unhealthy' => $this->trapezoid($x, 40, 55, 300, 300),
        ];
    }

    /**
     * Membership function for MQ-135 (Gas Index)
     */
    public function mq135Membership($x)
    {
        return [
            'low' => $this->trapezoid($x, 0, 0, 100, 200),
            'medium' => $this->triangle($x, 150, 250, 350),
            'high' => $this->trapezoid($x, 300, 400, 1000, 1000),
        ];
    }

    /**
     * Output membership functions (Hazard level)
     */
    private function hazardLow($y)
    {
        return $this->trapezoid($y, 0, 0, 25, 45);
    }

    private function hazardModerate($y)
    {
        return $this->triangle($y, 35, 50, 65);
    }

    private function hazardHigh($y)
    {
        return $this->trapezoid($y, 55, 75, 100, 100);
    }

    /**
     * Triangle membership curve helper
     */
    private function triangle($x, $a, $b, $c)
    {
        if ($x <= $a || $x >= $c) {
            return 0.0;
        }
        if ($x == $b) {
            return 1.0;
        }
        if ($x > $a && $x < $b) {
            return ($x - $a) / ($b - $a);
        }

        return ($c - $x) / ($c - $b);
    }

    /**
     * Trapezoid membership curve helper
     */
    private function trapezoid($x, $a, $b, $c, $d)
    {
        if ($x <= $a || $x >= $d) {
            return 0.0;
        }
        if ($x >= $b && $x <= $c) {
            return 1.0;
        }
        if ($x > $a && $x < $b) {
            return ($x - $a) / ($b - $a);
        }

        return ($d - $x) / ($d - $c);
    }

    /**
     * Calculate crisp hazard rating using Mamdani Fuzzy Inference System
     * Defuzzification method: Centroid (Center of Gravity)
     */
    public function calculateHazard($pm25, $mq135)
    {
        // 1. Fuzzification
        $pm = $this->pm25Membership($pm25);
        $mq = $this->mq135Membership($mq135);

        // 2. Rules Evaluation (MIN operator)
        $r1 = min($pm['good'], $mq['low']);        // Rule 1: Good & Low -> Low
        $r2 = min($pm['good'], $mq['medium']);     // Rule 2: Good & Medium -> Low
        $r3 = min($pm['good'], $mq['high']);       // Rule 3: Good & High -> Moderate

        $r4 = min($pm['moderate'], $mq['low']);     // Rule 4: Moderate & Low -> Low
        $r5 = min($pm['moderate'], $mq['medium']);  // Rule 5: Moderate & Medium -> Moderate
        $r6 = min($pm['moderate'], $mq['high']);    // Rule 6: Moderate & High -> High

        $r7 = min($pm['unhealthy'], $mq['low']);    // Rule 7: Unhealthy & Low -> Moderate
        $r8 = min($pm['unhealthy'], $mq['medium']); // Rule 8: Unhealthy & Medium -> High
        $r9 = min($pm['unhealthy'], $mq['high']);   // Rule 9: Unhealthy & High -> High

        // Aggregation (MAX operator)
        $outLow = max($r1, $r2, $r4);
        $outModerate = max($r3, $r5, $r7);
        $outHigh = max($r6, $r8, $r9);

        // 3. Defuzzification (Centroid Method)
        $numerator = 0.0;
        $denominator = 0.0;

        // Discretize the output range [0, 100] in steps of 2
        for ($y = 0; $y <= 100; $y += 2) {
            $mLow = min($outLow, $this->hazardLow($y));
            $mMod = min($outModerate, $this->hazardModerate($y));
            $mHigh = min($outHigh, $this->hazardHigh($y));

            $mAggregate = max($mLow, $mMod, $mHigh);

            $numerator += $y * $mAggregate;
            $denominator += $mAggregate;
        }

        $score = $denominator > 0 ? ($numerator / $denominator) : 0.0;
        $score = round($score, 1);

        // Descriptive classification mapping
        $label = 'Aman';
        $color = 'text-green-400';
        if ($score > 65) {
            $label = 'Bahaya';
            $color = 'text-red-400';
        } elseif ($score > 35) {
            $label = 'Waspada';
            $color = 'text-yellow-400';
        }

        return [
            'score' => $score,
            'label' => $label,
            'color' => $color,
        ];
    }
}
