import type { DemoCatalogSeed } from "./demo-catalog-provider";
import type { Product, ProductVariant } from "../../domain";

const demoAvailability = {
  source: "demo" as const,
  isAvailable: true,
  availabilityStatus: "in_stock" as const,
  quantityAvailable: null,
  lowStockThreshold: null,
};

function product(
  id: string,
  name: string,
  model: string,
  reference: string,
  category: "sunglasses" | "optical",
  gender: "male" | "female" | "unisex",
  shape: readonly string[],
  frameMaterial: string | null,
  frameColor: string | null,
  attributes: Record<string, unknown>,
  priority: number,
  description: string | null = null,
): Product {
  return {
    identity: { id, source: "demo" },
    slug: id,
    name,
    description,
    attributes: {
      category,
      subcategory: category,
      tags: [category, gender, ...shape],
      customAttributes: {
        model,
        noorReference: reference,
        gender,
        frameShapes: shape,
        frameMaterial,
        frameColor,
        ...attributes,
      },
    },
    merchandising: {
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      displayPriority: priority,
      promotionalLabels: [],
    },
    media: {
      primaryImage: null,
      gallery: [],
      videoUrl: null,
    },
    externalIds: {
      sku: model,
      barcode: null,
      providerProductId: reference,
      externalSystemIds: { noorReference: reference },
    },
  };
}

function variant(
  productId: string,
  id: string,
  name: string,
  color: string | null,
  size: string | null,
  material: string | null,
): ProductVariant {
  return {
    identity: {
      id,
      productId: { id: productId, source: "demo" },
    },
    name,
    sku: null,
    attributes: {
      color,
      size,
      material,
      customAttributes: {},
    },
    availability: demoAvailability,
  };
}

