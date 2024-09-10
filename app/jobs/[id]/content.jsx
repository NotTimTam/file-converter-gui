"use client";

import Loading from "@/components/Loading";
import { Download, RefreshCcw, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./index.module.scss";

const Content = () => {
	// Hooks
	const { id } = useParams();
	const router = useRouter();

	// States
	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(false);
	const [downloaded, setDownloaded] = useState(false);

	const downloadFiles = async () => {
		setLoading(true);

		try {
			const res = await fetch(
				`${window.location.origin}/api/v1/convert/download/${id}`,
				{
					cache: "no-store",
				}
			);

			if (!res.ok) {
				if (res.status === 404) router.push("/not-found");
				else throw await res.text();
			}

			const filename = res.headers
				.get("Content-Disposition")
				.split("; ")[1]
				.split("=")[1];

			const blob = await res.blob();

			// Create a temporary link element
			const a = document.createElement("a");
			const url = URL.createObjectURL(blob);
			a.href = url;
			a.download = filename; // You can specify the filename here

			// Programmatically click the link to trigger the download
			a.click();

			// Clean up
			URL.revokeObjectURL(url);

			setDownloaded(true);
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
				const res = await fetch(
					`${window.location.origin}/api/v1/jobs/${id}`,
					{
						method: "DELETE",
					}
				);

				if (!res.ok) throw await res.text();

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
			const res = await fetch(
				`${window.location.origin}/api/v1/jobs/${id}`,
				{
					cache: "no-store",
				}
			);

			if (!res.ok) {
				if (res.status === 404) router.push("/not-found");
				else throw await res.text();
			}

			const { job } = await res.json();

			document.title = `${job.module} Job | File Conversion GUI`;

			setJob(job);
		} catch (err) {
			console.error(err);

			router.push("/");
		}

		setLoading(false);
	};

	useEffect(() => {
		getJob();
	}, []);

	if (!job || loading) return <Loading />;

	if (downloaded)
		return (
			<section className="column gap-2 align-center">
				File downloaded...
			</section>
		);

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

				<sup>
					Job ID: <b>{job._id}</b>
				</sup>

				<button
					className="color-error border"
					title="Delete job and files."
					onClick={deleteJob}
				>
					<Trash2 /> Delete Job
				</button>
			</div>
		</section>
	);
};

export default Content;
