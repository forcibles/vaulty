const HEALTH_URL = 'https://api.billgang.com/v1/health';

async function main() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    console.log('Testing connectivity to:', HEALTH_URL);
    const response = await fetch(HEALTH_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'CheatVault-Debug/1.0',
      },
      signal: controller.signal,
    });

    const text = await response.text();
    console.log('Status:', response.status, response.statusText);
    console.log('Body preview:', text.slice(0, 500));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Request failed:', error.name, error.message);
    } else {
      console.error('Request failed:', error);
    }
    process.exitCode = 1;
  } finally {
    clearTimeout(timeoutId);
  }
}

main();
