import {describe,it,expect} from "vitest";
import {validateProvenanceDossier,assessProvenanceDossier} from "./visualProvenance";
const example={
  schemaVersion:1,productSlug:"chance-eau-tendre",imageUrl:"/editorial-v1/example.webp",
  imageSha256:"a".repeat(64),brandClaim:"Chanel",fragranceClaim:"Chance Eau Tendre",
  concentrationClaim:"EDT",flankerClaim:"original",packagingClaim:"transparent bottle",
  sourceUrl:"https://example.org/manufacturer/image",sourceKind:"manufacturer",
  rightsBasis:"unknown",rightsReference:"No permission checked yet",
  identityNotes:"Source comparison pending",visualNotes:"Needs real crop review"
} as const;
describe("manual source dossier",()=>{
  it("stays a draft even when permission is claimed",()=>{
    const valid=validateProvenanceDossier({...example,rightsBasis:"permission_documented"});
    const result=assessProvenanceDossier(valid);
    expect(result.publication).toBe("blocked");
    expect(result.identityVerified).toBe(false);
    expect(result.rightsVerified).toBe(false);
    expect(result.reasons).toContain("external_rights_validation_pending");
  });
  it("requires exact inspected asset fingerprint, source and concentration",()=>{
    for(const field of [
      {imageSha256:"source-url-hash"},{imageUrl:"https://example.org/a.webp"},
      {concentrationClaim:""},{sourceUrl:"file:///etc/passwd"},{sourceUrl:"http://example.org/image"},
      {sourceUrl:"https://127.0.0.1/foo"},{sourceUrl:"https://name:password@example.org/foo"},
      {imageUrl:"/../secret.webp"}]){
      expect(()=>validateProvenanceDossier({...example,...field})).toThrow();
    }
  });
  it("does not invent a license from a manufacturer URL",()=>{
    const valid=validateProvenanceDossier(example);
    expect(valid.rightsBasis).toBe("unknown");
    expect(assessProvenanceDossier(valid).reasons).toContain("rights_not_documented_as_permission");
  });
});
