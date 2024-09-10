"use client";

import Loading from "@/components/Loading";
import { File } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Form = () => {
	// Hooks
	const router = useRouter();
	const module = useSearchParams().get("module");

	// States
	const [modules, setModules] = useState(null);
	const [formData, setFormData] = useState({ module });
	const [loading, setLoading] = useState(false);

	const getModules = async () => {
		const { modules } = await (
			await fetch(`${window.location.origin}/api/v1/modules`, {
				cache: "no-store",
			})
		).json();

		setModules(modules);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setLoading(true);
		try {
			const FD = new FormData();
			FD.append("module", formData.module);
			for (let i = 0; i < formData.files.length; i++) {
				FD.append("files", formData.files[i]);
			}

			const res = await fetch(
				`${window.location.origin}/api/v1/convert`,
				{ method: "POST", body: FD }
			);

			if (!res.ok) throw new Error(await res.text());

			const { jobId } = await res.json();

			router.push(`/jobs/${jobId}`);
		} catch (err) {
			console.error(err);

			alert(err);
		}
		setLoading(false);
	};

	useEffect(() => {
		getModules();
	}, []);

	if (!modules || loading) return <Loading />;

	const currentModule =
		formData &&
		formData.module &&
		modules.find(({ label }) => label === formData.module);

	return (
		<form
			className="column gap-2 border radius box-shadow padding max-mobile-l fill-w"
			onSubmit={handleSubmit}
		>
			<select
				name="module"
				id="module"
				value={formData.module || ""}
				onChange={(e) =>
					setFormData({ ...formData, module: e.target.value })
				}
			>
				<option value="" disabled>
					Select a file conversion module.
				</option>

				{modules.map((module, index) => (
					<option value={module.label} key={index}>
						{module.label}
					</option>
				))}
			</select>

			{formData.module && (
				<>
					<b>{currentModule.description}</b>

					<label htmlFor="files">Files</label>
					<input
						type="file"
						multiple={true}
						name="files"
						id="files"
						onChange={(e) =>
							setFormData({ ...formData, files: e.target.files })
						}
						accept={
							currentModule.from instanceof Array
								? currentModule.from.join(",")
								: currentModule.from
						}
					/>
				</>
			)}

			{formData.module && formData.files && formData.files.length > 0 && (
				<button type="submit">
					<File /> Convert File{formData.files.length !== 1 && "s"}
				</button>
			)}
		</form>
	);
};

export default Form;
