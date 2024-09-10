"use client";

import Loading from "@/components/Loading";
import axios from "axios";
import { RefreshCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Content = () => {
	// Hooks
	const router = useRouter();

	// States
	const [jobs, setJobs] = useState(null);
	const [loading, setLoading] = useState(false);

	const getJobs = async () => {
		setLoading(true);

		try {
			const {
				data: { jobs },
			} = await axios.get(`/api/v1/jobs`);

			setJobs(jobs);
		} catch (err) {
			console.error(err);
		}

		setLoading(false);
	};

	const deleteJobs = async () => {
		setLoading(true);

		try {
			const check = confirm(
				"Are you sure you want to delete all finished jobs?"
			);

			if (check) {
				await axios.delete(`/api/v1/jobs`);

				await getJobs();
			}
		} catch (err) {
			console.error(err);
		}

		setLoading(false);
	};

	useEffect(() => {
		getJobs();
	}, []);

	if (!jobs || loading) return <Loading />;

	const anyJobsFinished =
		jobs.length > 0 && jobs.find(({ status: { step } }) => step === "done");

	return (
		<section className="column align-center">
			<div className="column gap-2 align-center fill-w max-mobile-l">
				<div className="row gap fill-w wrap">
					{anyJobsFinished && (
						<button
							title="Delete any finished jobs and their related files."
							onClick={deleteJobs}
							className="color-error border grow"
						>
							<Trash2 /> Delete Completed Jobs
						</button>
					)}
					<button
						title="Refresh job data."
						onClick={getJobs}
						className="color-em border grow"
					>
						<RefreshCcw /> Reload Jobs
					</button>
				</div>

				{jobs.length === 0 ? (
					<p>No active jobs.</p>
				) : (
					jobs.map(
						(
							{
								_id,
								status: { step, filesConverted, totalFiles },
								module,
							},
							index
						) => {
							return (
								<button
									onClick={() => router.push(`/jobs/${_id}`)}
									key={_id}
									className="column gap fill-w align-start"
								>
									<h3>
										Job {index + 1} &mdash; {module}
									</h3>

									<p>
										Status: <b>{step.toUpperCase()}</b>
									</p>

									<p>
										Converted files:{" "}
										<b>
											{filesConverted}
											{"/"}
											{totalFiles}
										</b>
									</p>

									<sup>
										Job ID: <b>{_id}</b>
									</sup>
								</button>
							);
						}
					)
				)}
			</div>
		</section>
	);
};

export default Content;
