import{G as p}from"./index2.js";var g={};const u=()=>typeof process<"u"&&g&&g.GEMINI_API_KEY?g.GEMINI_API_KEY:localStorage.getItem("omnilog_gemini_api_key")||"",y=()=>localStorage.getItem("omnilog_gemini_model")||"gemini-3-flash-preview",f=()=>localStorage.getItem("omnilog_ai_provider")||"google",T=()=>({apiKey:localStorage.getItem("omnilog_custom_ai_key")||"",baseUrl:localStorage.getItem("omnilog_custom_ai_base_url")||"",model:localStorage.getItem("omnilog_custom_ai_model")||""}),E=()=>{const s=u();return s?new p({apiKey:s}):null},h=async(s,i)=>{var c,n,e;const a=f();if(a==="google"){const t=E();if(!t)throw new Error("No Gemini API key");const l=y();try{const o={};return i&&(o.systemInstruction=i),(await t.models.generateContent({model:l,contents:s,config:Object.keys(o).length>0?o:void 0})).text||""}catch(o){if(((c=o==null?void 0:o.message)!=null&&c.includes("429")||(n=o==null?void 0:o.message)!=null&&n.includes("quota"))&&(l.includes("pro")||l.includes("preview"))){const r={};return i&&(r.systemInstruction=i),(await t.models.generateContent({model:"gemini-3.1-flash-lite",contents:s,config:Object.keys(r).length>0?r:void 0})).text||""}throw o}}else{const t=T();if(!t.apiKey)throw new Error("No custom AI API key");const l=t.baseUrl||(a==="groq"?"https://api.groq.com/openai/v1":a==="openrouter"?"https://openrouter.ai/api/v1":"https://api.openai.com/v1"),o=[];i&&o.push({role:"system",content:i}),o.push({role:"user",content:s});const r=await fetch(`${l}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.apiKey}`,"HTTP-Referer":window.location.origin,"X-Title":"OmniLog Applet"},body:JSON.stringify({model:t.model||(a==="groq"?"llama-3.1-70b-versatile":"gpt-4o-mini"),messages:o,temperature:.7})});if(!r.ok){const m=await r.json();throw new Error(((e=m==null?void 0:m.error)==null?void 0:e.message)||"AI Request failed")}return(await r.json()).choices[0].message.content}},I=async(s,i=[])=>{if(s.length===0&&i.length===0)return[];const a=i.length>0?`

CRITICAL: DO NOT recommend any of the following items. These are ALREADY in the user's backlog or have been recently seen. You MUST provide entirely NEW discoveries: ${i.join(", ")}.`:"",c=`Act as an expert media curator. Based on these items the user consumed: 
      
      ${s.map(n=>`- ${n.mediaTitle} (${n.mediaType})${n.rating?" - Rated "+n.rating+"/100":""}`).join(`
`)}
      ${a}
      
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
  `;try{let e=await h(c);return e.includes("```json")?e=e.split("```json")[1].split("```")[0]:e.includes("```")&&(e=e.split("```")[1].split("```")[0]),JSON.parse(e.trim())}catch(n){return console.error("AI Recommendation Error:",n),[]}},w=async(s=[],i=[])=>{const a=i.length>0?`

CRITICAL: DO NOT recommend any of the following items: ${i.join(", ")}.`:"",n=`Act as an expert cultural critic and media curator. ${s.length>0?`The user's backlog contains items like: ${s.slice(0,15).map(e=>`${e.mediaTitle} (${e.mediaType})`).join(", ")}.`:"The user has no items in their backlog yet. Recommend broadly acclaimed high-quality media across all genres."} ${a}
  
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
  ]`;try{let t=await h(n);return t.includes("```json")?t=t.split("```json")[1].split("```")[0]:t.includes("```")&&(t=t.split("```")[1].split("```")[0]),JSON.parse(t.trim())}catch(e){return console.error("AI Categorical Recommendation Error:",e),[]}};export{y as a,w as b,f as c,u as d,T as e,I as f,E as g,h};
