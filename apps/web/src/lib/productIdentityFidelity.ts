/**
 * AROMIA — Product Identity Fidelity Gate.
 * Publisher mandate: a visually beautiful representation never overrides a
 * material mismatch with the real identifiable commercial product.
 * This contract records observations only; it cannot certify identity or publish.
 */
export const PRODUCT_IDENTITY_FIELDS = [
  {id:"label", label:"Etiqueta y disposición", description:"Posición, material, forma y tipografía de la etiqueta, sin inventar elementos."},
  {id:"text", label:"Textos legibles", description:"Nombre, ortografía, concentración, volumen y cualquier impresión verificable."},
  {id:"logo", label:"Logotipos y marcas", description:"Diseño, proporción, colocación y presencia o ausencia del logotipo."},
  {id:"geometry", label:"Geometría del producto", description:"Silueta real del frasco, tapón, atomizador, base y detalles de estructura."},
  {id:"color", label:"Colores", description:"Tonalidad y transparencia del vidrio, líquido, tapa y elementos de marca."},
  {id:"dimensions", label:"Dimensiones y proporciones", description:"Relaciones alto-ancho, escala, capacidad y proporción de componentes."},
  {id:"distinctive", label:"Elementos distintivos", description:"Grabados, relieves, acabados, ornamentos y detalles específicos de la variante."},
  {id:"variant", label:"Identidad de variante", description:"Casa, nombre, flanker, EDT/EDP/Parfum y presentación exacta."},
] as const;
export type IdentityField = typeof PRODUCT_IDENTITY_FIELDS[number]["id"];
export type IdentityObservationState = "not_checked" | "claimed_match" | "mismatch";
export type IdentityObservation = {field:IdentityField;state:IdentityObservationState;note:string;reference:string};
export type ProductIdentityReview = {
  productSlug:string;
  imageSha256:string;
  authoritativeProductReference:string;
  observations:IdentityObservation[];
};
const SHA=/^[a-f0-9]{64}$/;
const SLUG=/^[a-z0-9][a-z0-9._-]{0,159}$/;
const S=(v:unknown,max:number)=>typeof v==="string" && v.length<=max;
export function assessProductIdentityReview(input:ProductIdentityReview) {
  if(!input || !SLUG.test(input.productSlug) || !SHA.test(input.imageSha256) ||
     !S(input.authoritativeProductReference,1500) ||
     !Array.isArray(input.observations) || input.observations.length!==PRODUCT_IDENTITY_FIELDS.length)
    throw new Error("invalid_product_identity_review");
  const fields=new Set<IdentityField>(),issues:string[]=[];
  let mismatches=0,unchecked=0,claimedMatches=0;
  for(const o of input.observations) {
    if(!o || !PRODUCT_IDENTITY_FIELDS.some(f=>f.id===o.field) || fields.has(o.field) ||
       !["not_checked","claimed_match","mismatch"].includes(o.state) ||
       !S(o.note,1500) || !S(o.reference,1500) ||
       (o.state!=="not_checked" && (!o.note.trim() || !o.reference.trim())))
      throw new Error("invalid_product_identity_observation");
    fields.add(o.field);
    if(o.state==="mismatch"){mismatches++;issues.push(o.field);}
    if(o.state==="not_checked")unchecked++;
    if(o.state==="claimed_match")claimedMatches++;
  }
  // Even 8/8 operator claims are NOT an independent verification of product identity.
  return {
    state:mismatches>0?"material_mismatch_blocked":"independent_verification_required",
    checks:{total:PRODUCT_IDENTITY_FIELDS.length,mismatches,unchecked,claimedMatches},
    mismatchFields:issues,
    fidelityVerified:false,
    aestheticOverrideAllowed:false,
    replacementAllowed:false,
    publication:"blocked" as const,
    next:mismatches>0
      ?"Reject candidate or correct the mismatched product features and restart from fresh image bytes."
      :"Verify each claim against an authorized real-product reference with a human reviewer and rights clearance.",
  };
}
