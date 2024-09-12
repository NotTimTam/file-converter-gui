"use client";

import Loading from "@/components/Loading";
import { Download, RefreshCcw, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./index.module.scss";
import axios from "axios";

const Content = () => {
	// Hooks
	const { id } = useParams();
	const router = useRouter();

	// States
	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(false);

	const downloadFiles = async () => {
		setLoading(true);

		try {
			const res = await axios.get(`/api/v1/convert/download/${id}`, {
				responseType: "blob",
			});

			const filename = res.headers
				.get("Content-Disposition")
				.split("; ")[1]
				.split("=")[1];

			// Create a temporary link element
			const a = document.createElement("a");
			const url = URL.createObjectURL(res.data);
			a.href = url;
			a.download = filename; // You can specify the filename here

			// Programmatically click the link to trigger the download
			a.click();

			// Clean up
			URL.revokeObjectURL(url);

			if (!job.unlimitedDownloads) router.push("/jobs"); // Reroute if the file can only be downloaded once.
		} catch (err) {
			console.error(err);
		}

		setLoading(false);
	};

	const deleteJob = async () => {
		setLoading(true);

		try {
			const check = confirm("Are you sure you want to delete this job?");

			if (check) {
				await axios.delete(`/api/v1/jobs/${id}`);

				router.push(`/jobs`);
			} else throw new Error("Job deletion request canceled.");
		} catch (err) {
			console.error(err);
			setLoading(false);
		}
	};

	const getJob = async () => {
		setLoading(true);

		try {
			const {
				data: { job },
			} = await axios.get(`/api/v1/jobs/${id}`);

			document.title = `${job.module} Job | File Converter GUI`;

			setJob(job);
		} catch (err) {
			console.error(err);

			if (err.status === 404) router.push("/not-found");

			router.push("/");
		}

		setLoading(false);
	};

	useEffect(() => {
		getJob();
	}, []);

	if (!job || loading) return <Loading />;

	const progress = job.status.filesConverted / job.status.totalFiles;

	return (
		<section className="column gap-2 align-center justify-center fill-w fill-h">
			<div className="border radius padding fill-w max-mobile-l column gap">
				<h3>{job.module} Job</h3>

				<div className="row gap justify-between align-center">
					<p>
						Status: <b>{job.status.step.toUpperCase()}</b>
					</p>
					{job.status.step !== "done" && (
						<button title="Refresh results." onClick={getJob}>
							<RefreshCcw size={16} />
						</button>
					)}
				</div>

				<div className="row gap fill-w align-center wrap justify-center">
					<div className={styles.progress}>
						<div
							className={styles.fill}
							style={{ width: `${progress * 100}%` }}
						></div>
					</div>
					<p>
						<b>{Math.round(progress * 100)}%</b> &mdash;
						<b>
							{job.status.filesConverted}
							{"/"}
							{job.status.totalFiles}
						</b>{" "}
						files
					</p>
				</div>

				{job.status.step === "done" && (
					<button title="Download files." onClick={downloadFiles}>
						<Download /> Download File{"(s)"}
					</button>
				)}

				<button
					className="color-error border"
					title="Delete job and files."
					onClick={deleteJob}
				>
					<Trash2 /> Delete Job
				</button>

				{job.options && (
					<>
						<h4>Job Options</h4>
						<ul>
							{Object.entries(job.options).map(
								([name, value], index) => (
									<li key={index}>
										<b>{name}:</b>{" "}
										{typeof value === "string"
											? `"${value}"`
											: JSON.stringify(value)}
									</li>
								)
							)}
						</ul>
					</>
				)}

				<sup>
					Job ID: <b>{job._id}</b>
				</sup>
			</div>
		</section>
	);
};

export default Content;
