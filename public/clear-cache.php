<?php
/**
 * Cache Clearing Script
 * 
 * Access this file via: https://yourdomain.com/clear-cache.php?key=YOUR_SECRET_KEY
 * 
 * SECURITY: Set CACHE_CLEAR_KEY in your .env file or change SECRET_KEY below
 */

// Get the base path (assuming this file is in public directory)
$basePath = dirname(__DIR__);
$currentFile = __FILE__;

// Try to find the actual Laravel root by looking for artisan file
// Check common locations based on typical server structures
$possiblePaths = [
    $basePath, // Standard Laravel structure (public is in root)
    $basePath . '/repositories/service_cafe', // If project is in subdirectory
    dirname($basePath) . '/repositories/service_cafe', // Alternative structure
    '/home4/servi5ne/repositories/service_cafe', // Specific server path
    dirname(dirname($basePath)) . '/repositories/service_cafe', // Go up two levels
];

// Also try to detect from current file path
$filePathParts = explode('/', $currentFile);
$publicIndex = array_search('public', $filePathParts);
if ($publicIndex !== false) {
    $detectedPath = implode('/', array_slice($filePathParts, 0, $publicIndex));
    if (!empty($detectedPath)) {
        array_unshift($possiblePaths, $detectedPath);
    }
}

$projectPath = null;
foreach ($possiblePaths as $path) {
    $path = rtrim($path, '/');
    if (file_exists($path . '/artisan')) {
        $projectPath = $path;
        break;
    }
}

// If still not found, use basePath and hope for the best
if (empty($projectPath)) {
    $projectPath = $basePath;
}

$envPath = $projectPath . '/.env';

// Try to read SECRET_KEY from .env file first, otherwise use hardcoded value
$secretKey = null;

// Read from .env file if it exists
if (file_exists($envPath)) {
    $envContent = file_get_contents($envPath);
    // Look for CACHE_CLEAR_KEY in .env
    if (preg_match('/^CACHE_CLEAR_KEY=(.+)$/m', $envContent, $matches)) {
        $secretKey = trim($matches[1], '"\'');
    }
}

// Fallback to hardcoded key if .env doesn't have it
if (empty($secretKey)) {
    $secretKey = '1fEHhL0IW1etCDtyZGohqk0lr5TxSf50'; // Default key (change this if not using .env)
}

// Check if secret key is provided in URL
$providedKey = isset($_GET['key']) ? $_GET['key'] : '';

if (empty($providedKey)) {
    http_response_code(403);
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Access Denied - Clear Cache</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background: #f5f5f5;
            }
            .error-box {
                background: #f8d7da;
                color: #721c24;
                padding: 20px;
                border-radius: 5px;
                border: 1px solid #f5c6cb;
            }
            code {
                background: #fff;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: monospace;
            }
        </style>
    </head>
    <body>
        <div class="error-box">
            <h2>❌ Access Denied</h2>
            <p><strong>Missing key parameter.</strong></p>
            <p>Please access this page with a key parameter:</p>
            <p><code>https://servecafe.com/clear-cache.php?key=YOUR_SECRET_KEY</code></p>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
                <strong>Note:</strong> The secret key should be set in your <code>.env</code> file as <code>CACHE_CLEAR_KEY</code> 
                or hardcoded in this PHP file.
            </p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

if ($providedKey !== $secretKey) {
    http_response_code(403);
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Access Denied - Clear Cache</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background: #f5f5f5;
            }
            .error-box {
                background: #f8d7da;
                color: #721c24;
                padding: 20px;
                border-radius: 5px;
                border: 1px solid #f5c6cb;
            }
            code {
                background: #fff;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: monospace;
            }
        </style>
    </head>
    <body>
        <div class="error-box">
            <h2>❌ Access Denied</h2>
            <p><strong>Invalid key provided.</strong></p>
            <p>The key you provided does not match the configured secret key.</p>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
                <strong>Note:</strong> Make sure you're using the correct key from your <code>.env</code> file 
                (CACHE_CLEAR_KEY) or the hardcoded key in this PHP file.
            </p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Set execution time limit
set_time_limit(300); // 5 minutes

// Find composer path
$composerPath = null;
$composerPaths = [
    '/usr/local/bin/composer',
    '/usr/bin/composer',
    '/opt/cpanel/composer/bin/composer', // cPanel composer
    '/usr/local/cpanel/3rdparty/bin/composer', // cPanel alternative
    'composer', // Try in PATH
];

// First, try to find composer using which/whereis
exec('which composer 2>&1', $whichOutput, $whichReturn);
if ($whichReturn === 0 && !empty($whichOutput) && trim($whichOutput[0]) !== '') {
    $foundPath = trim($whichOutput[0]);
    // Test if it works
    exec($foundPath . ' --version 2>&1', $testOutput, $testReturn);
    if ($testReturn === 0) {
        $composerPath = $foundPath;
    }
}

