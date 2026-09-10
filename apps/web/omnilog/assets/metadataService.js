import{d as s,s as i}from"./index.js";import{fetchCollectionForMedia as n}from"./api.js";import"./index2.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],S=s("circle-check",d),l=()=>Math.random().toString(36).substring(2,15),h=async(a,o,e)=>{const{data:t}=await i.from("media").select("id").eq("type",a).eq("defaultApiId",String(o));if(t&&t.length>0)return t[0].id;const c=l(),{error:r}=await i.from("media").insert({id:c,type:a,defaultApiId:String(o),title:e.title,coverUrl:e.coverUrl||"",synopsis:e.synopsis||"",releaseDate:e.releaseDate||"",totalSeasons:e.totalSeasons||null,alternateApiIds:e.extraMetadata||[]});if(r)throw console.error("Error creating media item:",r),r.code==="23514"&&r.message.includes("media_type_check")&&alert(`DATABASE UPDATE REQUIRED! You need to allow 'music' (and other types) in your Supabase schema. Please open the Supabase SQL Editor and run:

ALTER TABLE public.media DROP CONSTRAINT IF EXISTS media_type_check;
ALTER TABLE public."mediaApiSettings" DROP CONSTRAINT IF EXISTS "mediaApiSettings_type_check";`),r;return c},y=async(a,o=!1)=>{const e={};try{const t=await n(a.id,a.mediaType,a.name);t&&(e.collectionName=t)}catch(t){console.error("API Collection fetch failed",t)}return e};export{S as C,h as a,y as g};
