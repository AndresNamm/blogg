const assert = require('node:assert/strict');
const { execFileSync, spawn } = require('node:child_process');
const { randomUUID } = require('node:crypto');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const test = require('node:test');
const { setTimeout: delay } = require('node:timers/promises');

async function fixture(t) {
  const project = path.resolve(__dirname, '..');
  const root = path.join(project, `.test-build-${randomUUID()}`);
  const children = [];
  t.after(async () => {
    for (const child of children) {
      if (child.exitCode === null && child.signalCode === null) {
        await new Promise(resolve => {
          child.once('exit', resolve);
          child.kill();
        });
      }
    }
    await fs.rm(root, { recursive: true, force: true });
  });
  await fs.mkdir(root);
  for (const dir of ['dist', 'template']) {
    await fs.cp(path.join(project, dir), path.join(root, dir), { recursive: true });
  }
  await fs.mkdir(path.join(root, 'posts'));

  return {
    root,
    async write(file, content) {
      const target = path.join(root, file);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, content);
    },
    read: file => fs.readFile(path.join(root, file), 'utf8'),
    build: () => execFileSync(process.execPath, ['dist/build.js'], { cwd: root }),
    async start(args, pattern) {
      const child = spawn(process.execPath, args, {
        cwd: root,
        env: { ...process.env, PORT: '0' },
        stdio: ['ignore', 'pipe', 'pipe']
      });
      children.push(child);
      let output = '';
      child.stdout.on('data', chunk => { output += chunk; });
      child.stderr.on('data', chunk => { output += chunk; });
      return eventually(() => {
        if (child.exitCode !== null || child.signalCode !== null) {
          assert.fail(output);
        }
        return output.match(pattern);
      });
    }
  };
}

async function eventually(check) {
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    const result = await check();
    if (result) return result;
    await delay(50);
  }
  assert.fail('Timed out waiting for the build or server');
}

function request(port, pathname) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path: pathname }, response => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve({
        status: response.statusCode,
        mime: response.headers['content-type'],
        body
      }));
      response.on('error', reject);
    }).on('error', reject);
  });
}

test('builds and serves standalone posts and assets without changing Markdown URLs', async t => {
  const blog = await fixture(t);
  const standalone = `<!doctype html><html><head>
<!-- <title>Comment</title> --><script>const text = '<title>Script</title>';</script>
<title>  Café &amp; X &#x221A;
  <img src=x onerror=alert(1)> &lt;b&gt; $&amp; </title>
<link rel="stylesheet" href="theme%20%23%25.css?v=2">
</head><body><img src="../../images/shared.svg"></body></html>`;
  const css = 'body { color: green }';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"/>';
  await blog.write('posts/plain.md', '# Markdown & math\n\n$x_1$ [next](next.md#section) ![image](images/shared.svg)');
  await blog.write('posts/next.md', '# Next\n\n## Section');
  await blog.write('posts/images/shared.svg', svg);
  await blog.write('posts/html/plain.html', '<!doctype html><head><title>Standalone</title></head>');
  await blog.write('posts/html/index.html', '<!doctype html><head><title> </title></head>');
  await blog.write('posts/html/a b/Café #%.html', standalone);
  await blog.write('posts/html/a b/theme #%.css', css);
  await blog.write('private.txt', 'Not published');
  await fs.symlink('../../private.txt', path.join(blog.root, 'posts/html/skipped.txt'));
  blog.build();
  await fs.symlink('../private.txt', path.join(blog.root, 'build/escaped.txt'));

  const [, port] = await blog.start(['dist/serve.js'], /Server running at http:\/\/localhost:(\d+)/);
  const index = await request(port, '/?v=1');
  assert.equal(index.status, 200);
  assert.match(index.body, /href="plain.html">Markdown &amp; math<\/a>/);
  assert.match(index.body, /href="html\/plain.html">Standalone<\/a>/);
  assert.match(index.body, /href="html\/index.html">index<\/a>/);
  const href = 'html/a%20b/Caf%C3%A9%20%23%25.html';
  assert.ok(index.body.includes(`href="${href}">Café &amp; X &#x221A; &lt;img src=x onerror=alert(1)&gt; &lt;b&gt; $&amp;</a>`));
  assert.doesNotMatch(index.body, /<img|>Script<|>Comment<|theme%20/);

  const page = await request(port, `/${href}?r=1`);
  assert.deepEqual(page, { status: 200, mime: 'text/html', body: standalone });
  const pageUrl = new URL(href, `http://localhost:${port}/`);
  const theme = new URL('theme%20%23%25.css?v=2', pageUrl);
  assert.deepEqual(await request(port, theme.pathname + theme.search), { status: 200, mime: 'text/css', body: css });
  const image = new URL('../../images/shared.svg', pageUrl);
  assert.deepEqual(await request(port, image.pathname), { status: 200, mime: 'image/svg+xml', body: svg });

  const markdown = await request(port, '/plain.html');
  assert.equal(markdown.status, 200);
  assert.match(markdown.body, /\$x_1\$/);
  assert.match(markdown.body, /renderMathInElement/);
  assert.match(markdown.body, /href="next.html#section"/);
  assert.match(markdown.body, /src="images\/shared.svg"/);
  assert.match((await request(port, '/next.html')).body, /id="section"/);
  for (const forbidden of ['/../private.txt', '/%2e%2e/private.txt', '/html/%2f..', '/html/%5c..', '/%ZZ']) {
    assert.equal((await request(port, forbidden)).status, 400, forbidden);
  }
  for (const missing of ['/escaped.txt', '/html/skipped.txt', '/html/missing.html']) {
    assert.equal((await request(port, missing)).status, 404, missing);
  }

  await fs.rm(path.join(blog.root, 'posts/html'), { recursive: true });
  blog.build();
  assert.doesNotMatch((await request(port, '/')).body, /href="html\//);
  assert.equal((await request(port, `/${href}`)).status, 404);
  assert.equal((await request(port, '/plain.html')).status, 200);
});

test('watch picks up new standalone-only posts, asset updates and deletions', async t => {
  const blog = await fixture(t);
  await blog.start(['dist/build.js', '--watch'], /Build complete!/);
  assert.match(await blog.read('build/index.html'), /<h1>Blog Posts<\/h1>/);
  await blog.write('posts/html/page.html', '<head><title>New post</title></head>');
  await blog.write('posts/html/style.css', 'p { color: green }');
  await eventually(async () => (await blog.read('build/index.html')).includes('href="html/page.html">New post'));
  await eventually(async () => (await blog.read('build/html/style.css').catch(() => '')) === 'p { color: green }');
  await blog.write('posts/html/style.css', 'p { color: blue }');
  await eventually(async () => (await blog.read('build/html/style.css').catch(() => '')) === 'p { color: blue }');

  await fs.unlink(path.join(blog.root, 'posts/html/page.html'));
  await eventually(async () => !(await blog.read('build/index.html')).includes('href="html/page.html"'));
  await assert.rejects(blog.read('build/html/page.html'), { code: 'ENOENT' });
});
