# Winimi Bakery brand system

Brand lock: `2026-07-20-pastel-green`

## Primary palette

- Pastel green: `#D0E596` / `rgb(208, 229, 150)`
- Brand ink: `#27390C`
- Primary contrast: greater than `9:1`

The pastel green is the primary surface color for buttons, navigation states, footer, PWA chrome and branded highlights. Dark brand ink is used for text and icons on pastel surfaces; white text must not be used on the primary pastel color.

## Official logo

The official storefront logo is stored at:

```text
/brand/winimi-logo.svg
```

It is used by the header, footer, offline page and PWA icons. The logo mark contains the pastel circular field, cake slice and Winimi Bakery wordmark.

## Implementation boundary

The runtime override is `src/styles/brand-theme.css`, loaded after the shared UI styles. Existing semantic Tailwind classes continue to work while their green values are mapped to the official palette.

`npm run audit:brand` prevents the old `#356f50` and `#7b9b45` identity from returning to browser, PWA and offline surfaces.
