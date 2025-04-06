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
