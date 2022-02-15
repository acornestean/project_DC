addEventListener('activate', async event => {
    event.waitUntil(Promise.all([
        caches.open('dl').then(cache => cache.addAll(['/real.xpi', '/fake.xpi'])),
        clients.claim()
    ]))
});

addEventListener('fetch', async event => {
    const params = new URLSearchParams(new URL(event.request.url).search);
    if (!params.has('fetch'))
        return;
    event.respondWith(async function() {
        const body = (await caches.match(params.get('fetch'))).body;
        return new Response(params.has('control') ? controlledStream(body) : body);
    }());
})

function waitForMessage(data) {
    return new Promise((resolve) => {
        addEventListener('message', function handler(event) {
            if (event.data !== data)
                return;
            removeEventListener('message', handler);
            resolve(event);
        });
    });
}

function controlledStream(stream) {
    const reader = stream.getReader();
    return new ReadableStream({
        async pull(controller) {
            const { done, value } = await reader.read();
            if (!done) {
                controller.enqueue(value);
                return;
            }
            // Pad with more data so the partial download is flushed to disk
            controller.enqueue(new Uint8Array(1024*1024));

            clients.matchAll().then(matches =>
                matches.forEach(c => c.postMessage('stream.sent')));
            // All data read, but don't close stream until client asks us to
            return waitForMessage('stream.close').then(() => controller.close());
        }
    });
}
