"use client";

import {useEffect, useState, FormEvent} from "react";
import {Input} from "./ui/input";
import {Label} from "./ui/label";
import {Button} from "./ui/button";
import Avatar from "./components/Avatar";
import Messages from "./components/Messages";
import {GetChatbotByIdResponse, Message} from "./types";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";

const formSchema = z.object({
	message: z.string().min(2, "Your message is too short!"),
});

type ChatbotWidgetProps = {
	chatbotId: number;
};

const ChatbotWidget = ({chatbotId}: ChatbotWidgetProps) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [chatStarted, setChatStarted] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState(false);
	const [botData, setBotData] = useState<GetChatbotByIdResponse>();
	const [chatId, setChatId] = useState<number | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: "",
		},
	});

	useEffect(() => {
		if (messages) {
			setMessages(messages);
		}
	}, [messages]);

	const handleGuestSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const data = await fetch(
			`https://ai-help-bot-delta.vercel.app/api/start-chat`,
			{
				method: "POST",
				body: JSON.stringify({
					name: name,
					email: email,
					chatbotId: chatbotId,
				}),
			},
		)
			.then((res) => res.json())
			.then((data) => data);
		setChatId(data.chat_session_id);
		setLoading(false);
		setMessages(data.messages);
		setBotData(data.chatbotData);
		setChatStarted(true);
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		const message = values.message.trim();
		form.reset();

		if (!message || !chatId) return;

		const userMessage: Message = {
			id: Date.now(),
			content: message,
			created_at: new Date().toISOString(),
			chat_session_id: chatId,
			sender: "user",
		};

		const loadingMessage: Message = {
			id: Date.now() + 1,
			content: "Thinking...",
			created_at: new Date().toISOString(),
			chat_session_id: chatId,
			sender: "ai",
		};

		setMessages((prev) => [...prev, userMessage, loadingMessage]);

		try {
			const response = await fetch(
				"https://ai-help-bot-delta.vercel.app/api/send-message",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name,
						chat_session_id: chatId,
						chatbot_id: chatbotId,
						content: message,
					}),
				},
			);

			const result = await response.json();

			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === loadingMessage.id
						? {...msg, content: result.content, id: result.id}
						: msg,
				),
			);
		} catch (error) {
			console.error("Error sending message:", error);
		}

		setLoading(false);
	};

	return (
		<>
			{/* Floating Avatar Icon */}
			<div
				className='fixed bottom-6 right-6 cursor-pointer z-50'
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<Avatar
					seed='AI Support Agent'
					className='w-12 h-12 shadow-md'
				/>
			</div>
			{isOpen && (
				<div className='fixed bottom-20 right-6 w-[350px] max-h-[600px] shadow-xl rounded-lg border bg-white flex flex-col z-50 overflow-hidden'>
					{!chatStarted ? (
						<>
							<form
								onSubmit={handleGuestSubmit}
								className='p-4 space-y-4'
							>
								<h2>Welcome to the Chat</h2>
								<p>
									Tell us your name and email to get started
								</p>
								<div>
									<Label>Name</Label>
									<Input
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										required
									/>
								</div>
								<div>
									<Label>Email</Label>
									<Input
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										required
									/>
								</div>
								<Button
									type='submit'
									disabled={loading || !name || !email}
								>
									{loading ? "Loading..." : "Continue"}
								</Button>
							</form>
						</>
					) : (
						<>
							{botData?.chatbots && (
								<div className='bg-white'>
									<div className='flex items-center gap-2 p-4 bg-blue-500 text-white'>
										<Avatar
											seed={
												botData?.chatbots?.name ||
												"Chatbot"
											}
											className='w-10 h-10'
										/>
										<div>
											<h2 className='font-bold'>
												{botData.chatbots.name}
											</h2>
											<p className='text-sm'>
												Typically replies instantly
											</p>
										</div>
									</div>
									<Messages
										messages={messages}
										chatbotName={botData.chatbots.name}
									/>
									<Form {...form}>
										<form
											onSubmit={form.handleSubmit(
												onSubmit,
											)}
											className='flex items-start sticky bottom-0 z-50 space-x-4 p-4 bg-gray-100 rounded-md'
										>
											<FormField
												control={form.control}
												name='message'
												render={({field}) => (
													<FormItem className='flex-1'>
														<FormLabel hidden>
															Message
														</FormLabel>
														<FormControl>
															<Input
																placeholder='Type a message...'
																{...field}
																className='p-4'
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<Button
												disabled={
													form.formState
														.isSubmitting ||
													!form.formState.isValid
												}
												type='submit'
											>
												Send
											</Button>
										</form>
									</Form>
								</div>
							)}
						</>
					)}
				</div>
			)}
		</>
	);
};

export default ChatbotWidget;
