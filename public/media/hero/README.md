# Demo Hero Image Upload Instructions

This folder is reserved for the main hero image used by the Noor-inspired demo storefront.

## Upload the file here

Upload the approved, downloaded image to this exact path:

`public/media/hero/hero.jpg`

- Keep the filename exactly `hero.jpg`.
- Prefer a wide, high-resolution landscape image suitable for a desktop and mobile hero.
- Use an image that you have permission to use in this demo.
- Do not upload a product image here as a substitute for the hero unless that is the intended design.
- Do not upload video here; the current task is the static hero image.

## Important

Creating this folder does not mean the application has been changed to use `/media/hero/hero.jpg`. The hero renderer and styling must be updated and tested in a separate implementation change after the image is uploaded and reviewed.

## Product photos are stored separately

The 15 product-specific folders already exist under `public/media/products/`. For each exact matching product, upload its image to that product's own folder as `primary.jpg`. Do not mix the hero image into product folders or substitute a similar model/variant.
