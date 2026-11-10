const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function compile(file, globals = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, { exports, structuredClone, URL, Headers, AbortSignal, ...globals });
  return exports;
}
const { defaultContent } = compile('app/lib/content-defaults.ts');
function service(fetch) {
  return compile('app/lib/content-service.ts', {
    process: { env: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'public-key' } },
    require: () => ({ defaultContent }), fetch,
  });
}
test('original content and empty lists pass validation', () => {
  const api = service(); api.validateContent(defaultContent);
  const copy = structuredClone(defaultContent); copy.projects = []; api.validateContent(copy);
});
test('invalid payloads and unsafe public links are rejected', () => {
  const api = service(); assert.throws(() => api.validateContent({}));
  const copy = structuredClone(defaultContent); copy.profile.linkedin = 'javascript:alert(1)';
  assert.throws(() => api.validateContent(copy));
  copy.profile.linkedin = 'https://linkedin.com'; copy.publications[0].authors[1].featured = {};
  assert.throws(() => api.validateContent(copy));
});
test('empty database uses original content', async () => {
  const api = service(async () => Response.json([]));
  const result = await api.loadContent(); assert.equal(result.version, null); assert.deepEqual(JSON.parse(JSON.stringify(result.content)), JSON.parse(JSON.stringify(defaultContent)));
});
test('published content is read without user credentials', async () => {
  const api = service(async (url, init) => {
    assert.ok(url.includes('select=content,updated_at')); assert.equal(init.headers.get('apikey'), 'public-key');
    assert.equal(init.headers.has('Authorization'), false);
    return Response.json([{ content: defaultContent, updated_at: 'version1' }]);
  });
  assert.equal((await api.loadContent()).version, 'version1');
});
test('older saved portfolios gain the new collections without losing edits', async () => {
  const old = structuredClone(defaultContent);
  delete old.academicDevelopment; delete old.academicService; delete old.additionalTraining;
  old.profile.bio = 'Previously saved biography';
  const api = service(async () => Response.json([{ content: old, updated_at: 'previous-version' }]));
  const loaded = await api.loadContent();
  assert.equal(loaded.content.profile.bio, 'Previously saved biography');
  assert.equal(loaded.content.academicDevelopment.length, 4);
  assert.equal(loaded.content.academicService.length, 2);
  assert.equal(loaded.content.additionalTraining.length, 1);
  assert.equal(loaded.version, 'previous-version');
});
test('update requires token and checks previous version', async () => {
  const api = service(async (url, init) => {
    assert.ok(url.includes('updated_at=eq.version1')); assert.equal(init.method, 'PATCH');
    assert.equal(init.headers.get('Authorization'), 'Bearer admin-token');
    assert.deepEqual(JSON.parse(init.body).content, JSON.parse(JSON.stringify(defaultContent)));
    return Response.json([{ updated_at: 'version2' }]);
  });
  assert.equal(await api.saveContent(defaultContent, 'version1', 'admin-token'), 'version2');
});
test('first publication inserts a singleton record', async () => {
  const api = service(async (_, init) => {
    assert.equal(init.method, 'POST'); assert.equal(JSON.parse(init.body).id, 'main');
    return Response.json([{ updated_at: 'version1' }]);
  });
  assert.equal(await api.saveContent(defaultContent, null, 'admin-token'), 'version1');
});
test('stale writes and unauthorized requests report failures', async () => {
  await assert.rejects(service(async () => Response.json([])).saveContent(defaultContent, 'old', 'token'), /otra sesión/);
  await assert.rejects(service(async () => new Response('', { status: 403 })).saveContent(defaultContent, null, 'wrong-token'), /permisos/);
  await assert.rejects(service(async () => new Response('', { status: 401 })).loadContent(), /sesión vencida/);
});
