import{d as r,s as n}from"./index.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],k=r("info",l);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],p=r("plus",i),g=async(t,o,e)=>{const c=`${t}_${o}`,a=new Date().toISOString(),d={...e,id:c,userId:t,mediaId:o,createdAt:a,updatedAt:a},{error:s}=await n.from("backlogItems").upsert(d);if(s)throw console.error("Error upserting backlog item:",s),s},I=async(t,o,e)=>{const c=`${t}_${o}`,a=new Date().toISOString();await n.from("backlogItems").update({...e,updatedAt:a}).eq("id",c)},u=async(t,o)=>{const e=`${t}_${o}`;await n.from("backlogItems").delete().eq("id",e)};export{k as I,p as P,g as a,u as r,I as u};
