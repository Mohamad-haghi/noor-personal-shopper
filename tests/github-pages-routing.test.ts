import { describe, expect, it } from "vitest";
import { stripBasePath, withBasePath } from "../src/app/routing/create-router";

describe("GitHub Pages route base path", () => {
  const baseUrl = "/noor-personal-shopper/";

  it("maps the deployed app root to the home route", () => {
    expect(stripBasePath("/noor-personal-shopper/", baseUrl)).toBe("/");
    expect(stripBasePath("/noor-personal-shopper", baseUrl)).toBe("/");
  });

  it("maps deployed nested routes to app routes", () => {
    expect(stripBasePath("/noor-personal-shopper/products", baseUrl)).toBe("/products");
    expect(stripBasePath("/noor-personal-shopper/products/123", baseUrl)).toBe("/products/123");
  });

  it("keeps internal navigation under the GitHub Pages repository prefix", () => {
    expect(withBasePath("/", baseUrl)).toBe("/noor-personal-shopper/");
    expect(withBasePath("/products", baseUrl)).toBe("/noor-personal-shopper/products");
    expect(withBasePath("/noor-personal-shopper/products", baseUrl)).toBe("/noor-personal-shopper/products");
  });

  it("preserves the Pages base path for search, visit, and confirmation history routes", () => {
    expect(withBasePath("/search", baseUrl)).toBe("/noor-personal-shopper/search");
    expect(withBasePath("/visit", baseUrl)).toBe("/noor-personal-shopper/visit");
    expect(withBasePath("/confirmation/demo-confirmation-1", baseUrl)).toBe("/noor-personal-shopper/confirmation/demo-confirmation-1");
  });

  it("leaves root-hosted local development paths unchanged", () => {
    expect(stripBasePath("/products", "/")).toBe("/products");
    expect(withBasePath("/products", "/")).toBe("/products");
  });
});
