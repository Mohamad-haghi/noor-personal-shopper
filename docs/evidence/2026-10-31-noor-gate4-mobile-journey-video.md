# NOOR Gate 4 — Mobile Journey Video Evidence

- **Evidence date:** 2026-10-31
- **Artifact name:** `NOOR-Gate4-Mobile-Journey-2026-10-31.MP4`
- **Drive evidence link:** [Open the Google Drive video](https://drive.google.com/file/d/1b31rcEEXEWoBe0Z-xnaoeQuln-V-QINv/view?usp=drivesdk)
- **Reviewed attachment in this audit:** `NOOR-Gate4-Mobile-Journey-2026-10-31.mp4`
- **Reviewed attachment properties:** 49,287,012 bytes (about 47.0 MiB), H.264, 512×1108, 30 fps, duration 143.833 seconds (2:23.8).
- **Important evidence discrepancy:** the earlier register/operator report described the Drive original as 333.6 MB and approximately 5 minutes. The file actually attached and inspected in this review is 48 MB and 2:23.8. The available evidence does not establish whether this is a compressed/transcoded copy or a shorter derivative of the Drive original. Therefore this audit certifies inspection only of the 2:23.8 attachment, not the entire reported five-minute original.
- **Capture build / commit:** NOT RECORDED — do not assume this recording represents PR #101 or any particular deployed commit.
- **Visual review:** PARTIAL PASS — the attached clip was opened and inspected frame-by-frame at sampled timestamps. Several requested journey elements are visible; others are not shown or do not reach completion.
- **Gate 4 acceptance:** OPEN — do not close Gate 4 based on this partial clip. Resolve the original-vs-attachment duration discrepancy and inspect the remainder if a longer original exists.

## Timestamped visual findings (reviewed attachment)

Times below are offsets from the start of the attached 2:23.8 clip.

| Time | Area | Finding | Result |
|---|---|---|---|
| 00:00–00:15 | GitHub / evidence context | The recording begins in the NOOR repository's GitHub settings/navigation, not on the storefront landing page. | NOT SHOWN — storefront landing |
| 00:20 | Navigation | Brief black/loading transition while opening the NOOR site. | Informational |
| 00:30 | Counselor | Counselor is visible at step 2 of 8; question asks which type of eyewear the shopper is seeking, with optical/sunglasses/both choices. | PASS — counselor flow visible |
| 00:40 | Counselor | Frame-shape question is visible with rectangular, square, aviator and butterfly options. | PASS — input visible |
| 00:50 | Counselor | Frame-color question is visible; options include gold, Havana, black, white and no preference. | PASS — input visible |
| 01:00 | Selection Profile | Structured profile summary is displayed: sunglasses, everyday use, aviator frame, face shape unsure, frame material shown as standard, black color, no group preference, and no mandatory conditions. | PASS — profile summary visible |
| 01:20 | Recommendations transition | NOOR screen displays “building your recommendations” before results load. | Informational |
| 01:30 | COR recommendations | Results page states there are three suggestions based on the consultation and available Demo products. It explicitly explains that the percentage is a normalized COR match score, not a statistical probability of suitability. First visible card is Persol PO0649 95/31 at 100%, with visible matching explanations for selected frame gender/color/shape. | PASS — result and score explanation visible |
| 01:40 | Recommendation actions | Third visible card is Gucci GG0900S 005 at 64%; the card states frame gender and color match, while frame shape does not. Compare/save/select actions are visible. | PASS — differentiated score/explanation visible |
| 01:50 | Demo cart | Cart contains one Gucci GG0900S 005 item with displayed Demo price 8,650,000 Rial. Page explicitly says Demo display prices are not connected to real NOOR store prices and must be replaced before real payment. | PASS — demo-cart boundary visible |
| 02:00 | Checkout | Navigation shows the checkout route and a Shopper sign-in requirement to place an order. No payment or completed order is shown in the inspected clip. | PARTIAL — checkout gate visible; payment/order NOT SHOWN |
| 02:10 | Smart comparison | Comparison page is visible with Gucci GG0900S 005 and Tom Ford FT0778 01A 60; visible rows compare type, frame shape, material, color, dimensions and Demo availability. | PASS — comparison visible |
| 02:20 | Saved choices | Saved-selection cards are visible, including Tom Ford FT0778 and Persol PO0649, with product reference IDs and actions. | PASS — saved choices visible |

## Gate 4 checklist status

1. **NOOR demo landing/home screen:** NOT SHOWN in the inspected attachment; recording begins in GitHub and then opens the counselor.
2. **Counselor inputs:** PASS — multiple steps and choice options are visible.
3. **Structured Selection Profile:** PASS — profile summary is visible at approximately 01:00.
4. **COR-backed recommendations, scores and explanations:** PASS for visible UI evidence — three suggestions are stated; 100% and 64% examples and the normalized-score disclaimer are visible. This visual review does not independently validate COR calculation correctness or backend trace data.
5. **Product comparison:** PASS — comparison table is visible.
6. **Saved choices:** PASS — saved product cards are visible.
7. **Demo cart / handoff / confirmation:** PARTIAL — Demo cart and checkout sign-in gate are visible; no successful sign-in, payment, order submission, or final confirmation is shown.

## Limitations and required follow-up

- This GitHub file is the evidence register; the video remains hosted separately.
- The attachment reviewed here is 2:23.8 / about 47 MiB, which does not match the earlier report of a 333.6 MB / approximately five-minute Drive original. Do not silently treat them as the same complete artifact.
- Obtain/verify the full original or document that the 2:23.8 attachment is the intended final evidence copy. No re-recording is required if the original can be supplied.
- Record the deployed URL/build/commit represented by the capture; it is not visible in this clip.
- Do not infer backend correctness, recommendation-calculation accuracy, successful account login, real inventory, real pricing, payment, or order completion from these screens.
- Do not mark Gate 4 complete or approve release until the evidence-duration discrepancy is resolved and remaining required journey coverage is accepted.

## Audit conclusion

The inspected attachment provides useful visual evidence for the counselor, Selection Profile, COR score explanation, recommendations, comparison, saved choices, and Demo cart boundary. It does **not** show the storefront landing page, successful checkout completion, payment, or final order confirmation. Gate 4 remains **OPEN / PARTIAL PASS**.
