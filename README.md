### LLM-Council 

![image](https://github.com/dagmawibabi/llm-council/blob/main/public/G6ZZO7ragAAtnCZ.jpg)

To get started clone this repo, navigate to the root directory and then:

1. Create a .env file and in your Vercel [AI Gateway](https://vercel.com/ai-gateway) api key
```
AI_GATEWAY_API_KEY=abc...
```

2. You can change your Council of LLMs list, your reviewer LLM and your Chairman LLM in the lib/models.ts file or leave as is

3. Finally 

```
pnpm install 
pnpm run dev
```

4. That's it, enjoy!

This project is inspired by Andrej Karpathy's [LLM Council](https://x.com/karpathy/status/1992381094667411768) project, but vibe-coded on [v0](https://v0.app/) and built with NextJS and uses Vercel's AI Gateway.
