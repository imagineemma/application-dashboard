"use client";

import { Button } from "@heroui/button";
import { User } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Navbar = () => {
	return (
		<header className="py-4 flex items-center justify-between ">
			<Button as={Link} to="/" className="font-bold">
				Job helper
			</Button>
			<div className="flex items-center gap-2">
				<Button as={Link} to="/custom-post">
					Create your own posting
				</Button>
				<Button as={Link} to="/applied" variant="bordered">
					Applied jobs
				</Button>
				<Button
					as={Link}
					to="/profile"
					isIconOnly
					aria-label="profile page"
					color="primary"
				>
					<User size={20} />
				</Button>
			</div>
		</header>
	);
};
