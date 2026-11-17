import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchPerfumeSearch } from "./searchClient";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function pendingFetch() {
  return vi.fn((_url: string, init: RequestInit) => new Promise<Response>((_resolve, reject) => {
    init.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
  }));
}

describe("search recovery", () => {
  it("reports a timed-out request as a recoverable error, not a silent cancellation", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", pendingFetch());
    const result = fetchPerfumeSearch({ q: "vetiver" });
    await vi.advanceTimersByTimeAsync(6000);
    expect(await result).toEqual({ status: "error" });
    expect(vi.getTimerCount()).toBe(0);
  });

  it("silences an obsolete query cancelled by the caller", async () => {
    vi.stubGlobal("fetch", pendingFetch());
    const controller = new AbortController();
    const result = fetchPerfumeSearch({ q: "vetiver" }, controller.signal);
    controller.abort();
    expect(await result).toEqual({ status: "aborted" });
  });

  it("does not send a request for an already cancelled query", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const controller = new AbortController();
    controller.abort();
    expect(await fetchPerfumeSearch({ q: "vetiver" }, controller.signal)).toEqual({ status: "aborted" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("can retry the same query after an HTTP failure", async () => {
    const data = { items: [], total: 0, page: 1, pageSize: 20 };
    const fetch = vi.fn().mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json(data));
    vi.stubGlobal("fetch", fetch);
    expect(await fetchPerfumeSearch({ q: "vetiver" })).toEqual({ status: "error" });
    expect(await fetchPerfumeSearch({ q: "vetiver" })).toEqual({ status: "ok", data });
    expect(fetch.mock.calls[0][0]).toBe(fetch.mock.calls[1][0]);
  });
});