// If not found, try common paths
if (empty($composerPath)) {
    foreach ($composerPaths as $path) {
        if ($path === 'composer') {
            continue; // Already tried with which
        }
        
        // Try to execute it
        exec($path . ' --version 2>&1', $versionOutput, $versionReturn);
        if ($versionReturn === 0) {
            $composerPath = $path;
            break;
        }
    }
}

// If still not found, try local composer.phar
if (empty($composerPath)) {
    $composerPhar = $projectPath . '/composer.phar';
    if (file_exists($composerPhar)) {
        // Test if php can run it
        exec('php ' . escapeshellarg($composerPhar) . ' --version 2>&1', $pharOutput, $pharReturn);
        if ($pharReturn === 0) {
            $composerPath = 'php ' . escapeshellarg($composerPhar);
        }
    }
}

// Final fallback - try composer in PATH (might work in some environments)
if (empty($composerPath)) {
    $composerPath = 'composer';
}

// Function to execute command and return output
function executeCommand($command, $description, $workingDir, $envVars = []) {
    $output = [];
    $returnVar = 0;
    
    echo "<div style='padding: 10px; margin: 5px 0; background: #f0f0f0; border-left: 4px solid #007bff;'>";
    echo "<strong>Running: {$description}</strong><br>";
    echo "<code style='color: #666;'>{$command}</code><br>";
    echo "<small style='color: #999;'>Working Directory: {$workingDir}</small><br>";
    
    // Build environment variables string
    $envString = '';
    if (!empty($envVars)) {
        foreach ($envVars as $key => $value) {
            $envString .= escapeshellarg($key) . '=' . escapeshellarg($value) . ' ';
        }
    }
    
    // Change to working directory and execute
    $originalDir = getcwd();
    chdir($workingDir);
    
    // Execute with environment variables if provided
    if (!empty($envString)) {
        exec($envString . $command . ' 2>&1', $output, $returnVar);
    } else {
        exec($command . ' 2>&1', $output, $returnVar);
    }
    
    chdir($originalDir);
    
    if ($returnVar === 0) {
        echo "<span style='color: green;'>✓ Success</span><br>";
    } else {
        echo "<span style='color: red;'>✗ Error (Code: {$returnVar})</span><br>";
    }
    
    if (!empty($output)) {
        echo "<pre style='background: #fff; padding: 5px; margin-top: 5px; font-size: 12px;'>" . htmlspecialchars(implode("\n", $output)) . "</pre>";
    }
    
    echo "</div>";
    
    return $returnVar === 0;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clear Cache - Serve Cafe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #007bff;
            padding-bottom: 10px;
        }
        .status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            font-weight: bold;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧹 Cache Clearing Script</h1>
        
        <div class="info">
            <strong>Started at:</strong> <?php echo date('Y-m-d H:i:s'); ?><br>
            <strong>Project Path:</strong> <?php echo htmlspecialchars($projectPath); ?><br>
            <strong>Composer Path:</strong> <?php 
                if (empty($composerPath) || $composerPath === 'composer') {
                    // Test if composer actually works
                    exec('cd ' . escapeshellarg($projectPath) . ' && composer --version 2>&1', $testOutput, $testReturn);
                    if ($testReturn !== 0) {
                        echo '<span style="color: orange;">⚠️ Composer not found - will attempt to use "composer" command</span>';
                    } else {
                        echo htmlspecialchars($composerPath);
                    }
                } else {
                    echo htmlspecialchars($composerPath);
                }
            ?><br>
            <?php if (!file_exists($projectPath . '/artisan')): ?>
                <span style="color: orange;">⚠️ Warning: artisan file not found at this path!</span>
            <?php endif; ?>
        </div>

        <?php
        $allSuccess = true;
        $errors = [];

        // Verify artisan file exists
        if (!file_exists($projectPath . '/artisan')) {
            echo "<div class='status error'>";
            echo "❌ <strong>Error: Cannot find artisan file at: {$projectPath}/artisan</strong><br>";
            echo "Please check the project path configuration.";
            echo "</div>";
            exit;
        }

        // 1. Clear application cache
        if (!executeCommand('php artisan cache:clear', 'Clear Application Cache', $projectPath)) {
            $allSuccess = false;
            $errors[] = 'Failed to clear application cache';
        }

        // 2. Clear configuration cache
        if (!executeCommand('php artisan config:clear', 'Clear Configuration Cache', $projectPath)) {
            $allSuccess = false;
            $errors[] = 'Failed to clear configuration cache';
        }

        // 3. Clear route cache
        if (!executeCommand('php artisan route:clear', 'Clear Route Cache', $projectPath)) {
            $allSuccess = false;
            $errors[] = 'Failed to clear route cache';
        }

        // 4. Clear view cache
        if (!executeCommand('php artisan view:clear', 'Clear View Cache', $projectPath)) {
            $allSuccess = false;
            $errors[] = 'Failed to clear view cache';
        }

        // 5. Clear compiled class file
        if (!executeCommand('php artisan clear-compiled', 'Clear Compiled Classes', $projectPath)) {
            $allSuccess = false;
            $errors[] = 'Failed to clear compiled classes';
        }

        // 6. Rebuild autoloader (optional - skip if composer not available)
        $composerCommand = $composerPath . ' dump-autoload';
        
        // Determine HOME directory from project path (e.g., /home4/servi5ne/repositories/service_cafe -> /home4/servi5ne)
        $homeDir = null;
        
        // Try to extract from project path first
        if (preg_match('#^(/home[0-9]*/[^/]+)#', $projectPath, $matches)) {
            $homeDir = $matches[1];
        } elseif (isset($_SERVER['HOME'])) {
            $homeDir = $_SERVER['HOME'];
        } elseif (isset($_ENV['HOME'])) {
            $homeDir = $_ENV['HOME'];
        } else {
            // Try to get from posix_getpwuid if available
            if (function_exists('posix_getpwuid') && function_exists('posix_geteuid')) {
                $userInfo = posix_getpwuid(posix_geteuid());
                if ($userInfo && isset($userInfo['dir'])) {
                    $homeDir = $userInfo['dir'];
                }
            }
        }
        
        // Set environment variables for composer
        $composerEnv = [];
        if ($homeDir && is_dir($homeDir)) {
            $composerEnv['HOME'] = $homeDir;
            $composerEnv['COMPOSER_HOME'] = $homeDir . '/.composer';
        }
        
        // If composer path is a specific file path (not just "composer"), try to run it directly
        // Otherwise, test if composer is available first
        $shouldRunComposer = false;
        
        if ($composerPath !== 'composer' && (file_exists($composerPath) || strpos($composerPath, '/') !== false)) {
            // We found composer at a specific path, trust it and run it
            $shouldRunComposer = true;
        } else {
            // Test if composer is in PATH
            $testCommand = strpos($composerPath, 'php ') === 0 ? $composerPath . ' --version' : $composerPath . ' --version';
            $testEnvString = '';
            if (!empty($composerEnv)) {
                foreach ($composerEnv as $key => $value) {
                    $testEnvString .= escapeshellarg($key) . '=' . escapeshellarg($value) . ' ';
                }
            }
            exec('cd ' . escapeshellarg($projectPath) . ' && ' . $testEnvString . $testCommand . ' 2>&1', $composerTestOutput, $composerTestReturn);
            $shouldRunComposer = ($composerTestReturn === 0);
        }
        
        if ($shouldRunComposer) {
            if (!executeCommand($composerCommand, 'Rebuild Composer Autoloader', $projectPath, $composerEnv)) {
                $allSuccess = false;
                $errors[] = 'Failed to rebuild autoloader';
            }
        } else {
            echo "<div style='padding: 10px; margin: 5px 0; background: #fff3cd; border-left: 4px solid #ffc107;'>";
            echo "<strong>⚠️ Skipping: Rebuild Composer Autoloader</strong><br>";
            echo "<span style='color: #856404;'>Composer not found or not accessible. This step is optional and can be run manually if needed.</span><br>";
            if ($homeDir) {
                echo "<small style='color: #666;'>You can run manually: <code>cd " . htmlspecialchars($projectPath) . " && HOME=" . htmlspecialchars($homeDir) . " " . htmlspecialchars($composerPath) . " dump-autoload</code></small>";
            } else {
                echo "<small style='color: #666;'>You can run manually: <code>cd " . htmlspecialchars($projectPath) . " && composer dump-autoload</code></small>";
            }
            echo "</div>";
        }

        // Final status
        echo "<div class='status " . ($allSuccess ? 'success' : 'error') . "'>";
        if ($allSuccess) {
            echo "✅ <strong>All cache clearing operations completed successfully!</strong>";
        } else {
            echo "⚠️ <strong>Some operations failed. Please check the output above.</strong>";
            if (!empty($errors)) {
                echo "<ul style='margin-top: 10px;'>";
                foreach ($errors as $error) {
                    echo "<li>" . htmlspecialchars($error) . "</li>";
                }
                echo "</ul>";
            }
        }
        echo "<br><br><strong>Completed at:</strong> " . date('Y-m-d H:i:s');
        echo "</div>";
        ?>
    </div>
</body>
</html>

