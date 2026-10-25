import {test} from "node:test";
import assert from "node:assert/strict";
import {fetchSkinDataUrl, MAX_SKIN_BYTES} from "./skinTexture.ts";

function png(width: number, height: number, extraBytes = 0): Uint8Array {
    const bytes = new Uint8Array(24 + extraBytes);
    bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
    bytes.set([0x00, 0x00, 0x00, 0x0d], 8);
    bytes.set([0x49, 0x48, 0x44, 0x52], 12);
    const view = new DataView(bytes.buffer);
    view.setUint32(16, width);
    view.setUint32(20, height);
    return bytes;
}

function fakeFetch(response: { status: number; body: Uint8Array } | Error) {
    const calls: string[] = [];
    const inits: (RequestInit | undefined)[] = [];
    const fetcher = (async (url: string | URL | Request, init?: RequestInit) => {
        calls.push(String(url));
        inits.push(init);
        if (response instanceof Error) throw response;
        return new Response(response.body as BodyInit, {status: response.status});
    }) as typeof fetch;
    return {fetcher, calls, inits};
}

const player = {id: "p1", collectionId: "col", skin: "skin_x.png", playername: "Steve"};

test("returns_data_url_for_texture", async (t) => {
    t.mock.method(console, "warn", () => {});
    const {fetcher, calls} = fakeFetch({status: 200, body: png(64, 64)});
    const result = await fetchSkinDataUrl(player, fetcher);
    assert.ok(result?.startsWith("data:image/png;base64,"));
    assert.equal(calls[0], "https://pocketbase.antredesloutres.fr/api/files/col/p1/skin_x.png");
});

test("accepts_legacy_texture", async (t) => {
    t.mock.method(console, "warn", () => {});
    const {fetcher} = fakeFetch({status: 200, body: png(64, 32)});
    assert.notEqual(await fetchSkinDataUrl(player, fetcher), null);
});

test("returns_null_without_skin", async (t) => {
    t.mock.method(console, "warn", () => {});
    const {fetcher, calls} = fakeFetch({status: 200, body: png(64, 64)});
    assert.equal(await fetchSkinDataUrl({...player, skin: ""}, fetcher), null);
    assert.equal(calls.length, 0);
});

test("returns_null_on_http_error", async (t) => {
    t.mock.method(console, "warn", () => {});
    const {fetcher} = fakeFetch({status: 404, body: new Uint8Array()});
    assert.equal(await fetchSkinDataUrl(player, fetcher), null);
});

test("returns_null_when_fetch_throws", async (t) => {
    t.mock.method(console, "warn", () => {});
    const {fetcher} = fakeFetch(new Error("network"));
    assert.equal(await fetchSkinDataUrl(player, fetcher), null);
});

test("rejects_non_png", async (t) => {
    t.mock.method(console, "warn", () => {});
    const {fetcher} = fakeFetch({status: 200, body: new TextEncoder().encode("<html>")});
    assert.equal(await fetchSkinDataUrl(player, fetcher), null);
});

test("rejects_non_texture_dimensions", async (t) => {
    t.mock.method(console, "warn", () => {});
    const {fetcher} = fakeFetch({status: 200, body: png(128, 256)});
    assert.equal(await fetchSkinDataUrl(player, fetcher), null);
});

test("rejects_oversized_file", async (t) => {
    t.mock.method(console, "warn", () => {});
    const {fetcher} = fakeFetch({status: 200, body: png(64, 64, MAX_SKIN_BYTES)});
    assert.equal(await fetchSkinDataUrl(player, fetcher), null);
});

test("passes_abort_signal", async (t) => {
    t.mock.method(console, "warn", () => {});
    const {fetcher, inits} = fakeFetch({status: 200, body: png(64, 64)});
    await fetchSkinDataUrl(player, fetcher);
    assert.ok(inits[0]?.signal instanceof AbortSignal);
});
