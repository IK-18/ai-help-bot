"use client";

import {FormEvent, use, useEffect, useState} from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	GetChatbotByIdResponse,
	GetChatbotByIdVariables,
	Message,
	MessagesByChatSessionIdResponse,
	MessagesByChatSessionIdVariables,
} from "@/types/types";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {startNewChat} from "@/actions/actions";
import Avatar from "@/components/Avatar";
import {useQuery} from "@apollo/client";
import {
	GET_CHATBOT_BY_ID,
	GET_MESSAGES_BY_CAHT_SESSION_ID,
} from "@/graphql/queries/queries";
import Messages from "@/components/Messages";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
	message: z.string().min(2, "Your message is too short!"),
});

const ChatbotPage = ({params}: {params: Promise<{id: string}>}) => {
	const {id} = use(params);
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [isOpen, setIsOpen] = useState(true);
	const [chatId, setChatId] = useState(0);
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: "",
		},
	});

	const {data: chatBotData} = useQuery<
		GetChatbotByIdResponse,
		GetChatbotByIdVariables
	>(GET_CHATBOT_BY_ID, {
		variables: {id},
	});

	const {
		loading: loadingQuery,
		error,
		data,
	} = useQuery<
		MessagesByChatSessionIdResponse,
		MessagesByChatSessionIdVariables
	>(GET_MESSAGES_BY_CAHT_SESSION_ID, {
		variables: {chat_session_id: chatId},
		skip: !chatId,
	});

	useEffect(() => {
		if (data) {
			setMessages(data.chat_sessions.messages);
		}
	}, [data]);

	const handleInformationSubmit = async (e: FormEvent) => {
		e.preventDefault();

		setLoading(true);

		const chatId = await startNewChat(name, email, Number(id));

		setChatId(chatId);
		setLoading(false);
		setIsOpen(false);
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setLoading(true);
		const {message: formMessage} = values;

		const message = formMessage;
		form.reset();

		if (!name || !email) {
			setIsOpen(true);
			setLoading(false);
			return;
		}

		if (!message.trim()) {
			return;
		}

		// Optimistically update th UI with user message
		const userMessage: Message = {
			id: Date.now(),
			content: message,
			created_at: new Date().toISOString(),
			chat_session_id: chatId,
			sender: "user",
		};

		// Show loading state fo rAI response
		const loadingMessage: Message = {
			id: Date.now() + 1,
			content: "Thinking...",
			created_at: new Date().toISOString(),
			chat_session_id: chatId,
			sender: "ai",
		};

		setMessages((prev) => [...prev, userMessage, loadingMessage]);

		try {
			const response = await fetch("/api/send-message", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: name,
					chat_session_id: chatId,
					chatbot_id: id,
					content: message,
				}),
			});

			const result = await response.json();

			// Update loading message with actual message
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === loadingMessage.id
						? {...msg, content: result.content, id: result.id}
						: msg,
				),
			);
		} catch (error) {
			console.error("Error sending message: ", error);
		}
	};

	return (
		<div className='w-full flex bg-gray-100'>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='sm:max-w-[425px]'>
					<form onSubmit={handleInformationSubmit}>
						<DialogHeader>
							<DialogTitle>Let's help you out!</DialogTitle>
							<DialogDescription>
								I just need a few details to get started.
							</DialogDescription>
						</DialogHeader>
						<div className='grid gap-4 py-4'>
							<div className='flex items-center gap-4'>
								<Label htmlFor='name' className='w-[12.5%]'>
									Name
								</Label>
								<Input
									id='name'
									value={name}
									onChange={(e) => {
										setName(e.target.value);
									}}
									placeholder='John Doe'
									className='flex-1'
								/>
							</div>
							<div className='flex items-center gap-4'>
								<Label htmlFor='username' className='w-[12.5%]'>
									Email
								</Label>
								<Input
									id='username'
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
									}}
									placeholder='example@email.com'
									className='flex-1'
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								className=''
								type='submit'
								disabled={!name || !email || loading}
							>
								{!loading ? "Continue..." : "Loading..."}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<div className='flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10'>
				<div className='pb-4 border-b sticky top-0 z-50 bg-[#4d7dfb] py-5 px-10 text-white md: rounded-t-lg flex items-center space-x-4'>
					<Avatar
						seed={chatBotData?.chatbots.name}
						className='h-12 w-12 bg-white rounded-full border-2 border-white'
					/>
					<div>
						<h1 className='truncate text-lg'>
							{chatBotData?.chatbots.name}
						</h1>
						<p className='text-sm text-gray-300'>
							⚡Typically replies instantly
						</p>
					</div>
				</div>
				<Messages
					messages={messages}
					chatbotName={chatBotData?.chatbots.name}
				/>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex items-start sticky bottom-0 z-50 space-x-4 drop-shadow-lg p-4 bg-gray-100 rounded-md'
					>
						<FormField
							control={form.control}
							name='message'
							render={({field}) => (
								<FormItem className='flex-1'>
									<FormLabel hidden>Message</FormLabel>
									<FormControl>
										<Input
											placeholder='Type a message...'
											{...field}
											className='p-8'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={
								form.formState.isSubmitting ||
								!form.formState.isValid
							}
							type='submit'
							className='h-full'
						>
							Send
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};
export default ChatbotPage;
