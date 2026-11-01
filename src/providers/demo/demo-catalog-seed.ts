import type { DemoCatalogSeed } from "./demo-catalog-provider";
import type { Product, ProductVariant } from "../../domain";
import { DEMO_CATALOG_ATTRIBUTE_EVIDENCE } from "./demo-catalog-evidence";

const demoAvailability = {
  source: "demo" as const,
  isAvailable: true,
  availabilityStatus: "in_stock" as const,
  quantityAvailable: null,
  lowStockThreshold: null,
};

const demoImagePathByReference: Readonly<Record<string, string>> = {
  "1000053268": "ray-ban-rb3025-181-71",
  "1000087540": "persol-po0649-95-31",
  "1000088890": "oakley-oo9318-02-34",
  "1000103998": "tom-ford-ft0778-01a-60",
  "1000127057": "prada-pr03ys-2au6s1",
  "1000084476": "dolce-gabbana-dg2204-12988g-64",
  "1000100480": "dior-30montaigne-epz-1i",
  "1000104615": "gucci-gg0900s-005",
  "1000058221": "oga-8314o-nn030",
  "1000109052": "ray-ban-rb6461-2500",
  "1000104076": "tom-ford-ft5661-001",
  "1000112234": "prada-pr51yv-04q1o1",
  "1000106967": "valentino-va1021-3003",
  "1000127106": "cazal-607-001",
  "1000044519": "persol-po3011-095",
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
        catalogEvidence: DEMO_CATALOG_ATTRIBUTE_EVIDENCE[reference] ?? null,
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
      primaryImage: demoImagePathByReference[reference]
        ? {
            url: `${import.meta.env.BASE_URL}media/products/${demoImagePathByReference[reference]}/primary.jpeg`,
            altText: name,
            width: null,
            height: null,
          }
        : null,
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
  product("noor-demo-001-ray-ban-rb3025-181-71","عینک آفتابی ریبن خلبانی RB3025 181/71","RB3025 181/71","1000053268","sunglasses","unisex",["aviator"],"metal","gold",{templeMaterial:"metal",templeColor:"gold",lensColor:"grey",lensMaterial:"crystal",lensFeature:"gradient",protectionLevel:3,uvProtection:"UV400",polarized:false,prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:62,bridgeWidthMm:14,templeLengthMm:135,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","rectangle"],sourceNote:"Exact-variant source: https://www.ray-ban.ru/product/ray-ban-aviator-rb3025-18171; lists grey gradient lenses and 135 mm temples. Lens width remains from the captured seed; source lists lens height separately."},1),
  product("noor-demo-002-persol-po0649-95-31","عینک آفتابی پرسول PO0649 95/31","PO0649 95/31","1000087540","sunglasses","male",["aviator"],"acetate","black",{templeMaterial:"acetate",templeColor:"black",lensColor:"green",lensMaterial:"crystal",lensFeature:"single-color",protectionLevel:3,uvProtection:"UV400",polarized:false,prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:54,bridgeWidthMm:20,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:["oval","heart","round","triangle","rectangle"],sourceNote:"Description says nylon frame; structured specification says acetate. Structured value is preserved."},2),
  product("noor-demo-003-oakley-oo9318-02-34","عینک آفتابی اوکلی OO9318 02 34","OO9318 02 34","1000088890","sunglasses","male",["rectangular","sporty"],"nylon","white",{templeMaterial:"nylon",templeColor:"white",lensColor:"smoky",lensMaterial:"nylon",lensFeature:"mirrored / silver coating",protectionLevel:null,uvProtection:"UV400",polarized:false,prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:null,bridgeWidthMm:null,templeLengthMm:null,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","rectangle","triangle"],sourceNote:"Description calls it aviator; structured specification says rectangular/sporty. Structured value is preserved."},3),
  product("noor-demo-004-tom-ford-ft0778-01a-60","عینک آفتابی تام فورد FT0778 01A 60","FT0778 01A 60","1000103998","sunglasses","male",["aviator"],"acetate","black",{templeMaterial:"titanium",templeColor:"gold",lensColor:"smoky",lensMaterial:"nylon",lensFeature:"single-color",protectionLevel:3,uvProtection:"UV400",polarized:false,prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:60,bridgeWidthMm:12,templeLengthMm:135,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","rectangle","triangle"]},4),
  product("noor-demo-005-prada-pr03ys-2au6s1","عینک آفتابی پرادا PR03YS 2AU6S1","PR03YS 2AU6S1","1000127057","sunglasses","female",["butterfly"],null,"havana brown",{templeMaterial:"metal",templeColor:"gold",lensColor:"brown two-tone",lensMaterial:"plastic",lensFeature:"gradient",protectionLevel:3,uvProtection:"UV400",polarized:false,prescriptionCapable:true,frameMaterialComponents:["plastic","metal"],frameMaterialDescription:"plastic front / metal temples",brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:53,bridgeWidthMm:19,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:null,sourceNote:"Exact SKU source identifies plastic front / metal temples, tortoise frame and brown gradient lenses: https://www.lensonlineshop.de/Prada-PR-03YS-2AU6S1.html and https://www.jomashop.com/prada-brown-gradient-butterfly-ladies-sunglasses-pr-03ys-2au6s1-53.html. Single frameMaterial withheld because source describes a material combination."},5),
  product("noor-demo-006-dolce-gabbana-dg2204-12988g-64","عینک آفتابی دولچه اند گابانا DG2204 12988G 64","DG2204 12988G 64","1000084476","sunglasses","female",[],"metal",null,{frameType:null,templeMaterial:"metal",templeColor:"gold",lensColor:"grey",lensMaterial:"plastic",lensFeature:"gradient",frameColorDescription:null,frameColorDescriptions:["pink gold","gold"],protectionLevel:3,uvProtection:"UV400",polarized:false,prescriptionCapable:null,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:64,bridgeWidthMm:14,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:null,sourceNote:"Exact code 12988G-64 / UPC 8053672911039: Shade Station and OpticsPlanet list pink-gold metal with light-grey gradient-to-black lenses; Lentekontakti lists gold frame, grey lenses, plastic lens material and UV400. Frame-color disagreement is preserved; no scalar frame color is asserted. Sources: https://www.shadestation.co.uk/designer-sunglasses/Dolce---Gabbana/DG2204/DG2204-12988G-64 ; https://www.opticsplanet.com/dolce-gabbana-dg2204-sunglasses.html ; https://www.lentekontakti.com/dolce-gabbana-dg2204-12988g."},6),
  product("noor-demo-007-dior-30montaigne-epz-1i","عینک آفتابی دیور 30MONTAIGNE EPZ/1I","30MONTAIGNE EPZ/1I","1000100480","sunglasses","female",["square","oval"],null,null,{templeMaterial:null,templeColor:"black + gold",lensColor:null,lensMaterial:"plastic",lensFeature:"gradient",protectionLevel:3,uvProtection:"UV400",polarized:false,prescriptionCapable:null,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:60,bridgeWidthMm:15,templeLengthMm:135,caseIncluded:true,hinge:"non-spring",faceCompatibility:null,frameMaterialDescription:"plastic",frameColorDescription:"brown/havana vs yellow/red-havana conflict",lensColorDescription:"green vs grey conflict",sourceNote:"Exact EPZ/1I sources agree plastic construction, square/oval family, gradient lens and UV400/filter category 3, but conflict on frame and lens colors: https://www.alensa.hu/christian-dior-30montaigne-epz-1i and https://www.ebay.com/p/19038022081. Disputed colors and face compatibility are withheld; shape retains square only, which both sources support."},7),
  product("noor-demo-008-gucci-gg0900s-005","عینک آفتابی گوچی GG0900S 005","GG0900S 005","1000104615","sunglasses","unisex",[],null,null,{templeMaterial:"acetate",templeColor:"black",lensColor:"yellow",lensMaterial:"nylon",lensFeature:null,protectionLevel:2,uvProtection:"UV400",polarized:false,prescriptionCapable:false,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:60,bridgeWidthMm:9,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:null,frameColorDescription:"black vs black-and-gold source descriptions",sourceNote:"Exact variant GG0900S 005 listings agree on a yellow lens but differ on shape (square vs wrap/shield), material taxonomy (acetate vs generic plastic), and whether gold accents and a silver mirror are present. Shape, material, composite frame color, mirror and face fit are withheld from matching. Sources: https://www.glassesnow.co.uk/products/gucci-gg0900s-005 and https://www.visio-net.com/sunglasses/gucci-gg0900s-005.html. GG0900S 002 is a separate color variant, not this Demo record."},8),
  product("noor-demo-009-oga-8314o-nn030","عینک طبی اوگا 8314O NN030","8314O NN030","1000058221","optical","unisex",[] ,null,"black",{frameType:"full-rim",templeMaterial:null,templeColor:"gold + black",lensColor:"clear",prescriptionCapable:true,brandCountry:"France",manufactureCountry:"France",lensWidthMm:54,bridgeWidthMm:18,templeLengthMm:140,caseIncluded:true,hinge:"spring",faceCompatibility:null,style:"urban",frameMaterialComponents:["acetate","metal"],frameShapesSource:["angular","oval"],sourceNote:"Exact NN030 listing reports acetate + metal and angular + oval shapes; the scalar COR ranking fields are withheld pending multi-value feed support: https://top-brille.de/shop/oega-by-marius-morel-oega-8314o-nn030-brille-frame-lunettes-oga-2/. Size 54-18-140 and black/unisex are supported."},9),
  product("noor-demo-010-ray-ban-rb6461-2500","عینک طبی ریبن RB6461 2500","RB6461 2500","1000109052","optical","unisex",[] ,null,"gold",{frameType:"full-rim",templeMaterial:null,templeColor:null,lensColor:"clear",brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:51,bridgeWidthMm:19,templeLengthMm:145,caseIncluded:true,hinge:"non-spring",faceCompatibility:null,sourceNote:"Exact RB6461 2500 retailer listing confirms optical type, gold finish and size 51-19-145 but does not establish frame shape or material: https://www.look-eyewear.com/product/show/2153. Other RB6461 color codes are not transferred; shape, frame/temple material and face compatibility are withheld."},10),
  product("noor-demo-011-tom-ford-ft5661-001","عینک طبی تام فورد FT5661 001","FT5661 001","1000104076","optical","male",["square"],"acetate","black",{frameType:"full-rim",templeMaterial:"acetate",templeColor:"black",lensColor:"clear",prescriptionCapable:true,brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:54,bridgeWidthMm:18,templeLengthMm:145,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval"],style:"simple / understated"},11),
  product("noor-demo-012-prada-pr51yv-04q1o1","عینک طبی پرادا PR51YV 04Q1O1","PR51YV 04Q1O1","1000112234","optical","unisex",["rectangular"],"titanium","matte black",{frameType:"full-rim",templeMaterial:"titanium",templeColor:"gold",lensColor:"clear",brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:52,bridgeWidthMm:22,templeLengthMm:145,caseIncluded:true,hinge:"non-spring",faceCompatibility:["round","oval","heart","rectangle"]},12),
  product("noor-demo-013-valentino-va1021-3003","عینک طبی ولنتینو VA1021 3003","VA1021 3003","1000106967","optical","female",[],"metal","gold",{frameType:"full-rim",templeMaterial:"metal",templeColor:"gold",lensColor:"clear",brandCountry:"Italy",manufactureCountry:"Italy",lensWidthMm:54,bridgeWidthMm:18,templeLengthMm:140,caseIncluded:true,hinge:"non-spring",faceCompatibility:null,sourceNote:"Exact color-code 3003 sources conflict on normalized shape (Irregular vs round/geometric); shape and face compatibility are withheld pending source taxonomy resolution: https://www.eye-shop.eu/sunglasses.asp?a_availab=2&a_ccode=%25&a_type=3&aprice=3&b_color=%25&b_diameter=%25&b_discount=1&b_lenscolor=%25&b_material=%25&b_model=%25&b_shape=%25&b_special=%25&b_style=%25&mypage=118&price=1-690&rel=next&t_ccode=1 https://interoptika.ru/catalog/va-1021-3003/ https://chrisoptics.com/products/valentino-va1021-3003-eyeglasses-pale-gold-oversized-metal-frame."},13),
  product("noor-demo-014-cazal-607-001","عینک طبی کازال 607 001","607 001","1000127106","optical","unisex",["square"],null,null,{frameType:"full-rim",frameMaterialComponents:["acetate","metal"],frameColorComponents:["black","gold"],templeMaterial:null,templeColor:null,lensColor:"clear",brandCountry:"Germany",manufactureCountry:"Germany",lensWidthMm:56,bridgeWidthMm:18,templeLengthMm:140,caseIncluded:true,faceCompatibility:null,sourceNote:"Exact variant 607 001 is black; CAZAL manufacturer page lists acetate, while the exact-variant retailer describes black acetate plus gold metal construction and square frame, size 56/18, 140 mm temples. Composite frame material/color are retained as components; scalar frame material, color and temple material are withheld. Sources: https://www.cazal-eyewear.com/products/mod-607-3 ; https://www.cazal-shop.jp/c/legends/607."},14),
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
