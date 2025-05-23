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
