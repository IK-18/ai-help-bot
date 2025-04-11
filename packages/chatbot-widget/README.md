# 🤖 Chatbot Widget

Easily embed your AI-powered chatbot on any React website with a few lines of code.

## 🌀 Tailwind CSS Required

This widget uses [Tailwind CSS](https://tailwindcss.com/) for styling.

Please ensure Tailwind is installed and configured in your project before using this widget.

🛠️ Follow the official setup guide:  
👉 https://tailwindcss.com/docs/installation

> Tip: If you're using Vite, Next.js, or Create React App, Tailwind's docs provide environment-specific instructions.

### 🧩 Also install:

```bash
npm install daisyui tw-animate-css
```

Then, in your main stylesheet add the following to the top:

```css
@plugin "daisyui";
@import "tailwindcss";
@import "tw-animate-css";
```

## Installation

### (Yeah, it's a lot 😅)

```bash
npm install @apollo/client graphql lucide-react react-hook-form zod @hookform/resolvers @dicebear/core @dicebear/collection clsx tailwind-merge @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-label

# or

yarn add @apollo/client graphql react-hook-form zod @hookform/resolvers @dicebear/core @dicebear/collection class-variance-authority clsx tailwind-merge @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-label
```

## Usage

```tsx
import {ChatbotWidget} from "chatbot-widget";

export default function Page() {
	return <ChatbotWidget chatbotId={123} />;
}
```

## Props

| Prop      | Type     | Description                                    |
| --------- | -------- | ---------------------------------------------- |
| chatbotId | `number` | Required. The ID of the chatbot to connect to. |
| theme     | `string` | Optional. (Coming soon: "dark" or "light")     |

## Features

-   Fully customizable chat interface
-   Anonymous guest login (no auth required)
-   Optimistic UI updates
-   AI-powered replies using your custom data

## Coming Soon

-   Theming support
-   Callback hooks (`onMessageSend`, `onReply`)
-   Webhook support

## License

MIT
