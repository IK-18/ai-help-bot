This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose

This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format

The content is organized as follows:

1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
   a. A header with the file path (## File: path/to/file)
   b. The full contents of the file in a code block

## Usage Guidelines

-   This file should be treated as read-only. Any changes should be made to the
    original repository files, not this packed version.
-   When processing this file, use the file path to distinguish
    between different files in the repository.
-   Be aware that this file may contain sensitive information. Handle it with
    the same level of security as you would the original repository.

## Notes

-   Some files may have been excluded based on .gitignore rules and Repomix's configuration
-   Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
-   Files matching patterns in .gitignore are excluded
-   Files matching default ignore patterns are excluded
-   Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure

```
.gitignore
actions/actions.ts
app/(admin)/create-chatbot/loading.tsx
app/(admin)/create-chatbot/page.tsx
app/(admin)/edit-chatbot/[id]/page.tsx
app/(admin)/layout.tsx
app/(admin)/page.tsx
app/(admin)/review-sessions/[id]/page.tsx
app/(admin)/review-sessions/page.tsx
app/(admin)/view-chatbot/page.tsx
app/(guest)/chatbot/[id]/page.tsx
app/(guest)/login/page.tsx
app/api/graphql/route.ts
app/api/send-message/route.ts
app/globals.css
app/layout.tsx
components.json
components/ApolloProvider.tsx
components/Avatar.tsx
components/Characteristic.tsx
components/ChatbotSessions.tsx
components/EmbedInstructions.tsx
components/Header.tsx
components/Messages.tsx
components/Sidebar.tsx
components/ui/accordion.tsx
components/ui/button.tsx
components/ui/dialog.tsx
components/ui/form.tsx
components/ui/input.tsx
components/ui/label.tsx
components/ui/sonner.tsx
components/ui/switch.tsx
graphql/apolloClient.ts
graphql/mutations/mutations.ts
graphql/queries/queries.ts
lib/config.ts
lib/server/serverClient.ts
lib/utils.ts
middleware.ts
next.config.ts
package.json
postcss.config.mjs
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
README.md
stepzen/config.yaml
stepzen/index.graphql
stepzen/postgresql/index.graphql
stepzen/stepzen.config.json
tsconfig.json
types/types.ts
vercel.json
```

# Files

## File: components/EmbedInstructions.tsx

```typescript
// components/EmbedInstructions.tsx
import {Button} from "@/components/ui/button";
import {config} from "@/lib/config";
import {EmbedInstructionsProps} from "@/types/types";
import {Copy} from "lucide-react";
import {toast} from "sonner";
import {Input} from "./ui/input";

export const EmbedInstructions = ({chatbotId}: EmbedInstructionsProps) => {
	const embedCode = `<script src="${config.baseUrl}/embed.js" data-chatbot-id="${chatbotId}" async></script>`;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(embedCode);
		toast.success("Embed code copied to clipboard");
	};

	return (
		<>
			<h2 className='text-white text-sm font-bold'>
				Embed on Your Website
			</h2>
			<p className='text-sm inline text-white'>
				Add this code to your website's HTML:
			</p>
			<div className='flex items-center space-x-2'>
				<Input
					className='bg-white p-2 rounded-md mb-2 truncate'
					value={embedCode}
				/>
				<Button onClick={copyToClipboard}>
					<Copy className='h-4 w-4 mr-2' />
					Copy Code
				</Button>
			</div>
		</>
	);
};
```

## File: components/ui/switch.tsx

```typescript
"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import {cn} from "@/lib/utils";

function Switch({
	className,
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
	return (
		<SwitchPrimitive.Root
			data-slot='switch'
			className={cn(
				"peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot='switch-thumb'
				className={cn(
					"bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export {Switch};
```

## File: lib/config.ts

```typescript
export const config = {
	baseUrl: process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000",
	groqApiKey: process.env.GROQ_KEY || "",
	graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT || "",
};
```

## File: .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

## File: actions/actions.ts

```typescript
import client from "@/graphql/apolloClient";
import {gql} from "@apollo/client";
import {
	INSERT_CHAT_SESSION,
	INSERT_GUEST,
	INSERT_MESSAGE,
} from "@/graphql/mutations/mutations";
import {GET_CHATBOT_BY_ID} from "@/graphql/queries/queries";

export const startNewChat = async (
	guestName: string,
	guestEmail: string,
	chatbotId: number,
) => {
	try {
		// Create a new guest entry
		const guestResult = await client.mutate({
			mutation: INSERT_GUEST,
			variables: {
				name: guestName,
				email: guestEmail,
			},
		});

		if (!guestResult.data?.insertGuests?.id) {
			throw new Error("Failed to create guest");
		}

		const guestId = guestResult.data.insertGuests.id;

		// Initialise a new chat session
		const chatSessionResult = await client.mutate({
			mutation: INSERT_CHAT_SESSION,
			variables: {chatbot_id: chatbotId, guest_id: guestId},
		});
		const chatSessionId = chatSessionResult.data.insertChat_sessions.id;

		// Fetch chatbot to get welcome message
		const {data} = await client.query({
			query: GET_CHATBOT_BY_ID,
			variables: {id: chatbotId},
		});
		const welcomeMessage =
			data.chatbots.welcome_message ||
			`Welcome ${guestName}!\n How can I assist you today?`;

		// Insert initial message (Optional)
		await client.mutate({
			mutation: INSERT_MESSAGE,
			variables: {
				chat_session_id: chatSessionId,
				sender: "ai",
				// TODO: Change to be dynamic content that can be set by admin
				content: welcomeMessage,
			},
		});

		console.log("New chat session successfully created");
		return chatSessionId;
	} catch (error) {
		console.error("Error starting new session: ", error);
	}
};
```

## File: app/(admin)/create-chatbot/loading.tsx

```typescript
import Avatar from "@/components/Avatar";

const Loading = () => {
	return (
		<Avatar seed='Loading Spinner' className='mx-auto animate-spin p-10' />
	);
};
export default Loading;
```

## File: app/(admin)/create-chatbot/page.tsx

```typescript
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
```

## File: app/(admin)/edit-chatbot/[id]/page.tsx

```typescript
"use client";

import Avatar from "@/components/Avatar";
import Characteristic from "@/components/Characteristic";
import {EmbedInstructions} from "@/components/EmbedInstructions";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
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
			<div className='md:sticky md:top-0 z-50 max-sm:max-w-sm m-auto space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#2991ee]'>
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
							onChange={(e) => setWelcomeMessage(e.target.value)}
							placeholder={welcomeMessage}
							className='w-full border-none bg-transparent'
						/>
						<div className='flex items-center space-x-2'>
							<Switch
								checked={publicAccess}
								onCheckedChange={(checked) => {
									setPublicAccess(checked);
								}}
								id='public-access'
							/>
							<label htmlFor='public-access'>
								Make Publicly Accessible
							</label>
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
```

## File: app/(admin)/layout.tsx

```typescript
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

const AdminLayout = async ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const {userId, sessionClaims} = await auth.protect();
	if (!userId) {
		return redirect("/login");
	}
	return (
		<div className='flex flex-col flex-1'>
			{/* header */}
			<Header />
			<div className='flex flex-col flex-1 md:flex-row bg-gray-100'>
				{/* Sidebar */}
				<Sidebar />
				<div className='flex flex-1 justify-center md:justify-start items-start max-w-5xl mx-auto w-full'>
					{children}
				</div>
			</div>
		</div>
	);
};
export default AdminLayout;
```

## File: app/(admin)/page.tsx

```typescript
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<main className='p-10 bg-white m-10 rounded-md w-full'>
			<h1 className='text-4xl font-light'>
				Welcome to{" "}
				<span className='text-[#64b5f5] font-semibold'>Assistly</span>
			</h1>
			<h2 className='mt-2 mb-10'>
				Your customisable AI chat agent that helps you manage your
				customer conversations.
			</h2>
			<Link href={"/create-chatbot"}>
				<Button className='text-[#64b5f5]'>
					Let's get started with your frst chatbot
				</Button>
			</Link>
		</main>
	);
}
```

## File: app/(admin)/review-sessions/[id]/page.tsx

```typescript
import Messages from "@/components/Messages";
import {GET_CHAT_SESSION_MESSAGES} from "@/graphql/queries/queries";
import serverClient from "@/lib/server/serverClient";
import {
	GetChatSessionMessagesResponse,
	GetChatSessionMessagesVariablse,
} from "@/types/types";

export const dynamic = "force-dynamic";

const ReviewSession = async ({params}: {params: Promise<{id: string}>}) => {
	const {id} = await params;
	const {
		data: {
			chat_sessions: {
				id: chatSessionId,
				created_at,
				messages,
				chatbots: {name},
				guests: {name: guestName, email},
			},
		},
	} = await serverClient.query<
		GetChatSessionMessagesResponse,
		GetChatSessionMessagesVariablse
	>({
		query: GET_CHAT_SESSION_MESSAGES,
		variables: {id: parseInt(id as string)},
	});

	return (
		<div className='flex-1 p-10 pb-24'>
			<h1 className='text-xl lg:text-3xl font-semibold'>
				Session Review
			</h1>
			<p className='font-light text-xs text-gray-400 mt-2'>
				Started at {new Date(created_at).toLocaleString()}
			</p>
			<h2 className='font-light mt-2'>
				Between {name} &{" "}
				<span className='fot-semibold'>
					{guestName} {email}
				</span>
			</h2>
			<hr className='my-10' />
			<Messages messages={messages} chatbotName={name} />
		</div>
	);
};
export default ReviewSession;
```

## File: app/(admin)/review-sessions/page.tsx

```typescript
import ChatbotSessions from "@/components/ChatbotSessions";
import {GET_USER_CHATBOTS} from "@/graphql/queries/queries";
import serverClient from "@/lib/server/serverClient";
import {
	Chatbot,
	GetUserChatbotsData,
	GetUserChatbotsVariables,
} from "@/types/types";
import {auth} from "@clerk/nextjs/server";

const ReviewSessions = async () => {
	const {userId, sessionClaims} = await auth.protect();

	if (!userId) return;

	// Get the chatbots for the user
	const {
		data: {chatbotsByUser},
	} = await serverClient.query<GetUserChatbotsData, GetUserChatbotsVariables>(
		{
			query: GET_USER_CHATBOTS,
			variables: {clerk_user_id: userId},
		},
	);

	const sortedChatbotsByUser: Chatbot[] = chatbotsByUser.map((chatbot) => ({
		...chatbot,
		chat_sessions: [...chatbot.chat_sessions].sort(
			(a, b) =>
				new Date(b.created_at).getTime() -
				new Date(a.created_at).getTime(),
		),
	}));

	return (
		<div className='flex-1 px-10'>
			<h1 className='text-xl md:text-3xl font-semibold mt-10'>
				Chat Sessions
			</h1>
			<h2 className='mb-5'>
				Review all the chat sesions the chat bots have had with your
				customers.
			</h2>
			<ChatbotSessions chatbots={sortedChatbotsByUser} />
		</div>
	);
};
export default ReviewSessions;
```

## File: app/(admin)/view-chatbot/page.tsx

```typescript
import Avatar from "@/components/Avatar";
import {Button} from "@/components/ui/button";
import {GET_CHATBOTS_BY_USER} from "@/graphql/queries/queries";
import serverClient from "../../../lib/server/serverClient";
import {
	Chatbot,
	GetChatbotsByUserData,
	GetChatbotsByUserDataVariables,
} from "@/types/types";
import {auth} from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ViewChatbots = async () => {
	const {userId, sessionClaims} = await auth.protect();

	if (!userId) return;

	// Get the chatbots for the user
	const {
		data: {chatbotsByUser},
	} = await serverClient.query<
		GetChatbotsByUserData,
		GetChatbotsByUserDataVariables
	>({
		query: GET_CHATBOTS_BY_USER,
		variables: {clerk_user_id: userId},
	});

	const sortedChatbotsByUser: Chatbot[] = [...chatbotsByUser].sort(
		(a, b) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
	);

	return (
		<div className='flex-1 pb-20 p-10'>
			<h1 className='text-xl md:text-3xl font-semibold mb-5'>
				Active Chatbots
			</h1>
			{sortedChatbotsByUser.length === 0 && (
				<div>
					<p>
						You have not created any chatbots yet. Click on the
						button below to create one.
					</p>
					<Link href={"/create-chatbot"}>
						<Button className='bg-[#64b5f5] text-white p-3 rounded-md mt-5'>
							Create Chatbot
						</Button>
					</Link>
				</div>
			)}

			<ul className='flex flex-col space-y-5'>
				{sortedChatbotsByUser.map((chatbot) => (
					<Link key={chatbot.id} href={`/edit-chatbot/${chatbot.id}`}>
						<li className='relative p-10 border rounded-md flex-1 bg-white'>
							<div className='flex justify-between items-center'>
								<div className='flex items-center space-x-4'>
									<Avatar seed={chatbot.name} />
									<h2 className='text-xl font-bold'>
										{chatbot.name}
									</h2>
								</div>
								<p className='absolute top-5 right-5 text-xs text-gray-400'>
									Created:{" "}
									{new Date(
										chatbot.created_at,
									).toLocaleString()}
								</p>
							</div>
							<hr className='mt-2' />
							<div className='grid grid-cols-2 gap-10 md:gap-5 p-5'>
								<h3 className='italic'>Characteristics:</h3>
								<ul className='text-xs'>
									{!chatbot.chatbot_characteristics
										.length && (
										<p>No characteristics added yet.</p>
									)}
									{chatbot.chatbot_characteristics.map(
										(characteristics) => (
											<li
												key={characteristics.id}
												className='list-disc break-words'
											>
												{characteristics.content}
											</li>
										),
									)}
								</ul>
								<h3 className='italic'>No of Sessions:</h3>
								<p>{chatbot.chat_sessions.length}</p>
							</div>
						</li>
					</Link>
				))}
			</ul>
		</div>
	);
};
export default ViewChatbots;
```

## File: app/(guest)/chatbot/[id]/page.tsx

```typescript
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
	GET_MESSAGES_BY_CHAT_SESSION_ID,
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
	>(GET_MESSAGES_BY_CHAT_SESSION_ID, {
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
```

## File: app/(guest)/login/page.tsx

```typescript
import Avatar from "@/components/Avatar";
import {SignIn} from "@clerk/nextjs";

const Login = () => {
	return (
		<div className='flex py-10 md:py-0 flex-col flex-1 justify-center items-center bg-[#64b5f5]'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
				<div className='flex flex-col items-center justify-center space-t-5 text-white'>
					<div className='rounded-full bg-white p-5'>
						<Avatar seed='AI Support Agent' className='h-60 w-60' />
					</div>
					<div className='text-center'>
						<h1 className='text-4xl'>Assistly</h1>
						<h2 className='text-base font-light'>
							Your Customisable AI Chat Agent
						</h2>
					</div>
					<h3 className='my-5 font-bold'>Sign In to get started</h3>
				</div>
				<SignIn routing='hash' fallbackRedirectUrl={"/"} />
			</div>
		</div>
	);
};
export default Login;
```

## File: app/api/send-message/route.ts

```typescript
import {NextRequest, NextResponse} from "next/server";
import Groq from "groq-sdk";
import serverClient from "@/lib/server/serverClient";
import {
	GetChatbotByIdResponse,
	GetChatbotByIdVariables,
	MessagesByChatSessionIdResponse,
	MessagesByChatSessionIdVariables,
} from "@/types/types";
import {
	GET_CHATBOT_BY_ID,
	GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "@/graphql/queries/queries";
import {ChatCompletionMessageParam} from "groq-sdk/resources/chat/completions.mjs";
import {INSERT_MESSAGE} from "@/graphql/mutations/mutations";

const groq = new Groq({apiKey: process.env.GROQ_KEY});

export const POST = async (req: NextRequest) => {
	const {chat_session_id, chatbot_id, content, name} = await req.json();

	console.log(
		`Received message from chat session ${chat_session_id}: ${content} (chatbot: ${chatbot_id})`,
	);

	try {
		// Fetch chatbot characteristics
		const {data} = await serverClient.query<
			GetChatbotByIdResponse,
			GetChatbotByIdVariables
		>({
			query: GET_CHATBOT_BY_ID,
			variables: {id: chatbot_id},
		});

		const chatbot = data.chatbots;
		if (!chatbot) {
			return NextResponse.json(
				{error: "Chatbot not found"},
				{status: 404},
			);
		}

		// Fetch previous messages
		const {data: messagesData} = await serverClient.query<
			MessagesByChatSessionIdResponse,
			MessagesByChatSessionIdVariables
		>({
			query: GET_MESSAGES_BY_CHAT_SESSION_ID,
			variables: {chat_session_id: chat_session_id},
			fetchPolicy: "no-cache",
		});

		const prevMessages = messagesData.chat_sessions.messages;

		const formattedPreviousMessages: ChatCompletionMessageParam[] =
			prevMessages.map((msg) => ({
				role: msg.sender === "ai" ? "system" : "user",
				name: msg.sender === "ai" ? "system" : name,
				content: msg.content,
			}));

		// Combine characteristics into a system prompt
		const systemPrompt = chatbot.chatbot_characteristics
			.map((c) => c.content)
			.join(" + ");

		console.log(systemPrompt);

		const messages: ChatCompletionMessageParam[] = [
			{
				role: "system",
				name: "system",
				content: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevant or in the same scope or domain as the points enterd in the key information section, kindly inform the user they're only allowed to search for the specified content. Use emojis where possible. Here is some key information that you need to be aware of, these are elements you may be asked abouut: ${systemPrompt}`,
			},
			...formattedPreviousMessages,
			{role: "user", name: name, content: content},
		];

		// Send the message to Groq's completions API
		const groqResponse = await groq.chat.completions.create({
			messages: messages,
			model: "llama-3.3-70b-versatile",
		});

		const aiResponse = groqResponse.choices[0].message.content?.trim();

		if (!aiResponse) {
			return NextResponse.json(
				{error: "Failed to generate AI response"},
				{status: 500},
			);
		}

		// Insert message into database
		await serverClient.mutate({
			mutation: INSERT_MESSAGE,
			variables: {chat_session_id, content, sender: "user"},
		});

		// Insert the AI's response
		const aiMessageResult = await serverClient.mutate({
			mutation: INSERT_MESSAGE,
			variables: {chat_session_id, content: aiResponse, sender: "ai"},
		});

		// Return AI's response back to the client
		return NextResponse.json({
			id: aiMessageResult.data.insertMessages.id,
			content: aiResponse,
		});
	} catch (error) {
		console.error("error sending message ", error);
		return NextResponse.json({error}, {status: 500});
	}
};
```

## File: components.json

```json
{
	"$schema": "https://ui.shadcn.com/schema.json",
	"style": "new-york",
	"rsc": true,
	"tsx": true,
	"tailwind": {
		"config": "",
		"css": "app/globals.css",
		"baseColor": "slate",
		"cssVariables": true,
		"prefix": ""
	},
	"aliases": {
		"components": "@/components",
		"utils": "@/lib/utils",
		"ui": "@/components/ui",
		"lib": "@/lib",
		"hooks": "@/hooks"
	},
	"iconLibrary": "lucide"
}
```

## File: components/ApolloProvider.tsx

```typescript
"use client";

