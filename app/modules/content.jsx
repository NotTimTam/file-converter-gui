"use client";

import Loading from "@/components/Loading";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Content = () => {
	const router = useRouter();

	const [modules, setModules] = useState(null);

	const getModules = async () => {
		try {
			const {
				data: { modules },
			} = await axios.get(`/api/v1/modules`);

			setModules(modules);
		} catch (err) {
			console.error(err);
		}
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
						<div className="row gap-2 justify-evenly align-self-stretch fill-w">
							<div className="grow" style={{ maxWidth: "50%" }}>
								<p>
									<b>Input Mimetypes</b>
								</p>
								<div className="fill-w">
									{from.map((label, index) => (
										<p
											key={index}
											className="fill-w"
											style={{ wordWrap: "break-word" }}
										>
											{label}
										</p>
									))}
								</div>
							</div>
							<div className="grow" style={{ maxWidth: "50%" }}>
								<p>
									<b>Output Mimetypes</b>
								</p>
								<div className="fill-w">
									{to.map((label, index) => (
										<p
											key={index}
											className="fill-w"
											style={{ wordWrap: "break-word" }}
										>
											{label}
										</p>
									))}
								</div>
							</div>
						</div>
					</button>
				);
			})}
		</section>
	);
};

export default Content;
