import{c as l,s as n}from"./index.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],p=l("info",i);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],u=l("plus",d),g=async(t,e,a)=>{const o=`${t}_${e}`,r=new Date().toISOString(),c={...a,id:o,userId:t,mediaId:e,createdAt:r,updatedAt:r},{error:s}=await n.from("backlogItems").upsert(c);if(s)throw console.error("Error upserting backlog item:",s),s},k=async(t,e,a)=>{const o=`${t}_${e}`,r=new Date().toISOString(),{data:c,error:s}=await n.from("backlogItems").update({...a,updatedAt:r}).eq("id",o).eq("userId",t).select("id");if(s)throw s;if(!(c!=null&&c.length))throw new Error("Backlog item not found.")},_=async(t,e)=>{const a=`${t}_${e}`,{error:o}=await n.from("backlogItems").delete().eq("id",a).eq("userId",t);if(o)throw o},I=async(t,e,a,o)=>{const{data:r,error:c}=await n.rpc("move_backlog_queue_item",{p_backlog_item_id:e,p_plan_queue:a,p_plan_reason:o??null});if(c)throw c;return r},w=async(t,e)=>{const{data:a,error:o}=await n.rpc("complete_backlog_item",{p_backlog_item_id:e});if(o)throw o;return a};export{p as I,u as P,g as a,w as c,I as m,_ as r,k as u};
