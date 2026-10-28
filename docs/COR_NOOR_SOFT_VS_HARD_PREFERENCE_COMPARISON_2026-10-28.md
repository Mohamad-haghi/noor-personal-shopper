# COR↔NOOR controlled preference-policy comparison — 2026-10-28

## Purpose

Compare the observed current soft-preference behavior with the consequence of treating the shopper's requested frame material (`titanium`) and frame shape (`round`) as hard constraints. This is a read-only catalog audit and test-only change. It does **not** change COR scoring, Domain Pack configuration, installation state, or the live NOOR UI.

## Case under review

NOOR request:
- Category: sunglasses
- Frame material: titanium
- Frame shape: round
- Frame color: black
- Product group: male
- Use case: driving / outdoors (not a canonical scored criterion in the current Domain Pack)

Observed live recommendations:
| Product | COR score | Relevant catalog facts |
|---|---:|---|
| Persol PO0649 95/31 | 46.15% (shown as 46%) | frame material acetate; frame shape aviator; color black; gender male |
| Tom Ford FT0778 01A 60 | 46.15% (shown as 46%) | frame material acetate; frame shape aviator; color black; gender male; temple material is listed as titanium |
| Gucci GG0900S 005 | 30.77% (shown as 31%) | frame material acetate; frame shape square; color black; gender unisex |

The live COR trace explained the scores as normalized criterion contributions, not probabilities. In this trace, availability contributes 1 point, color 3, gender 2, and the score denominator is 13. Material and shape did not match the request. The product's **frame material** is the canonical field; a titanium temple does not make the whole frame titanium.

## Controlled comparison

### Mode A — current soft preferences

Soft preferences rank products even when some preferences do not match. The observed live result is:
- Persol: 6/13 = 46.15%
- Tom Ford: 6/13 = 46.15%
- Gucci: 4/13 = 30.77%

This is consistent with the recorded color/gender matches and material/shape mismatches. It is deterministic scoring evidence for this request, not proof of real-world suitability.

### Mode B — hypothetical hard constraints for both material and shape

The test inspects the current NOOR demo catalog independently of COR's returned ranking:
- Catalog total: 15 products.
- Sunglasses in category: 8.
- Sunglasses whose canonical `frameMaterial` is `titanium`: 0.
- Sunglasses whose `frameShapes` contains `round`: 0.
- Sunglasses satisfying **both** constraints: 0.

Therefore, applying both requests as hard constraints to this demo catalog would correctly leave **zero eligible sunglasses**. It would not produce a better-ranked result from this catalog; it would expose a catalog-coverage gap. Silently relaxing hard constraints to fill three cards would violate the policy's meaning.

## Conclusion and recommendation

The mismatch is not explained by scoring weights alone. The present test case asks for two attributes that no sunglasses record in the current 15-item demo feed satisfies. This is primarily a **catalog coverage / preference semantics** issue for this scenario.

For the MVP, keep the existing behavior unchanged until the product decision is explicit:
1. Treat material and shape as soft preferences by default; explain mismatches clearly, as the current UI now does.
2. If a shopper marks a property as mandatory, treat it as a hard constraint and return a clear no-match state when the catalog has no eligible product. Do not silently fall back to mismatches.
3. Do not label an ordinary preference as mandatory merely because it was selected in the form.

No production logic or live installation was modified in this audit. The added automated test verifies catalog coverage only.
