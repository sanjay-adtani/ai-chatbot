# 💬 Customized AI ChatBot

A smart, **fully customizable AI chatbot** built using **Next.js 15**, **OpenAI**, and **Apollo Client**. Users can personalize the chatbot’s personality, appearance, and behavior — making it ideal for embedding into websites, SaaS platforms, or customer support flows.

Powered by **OpenAI** for intelligent, contextual conversations and using **IBM API Connect + NeonDB** for flexible, scalable GraphQL-based backend architecture.

---

## 📷 Live Demo

- [Click here to check demo](https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7342469443966377986)

---

## 🚀 Tech Stack

| Technology         | Purpose                                 |
|--------------------|------------------------------------------|
| **Next.js 15**      | Full-stack React framework              |
| **TypeScript**      | Type-safe modern JavaScript             |
| **Apollo Client**   | GraphQL state management & queries      |
| **OpenAI API**      | AI-generated conversation responses     |
| **IBM API Connect** | Secure, scalable GraphQL backend        |
| **NeonDB (PostgreSQL)** | Cloud-native Postgres database         |

---

## 🎯 Key Features

- 🧠 **OpenAI-Powered Conversations**  
  Real-time, context-aware responses using OpenAI GPT models.

- 🛠️ **Chatbot Customization**  
  Easily configure bot name, avatar, tone, and behavior.

- 🌐 **GraphQL-Driven Architecture**  
  Powered by Apollo Client and IBM API Connect for flexible backend communication.

- 🧾 **Conversation History**  
  Persist and review past interactions via PostgreSQL (NeonDB).

- ⚙️ **Developer Friendly**  
  Modular, scalable codebase using Next.js App Router & Server Actions.

---

## 🎯 Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# ✅ Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=PASTE_YOUR_PUBLISH_KEY
CLERK_SECRET_KEY=PASTE_YOUR_SECRET_KEY

# 🔗 GraphQL API (NeonDB + IBM API Connect via StepZen)
NEXT_PUBLIC_GRAPHQL_ENDPOINT=PASTE_YOUR_ENDPOINT
GRAPHQL_TOKEN=PASTE_YOUR_TOKEN

# 🧠 OpenAI API Key
OPENAI_API_KEY=PASTE_YOUR_KEY
```

## 📫 Contact

Feel free to reach out for collaboration, feedback, or questions!

- 👤 **Author**: [Sanjay Adtani](https://github.com/sanjay-adtani)
- 📧 **Email**: sanjay.adtani01@gmail.com
- 💼 **LinkedIn**: [linkedin.com/in/sanjayadtani](https://www.linkedin.com/in/sanjayadtani)

## 🔧 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sanjay-adtani/ai-chatbot.git
cd ai-chatbot
npm install
npm run dev