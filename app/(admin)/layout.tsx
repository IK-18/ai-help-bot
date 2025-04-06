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
