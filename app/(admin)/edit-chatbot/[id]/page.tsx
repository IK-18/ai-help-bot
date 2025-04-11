"use client";

import Avatar from "@/components/Avatar";
import Characteristic from "@/components/Characteristic";
import {EmbedInstructions} from "@/components/EmbedInstructions";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {BASE_URL} from "@/graphql/apolloClient";
import {
	ADD_CHARACTERISTIC,
	DELETE_CHATBOT,
	UPDATE_CHATBOT,
} from "@/graphql/mutations/mutations";
import {GET_CHATBOT_BY_ID} from "@/graphql/queries/queries";
import {GetChatbotByIdResponse, GetChatbotByIdVariables} from "@/types/types";
import {useMutation, useQuery} from "@apollo/client";
import {Copy} from "lucide-react";
import Link from "next/link";
import {redirect} from "next/navigation";
import {FormEvent, use, useEffect, useState} from "react";
import {toast} from "sonner";

const EditChatbot = ({params}: {params: Promise<{id: string}>}) => {
	const {id} = use(params);
	const [url, setUrl] = useState<string>("");
	const [chatbotName, setChatbotName] = useState<string>("");
	const [welcomeMessage, setWelcomeMessage] = useState<string>("");
	const [newCharacteristic, setNewCharacteristic] = useState<string>("");
	const [publicAccess, setPublicAccess] = useState<boolean>(false);
	const [deleteChatbot] = useMutation(DELETE_CHATBOT, {
		refetchQueries: ["GetChatbotById"],
		awaitRefetchQueries: true,
	});
	const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
		refetchQueries: ["GetChatbotById"],
	});
	const [updateChatbot] = useMutation(UPDATE_CHATBOT, {
		refetchQueries: ["GetChatbotById"],
	});

	const {data, loading, error} = useQuery<
		GetChatbotByIdResponse,
		GetChatbotByIdVariables
	>(GET_CHATBOT_BY_ID, {
		variables: {id},
	});

	useEffect(() => {
		if (data) {
			setChatbotName(data.chatbots.name);
			setWelcomeMessage(
				data.chatbots.welcome_message ||
					"Welcome! How can I assist you today?",
			); // Set default if null
			setPublicAccess(data.chatbots.public_access || false);
		}
	}, [data, loading]);

	useEffect(() => {
		const url = `${BASE_URL}/chatbot/${id}`;
		setUrl(url);
	}, [id]);

	const handleDelete = async (id: string) => {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this chatbot?",
		);
		if (!isConfirmed) return;

		try {
			const promise = deleteChatbot({variables: {id}});
			toast.promise(promise, {
				loading: "Deleting...",
				success: "Chatbot Successfully deleted",
				error: "Failed to delete chatbot",
			});
		} catch (error) {
			console.error("Error deleteing chatbot:", error);
			toast.error("Failed to delete chatbot");
		}
	};

	const handleAddCharacteristic = async (content: string) => {
		try {
			const promise = addCharacteristic({
				variables: {
					chatbotId: Number(id),
					content,
				},
			});

			toast.promise(promise, {
				loading: "Adding...",
				success: "Information added",
				error: "Failed to add information",
			});
		} catch (error) {
			console.error("Failed to add characteristics: ", error);
		}
	};

	const handleUpdateChatbot = (e: FormEvent) => {
		e.preventDefault();

		try {
			const promise = updateChatbot({
				variables: {
					id,
					name: chatbotName,
					welcome_message: welcomeMessage,
					public_access: publicAccess,
				},
			});
			toast.promise(promise, {
				loading: "Updating...",
				success: "Chatbot Successfully updated!",
				error: (err) => `Failed to update chatbot: ${err.message}`,
			});
		} catch (error) {
			console.error("Failed to update chatbot:", error);
		}
	};

	if (loading) {
		return (
			<div className='mx-auto animate-spin p-10'>
				<Avatar seed='Loading Spinner' />
			</div>
		);
	}

	if (error) return <p>Error: {error.message}</p>;

	if (!data?.chatbots) return redirect("/view-chatbots");

	return (
		<div className='px-0 md:p-10 flex-1 max-w-4xl mx-auto'>
			<div className='md:top-0 z-50 max-sm:max-w-sm m-auto space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#2991ee]'>
				<h2 className='text-white text-sm font-bold'>Link to Chat</h2>
				<p className='text-sm inline text-white'>
					Share this link with your customers to start conversations
					with your chatbot
				</p>
				<div className='flex items-center space-x-2'>
					<Link
						href={url}
						className='w-full cursor-pointer hover:opacity-50'
					>
						<Input
							value={url}
							readOnly
							className='cursor-pointer truncate bg-white'
						/>
					</Link>
					<Button
						size='sm'
						className='px-3 cursor-pointer'
						onClick={() => {
							navigator.clipboard.writeText(url);
							toast.success("Copied to clipboard");
						}}
					>
						<span className='sr-only'>Copy</span>
						<Copy className='h-4 w-4' />
					</Button>
				</div>
				<EmbedInstructions chatbotId={Number(id)} />
			</div>
			<section className='relative mt-5 bg-white p-5 md:p-10 rounded-lg'>
				<Button
					variant={"destructive"}
					className='absolute top-2 right-2 h-8 w-2 cursor-pointer'
					onClick={() => handleDelete(id)}
				>
					X
				</Button>

				<div className='flex space-x-'>
					<Avatar seed={chatbotName} />
					<form
						onSubmit={handleUpdateChatbot}
						className='flex flex-1 space-x-2 items-center'
					>
						<div className='grid grid-cols-2 gap-y-4'>
							<Input
								value={chatbotName}
								placeholder={chatbotName}
								className='w-full border-none bg-transparent !text-xl font-bold'
								onChange={(e) => {
									setChatbotName(e.target.value);
								}}
							/>
							<Input
								value={welcomeMessage}
								onChange={(e) =>
									setWelcomeMessage(e.target.value)
								}
								placeholder={welcomeMessage}
								className='w-full'
							/>
							<div className='flex justify-end items-center space-x-2 col-span-2'>
								<Switch
									checked={publicAccess}
									onCheckedChange={(checked) => {
										setPublicAccess(checked);
									}}
									id='public-access'
									name='public-access'
								/>
								<Label htmlFor='public-access'>
									Public Access
								</Label>
							</div>
						</div>
						<Button
							type='submit'
							disabled={!chatbotName || !welcomeMessage}
						>
							Update
						</Button>
					</form>
				</div>
				<h2 className='text-xl font-bold mt-10'>
					Here's what your AI knows...
				</h2>
				<p>
					Your chatbot is equipped with the following information to
					assist you in your conversations with your customers &
					users.
				</p>
				<div className='bg-gray-200 p-5 md:p-5 rounded-md mt-5'>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleAddCharacteristic(newCharacteristic);
							setNewCharacteristic("");
						}}
						className='flex spce-x-2 mb-5'
					>
						<Input
							type='text'
							placeholder='Example: If customer asks for prices, provide pricing page: www.example.com/pricing'
							value={newCharacteristic}
							onChange={(e) => {
								setNewCharacteristic(e.target.value);
							}}
							className='bg-white'
						/>
						<Button type='submit' disabled={!newCharacteristic}>
							Add
						</Button>
					</form>
					<ul className='flex flex-wrap-reverse gap-5'>
						{data?.chatbots?.chatbot_characteristics.map(
							(characteristic) => (
								<Characteristic
									key={characteristic.id}
									characteristic={characteristic}
								/>
							),
						)}
					</ul>
				</div>
			</section>
		</div>
	);
};
export default EditChatbot;
