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
