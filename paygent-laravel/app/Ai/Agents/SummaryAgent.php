<?php

namespace App\Ai\Agents;

use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;
use Stringable;

#[Provider(Lab::Groq)]
#[Model('llama-3.3-70b-versatile')]
class SummaryAgent implements Agent
{
    use Promptable;

    public function instructions(): Stringable|string
    {
        return <<<'PROMPT'
Kamu adalah analis keuangan PayGent untuk freelancer Indonesia.
Buat ringkasan singkat, actionable, dan ramah dalam Bahasa Indonesia berdasarkan data invoice user.
Fokus pada: total tagihan, status pembayaran, invoice pending, dan 2-3 rekomendasi tindak lanjut.
Gunakan bullet point singkat. Maksimal 180 kata.
PROMPT;
    }
}
