import React, {useMemo} from "react";
import {createAvatar} from "@dicebear/core";
import {rings} from "@dicebear/collection";

type AvatarProps = {
	seed?: string;
	className?: string;
};

const Avatar = ({seed = "Chatbot", className = ""}: AvatarProps) => {
	const avatarDataUri = useMemo(() => {
		return createAvatar(rings, {seed}).toDataUri();
	}, [seed]);

	return (
		<img
			src={avatarDataUri}
			alt='Chatbot Avatar'
			className={`w-10 h-10 ${className}`}
		/>
	);
};

export default Avatar;
