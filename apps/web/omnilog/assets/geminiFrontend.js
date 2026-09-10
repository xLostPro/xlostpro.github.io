import{G as f}from"./index2.js";const T=new Set(["game","movie","tv","book","music"]),E=e=>typeof e=="object"&&e!==null&&!Array.isArray(e),h=e=>typeof e=="string"&&e.trim()?e.trim():null,d=e=>typeof e=="string"&&e.trim()?e.trim():void 0,A=e=>{const t=e.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);return JSON.parse(((t==null?void 0:t[1])??e).trim())},w=e=>typeof e=="string"&&T.has(e)?e:null,I=e=>{if(!E(e))return null;const t=h(e.title),n=w(e.type),s=h(e.reason);return!t||!n||!s?null:{title:t,type:n,reason:s,category:d(e.category),releaseYear:d(e.releaseYear)}},p=e=>{const t=A(e);if(!Array.isArray(t))throw new Error("AI response must be a JSON array");const n=t.map(I).filter(s=>s!==null);if(!n.length)throw new Error("AI response contained no valid recommendations");return n};var g={};const S=()=>typeof process<"u"&&g&&g.GEMINI_API_KEY?g.GEMINI_API_KEY:localStorage.getItem("omnilog_gemini_api_key")||"",b=()=>localStorage.getItem("omnilog_gemini_model")||"gemini-3-flash-preview",R=()=>localStorage.getItem("omnilog_ai_provider")||"google",C=()=>({apiKey:localStorage.getItem("omnilog_custom_ai_key")||"",baseUrl:localStorage.getItem("omnilog_custom_ai_base_url")||"",model:localStorage.getItem("omnilog_custom_ai_model")||""}),k=()=>{const e=S();return e?new f({apiKey:e}):null},u=async(e,t)=>{var s,i,r;const n=R();if(n==="google"){const a=k();if(!a)throw new Error("No Gemini API key");const l=b();try{const o={};return t&&(o.systemInstruction=t),(await a.models.generateContent({model:l,contents:e,config:Object.keys(o).length>0?o:void 0})).text||""}catch(o){if(((s=o==null?void 0:o.message)!=null&&s.includes("429")||(i=o==null?void 0:o.message)!=null&&i.includes("quota"))&&(l.includes("pro")||l.includes("preview"))){const c={};return t&&(c.systemInstruction=t),(await a.models.generateContent({model:"gemini-3.1-flash-lite",contents:e,config:Object.keys(c).length>0?c:void 0})).text||""}throw o}}else{const a=C();if(!a.apiKey)throw new Error("No custom AI API key");const l=a.baseUrl||(n==="groq"?"https://api.groq.com/openai/v1":n==="openrouter"?"https://openrouter.ai/api/v1":"https://api.openai.com/v1"),o=[];t&&o.push({role:"system",content:t}),o.push({role:"user",content:e});const c=await fetch(`${l}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a.apiKey}`,"HTTP-Referer":window.location.origin,"X-Title":"OmniLog Applet"},body:JSON.stringify({model:a.model||(n==="groq"?"llama-3.1-70b-versatile":"gpt-4o-mini"),messages:o,temperature:.7})});if(!c.ok){const m=await c.json();throw new Error(((r=m==null?void 0:m.error)==null?void 0:r.message)||"AI Request failed")}return(await c.json()).choices[0].message.content}},v=async(e,t=[])=>{if(e.length===0&&t.length===0)return[];const n=t.length>0?`

CRITICAL: DO NOT recommend any of the following items. These are ALREADY in the user's backlog or have been recently seen. You MUST provide entirely NEW discoveries: ${t.join(", ")}.`:"",s=`Act as an expert media curator. Based on these items the user consumed: 
      
      ${e.map(i=>`- ${i.mediaTitle} (${i.mediaType})${i.rating?" - Rated "+i.rating+"/100":""}`).join(`
`)}
      ${n}
      
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
  `;try{const i=await u(s);return p(i)}catch(i){return console.error("AI Recommendation Error:",i),[]}},N=async(e=[],t=[])=>{const n=t.length>0?`

CRITICAL: DO NOT recommend any of the following items: ${t.join(", ")}.`:"",i=`Act as an expert cultural critic and media curator. ${e.length>0?`The user's backlog contains items like: ${e.slice(0,15).map(r=>`${r.mediaTitle} (${r.mediaType})`).join(", ")}.`:"The user has no items in their backlog yet. Recommend broadly acclaimed high-quality media across all genres."} ${n}
  
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
  ]`;try{const r=await u(i);return p(r)}catch(r){return console.error("AI Categorical Recommendation Error:",r),[]}};export{b as a,N as b,R as c,S as d,C as e,v as f,k as g,u as h};
