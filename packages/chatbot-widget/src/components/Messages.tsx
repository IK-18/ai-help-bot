import React, {useEffect, useRef} from "react";
import {Message} from "../types";
import Avatar from "./Avatar";

type Props = {
	messages: Message[];
	chatbotName?: string;
};

const Messages = ({messages, chatbotName}: Props) => {
	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({behavior: "smooth"});
	}, [messages]);

	return (
		<div className='flex flex-col space-y-4 p-4 overflow-y-auto h-[400px] bg-white'>
			{messages.map((msg) => {
				const isUser = msg.sender === "user";
				return (
					<div
						key={msg.id}
						className={`flex items-start ${
							isUser ? "justify-end" : "justify-start"
						}`}
					>
						{!isUser && (
							<Avatar
								seed={chatbotName}
								className='w-8 h-8 mr-2'
							/>
						)}
						<div
							className={`px-4 py-2 rounded-lg max-w-sm ${
								isUser
									? "bg-gray-200 text-gray-800"
									: "bg-blue-500 text-white"
							}`}
						>
							{msg.content}
						</div>
					</div>
				);
			})}
			<div ref={bottomRef} />
		</div>
	);
};

export default Messages;