const products: readonly Product[] = [
  product("noor-demo-001-ray-ban-rb3025-181-71","عینک آفتابی ریبن خلبانی RB3025 181/71","RB3025 181/71","1000053268","sunglasses","unisex",["aviator"],"metal","gold",{templeMaterial:"metal",templeColor:"gold",lensColor:"smoky two-tone",lensMaterial:"crystal",lensFeature:"gradient",protectionLevel:3,uvProtection:"UV400",polarized:false,prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:62,bridgeWidthMm:14,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","rectangle"],sourceNote:"Classic aviator; page also exposes multiple color variants."},1),
  product("noor-demo-002-persol-po0649-95-31","عینک آفتابی پرسول PO0649 95/31","PO0649 95/31","1000087540","sunglasses","male",["aviator"],"acetate","black",{templeMaterial:"acetate",templeColor:"black",lensColor:"green",lensMaterial:"crystal",lensFeature:"single-color",protectionLevel:3,uvProtection:"UV400",polarized:false,prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:54,bridgeWidthMm:20,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:["oval","heart","round","triangle","rectangle"],sourceNote:"Description says nylon frame; structured specification says acetate. Structured value is preserved."},2),
  product("noor-demo-003-oakley-oo9318-02-34","عینک آفتابی اوکلی OO9318 02 34","OO9318 02 34","1000088890","sunglasses","male",["rectangular","sporty"],"nylon","white",{templeMaterial:"nylon",templeColor:"white",lensColor:"smoky",lensMaterial:"nylon",lensFeature:"mirrored / silver coating",protectionLevel:null,uvProtection:"UV400",polarized:false,prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:null,bridgeWidthMm:null,templeLengthMm:null,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","rectangle","triangle"],sourceNote:"Description calls it aviator; structured specification says rectangular/sporty. Structured value is preserved."},3),
  product("noor-demo-004-tom-ford-ft0778-01a-60","عینک آفتابی تام فورد FT0778 01A 60","FT0778 01A 60","1000103998","sunglasses","male",["aviator"],"acetate","black",{templeMaterial:"titanium",templeColor:"gold",lensColor:"smoky",lensMaterial:"nylon",lensFeature:"single-color",protectionLevel:3,uvProtection:"UV400",polarized:false,prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:60,bridgeWidthMm:12,templeLengthMm:135,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","rectangle","triangle"]},4),
  product("noor-demo-005-prada-pr03ys-2au6s1","عینک آفتابی پرادا PR03YS 2AU6S1","PR03YS 2AU6S1","1000127057","sunglasses","female",["butterfly"],"nylon","havana brown",{templeMaterial:"metal",templeColor:"gold",lensColor:"brown two-tone",lensMaterial:"nylon",lensFeature:"gradient",protectionLevel:3,uvProtection:"UV400",polarized:false,prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:53,bridgeWidthMm:19,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","triangle"]},5),
  product("noor-demo-006-dolce-gabbana-dg2204-12988g-64","عینک آفتابی دولچه اند گابانا DG2204 12988G 64","DG2204 12988G 64","1000084476","sunglasses","female",["butterfly"],"metal","gold",{frameType:"rimless",templeMaterial:"metal",templeColor:"gold",lensColor:"brown two-tone",lensMaterial:"polycarbonate",lensFeature:"gradient",protectionLevel:3,uvProtection:"UV400",polarized:false,prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:64,bridgeWidthMm:14,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","triangle"]},6),
  product("noor-demo-007-dior-30montaigne-epz-1i","عینک آفتابی دیور 30MONTAIGNE EPZ/1I","30MONTAIGNE EPZ/1I","1000100480","sunglasses","female",["square"],"nylon","havana brown",{templeMaterial:"metal",templeColor:"gold",lensColor:"smoky two-tone",lensMaterial:"nylon",lensFeature:"gradient",protectionLevel:2,uvProtection:"UV400",polarized:false,prescriptionCapable:false,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:60,bridgeWidthMm:15,templeLengthMm:135,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","rectangle"]},7),
  product("noor-demo-008-gucci-gg0900s-005","عینک آفتابی گوچی GG0900S 005","GG0900S 005","1000104615","sunglasses","unisex",["square"],"acetate","black",{templeMaterial:"acetate",templeColor:"black",lensColor:"yellow",lensMaterial:"nylon",lensFeature:"single-color",protectionLevel:2,uvProtection:"UV400",polarized:false,prescriptionCapable:false,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:60,bridgeWidthMm:9,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval"],sourceNote:"GG0900S 002 is also shown as a related color variant; it is not a separate Demo record."},8),
  product("noor-demo-009-oga-8314o-nn030","عینک طبی اوگا 8314O NN030","8314O NN030","1000058221","optical","male",["rectangular"],"nylon","black",{frameType:"full-rim",templeMaterial:"metal + nylon",templeColor:"gold + black",lensColor:"clear",prescriptionCapable:true,brandCountry:"France",manufactureCountry:"France",lensWidthMm:54,bridgeWidthMm:18,templeLengthMm:140,caseIncluded:true,hinge:"spring",faceCompatibility:["round","oval","heart","rectangle","triangle"],style:"urban"},9),
  product("noor-demo-010-ray-ban-rb6461-2500","عینک طبی ریبن RB6461 2500","RB6461 2500","1000109052","optical","unisex",["round"],"metal","gold",{frameType:"full-rim",templeMaterial:"nylon",templeColor:"brown",lensColor:"clear",brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:51,bridgeWidthMm:19,templeLengthMm:145,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","rectangle","triangle"],sourceNote:"Related-variant area references RB6461 2509; main captured product is RB6461 2500."},10),
  product("noor-demo-011-tom-ford-ft5661-001","عینک طبی تام فورد FT5661 001","FT5661 001","1000104076","optical","male",["square"],"acetate","black",{frameType:"full-rim",templeMaterial:"acetate",templeColor:"black",lensColor:"clear",prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:54,bridgeWidthMm:18,templeLengthMm:145,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval"],style:"simple / understated"},11),
  product("noor-demo-012-prada-pr51yv-04q1o1","عینک طبی پرادا PR51YV 04Q1O1","PR51YV 04Q1O1","1000112234","optical","unisex",["rectangular"],"titanium","matte black",{frameType:"full-rim",templeMaterial:"titanium",templeColor:"gold",lensColor:"clear",brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:52,bridgeWidthMm:22,templeLengthMm:145,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","rectangle"]},12),
  product("noor-demo-013-valentino-va1021-3003","عینک طبی ولنتینو VA1021 3003","VA1021 3003","1000106967","optical","female",["round"],"metal","gold",{frameType:"full-rim",templeMaterial:"metal",templeColor:"gold",lensColor:"clear",brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:54,bridgeWidthMm:18,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:["oval","heart","rectangle"],sourceNote:"Captured source ended mid-word after 'مثل'; only complete face values are retained."},13),
  product("noor-demo-014-cazal-607-001","عینک طبی کازال 607 001","607 001","1000127106","optical","unisex",["square"],"nylon","gold + black",{frameType:"full-rim",templeMaterial:"nylon",templeColor:"gold + black",lensColor:"clear",brandCountry:"Germany",manufactureCountry:"Germany",lensWidthMm:56,bridgeWidthMm:18,templeLengthMm:140,caseIncluded:true,faceCompatibility:null,sourceNote:"Face compatibility was not exposed in the captured source data."},14),
  product("noor-demo-015-persol-po3011-095","عینک طبی پرسول PO3011 095","PO3011 095","1000044519","optical","unisex",["rectangular","square","wayfarer"],"acetate","black",{frameType:"full-rim",templeMaterial:"acetate",templeColor:"black",lensColor:"clear",prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:54,bridgeWidthMm:17,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","rectangle"]},15),
];

const variants: readonly ProductVariant[] = products.map((item) => {
  const customAttributes = item.attributes.customAttributes as Readonly<Record<string, unknown>>;
  return variant(
    item.identity.id,
    `${item.identity.id}-default`,
    item.name,
    typeof customAttributes.frameColor === "string" ? customAttributes.frameColor : null,
    typeof customAttributes.lensWidthMm === "number" ? String(customAttributes.lensWidthMm) : null,
    typeof customAttributes.frameMaterial === "string" ? customAttributes.frameMaterial : null,
  );
});

export const DEMO_CATALOG_SEED: DemoCatalogSeed = Object.freeze({
  products,
  variants,
});
