"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Copy} from "lucide-react";
import {toast} from "sonner";

type Props = {
	chatbotId: number;
};

export const EmbedInstructions = ({chatbotId}: Props) => {
	const importCode = `import { ChatbotWidget } from "./chatbot-widget";`;

	const usageCode = `<ChatbotWidget chatbotId={${chatbotId}} />`;

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard!");
	};

	return (
		<div className='space-y-6 bg-white p-5 rounded-md border mt-4'>
			<h2 className='text-lg font-bold'>Embed This Chatbot</h2>

			<h3 className='text-lg text-gray-600'>
				Download the widget files and drop them in your project:
			</h3>
			<a
				href='/api/download-widget'
				download
				className='block text-blue-600 underline text-md'
			>
				📦 Download Widget ZIP
			</a>
			<div className='bg-yellow-50 border border-yellow-300 p-4 rounded text-sm text-yellow-800 space-y-1'>
				<p>
					⚠️ <strong>Tailwind CSS Required</strong>
				</p>
				<p>
					This widget uses Tailwind CSS for styling. Make sure it's
					installed and configured in your project.
				</p>
				<p>
					👉{" "}
					<a
						href='https://tailwindcss.com/docs/installation'
						target='_blank'
						rel='noopener noreferrer'
						className='text-blue-700 underline'
					>
						View Tailwind CSS Setup Guide
					</a>
				</p>
				<br className='mx-4' />
				<p>
					Then install:
					<code className='block bg-gray-100 p-1 rounded mt-1'>
						npm install daisyui tw-animate-css
					</code>
				</p>
				<br className='mx-4' />
				<p>
					Optional: Copy the provided <code>globals.css</code> styles
					into your project for full theme consistency.
				</p>
				<br className='mx-4' />
				<p>
					Or just add{" "}
					<code className='block bg-gray-100 p-1 rounded mt-1'>
						<p>@plugin "daisyui";</p>
						<p>@import "tailwindcss";</p>
						<p>@import "tw-animate-css";</p>
					</code>
					at the top of your main style file.
				</p>
			</div>
			<p className='text-sm text-gray-600'>After unzipping, run:</p>
			<code className='bg-gray-100 p-2 rounded text-sm w-full'>
				npm install @apollo/client graphql lucide-react react-hook-form
				zod @hookform/resolvers class-variance-authority @dicebear/core
				@dicebear/collection clsx tailwind-merge @radix-ui/react-slot
				@radix-ui/react-dialog @radix-ui/react-label
			</code>
			<div>
				<br className='mx-4' />
				<p className='text-sm mb-1'>
					Import the widget into your project:
				</p>
				<div className='flex space-x-2'>
					<Input
						readOnly
						value={importCode}
						className='text-xs bg-gray-100'
					/>
					<Button onClick={() => handleCopy(importCode)} size='sm'>
						<Copy className='w-4 h-4 mr-1' /> Copy
					</Button>
				</div>
			</div>

			<div>
				<p className='text-sm mb-1'>Use it in your JSX:</p>
				<div className='flex space-x-2'>
					<Input
						readOnly
						value={usageCode}
						className='text-xs bg-gray-100'
					/>
					<Button onClick={() => handleCopy(usageCode)} size='sm'>
						<Copy className='w-4 h-4 mr-1' /> Copy
					</Button>
				</div>
			</div>
		</div>
	);
};
