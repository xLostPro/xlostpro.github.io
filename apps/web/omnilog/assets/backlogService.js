import{c as l,s,i}from"./index.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],g=l("info",m);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],k=l("plus",p),_=async(o,e,a)=>{const t=`${o}_${e}`,r=new Date().toISOString(),c={...a,id:t,userId:o,mediaId:e,createdAt:r,updatedAt:r},{error:n}=await s.from("backlogItems").upsert(c);if(n)throw console.error("Error upserting backlog item:",n),n;i(o)},u=async(o,e,a)=>{const t=`${o}_${e}`,r=new Date().toISOString(),{data:c,error:n}=await s.from("backlogItems").update({...a,updatedAt:r}).eq("id",t).eq("userId",o).select("id");if(n)throw n;if(!(c!=null&&c.length))throw new Error("Backlog item not found.");i(o)},w=async(o,e)=>{const a=`${o}_${e}`,{error:t}=await s.from("backlogItems").delete().eq("id",a).eq("userId",o);if(t)throw t;i(o)},f=async(o,e,a,t)=>{const{data:r,error:c}=await s.rpc("move_backlog_queue_item",{p_backlog_item_id:e,p_plan_queue:a,p_plan_reason:t??null});if(c)throw c;return i(o),r},h=async(o,e)=>{const{data:a,error:t}=await s.rpc("complete_backlog_item",{p_backlog_item_id:e});if(t)throw t;return i(o),a};export{g as I,k as P,_ as a,h as c,f as m,w as r,u};
