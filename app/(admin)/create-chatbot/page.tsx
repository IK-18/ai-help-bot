"use client";

import Avatar from "@/components/Avatar";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {CREATE_CHATBOT} from "@/graphql/mutations/mutations";
import {useMutation} from "@apollo/client";
import {useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";

const CreateChatbot = () => {
	const {user} = useUser();
	const [name, setName] = useState("");
	const router = useRouter();

	const [createChatbot, {data, loading, error}] = useMutation(
		CREATE_CHATBOT,
		{
			variables: {
				clerk_user_id: user?.id,
				name: name,
			},
		},
	);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		try {
			const res = await createChatbot();
			setName("");

			router.push(`/edit-chatbot/${res.data.insertChatbots.id}`);
		} catch (error) {
			console.error(error);
		}
	};

	if (!user) {
		return null;
	}

	return (
		<div className='flex flex-col items-center justify-center gap-5 md:flex-row md:space-x-10 bg-white rounded-md m-10 p-10 flex-1'>
			<Avatar className='scale-[1.5]' seed='Create New Chatbot' />
			<div>
				<h1 className='text-xl md:text-3xl font-semibold'>Create</h1>
				<h2 className='font-light'>
					Create a new chatbot to assist you in your conversation with
					your customers.
				</h2>
				<form
					onSubmit={handleSubmit}
					className='flex flex-col md:flex-row gap-2 mt-5'
				>
					<Input
						placeholder='Chatbot Name...'
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
						className='max-w-lg'
						type='text'
						required
					/>
					<Button disabled={loading || !name} type='submit'>
						{loading ? "Creating Chatbot..." : "Create Chatbot"}
					</Button>
				</form>
				<p className='text-gray-300 mt-5'>
					Example: Customer Support Chatbot
				</p>
			</div>
		</div>
	);
};
export default CreateChatbot;
