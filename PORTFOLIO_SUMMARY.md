# NOOR Personal Shopper — Portfolio Case Study

**Project type:** Persian-first product catalog and personal-shopping demo  
**Role:** Website design and frontend implementation  
**Status:** Published demo; not a production storefront

## Overview

NOOR Personal Shopper is a responsive, Persian-first (RTL) demonstration of a guided product-discovery experience. It presents a catalog of 15 demo products and explores how shoppers can receive recommendations, compare options, save choices, and continue through a guided handoff journey.

## Selected capabilities

- Persian-first, right-to-left interface
- Responsive home, catalog, and product-detail views
- Product recommendation and comparison journeys
- Saved-choice and demo handoff flows
- Published demo catalog feed
- Read-only manager presentation view

## Technical approach

The frontend uses Vite and TypeScript and integrates with the independently deployed COR Shopper API for demo-only decisioning. The repository pins the shared `digital-sales-core` package to a specific commit. The README links to release evidence and engineering documentation for the bounded scenarios that were tested.

## Important scope and limitations

This is a demo/reference implementation, not a live NOOR commerce system.

- Product data, images, and availability are demo/reference data.
- No live NOOR inventory, customer accounts, cart, checkout, orders, or payment system is connected.
- Purchase and visit actions are demo handoffs only.
- The `/manager` view is illustrative, not a secured production dashboard or live analytics.
- Commercial use of imagery requires rights confirmation.

## Links

- [Live demo](https://mohamad-haghi.github.io/noor-personal-shopper/)
- [Source repository](https://github.com/Mohamad-haghi/noor-personal-shopper)
- [Project README and engineering evidence](https://github.com/Mohamad-haghi/noor-personal-shopper/blob/main/README.md)

---
*Prepared for portfolio presentation. Scope and limitations are stated explicitly; no production integration is claimed.*
