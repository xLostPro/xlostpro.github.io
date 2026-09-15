const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index2.js","./index.js","./index.css"])))=>i.map(i=>d[i]);
import{_ as w,z as d,A as u}from"./index.js";const A=new Set(["game","movie","tv","book","music"]),E=e=>typeof e=="object"&&e!==null&&!Array.isArray(e),h=e=>typeof e=="string"&&e.trim()?e.trim():null,p=e=>typeof e=="string"&&e.trim()?e.trim():void 0,b=e=>{const t=e.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);return JSON.parse(((t==null?void 0:t[1])??e).trim())},S=e=>typeof e=="string"&&A.has(e)?e:null,C=e=>{if(!E(e))return null;const t=h(e.title),n=S(e.type),s=h(e.reason);return!t||!n||!s?null:{title:t,type:n,reason:s,category:p(e.category),releaseYear:p(e.releaseYear)}},y=e=>{const t=b(e);if(!Array.isArray(t))throw new Error("AI response must be a JSON array");const n=t.map(C).filter(s=>s!==null);if(!n.length)throw new Error("AI response contained no valid recommendations");return n},f=()=>u("gemini"),I=()=>localStorage.getItem("omnilog_gemini_model")||"gemini-3-flash-preview",R=()=>localStorage.getItem("omnilog_ai_provider")||"google",k=()=>({apiKey:u("customAi"),baseUrl:localStorage.getItem("omnilog_custom_ai_base_url")||"",model:localStorage.getItem("omnilog_custom_ai_model")||""}),v=async()=>{const e=f();if(!e)return null;const{GoogleGenAI:t}=await w(async()=>{const{GoogleGenAI:n}=await import("./index2.js");return{GoogleGenAI:n}},__vite__mapDeps([0,1,2]),import.meta.url);return new t({apiKey:e})},T=async(e,t)=>{var s,c,a;const n=R();if(n==="google"){const o=f(),l=await v();if(!l)throw new Error("No Gemini API key");const r=I();try{const i={};return t&&(i.systemInstruction=t),(await l.models.generateContent({model:r,contents:e,config:Object.keys(i).length>0?i:void 0})).text||""}catch(i){if(((s=i==null?void 0:i.message)!=null&&s.includes("429")||(c=i==null?void 0:i.message)!=null&&c.includes("quota"))&&(r.includes("pro")||r.includes("preview"))){const m={};return t&&(m.systemInstruction=t),(await l.models.generateContent({model:"gemini-3.1-flash-lite",contents:e,config:Object.keys(m).length>0?m:void 0})).text||""}throw new Error(d(i,"The Gemini request failed.",[o]))}}else{const o=k();if(!o.apiKey)throw new Error("No custom AI API key");const l=o.baseUrl||(n==="groq"?"https://api.groq.com/openai/v1":n==="openrouter"?"https://openrouter.ai/api/v1":"https://api.openai.com/v1"),r=[];t&&r.push({role:"system",content:t}),r.push({role:"user",content:e});const i=await fetch(`${l}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o.apiKey}`,"HTTP-Referer":window.location.origin,"X-Title":"OmniLog Applet"},body:JSON.stringify({model:o.model||(n==="groq"?"llama-3.1-70b-versatile":"gpt-4o-mini"),messages:r,temperature:.7})});if(!i.ok){const g=await i.json();throw new Error(d((a=g==null?void 0:g.error)==null?void 0:a.message,"AI request failed.",[o.apiKey]))}return(await i.json()).choices[0].message.content}},x=async(e,t=[],n=60)=>{if(e.length===0&&t.length===0)return[];const s=t.length>0?`

CRITICAL: DO NOT recommend any of the following items. These are ALREADY in the user's backlog or have been recently seen. You MUST provide entirely NEW discoveries: ${t.join(", ")}.`:"",c=e.length>0?`The user's planning context: available session time is ${n} minutes. Prioritize suggestions that can realistically fit this window when a duration is known, and favor high-priority or soon-targeted backlog context. Never use items marked recommendationIgnored as taste signals.`:"There is no planning context yet.",a=`Act as an expert media curator. Based on these items the user consumed: 
      
      ${e.map(o=>`- ${o.mediaTitle} (${o.mediaType})${o.rating?" - Rated "+o.rating+"/100":""}${o.priority?` - Priority ${o.priority}/3`:""}${o.targetDate?` - Target ${o.targetDate}`:""}${o.estimatedMinutes?` - Estimated ${o.estimatedMinutes} minutes`:""}`).join(`
`)}
      ${s}
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
  `;try{const o=await T(a);return y(o)}catch{return console.error("AI recommendation request failed."),[]}},_=async(e=[],t=[])=>{const n=t.length>0?`

CRITICAL: DO NOT recommend any of the following items: ${t.join(", ")}.`:"",c=`Act as an expert cultural critic and media curator. ${e.length>0?`The user's backlog contains items like: ${e.slice(0,15).map(a=>`${a.mediaTitle} (${a.mediaType})`).join(", ")}.`:"The user has no items in their backlog yet. Recommend broadly acclaimed high-quality media across all genres."} ${n}
  
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
  ]`;try{const a=await T(c);return y(a)}catch{return console.error("AI categorical-recommendation request failed."),[]}};export{I as a,_ as b,R as c,f as d,k as e,x as f,v as g,T as h};
