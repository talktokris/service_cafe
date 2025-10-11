<?php
header('Content-Type: application/json');

$gitHash = trim(shell_exec('cd /home4/servi5ne/repositories/service_cafe && git rev-parse --short HEAD 2>/dev/null') ?? 'unknown');
$gitBranch = trim(shell_exec('cd /home4/servi5ne/repositories/service_cafe && git rev-parse --abbrev-ref HEAD 2>/dev/null') ?? 'unknown');
$lastCommit = trim(shell_exec('cd /home4/servi5ne/repositories/service_cafe && git log -1 --pretty=format:"%h - %s (%ci)" 2>/dev/null') ?? 'unknown');

echo json_encode([
    'current_hash' => $gitHash,
    'branch' => $gitBranch,
    'last_commit' => $lastCommit,
    'expected_hash' => '40a435b',
    'is_latest' => ($gitHash === '40a435b'),
    'server_time' => date('Y-m-d H:i:s'),
], JSON_PRETTY_PRINT);
