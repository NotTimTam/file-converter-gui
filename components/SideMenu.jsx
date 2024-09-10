"use client";

import {
	ChartColumnIncreasing,
	FileCog,
	Package,
	Server,
	Workflow,
} from "lucide-react";
import { useRouter } from "next/navigation";

const SideMenu = () => {
	const router = useRouter();

	const menus = [
		[
			{
				title: (
					<>
						<FileCog /> Convert Files
					</>
				),
				route: "/",
			},

			{
				title: (
					<>
						<ChartColumnIncreasing /> Statistics
					</>
				),
				route: "/stats",
			},

			{
				title: (
					<>
						<Package /> Modules
					</>
				),
				route: "/modules",
			},

			{
				title: (
					<>
						<Workflow /> Jobs
					</>
				),
				route: "/jobs",
			},
		],

		[
			{
				title: (
					<>
						<Server /> API URL
					</>
				),
				route: "/api/v1",
			},
		],
	];

	return (
		<aside className="side-menu">
			{menus.map((arr, sectionIndex) => (
				<section key={sectionIndex}>
					{arr.map(({ title, route }, itemIndex) => (
						<button
							className="side-menu-button"
							key={`${sectionIndex}-${itemIndex}`}
							active={
								window.location.pathname === route
									? "true"
									: undefined
							}
							onClick={() => router.push(route)}
						>
							{title}
						</button>
					))}
				</section>
			))}
		</aside>
	);
};

export default SideMenu;