import client from "@/graphql/apolloClient";
import {ApolloProvider} from "@apollo/client";

const ApolloProviderWrapper = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default ApolloProviderWrapper;
```

## File: components/Avatar.tsx

```typescript
import Image from "next/image";
import {createAvatar} from "@dicebear/core";
import {rings} from "@dicebear/collection";
import {useMemo} from "react";

const Avatar = ({seed, className}: {seed?: string; className?: string}) => {
	const avatar = useMemo(() => {
		return createAvatar(rings, {
			seed, // ...other options
		}).toDataUri();
	}, []);

	return (
		<Image
			src={avatar}
			alt='User Avatar'
			width={100}
			height={100}
			className={className}
		/>
	);
};
export default Avatar;
```

## File: components/Characteristic.tsx

```typescript
import {REMOVE_CHARACTERISTIC} from "@/graphql/mutations/mutations";
import {ChatbotCharacteristic} from "@/types/types";
import {useMutation} from "@apollo/client";
import {OctagonX} from "lucide-react";
import {toast} from "sonner";

const Characteristic = ({
	characteristic,
}: {
	characteristic: ChatbotCharacteristic;
}) => {
	const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
		refetchQueries: ["GetChatbotById"],
	});

	const handleRemoveCharacteristic = async (characteristicId: number) => {
		try {
			await removeCharacteristic({
				variables: {
					characteristicId,
				},
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<li
			key={characteristic.id}
			className='relative p-10 bg-white border rounded-md'
		>
			{characteristic.content}
			<OctagonX
				onClick={() => {
					const promise = handleRemoveCharacteristic(
						characteristic.id,
					);
					toast.promise(promise, {
						loading: "Removing...",
						success: "Characteristic removed",
						error: "Failed to remove characteristic",
					});
				}}
				className='w-6 h-6 text-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50'
			/>
		</li>
	);
};
export default Characteristic;
```

## File: components/ChatbotSessions.tsx

```typescript
"use client";

import {Chatbot} from "@/types/types";
import {useEffect, useState} from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Avatar from "./Avatar";
import Link from "next/link";
import ReactTimeago from "react-timeago";

const ChatbotSessions = ({chatbots}: {chatbots: Chatbot[]}) => {
	const [sortedChatbots, setSortedChatbots] = useState<Chatbot[]>(chatbots);

	useEffect(() => {
		const sortedArray = [...chatbots].sort(
			(a, b) => b.chat_sessions.length - a.chat_sessions.length,
		);
		setSortedChatbots(sortedArray);
	}, [chatbots]);

	return (
		<div className='bg-white'>
			<Accordion type='single' collapsible>
				{sortedChatbots.map((chatbot) => {
					const hasSessions = chatbot.chat_sessions.length > 0;

					return (
						<AccordionItem
							key={chatbot.id}
							value={`item-${chatbot.id}`}
							className='px-10 py-5'
						>
							{hasSessions ? (
								<>
									<AccordionTrigger>
										<div className='flex text-left items-center w-full'>
											<Avatar
												seed={chatbot.name}
												className='h-10 w-10 mr-4'
											/>
											<div className='flex flex-1 justify-between space-x-'>
												<p>{chatbot.name}</p>
												<p className='pr- font-bold text-right'>
													{
														chatbot.chat_sessions
															.length
													}{" "}
													sessions
												</p>
											</div>
										</div>
									</AccordionTrigger>
									<AccordionContent className='space-y-5 bg-gray-100 rounded-md'>
										{chatbot.chat_sessions.map(
											(session) => (
												<Link
													href={`/review-sessions/${session.id}`}
													key={session.id}
													className='relative p-10 bg-[#2991ee] text-white rounded-md block'
												>
													<p className='text-lg font-bold'>
														{session.guests?.name ||
															"Anonymous"}
													</p>
													<p className='text-sm font-light'>
														{session.guests
															?.email ||
															"No email provided"}
													</p>
													<p className='absolute top-5 right-5 text-sm'>
														<ReactTimeago
															date={
																new Date(
																	session.created_at,
																)
															}
														/>
													</p>
												</Link>
											),
										)}
									</AccordionContent>
								</>
							) : (
								<p className='font-light'>
									{chatbot.name} (No Sessions)
								</p>
							)}
						</AccordionItem>
					);
				})}
			</Accordion>
		</div>
	);
};
export default ChatbotSessions;
```

## File: components/Header.tsx

```typescript
import Link from "next/link";
import Avatar from "./Avatar";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";

const Header = () => {
	return (
		<header className='bg-white shadow-sm text-gray-800 flex justify-between p-5'>
			<Link href='/' className='flex items-center text-4xl font-thin'>
				{/* Avatar */}
				<Avatar seed='AI Support Agent' />
				<div className='space-y-1'>
					<h1>Assistly</h1>
					<h2 className='text-sm'>Your customisable AI Chat Agent</h2>
				</div>
			</Link>
			<div className='flex items-center'>
				<SignedIn>
					<UserButton showName />
				</SignedIn>
				<SignedOut>
					<SignInButton />
				</SignedOut>
			</div>
		</header>
	);
};
export default Header;
```

## File: components/Messages.tsx

```typescript
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
```

## File: components/Sidebar.tsx

```typescript
import Link from "next/link";
import {BotMessageSquare, PencilLine, SearchIcon} from "lucide-react";

const Sidebar = () => {
	return (
		<div className='bg-white text-white p-5'>
			<ul className='gap-5 flex md:flex-col'>
				<li className='flex-1'>
					<Link
						className='hover:opacity-50 flex flex-col text-center md:text-left md:flex-row items-center gap-2 p-5 rounded-md bg-[#2991ee]'
						href={"/create-chatbot"}
					>
						<BotMessageSquare className='h-6 w-6 md:h-8 md:w-8' />
						<div className='hidden sm:inline'>
							<p className='text-xl'>Create</p>
							<p className='text-sm font-extralight'>
								New Chatbot
							</p>
						</div>
					</Link>
				</li>
				<li className='flex-1'>
					<Link
						className='hover:opacity-50 flex flex-col text-center md:text-left md:flex-row items-center gap-2 p-5 rounded-md bg-[#2991ee]'
						href={"/view-chatbot"}
					>
						<PencilLine className='h-6 w-6 md:h-8 md:w-8' />
						<div className='hidden sm:inline'>
							<p className='text-xl'>Edit</p>
							<p className='text-sm font-extralight'>Chatbots</p>
						</div>
					</Link>
				</li>
				<li className='flex-1'>
					<Link
						className='hover:opacity-50 flex flex-col text-center md:text-left md:flex-row items-center gap-2 p-5 rounded-md bg-[#2991ee]'
						href={"/review-sessions"}
					>
						<SearchIcon className='h-6 w-6 md:h-8 md:w-8' />
						<div className='hidden sm:inline'>
							<p className='text-xl'>View</p>
							<p className='text-sm font-extralight'>Sessions</p>
						</div>
					</Link>
				</li>
			</ul>
		</div>
	);
};
export default Sidebar;
```

## File: components/ui/accordion.tsx

```typescript
"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {ChevronDownIcon} from "lucide-react";

import {cn} from "@/lib/utils";

function Accordion({
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
	return <AccordionPrimitive.Root data-slot='accordion' {...props} />;
}

function AccordionItem({
	className,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	return (
		<AccordionPrimitive.Item
			data-slot='accordion-item'
			className={cn("border-b last:border-b-0", className)}
			{...props}
		/>
	);
}

function AccordionTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
	return (
		<AccordionPrimitive.Header className='flex'>
			<AccordionPrimitive.Trigger
				data-slot='accordion-trigger'
				className={cn(
					"focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
					className,
				)}
				{...props}
			>
				{children}
				<ChevronDownIcon className='text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200' />
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}

function AccordionContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	return (
		<AccordionPrimitive.Content
			data-slot='accordion-content'
			className='data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm'
			{...props}
		>
			<div className={cn("pt-0 pb-4", className)}>{children}</div>
		</AccordionPrimitive.Content>
	);
}

export {Accordion, AccordionItem, AccordionTrigger, AccordionContent};
```

## File: components/ui/button.tsx

```typescript
import * as React from "react";
import {Slot} from "@radix-ui/react-slot";
import {cva, type VariantProps} from "class-variance-authority";

import {cn} from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
				destructive:
					"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot='button'
			className={cn(buttonVariants({variant, size, className}))}
			{...props}
		/>
	);
}

export {Button, buttonVariants};
```

## File: components/ui/dialog.tsx

```typescript
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {XIcon} from "lucide-react";

import {cn} from "@/lib/utils";

function Dialog({...props}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot='dialog' {...props} />;
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />;
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />;
}

function DialogClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot='dialog-close' {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot='dialog-overlay'
			className={cn(
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
	return (
		<DialogPortal data-slot='dialog-portal'>
			<DialogOverlay />
			<DialogPrimitive.Content
				data-slot='dialog-content'
				className={cn(
					"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
					className,
				)}
				{...props}
			>
				{children}
				<DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
					<XIcon />
					<span className='sr-only'>Close</span>
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogHeader({className, ...props}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot='dialog-header'
			className={cn(
				"flex flex-col gap-2 text-center sm:text-left",
				className,
			)}
			{...props}
		/>
	);
}

function DialogFooter({className, ...props}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot='dialog-footer'
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot='dialog-title'
			className={cn("text-lg leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot='dialog-description'
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
```

## File: components/ui/form.tsx

```typescript
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import {Slot} from "@radix-ui/react-slot";
import {
	Controller,
	FormProvider,
	useFormContext,
	useFormState,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
);

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{name: props.name}}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
};

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);
	const {getFieldState} = useFormContext();
	const formState = useFormState({name: fieldContext.name});
	const fieldState = getFieldState(fieldContext.name, formState);

	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>");
	}

	const {id} = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

function FormItem({className, ...props}: React.ComponentProps<"div">) {
	const id = React.useId();

	return (
		<FormItemContext.Provider value={{id}}>
			<div
				data-slot='form-item'
				className={cn("grid gap-2", className)}
				{...props}
			/>
		</FormItemContext.Provider>
	);
}

function FormLabel({
	className,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
	const {error, formItemId} = useFormField();

	return (
		<Label
			data-slot='form-label'
			data-error={!!error}
			className={cn("data-[error=true]:text-destructive", className)}
			htmlFor={formItemId}
			{...props}
		/>
	);
}

function FormControl({...props}: React.ComponentProps<typeof Slot>) {
	const {error, formItemId, formDescriptionId, formMessageId} =
		useFormField();

	return (
		<Slot
			data-slot='form-control'
			id={formItemId}
			aria-describedby={
				!error
					? `${formDescriptionId}`
					: `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			{...props}
		/>
	);
}

function FormDescription({className, ...props}: React.ComponentProps<"p">) {
	const {formDescriptionId} = useFormField();

	return (
		<p
			data-slot='form-description'
			id={formDescriptionId}
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function FormMessage({className, ...props}: React.ComponentProps<"p">) {
	const {error, formMessageId} = useFormField();
	const body = error ? String(error?.message ?? "") : props.children;

	if (!body) {
		return null;
	}

	return (
		<p
			data-slot='form-message'
			id={formMessageId}
			className={cn("text-destructive text-sm", className)}
			{...props}
		>
			{body}
		</p>
	);
}

export {
	useFormField,
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	FormField,
};
```

## File: components/ui/input.tsx

```typescript
import * as React from "react";

import {cn} from "@/lib/utils";

function Input({className, type, ...props}: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot='input'
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				className,
			)}
			{...props}
		/>
	);
}

export {Input};
```

## File: components/ui/label.tsx

```typescript
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import {cn} from "@/lib/utils";

function Label({
	className,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
	return (
		<LabelPrimitive.Root
			data-slot='label'
			className={cn(
				"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export {Label};
```

## File: components/ui/sonner.tsx

```typescript
"use client";

import {useTheme} from "next-themes";
import {Toaster as Sonner, ToasterProps} from "sonner";

const Toaster = ({...props}: ToasterProps) => {
	const {theme = "system"} = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className='toaster group'
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export {Toaster};
```

## File: graphql/mutations/mutations.ts

```typescript
import {gql} from "@apollo/client";

export const CREATE_CHATBOT = gql`
	mutation CreateChatbot(
		$clerk_user_id: String!
		$name: String!
		$welcome_message: String
		$public_access: Boolean
	) {
		insertChatbots(
			clerk_user_id: $clerk_user_id
			name: $name
			welcome_message: $welcome_message
			public_access: $public_access
		) {
			id
			name
			welcome_message
			public_access
		}
	}
`;

export const REMOVE_CHARACTERISTIC = gql`
	mutation RemoveCharacteristic($characteristicId: Int!) {
		deleteChatbot_characteristics(id: $characteristicId) {
			id
			# Add other fields you might want to return after removal
		}
	}
`;

export const DELETE_CHATBOT = gql`
	mutation DeleteChatbot($id: Int!) {
		deleteChatbots(id: $id) {
			id
		}
	}
`;

export const ADD_CHARACTERISTIC = gql`
	mutation AddCharacteristic($chatbotId: Int!, $content: String!) {
		insertChatbot_characteristics(
			chatbot_id: $chatbotId
			content: $content
		) {
			id
			content
			created_at
			# Add other fields you may want to return after adding
		}
	}
`;

export const UPDATE_CHATBOT = gql`
	mutation UpdateChatbot(
		$id: Int!
		$name: String!
		$welcome_message: String
		$public_access: Boolean
	) {
		updateChatbots(
			id: $id
			name: $name
			welcome_message: $welcome_message
			public_access: $public_access
		) {
			id
			name
			created_at
			#  Add other fields you amy want to return after update
			welcome_message
			public_access
		}
	}
`;

export const INSERT_MESSAGE = gql`
	mutation InsertMessage(
		$chat_session_id: Int!
		$content: String!
		$sender: String!
	) {
		insertMessages(
			chat_session_id: $chat_session_id
			content: $content
			sender: $sender
		) {
			id
			content
			created_at
			sender
		}
	}
`;

export const INSERT_GUEST = gql`
	mutation insertGuest($name: String!, $email: String!) {
		insertGuests(name: $name, email: $email) {
			id
		}
	}
`;

export const INSERT_CHAT_SESSION = gql`
	mutation insertChatSession($chatbot_id: Int!, $guest_id: Int!) {
		insertChat_sessions(chatbot_id: $chatbot_id, guest_id: $guest_id) {
			id
		}
	}
`;
```

## File: graphql/queries/queries.ts

```typescript
import {gql} from "@apollo/client";

export const GET_CHATBOT_BY_ID = gql`
	query GetChatbotById($id: Int!) {
		chatbots(id: $id) {
			id
			name
			welcome_message
			public_access
			created_at
			chatbot_characteristics {
				id
				content
				created_at
			}
			chat_sessions {
				id
				created_at
				guest_id
				messages {
					id
					content
					created_at
				}
			}
		}
	}
`;

export const GET_CHATBOTS_BY_USER = gql`
	query GetChatbotsByUser($clerk_user_id: String!) {
		chatbotsByUser(clerk_user_id: $clerk_user_id) {
			id
			name
			created_at
			chatbot_characteristics {
				id
				content
				created_at
			}
			chat_sessions {
				id
				created_at
				guest_id
				messages {
					id
					content
					created_at
				}
			}
		}
	}
`;

export const GET_USER_CHATBOTS = gql`
	query GetUserChatbots($clerk_user_id: String!) {
		chatbotsByUser(clerk_user_id: $clerk_user_id) {
			id
			name
			chat_sessions {
				id
				created_at
				guests {
					name
					email
				}
			}
		}
	}
`;

export const GET_CHAT_SESSION_MESSAGES = gql`
	query GetChatSessionMessages($id: Int!) {
		chat_sessions(id: $id) {
			id
			created_at
			messages {
				id
				content
				created_at
				sender
			}
			chatbots {
				name
			}
			guests {
				name
				email
			}
		}
	}
`;

export const GET_MESSAGES_BY_CHAT_SESSION_ID = gql`
	query GetMessagesChatSessionId($chat_session_id: Int!) {
		chat_sessions(id: $chat_session_id) {
			id
			messages {
				id
				content
				sender
				created_at
			}
		}
	}
`;
```

## File: lib/server/serverClient.ts

```typescript
import {
	ApolloClient,
	DefaultOptions,
	HttpLink,
	InMemoryCache,
} from "@apollo/client";

const defaultOptions: DefaultOptions = {
	watchQuery: {
		fetchPolicy: "no-cache",
		errorPolicy: "all",
	},
	query: {
		fetchPolicy: "no-cache",
		errorPolicy: "all",
	},
	mutate: {
		fetchPolicy: "no-cache",
		errorPolicy: "all",
	},
};

const serverClient = new ApolloClient({
	ssrMode: true,
	link: new HttpLink({
		uri: process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT,
		headers: {Authorization: `apikey ${process.env.GRAPHQL_TOKEN}`},
		fetch,
	}),
	cache: new InMemoryCache(),
	defaultOptions: defaultOptions,
});

export default serverClient;
```

## File: lib/utils.ts

```typescript
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
```

## File: middleware.ts

```typescript
import {clerkMiddleware} from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
```

## File: next.config.ts

```typescript
import type {NextConfig} from "next";

const nextConfig: NextConfig = {
	/* config options here */
};

export default nextConfig;
```

## File: postcss.config.mjs

```
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

## File: public/file.svg

```
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
```

## File: public/globe.svg

```
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
```

## File: public/next.svg

```
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
```

## File: public/vercel.svg

```
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
```

## File: public/window.svg

```
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
```

## File: README.md

````markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
````

## File: stepzen/config.yaml

```yaml
configurationset:
    - configuration:
          name: postgresql_config
          uri: postgresql://ep-flat-silence-a5hl6rl9-pooler.us-east-2.aws.neon.tech/neondb?user=neondb_owner&password=npg_09unbHBlOojW
```

## File: stepzen/index.graphql

```graphql
schema @sdl(files: ["postgresql/index.graphql"]) {
	query: Query
}
```

## File: stepzen/postgresql/index.graphql

```graphql
type Chat_sessions {
	chatbot_id: Int
	chatbots: Chatbots
		@materializer(query: "chatbotsUsingChat_sessions_chatbot_id_fkey")
	created_at: DateTime!
	guest_id: Int
	guests: Guests
		@materializer(query: "guestsUsingChat_sessions_guest_id_fkey")
	id: Int!
	messages: [Messages]
		@materializer(query: "messagesUsingMessages_chat_session_id_fkey")
}

type Chatbot_characteristics {
	chatbot_id: Int
	chatbots: Chatbots
		@materializer(
			query: "chatbotsUsingChatbot_characteristics_chatbot_id_fkey"
		)
	content: String!
	created_at: DateTime!
	id: Int!
}

type Chatbots {
	chat_sessions: [Chat_sessions]
		@materializer(query: "chat_sessionsUsingChat_sessions_chatbot_id_fkey")
	chatbot_characteristics: [Chatbot_characteristics]
		@materializer(
			query: "chatbot_characteristicsUsingChatbot_characteristics_chatbot_id_fkey"
		)
	clerk_user_id: String!
	created_at: DateTime!
	id: Int!
	name: String!
	welcome_message: String
	public_access: Boolean!
}

type Guests {
	chat_sessions: [Chat_sessions]
		@materializer(query: "chat_sessionsUsingChat_sessions_guest_id_fkey")
	created_at: DateTime!
	email: String
	id: Int!
	name: String
}

type Messages {
	chat_session_id: Int
	chat_sessions: Chat_sessions
		@materializer(query: "chat_sessionsUsingMessages_chat_session_id_fkey")
	content: String!
	created_at: DateTime!
	id: Int!
	sender: String!
}

"""
The following queries are just a set of examples of how to access your schema.
Feel free to modify them or aggregate more.
"""
type Query {
	" Queries for type 'Chat_sessions' "
	chat_sessions(id: Int!): Chat_sessions
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chat_sessions"
			configuration: "postgresql_config"
		)
	chat_sessionsList: [Chat_sessions]
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chat_sessions"
			configuration: "postgresql_config"
		)
	chat_sessionsPaginatedList(first: Int, after: Int): [Chat_sessions]
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "chatbot_id", "created_at", "guest_id", "id" FROM "chat_sessions" ORDER BY "id" LIMIT $1 OFFSET $2
			"""
			configuration: "postgresql_config"
		)
	chat_sessionsUsingChat_sessions_chatbot_id_fkey(id: Int!): [Chat_sessions]
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "chatbot_id", "created_at", "guest_id", "id" FROM "chat_sessions" WHERE "chatbot_id" = $1
			"""
			configuration: "postgresql_config"
		)
	chat_sessionsUsingChat_sessions_guest_id_fkey(id: Int!): [Chat_sessions]
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "chatbot_id", "created_at", "guest_id", "id" FROM "chat_sessions" WHERE "guest_id" = $1
			"""
			configuration: "postgresql_config"
		)
	chat_sessionsUsingMessages_chat_session_id_fkey(
		chat_session_id: Int!
	): Chat_sessions
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "chatbot_id", "created_at", "guest_id", "id" FROM "chat_sessions" WHERE "id" = $1
			"""
			configuration: "postgresql_config"
		)
	" Queries for type 'Chatbot_characteristics' "
	chatbot_characteristics(id: Int!): Chatbot_characteristics
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chatbot_characteristics"
			configuration: "postgresql_config"
		)
	chatbot_characteristicsList: [Chatbot_characteristics]
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chatbot_characteristics"
			configuration: "postgresql_config"
		)
	chatbot_characteristicsPaginatedList(
		first: Int
		after: Int
	): [Chatbot_characteristics]
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "chatbot_id", "content", "created_at", "id" FROM "chatbot_characteristics" ORDER BY "id" LIMIT $1 OFFSET $2
			"""
			configuration: "postgresql_config"
		)
	chatbot_characteristicsUsingChatbot_characteristics_chatbot_id_fkey(
		id: Int!
	): [Chatbot_characteristics]
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "chatbot_id", "content", "created_at", "id" FROM "chatbot_characteristics" WHERE "chatbot_id" = $1
			"""
			configuration: "postgresql_config"
		)
	" Queries for type 'Chatbots' "
	chatbots(id: Int!): Chatbots
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chatbots"
			configuration: "postgresql_config"
		)
	chatbotsList: [Chatbots]
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chatbots"
			configuration: "postgresql_config"
		)
	chatbotsPaginatedList(first: Int, after: Int): [Chatbots]
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "clerk_user_id", "created_at", "id", "name" FROM "chatbots" ORDER BY "id" LIMIT $1 OFFSET $2
			"""
			configuration: "postgresql_config"
		)
	chatbotsByUser(clerk_user_id: String!): [Chatbots]
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "clerk_user_id", "created_at", "id", "name" FROM "chatbots" WHERE "clerk_user_id" = $1
			"""
			configuration: "postgresql_config"
		)
	chatbotsByUserPaginatedList(
		clerk_user_id: String!
		first: Int
		after: Int
	): [Chatbots]
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "clerk_user_id", "created_at", "id", "name" FROM "chatbots" WHERE "clerk_user_id" = $1 LIMIT $2 OFFSET $3
			"""
			configuration: "postgresql_config"
		)
	chatbotsUsingChat_sessions_chatbot_id_fkey(chatbot_id: Int!): Chatbots
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "clerk_user_id", "created_at", "id", "name" FROM "chatbots" WHERE "id" = $1
			"""
			configuration: "postgresql_config"
		)
	chatbotsUsingChatbot_characteristics_chatbot_id_fkey(
		chatbot_id: Int!
	): Chatbots
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "clerk_user_id", "created_at", "id", "name" FROM "chatbots" WHERE "id" = $1
			"""
			configuration: "postgresql_config"
		)
	" Queries for type 'Guests' "
	guests(id: Int!): Guests
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "guests"
			configuration: "postgresql_config"
		)
	guestsList: [Guests]
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "guests"
			configuration: "postgresql_config"
		)
	guestsPaginatedList(first: Int, after: Int): [Guests]
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "created_at", "email", "id", "name" FROM "guests" ORDER BY "id" LIMIT $1 OFFSET $2
			"""
			configuration: "postgresql_config"
		)
	guestsUsingChat_sessions_guest_id_fkey(guest_id: Int!): Guests
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "created_at", "email", "id", "name" FROM "guests" WHERE "id" = $1
			"""
			configuration: "postgresql_config"
		)
	" Queries for type 'Messages' "
	messages(id: Int!): Messages
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "messages"
			configuration: "postgresql_config"
		)
	messagesList: [Messages]
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "messages"
			configuration: "postgresql_config"
		)
	messagesPaginatedList(first: Int, after: Int): [Messages]
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "chat_session_id", "content", "created_at", "id", "sender" FROM "messages" ORDER BY "id" LIMIT $1 OFFSET $2
			"""
			configuration: "postgresql_config"
		)
	messagesUsingMessages_chat_session_id_fkey(id: Int!): [Messages]
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			SELECT "chat_session_id", "content", "created_at", "id", "sender" FROM "messages" WHERE "chat_session_id" = $1
			"""
			configuration: "postgresql_config"
		)
}

"""
The following mutations are just a set of examples of how to access your schema.
Feel free to modify them or aggregate more.
"""
type Mutation {
	" Mutations for type 'Chat_sessions' "
	deleteChat_sessions(id: Int!): Chat_sessions
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chat_sessions"
			dml: DELETE
			configuration: "postgresql_config"
		)
	insertChat_sessions(
		created_at: DateTime
		guest_id: Int
		chatbot_id: Int
	): Chat_sessions
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chat_sessions"
			dml: INSERT
			configuration: "postgresql_config"
		)
	updateChat_sessions(
		id: Int!
		chatbot_id: Int
		created_at: DateTime
		guest_id: Int
	): Chat_sessions
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			UPDATE "chat_sessions" SET
			  "chatbot_id" = COALESCE($2, "chatbot_id"),
			  "created_at" = COALESCE($3, "created_at"),
			  "guest_id" = COALESCE($4, "guest_id")
			WHERE
			  "id" = $1
			RETURNING *
			"""
			configuration: "postgresql_config"
		)
	" Mutations for type 'Chatbot_characteristics' "
	deleteChatbot_characteristics(id: Int!): Chatbot_characteristics
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chatbot_characteristics"
			dml: DELETE
			configuration: "postgresql_config"
		)
	insertChatbot_characteristics(
		created_at: DateTime
		content: String!
		chatbot_id: Int
	): Chatbot_characteristics
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chatbot_characteristics"
			dml: INSERT
			configuration: "postgresql_config"
		)
	updateChatbot_characteristics(
		id: Int!
		chatbot_id: Int
		content: String
		created_at: DateTime
	): Chatbot_characteristics
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			UPDATE "chatbot_characteristics" SET
			  "chatbot_id" = COALESCE($2, "chatbot_id"),
			  "content" = COALESCE($3, "content"),
			  "created_at" = COALESCE($4, "created_at")
			WHERE
			  "id" = $1
			RETURNING *
			"""
			configuration: "postgresql_config"
		)
	" Mutations for type 'Chatbots' "
	deleteChatbots(id: Int!): Chatbots
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chatbots"
			dml: DELETE
			configuration: "postgresql_config"
		)
	insertChatbots(
		created_at: DateTime
		name: String!
		clerk_user_id: String!
		welcome_message: String
		public_access: Boolean
	): Chatbots
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "chatbots"
			dml: INSERT
			configuration: "postgresql_config"
		)
	updateChatbots(
		id: Int!
		clerk_user_id: String
		created_at: DateTime
		name: String
		welcome_message: String
		public_access: Boolean
	): Chatbots
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			UPDATE "chatbots" SET
			  "clerk_user_id" = COALESCE($2, "clerk_user_id"),
			  "created_at" = COALESCE($3, "created_at"),
			  "name" = COALESCE($4, "name"),
			  "welcome_message" = COALESCE($5, "welcome_message"),
			  "public_access" = COALESCE($6, "public_access")
			WHERE
			  "id" = $1
			RETURNING *
			"""
			configuration: "postgresql_config"
		)
	" Mutations for type 'Guests' "
	deleteGuests(id: Int!): Guests
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "guests"
			dml: DELETE
			configuration: "postgresql_config"
		)
	insertGuests(created_at: DateTime, email: String, name: String): Guests
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "guests"
			dml: INSERT
			configuration: "postgresql_config"
		)
	updateGuests(
		id: Int!
		created_at: DateTime
		email: String
		name: String
	): Guests
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			UPDATE "guests" SET
			  "created_at" = COALESCE($2, "created_at"),
			  "email" = COALESCE($3, "email"),
			  "name" = COALESCE($4, "name")
			WHERE
			  "id" = $1
			RETURNING *
			"""
			configuration: "postgresql_config"
		)
	" Mutations for type 'Messages' "
	deleteMessages(id: Int!): Messages
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "messages"
			dml: DELETE
			configuration: "postgresql_config"
		)
	insertMessages(
		chat_session_id: Int
		content: String!
		sender: String!
		created_at: DateTime
	): Messages
		@dbquery(
			type: "postgresql"
			schema: "public"
			table: "messages"
			dml: INSERT
			configuration: "postgresql_config"
		)
	updateMessages(
		id: Int!
		chat_session_id: Int
		content: String
		created_at: DateTime
		sender: String
	): Messages
		@dbquery(
			type: "postgresql"
			schema: "public"
			query: """
			UPDATE "messages" SET
			  "chat_session_id" = COALESCE($2, "chat_session_id"),
			  "content" = COALESCE($3, "content"),
			  "created_at" = COALESCE($4, "created_at"),
			  "sender" = COALESCE($5, "sender")
			WHERE
			  "id" = $1
			RETURNING *
			"""
			configuration: "postgresql_config"
		)
}
```

## File: stepzen/stepzen.config.json

```json
{
	"endpoint": "api/icy-dragonfly"
}
```

## File: tsconfig.json

```json
{
	"compilerOptions": {
		"target": "ES2017",
		"lib": ["dom", "dom.iterable", "esnext"],
		"allowJs": true,
		"skipLibCheck": true,
		"strict": true,
		"noEmit": true,
		"esModuleInterop": true,
		"module": "esnext",
		"moduleResolution": "bundler",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"jsx": "preserve",
		"incremental": true,
		"plugins": [
			{
				"name": "next"
			}
		],
		"paths": {
			"@/*": ["./*"]
		}
	},
	"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
	"exclude": ["node_modules"]
}
```

## File: types/types.ts

```typescript
export interface Chatbot {
	id: number;
	clerk_user_id: string;
	name: string;
	created_at: string;
	welcome_message: string;
	public_access: boolean;
	chatbot_characteristics: ChatbotCharacteristic[];
	chat_sessions: ChatSession[];
}

export interface ChatbotCharacteristic {
	id: number;
	chatbot_id: number;
	content: string;
	created_at: string;
}

export interface Guest {
	id: number;
	name: string;
	email: string;
	created_at: string;
}

export interface ChatSession {
	id: number;
	chatbot_id: number;
	guest_id: number | null;
	created_at: string;
	messages: Message[];
	guests: Guest;
}

export interface Message {
	id: number;
	chat_session_id: number;
	content: string;
	created_at: string;
	sender: "ai" | "user";
}

export interface GetChatbotByIdResponse {
	chatbots: Chatbot;
}

export interface GetChatbotByIdVariables {
	id: string;
}

export interface GetChatbotsByUserData {
	chatbotsByUser: Chatbot[];
}

export interface GetChatbotsByUserDataVariables {
	clerk_user_id: string;
}

export interface GetUserChatbotsData {
	chatbotsByUser: Chatbot[];
}

export interface GetUserChatbotsVariables {
	clerk_user_id: string;
}

export interface GetChatSessionMessagesResponse {
	chat_sessions: {
		id: number;
		created_at: string;
		messages: Message[];
		chatbots: {name: string};
		guests: {
			name: string;
			email: string;
		};
	};
}

export interface GetChatSessionMessagesVariablse {
	id: number;
}

export interface MessagesByChatSessionIdResponse {
	chat_sessions: ChatSession;
}

export interface MessagesByChatSessionIdVariables {
	chat_session_id: number;
}

export interface APIError {
	message: string;
	code?: string;
	details?: unknown;
}

export interface ChatbotConfig {
	id: number;
	name: string;
	welcomeMessage: string;
	theme?: {
		primaryColor: string;
		secondaryColor: string;
	};
}

export interface EmbedInstructionsProps {
	chatbotId: number;
}
```

## File: app/api/graphql/route.ts

```typescript
import serverClient from "@/lib/server/serverClient";
import {gql} from "@apollo/client";
import {NextRequest, NextResponse} from "next/server";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const POST = async (request: NextRequest) => {
	const {query, variables} = await request.json();

	try {
		let result;
		if (query.trim().startsWith("mutation")) {
			// Handle mutations
			result = await serverClient.mutate({
				mutation: gql`
					${query}
				`,
				variables,
			});
		} else {
			// Handle queries
			result = await serverClient.query({
				query: gql`
					${query}
				`,
				variables,
			});
		}

		if (result.errors) {
			console.error(result.errors);
		}

		const data = result.data;
		console.log("DATA >>>", data);
		return NextResponse.json({data}, {headers: corsHeaders});
	} catch (error) {
		console.log(error);
		return NextResponse.json(error, {status: 500});
	}
};
```

## File: app/globals.css

```css
@plugin "daisyui";
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
	--radius: 0.625rem;
	--background: oklch(1 0 0);
	--foreground: oklch(0.129 0.042 264.695);
	--card: oklch(1 0 0);
	--card-foreground: oklch(0.129 0.042 264.695);
	--popover: oklch(1 0 0);
	--popover-foreground: oklch(0.129 0.042 264.695);
	--primary: oklch(0.208 0.042 265.755);
	--primary-foreground: oklch(0.984 0.003 247.858);
	--secondary: oklch(0.968 0.007 247.896);
	--secondary-foreground: oklch(0.208 0.042 265.755);
	--muted: oklch(0.968 0.007 247.896);
	--muted-foreground: oklch(0.554 0.046 257.417);
	--accent: oklch(0.968 0.007 247.896);
	--accent-foreground: oklch(0.208 0.042 265.755);
	--destructive: oklch(0.577 0.245 27.325);
	--border: oklch(0.929 0.013 255.508);
	--input: oklch(0.929 0.013 255.508);
	--ring: oklch(0.704 0.04 256.788);
	--chart-1: oklch(0.646 0.222 41.116);
	--chart-2: oklch(0.6 0.118 184.704);
	--chart-3: oklch(0.398 0.07 227.392);
	--chart-4: oklch(0.828 0.189 84.429);
	--chart-5: oklch(0.769 0.188 70.08);
	--sidebar: oklch(0.984 0.003 247.858);
	--sidebar-foreground: oklch(0.129 0.042 264.695);
	--sidebar-primary: oklch(0.208 0.042 265.755);
	--sidebar-primary-foreground: oklch(0.984 0.003 247.858);
	--sidebar-accent: oklch(0.968 0.007 247.896);
	--sidebar-accent-foreground: oklch(0.208 0.042 265.755);
	--sidebar-border: oklch(0.929 0.013 255.508);
	--sidebar-ring: oklch(0.704 0.04 256.788);
}

.dark {
	--background: oklch(0.129 0.042 264.695);
	--foreground: oklch(0.984 0.003 247.858);
	--card: oklch(0.208 0.042 265.755);
	--card-foreground: oklch(0.984 0.003 247.858);
	--popover: oklch(0.208 0.042 265.755);
	--popover-foreground: oklch(0.984 0.003 247.858);
	--primary: oklch(0.929 0.013 255.508);
	--primary-foreground: oklch(0.208 0.042 265.755);
	--secondary: oklch(0.279 0.041 260.031);
	--secondary-foreground: oklch(0.984 0.003 247.858);
	--muted: oklch(0.279 0.041 260.031);
	--muted-foreground: oklch(0.704 0.04 256.788);
	--accent: oklch(0.279 0.041 260.031);
	--accent-foreground: oklch(0.984 0.003 247.858);
	--destructive: oklch(0.704 0.191 22.216);
	--border: oklch(1 0 0 / 10%);
	--input: oklch(1 0 0 / 15%);
	--ring: oklch(0.551 0.027 264.364);
	--chart-1: oklch(0.488 0.243 264.376);
	--chart-2: oklch(0.696 0.17 162.48);
	--chart-3: oklch(0.769 0.188 70.08);
	--chart-4: oklch(0.627 0.265 303.9);
	--chart-5: oklch(0.645 0.246 16.439);
	--sidebar: oklch(0.208 0.042 265.755);
	--sidebar-foreground: oklch(0.984 0.003 247.858);
	--sidebar-primary: oklch(0.488 0.243 264.376);
	--sidebar-primary-foreground: oklch(0.984 0.003 247.858);
	--sidebar-accent: oklch(0.279 0.041 260.031);
	--sidebar-accent-foreground: oklch(0.984 0.003 247.858);
	--sidebar-border: oklch(1 0 0 / 10%);
	--sidebar-ring: oklch(0.551 0.027 264.364);
}

@theme inline {
	--radius-sm: calc(var(--radius) - 4px);
	--radius-md: calc(var(--radius) - 2px);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) + 4px);
	--color-background: var(--background);
	--color-foreground: var(--foreground);
	--color-card: var(--card);
	--color-card-foreground: var(--card-foreground);
	--color-popover: var(--popover);
	--color-popover-foreground: var(--popover-foreground);
	--color-primary: var(--primary);
	--color-primary-foreground: var(--primary-foreground);
	--color-secondary: var(--secondary);
	--color-secondary-foreground: var(--secondary-foreground);
	--color-muted: var(--muted);
	--color-muted-foreground: var(--muted-foreground);
	--color-accent: var(--accent);
	--color-accent-foreground: var(--accent-foreground);
	--color-destructive: var(--destructive);
	--color-border: var(--border);
	--color-input: var(--input);
	--color-ring: var(--ring);
	--color-chart-1: var(--chart-1);
	--color-chart-2: var(--chart-2);
	--color-chart-3: var(--chart-3);
	--color-chart-4: var(--chart-4);
	--color-chart-5: var(--chart-5);
	--color-sidebar: var(--sidebar);
	--color-sidebar-foreground: var(--sidebar-foreground);
	--color-sidebar-primary: var(--sidebar-primary);
	--color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
	--color-sidebar-accent: var(--sidebar-accent);
	--color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
	--color-sidebar-border: var(--sidebar-border);
	--color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
	* {
		@apply border-border outline-ring/50;
	}
	body {
		@apply bg-background text-foreground;
	}
}
```

## File: app/layout.tsx

```typescript
import type {Metadata} from "next";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import ApolloProviderWrapper from "@/components/ApolloProvider";
import {Toaster} from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ApolloProviderWrapper>
			<ClerkProvider afterSignOutUrl={"/login"}>
				<html lang='en'>
					<body className='min-h-screen flex'>
						{children}
						{/* Toaster */}
						<Toaster position='bottom-center' />
					</body>
				</html>
			</ClerkProvider>
		</ApolloProviderWrapper>
	);
}
```

## File: graphql/apolloClient.ts

```typescript
import {
	ApolloClient,
	DefaultOptions,
	InMemoryCache,
	createHttpLink,
} from "@apollo/client";

export const BASE_URL =
	process.env.NODE_ENV !== "development"
		? `${process.env.NEXT_PUBLIC_VERCEL_URL}`
		: "http://localhost:3000";

const httpLink = createHttpLink({uri: `${BASE_URL}/api/graphql`});

const defaultOptions: DefaultOptions = {
	watchQuery: {
		fetchPolicy: "no-cache",
		errorPolicy: "all",
	},
	query: {
		fetchPolicy: "no-cache",
		errorPolicy: "all",
	},
	mutate: {
		fetchPolicy: "no-cache",
		errorPolicy: "all",
	},
};

const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
	defaultOptions: defaultOptions,
});

export default client;
```

## File: package.json

```json
{
	"name": "ai-help-bot",
	"version": "0.1.0",
	"private": true,
	"scripts": {
		"dev": "next dev --turbopack",
		"build": "next build",
		"start": "next start",
		"lint": "next lint"
	},
	"dependencies": {
		"@apollo/client": "^3.13.5",
		"@clerk/nextjs": "^6.12.12",
		"@dicebear/collection": "^9.2.2",
		"@dicebear/core": "^9.2.2",
		"@hookform/resolvers": "^5.0.1",
		"@radix-ui/react-accordion": "^1.2.3",
		"@radix-ui/react-dialog": "^1.1.6",
		"@radix-ui/react-label": "^2.1.2",
		"@radix-ui/react-slot": "^1.1.2",
		"@radix-ui/react-switch": "^1.1.4",
		"class-variance-authority": "^0.7.1",
		"clsx": "^2.1.1",
		"daisyui": "^5.0.12",
		"graphql": "^16.10.0",
		"groq": "^3.82.0",
		"groq-sdk": "^0.19.0",
		"lucide-react": "^0.486.0",
		"next": "15.2.4",
		"next-themes": "^0.4.6",
		"openai": "^4.91.1",
		"react": "^19.0.0",
		"react-dom": "^19.0.0",
		"react-hook-form": "^7.55.0",
		"react-markdown": "^10.1.0",
		"react-timeago": "^8.0.0",
		"remark-gfm": "^4.0.1",
		"sonner": "^2.0.3",
		"tailwind-merge": "^3.1.0",
		"tw-animate-css": "^1.2.5",
		"zod": "^3.24.2"
	},
	"devDependencies": {
		"@tailwindcss/postcss": "^4",
		"@types/node": "^20",
		"@types/react": "^19",
		"@types/react-dom": "^19",
		"tailwindcss": "^4",
		"typescript": "^5"
	}
}
```

## File: vercel.json

```json
{
	"headers": [
		{
			"source": "/api/(.*)",
			"headers": [
				{"key": "Access-Control-Allow-Credentials", "value": "true"},
				{"key": "Access-Control-Allow-Origin", "value": "*"},
				{
					"key": "Access-Control-Allow-Methods",
					"value": "GET,OPTIONS,PATCH,DELETE,POST,PUT"
				},
				{
					"key": "Access-Control-Allow-Headers",
					"value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
				}
			]
		}
	]
}
```
