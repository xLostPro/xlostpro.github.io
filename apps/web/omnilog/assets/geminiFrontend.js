const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index2.js","./index.js","./index.css"])))=>i.map(i=>d[i]);
import{_ as f}from"./index.js";const T=new Set(["game","movie","tv","book","music"]),w=e=>typeof e=="object"&&e!==null&&!Array.isArray(e),d=e=>typeof e=="string"&&e.trim()?e.trim():null,h=e=>typeof e=="string"&&e.trim()?e.trim():void 0,E=e=>{const t=e.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);return JSON.parse(((t==null?void 0:t[1])??e).trim())},A=e=>typeof e=="string"&&T.has(e)?e:null,I=e=>{if(!w(e))return null;const t=d(e.title),n=A(e.type),a=d(e.reason);return!t||!n||!a?null:{title:t,type:n,reason:a,category:h(e.category),releaseYear:h(e.releaseYear)}},p=e=>{const t=E(e);if(!Array.isArray(t))throw new Error("AI response must be a JSON array");const n=t.map(I).filter(a=>a!==null);if(!n.length)throw new Error("AI response contained no valid recommendations");return n};var g={};const _=()=>typeof process<"u"&&g&&g.GEMINI_API_KEY?g.GEMINI_API_KEY:localStorage.getItem("omnilog_gemini_api_key")||"",b=()=>localStorage.getItem("omnilog_gemini_model")||"gemini-3-flash-preview",S=()=>localStorage.getItem("omnilog_ai_provider")||"google",R=()=>({apiKey:localStorage.getItem("omnilog_custom_ai_key")||"",baseUrl:localStorage.getItem("omnilog_custom_ai_base_url")||"",model:localStorage.getItem("omnilog_custom_ai_model")||""}),C=async()=>{const e=_();if(!e)return null;const{GoogleGenAI:t}=await f(async()=>{const{GoogleGenAI:n}=await import("./index2.js");return{GoogleGenAI:n}},__vite__mapDeps([0,1,2]),import.meta.url);return new t({apiKey:e})},u=async(e,t)=>{var a,c,s;const n=S();if(n==="google"){const o=await C();if(!o)throw new Error("No Gemini API key");const l=b();try{const i={};return t&&(i.systemInstruction=t),(await o.models.generateContent({model:l,contents:e,config:Object.keys(i).length>0?i:void 0})).text||""}catch(i){if(((a=i==null?void 0:i.message)!=null&&a.includes("429")||(c=i==null?void 0:i.message)!=null&&c.includes("quota"))&&(l.includes("pro")||l.includes("preview"))){const r={};return t&&(r.systemInstruction=t),(await o.models.generateContent({model:"gemini-3.1-flash-lite",contents:e,config:Object.keys(r).length>0?r:void 0})).text||""}throw i}}else{const o=R();if(!o.apiKey)throw new Error("No custom AI API key");const l=o.baseUrl||(n==="groq"?"https://api.groq.com/openai/v1":n==="openrouter"?"https://openrouter.ai/api/v1":"https://api.openai.com/v1"),i=[];t&&i.push({role:"system",content:t}),i.push({role:"user",content:e});const r=await fetch(`${l}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o.apiKey}`,"HTTP-Referer":window.location.origin,"X-Title":"OmniLog Applet"},body:JSON.stringify({model:o.model||(n==="groq"?"llama-3.1-70b-versatile":"gpt-4o-mini"),messages:i,temperature:.7})});if(!r.ok){const m=await r.json();throw new Error(((s=m==null?void 0:m.error)==null?void 0:s.message)||"AI Request failed")}return(await r.json()).choices[0].message.content}},v=async(e,t=[],n=60)=>{if(e.length===0&&t.length===0)return[];const a=t.length>0?`

CRITICAL: DO NOT recommend any of the following items. These are ALREADY in the user's backlog or have been recently seen. You MUST provide entirely NEW discoveries: ${t.join(", ")}.`:"",c=e.length>0?`The user's planning context: available session time is ${n} minutes. Prioritize suggestions that can realistically fit this window when a duration is known, and favor high-priority or soon-targeted backlog context. Never use items marked recommendationIgnored as taste signals.`:"There is no planning context yet.",s=`Act as an expert media curator. Based on these items the user consumed: 
      
      ${e.map(o=>`- ${o.mediaTitle} (${o.mediaType})${o.rating?" - Rated "+o.rating+"/100":""}${o.priority?` - Priority ${o.priority}/3`:""}${o.targetDate?` - Target ${o.targetDate}`:""}${o.estimatedMinutes?` - Estimated ${o.estimatedMinutes} minutes`:""}`).join(`
`)}
      ${a}
      ${c}
      
      Recommend 10 high-quality, NEW items they haven't seen. Mix games, movies, TV shows, books, and music.
      BE CREATIVE. Avoid obvious sequels or mainstream blockbusters unless they are a perfect fit.
      Identify nuances (e.g. "Since you liked the '80s synthwave vibe of X...")
      
      Respond in STRICT JSON format:
      [
        {
          "title": "Title",
          "type": "game|movie|tv|book|music",
          "releaseYear": "YYYY",
          "reason": "Expert insight on why this specifically matches their taste",
          "category": "Cult Classic | Hidden Gem | Stylistic Match"
        }
      ]
  `;try{const o=await u(s);return p(o)}catch(o){return console.error("AI Recommendation Error:",o),[]}},$=async(e=[],t=[])=>{const n=t.length>0?`

CRITICAL: DO NOT recommend any of the following items: ${t.join(", ")}.`:"",c=`Act as an expert cultural critic and media curator. ${e.length>0?`The user's backlog contains items like: ${e.slice(0,15).map(s=>`${s.mediaTitle} (${s.mediaType})`).join(", ")}.`:"The user has no items in their backlog yet. Recommend broadly acclaimed high-quality media across all genres."} ${n}
  
  Generate 20 personalized, high-quality, and diverse media recommendations (Games, Movies, TV Shows, Books, Music).
  
  CURRENT VARIETY SEED: ${Date.now()}
  
  CRITICAL REQUIREMENTS:
  1. BE CREATIVE: Mix mainstream hits with obscure indie gems, cult classics, and upcoming releases.
  2. EXACT TITLES: Use exact titles for better database matching.
  3. CATEGORIES: Each item should have a category like "Deep Cut", "Stylistic Parallel", "Thematic Match", or "Masterpiece".
  4. REASONS: Provide expert insight into WHY this matches their taste (e.g. "Because you liked the psychological horror elements in X, the narrative tension in this one will keep you hooked").

  Respond in STRICT JSON format:
  [
    {
      "title": "Exact Title",
      "type": "game|movie|tv|book|music",
      "reason": "Expert insight on why this specifically matches their taste",
      "category": "Stylistic Match | Hidden Gem | etc"
    }
  ]`;try{const s=await u(c);return p(s)}catch(s){return console.error("AI Categorical Recommendation Error:",s),[]}};export{b as a,$ as b,S as c,_ as d,R as e,v as f,C as g,u as h};
