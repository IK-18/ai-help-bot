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
