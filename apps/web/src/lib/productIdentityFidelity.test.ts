import {describe,it,expect} from "vitest";
import {PRODUCT_IDENTITY_FIELDS,assessProductIdentityReview} from "./productIdentityFidelity";
import type {ProductIdentityReview} from "./productIdentityFidelity";
const fixture=():ProductIdentityReview=>({
  productSlug:"sample-edp",imageSha256:"a".repeat(64),
  authoritativeProductReference:"Manufacturer product page or archived authorized packshot, to be independently checked",
  observations:PRODUCT_IDENTITY_FIELDS.map(f=>({
    field:f.id,state:"claimed_match",
    note:"Operator asserts that the detail matches the exact reference",
    reference:"https://example.org/reference"
  }))
});
describe("AROMIA product identity fidelity gate",()=>{
  it("does not turn 8/8 favorable claims into authorization",()=>{
    const result=assessProductIdentityReview(fixture());
    expect(result.checks.claimedMatches).toBe(PRODUCT_IDENTITY_FIELDS.length);
    expect(result.fidelityVerified).toBe(false);
    expect(result.aestheticOverrideAllowed).toBe(false);
    expect(result.replacementAllowed).toBe(false);
    expect(result.publication).toBe("blocked");
    expect(result.state).toBe("independent_verification_required");
  });
  it("blocks when even one distinctive feature is mismatched",()=>{
    for(const field of PRODUCT_IDENTITY_FIELDS){
      const value=fixture();
      value.observations=value.observations.map(o=>o.field===field.id?{...o,state:"mismatch" as const}:o);
      const result=assessProductIdentityReview(value);
      expect(result.state).toBe("material_mismatch_blocked");
      expect(result.mismatchFields).toContain(field.id);
      expect(result.replacementAllowed).toBe(false);
    }
  });
  it("requires all eight fields and supporting notes for claims",()=>{
    expect(()=>assessProductIdentityReview({...fixture(),observations:fixture().observations.slice(0,-1)})).toThrow();
    const d=fixture();
    d.observations[0].reference="";
    expect(()=>assessProductIdentityReview(d)).toThrow("invalid_product_identity_observation");
    const duplicate=fixture();
    duplicate.observations[1].field=duplicate.observations[0].field;
    expect(()=>assessProductIdentityReview(duplicate)).toThrow("invalid_product_identity_observation");
  });
  it("leaves unexamined attributes outstanding and prevents image substitution",()=>{
    const d=fixture();
    const observations=d.observations.map((o,i)=>i===0?{...o,state:"not_checked" as const,note:"",reference:""}:o);
    const result=assessProductIdentityReview({...d,observations});
    expect(result.checks.unchecked).toBe(1);
    expect(result.fidelityVerified).toBe(false);
    expect(result.replacementAllowed).toBe(false);
  });
});
