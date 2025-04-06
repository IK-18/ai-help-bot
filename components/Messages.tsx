"use client";

import {Message} from "@/types/types";
import {usePathname} from "next/navigation";
import Avatar from "./Avatar";
import {UserCircle} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {useEffect, useRef} from "react";

const Messages = ({
	messages,
	chatbotName,
}: {
	messages: Message[];
	chatbotName?: string;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const path = usePathname();
	const isReviewsPage = path.includes("review-sessions");

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollIntoView({behavior: "smooth"});
		}
	}, [messages]);

	return (
		<div className='flex-1 flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white rounded-lg'>
			{messages.map((message) => {
				const isSender = message.sender !== "user";
				return (
					<div
						key={message.id}
						className={`chat ${
							isSender ? "chat-start" : "chat-end"
						} relative`}
					>
						{isReviewsPage && (
							<p className='absolute -bottom-5 text-xs text-gray-300'>
								sent{" "}
								{new Date(message.created_at).toLocaleString()}
							</p>
						)}
						<div
							className={`chat-image avatar w-10 ${
								!isSender && "-mr-4"
							}`}
						>
							{isSender ? (
								<Avatar
									seed={chatbotName}
									className='h-12 w-12 bg-white rounded-full border-2 border-[#2991ee]'
								/>
							) : (
								<UserCircle className='text-[#2991ee]' />
							)}
						</div>
						<div
							className={`chat-bubble text-white ${
								isSender
									? "chat-bubble-primary bg-[#4d7df8]"
									: "chat-bubble-secondary bg-gray-200 text-gray-700"
							}`}
						>
							<span className={`break-words font-semibold`}>
								<Markdown
									remarkPlugins={[remarkGfm]}
									key={message.id}
									components={{
										ul: (node, ...props) => (
											<ul
												{...props}
												className='list-disc list-inside ml-5 mb-5'
											>
												{node.children}
											</ul>
										),
										ol: (node, ...props) => (
											<ol
												{...props}
												className='list-decimal list-inside ml-5 mb-5'
											>
												{node.children}
											</ol>
										),
										h1: (node, ...props) => (
											<h1
												{...props}
												className='text-2xl font-bold mb-5'
											>
												{node.children}
											</h1>
										),
										h2: (node, ...props) => (
											<h2
												{...props}
												className='text-xl font-bold mb-5'
											>
												{node.children}
											</h2>
										),
										h3: (node, ...props) => (
											<h3
												{...props}
												className='text-lg font-bold mb-5'
											>
												{node.children}
											</h3>
										),
										table: (node, ...props) => (
											<table
												{...props}
												className='table-auto w-full border-separate border-2 rounded-sm border-spacing-4 border-white mb-5'
											>
												{node.children}
											</table>
										),
										th: (node, ...props) => (
											<th
												{...props}
												className='text-left underline'
											>
												{node.children}
											</th>
										),
										p: (node, ...props) => (
											<p
												{...props}
												className={`whitespace-break-spaces mb-5 ${
													message.content ===
														"Thinking..." &&
													"animate-pulse"
												} ${
													isSender
														? "text-white"
														: "text-gray-700"
												}`}
											>
												{node.children}
											</p>
										),
										a: (node, ...props) => (
											<a
												{...props}
												target='_blank'
												className='font-bold underline hover:text-blue-400'
												rel='noopener noreferrer'
											>
												{node.children}
											</a>
										),
									}}
								>
									{message.content}
								</Markdown>
							</span>
						</div>
					</div>
				);
			})}
			<div ref={ref}></div>
		</div>
	);
};
export default Messages;
