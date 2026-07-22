# Frontend Phase 10.0 — Homepage and category architecture

Marker: `homepage_and_category_architecture=ready`

## Goal

Complete the customer-facing homepage before the SSR migration and create a crawlable category architecture that can later move into server loaders without redesigning the information architecture.

## Homepage changes

- replace developer-facing language with product, occasion and customer language
- use a descriptive H1 for cookies, cakes and gift boxes
- add a prominent category entry point above the product grid
- keep featured products as the commerce proof layer
- add shopping-by-occasion for gifts, gatherings and temperature-sensitive products
- introduce brand-story, verified-review and help entry points without inventing reviews or operational claims
- preserve the existing visual system, mobile bottom navigation, performance fixes and responsive behavior

## Category architecture

- add `/categories` as the canonical category index
- expose seven editorial category landing pages:
  - cookies
  - mini-cookies
  - diet-diabetic
  - cakes
  - cheesecakes
  - pastry
  - gift-boxes
- map editorial slugs to Laravel catalog slugs
- use a catalog search only where a visual subcategory shares a backend category, such as cheesecakes inside cakes
- add CollectionPage, ItemList and FAQ structured data
- add category breadcrumbs and cross-category internal links
- include the category index and every editorial landing page in generated sitemap output

## Evidence policy

Static content explains how to choose and browse. Price, stock, ingredients, allergens, delivery eligibility and preparation details continue to come from verified backend/product data. The static category copy intentionally avoids unsupported ingredient, shipping, medical, discount or lead-time claims.

## Acceptance

The production-build browser suite verifies on desktop and mobile that:

- the new homepage H1 and category section render
- `/categories` exposes all category destinations
- the cookies landing returns catalog products
- the diet landing maps to the backend `diet` category rather than querying the editorial slug
- category breadcrumbs and internal links are usable
- no horizontal overflow is introduced
