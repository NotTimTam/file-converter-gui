"use client";

import Loading from "@/components/Loading";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Content = () => {
	const router = useRouter();

	const [modules, setModules] = useState(null);

	const getModules = async () => {
		const { modules } = await (
			await fetch(`${window.location.origin}/api/v1/modules`, {
				cache: "no-store",
			})
		).json();

		setModules(modules);
	};

	useEffect(() => {
		getModules();
	}, []);

	if (!modules) return <Loading />;

	return (
		<section className="column gap-2 align-center">
			<header>
				<p>
					{modules.length} module{modules.length !== 1 && "s"} loaded.
					Go to <Link href="/">Convert Files</Link>, or click one to
					convert with it.
				</p>
			</header>
			{modules.map(({ description, from, to, label }, index) => {
				if (typeof from === "string") from = [from];
				if (typeof to === "string") to = [to];

				return (
					<button
						key={index}
						onClick={() => router.push(`/?module=${label}`)}
						className="border radius column padding max-mobile fill-w align-start"
					>
						<h3>{label}</h3>
						<p>{description}</p>
						<div className="row gap-2 justify-evenly align-self-stretch">
							<div>
								<p>
									<b>Input Mimetypes</b>
								</p>
								<ul>
									{from.map((label, index) => (
										<li key={index}>{label}</li>
									))}
								</ul>
							</div>
							<div>
								<p>
									<b>Output Mimetypes</b>
								</p>
								<ul>
									{to.map((label, index) => (
										<li key={index}>{label}</li>
									))}
								</ul>
							</div>
						</div>
					</button>
				);
			})}
		</section>
	);
};

export default Content;
