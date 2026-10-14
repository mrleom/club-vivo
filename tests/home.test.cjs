const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

// Compile real TS/TSX modules in memory; no generated fixtures or test dependency.
function load(relative, mocks = {}, cache = new Map()) {
  const filename = path.resolve(__dirname, "..", relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX }
  }).outputText;
  const localRequire = (name) => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (!name.startsWith(".")) return require(name);
    const base = path.resolve(path.dirname(filename), name);
    const resolved = [base, base + ".ts", base + ".tsx"].find((file) =>
      fs.existsSync(file) && fs.statSync(file).isFile()
    );
    if (!resolved) throw new Error("Cannot resolve " + name);
    return load(path.relative(path.resolve(__dirname, ".."), resolved), mocks, cache);
  };
  vm.runInThisContext("(function(require,module,exports){" + output + "\n})", { filename })(localRequire, module, module.exports);
  return module.exports;
}
const nav = load("lib/platform-navigation.ts");
const catalog = load("lib/application-catalog.ts");
const { ApplicationsHub } = load("components/platform/ApplicationsHub.tsx");
const { OrganizationOverview } = load("components/platform/OrganizationOverview.tsx");
const mockUser = (role) => ({ ok: true, userId: "test-user", tenantId: "tenant_test-org", role, tier: "free" });

test("coach navigation keeps all six existing coaching paths, without admin areas", () => {
  assert.deepEqual(Array.from(nav.getPlatformNavigation("coach"), x => x.href), ["/home", "/applications", "/tie"]);
  assert.deepEqual(Array.from(nav.COACHING_NAVIGATION, x => x.href),
    ["/sessions/new", "/tie#quick-soccer-game", "/sessions", "/teams", "/equipment", "/methodology"]);
});
test("server-issued admin aliases retain organization navigation", () => {
  for (const role of ["admin", "club_admin", "club admin", "admin coach", "admincoach", " ADMIN "]) {
    assert.equal(nav.canUseTie(role), true);
    assert.equal(nav.getPlatformNavigation(role).some(x => x.href === "/organization"), true);
  }
});
test("non-coaching and unknown roles fail closed in navigation and launch policy", () => {
  for (const role of ["athlete", "medical", "owner", "", "coach_admin", null, undefined]) {
    assert.equal(nav.canUseTie(role), false);
    assert.equal(nav.getPlatformNavigation(role).some(x => x.href === "/organization"), false);
    assert.equal(catalog.canOpenApplication(catalog.APPLICATIONS[0], role), false);
  }
});
test("coming-soon modules never offer a launch route, even to admins", () => {
  assert.equal(new Set(catalog.APPLICATIONS.map(x => x.id)).size, catalog.APPLICATIONS.length);
  for (const app of catalog.APPLICATIONS.filter(x => x.status === "coming-soon")) {
    assert.equal(app.href, undefined);
    assert.equal(catalog.canOpenApplication(app, "admin"), false);
  }
  assert.equal(catalog.canOpenApplication(catalog.APPLICATIONS[0], "coach"), true);
});
test("organization apps are visible to admins and omitted for other roles", () => {
  assert.equal(catalog.getVisibleApplications("admin").length, 6);
  for (const role of ["coach", "athlete", "medical", "unrecognized"]) {
    assert.deepEqual(Array.from(catalog.getVisibleApplications(role), x => x.id),
      ["tie", "athlete-development", "sports-insights"]);
  }
});
test("nested coaching navigation selects the right tool without overlapping saved sessions", () => {
  for (const [route, selected] of [
    ["/sessions/new", "/sessions/new"], ["/sessions/new/step", "/sessions/new"],
    ["/sessions/quick", "/tie#quick-soccer-game"], ["/sessions/quick-review", "/tie#quick-soccer-game"],
    ["/sessions/example", "/sessions"], ["/sessions", "/sessions"],
    ["/teams", "/teams"], ["/equipment", "/equipment"], ["/methodology", "/methodology"]
  ]) {
    const active = nav.COACHING_NAVIGATION.filter(x => nav.isNavigationActive(route, x.href));
    assert.deepEqual(Array.from(active, x => x.href), [selected]);
    assert.equal(nav.isNavigationActive(route, "/tie"), true);
  }
  assert.equal(nav.isNavigationActive("/home", "/tie"), false);
  assert.equal(nav.isNavigationActive("/sessions-elsewhere", "/sessions"), false);
});
test("rendered hub distinguishes flagship, coming soon, and unavailable role access", () => {
  const admin = renderToStaticMarkup(React.createElement(ApplicationsHub, { role: "admin" }));
  assert.match(admin, /href="\/tie"/);
  assert.match(admin, /Business Intelligence/);
  assert.equal((admin.match(/Coming soon/g) || []).length, 5);
  assert.equal((admin.match(/href=/g) || []).length, 1);
  const athlete = renderToStaticMarkup(React.createElement(ApplicationsHub, { role: "athlete" }));
  assert.doesNotMatch(athlete, /href="\/tie"/);
  assert.match(athlete, /Available to coaches and club admins/);
  assert.doesNotMatch(athlete, /Financial, membership/);
});
test("organization overview shows verified context, escapes display values, and never grants access", () => {
  const coach = renderToStaticMarkup(React.createElement(OrganizationOverview, {
    user: { ...mockUser("coach"), tenantId: "<script>example</script>" }
  }));
  assert.match(coach, /&lt;script&gt;example&lt;\/script&gt;/);
  assert.doesNotMatch(coach, /href="\/organization"/);
  assert.doesNotMatch(coach, /<form|<input/);
  const admin = renderToStaticMarkup(React.createElement(OrganizationOverview, { user: mockUser("admin") }));
  assert.match(admin, /href="\/organization"/);
  assert.match(admin, /Club admin/);
});
test("new organization and TIE pages deny direct navigation for inappropriate roles", async () => {
  const denied = { deny: true };
  const redirect = () => { throw denied; };
  for (const [file, role] of [
    ["app/(protected)/organization/page.tsx", "coach"],
    ["app/(protected)/organization/page.tsx", "medical"],
    ["app/(protected)/tie/page.tsx", "athlete"],
    ["app/(protected)/tie/page.tsx", "unknown"]
  ]) {
    const page = load(file, {
      "next/navigation": { redirect },
      "../../../lib/get-platform-user": { getPlatformUser: async () => mockUser(role) },
      "../sessions/quick-session-actions": { createQuickSessionAction: async () => ({}) }
    });
    await assert.rejects(page.default(), error => error === denied);
  }
});
test("Home renders real coaching entry points without business metrics or sample organization data", async () => {
  const page = load("app/(protected)/home/page.tsx", {
    "../../../lib/get-platform-user": { getPlatformUser: async () => mockUser("coach") }
  });
  const html = renderToStaticMarkup(await page.default());
  for (const route of ["/tie", "/applications", "/sessions/new", "/tie#quick-soccer-game", "/sessions"]) {
    assert.match(html, new RegExp('href="' + route + '"'));
  }
  assert.match(html, /tenant_test-org/);
  assert.doesNotMatch(html, /Revenue|\$[0-9]|KSC|Miami/);
});
