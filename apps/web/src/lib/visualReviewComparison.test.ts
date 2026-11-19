import {describe,it,expect} from "vitest";
import {compareVisualClaims} from "./visualReviewComparison";
const slug="chance-eau-tendre", a="a".repeat(64), b="b".repeat(64);
describe("supervised image evidence comparison",()=>{
  it("never certifies product identity or rights even on an exact hash match",()=>{
    const result=compareVisualClaims(slug,a,[{product_slug:slug,review_id:"review-1",image_sha256:a}]);
    expect(result.state).toBe("match_claimed_digest");
    expect(result.matchingReviewIds).toEqual(["review-1"]);
    expect(result.identityVerified).toBe(false);
    expect(result.rightsVerified).toBe(false);
    expect(result.publication).toBe("blocked");
  });
  it("detects changed image and preserves history of divergent claims",()=>{
    const result=compareVisualClaims(slug,a,[
      {product_slug:slug,review_id:"old",image_sha256:b},
      {product_slug:slug,review_id:"current",image_sha256:a},
    ]);
    expect(result.state).toBe("match_claimed_digest");
    expect(result.mismatchingReviewIds).toEqual(["old"]);
    expect(result.matchingReviewIds).toEqual(["current"]);
  });
  it("does not mix observations from another product",()=>{
    const result=compareVisualClaims(slug,a,[{product_slug:"different",review_id:"other",image_sha256:a}]);
    expect(result.state).toBe("no_history");
    expect(result.comparedClaims).toBe(0);
  });
  it("distinguishes incompatible hashes from no history",()=>{
    expect(compareVisualClaims(slug,a,[{product_slug:slug,review_id:"old",image_sha256:b}]).state).toBe("no_matching_claimed_digest");
    expect(compareVisualClaims(slug,a,[]).state).toBe("no_history");
  });
  it("rejects invalid input rather than claiming an approval",()=>{
    expect(()=>compareVisualClaims("../../etc/passwd",a,[])).toThrow("invalid_visual_comparison_input");
    expect(()=>compareVisualClaims(slug,"url-not-image-digest",[])).toThrow("invalid_visual_comparison_input");
  });
});
