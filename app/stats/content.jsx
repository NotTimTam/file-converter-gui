"use client";

import Loading from "@/components/Loading";
import axios from "axios";
import { useEffect, useState } from "react";

export const metadata = {
	title: "Stats",
};

const Content = () => {
	const [stats, setStats] = useState(null);

	const getStats = async () => {
		try {
			const { data } = await axios.get(
				`http://localhost:3000/api/v1/stats`
			);

			setStats(data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		getStats();
	}, []);

	if (!stats) return <Loading />;

	const { initialization, filesConverted, dataConverted } = stats;

	const hours = (Date.now() - initialization) / (1000 * 60 * 60);

	const uptimeDisplay =
		hours > 24
			? `${(hours / 24).toFixed(2)} day${hours / 24 !== 1 && "s"}`
			: `${hours.toFixed(2)} hour${hours !== 1 && "s"}`;

	return (
		<section className="column align-center gap-2 fill-w fill-h justify-center">
			<header>
				<h2>File Transfer Stats</h2>
			</header>

			<p>Uptime: {uptimeDisplay}.</p>

			<p>
				{filesConverted.toLocaleString()} file
				{filesConverted !== 1 && "s"} have been converted.
			</p>

			<h3>
				A total of {(dataConverted / 1000).toFixed(2)}gb of data has
				been converted!
			</h3>
		</section>
	);
};

export default Content;
