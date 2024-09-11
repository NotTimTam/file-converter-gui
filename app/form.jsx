"use client";

import Loading from "@/components/Loading";
import axios from "axios";
import { File } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Fragment } from "react";

const Form = () => {
	// Hooks
	const router = useRouter();
	const module = useSearchParams().get("module");

	// States
	const [modules, setModules] = useState(null);
	const [formData, setFormData] = useState({ module });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const currentModule =
		formData &&
		formData.module &&
		modules.find(({ label }) => label === formData.module);

	const getModules = async () => {
		setError(null);

		try {
			const {
				data: { modules },
			} = await axios.get(`/api/v1/modules`);

			setModules(modules);
		} catch (err) {
			console.error(err);

			setError(err.response ? err.response.data : JSON.stringify(err));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setError(null);

		setLoading(true);
		try {
			const FD = new FormData();
			FD.append("module", formData.module);
			for (let i = 0; i < formData.files.length; i++) {
				FD.append("files", formData.files[i]);
			}

			if (formData.options)
				FD.append("options", JSON.stringify(formData.options));

			const {
				data: { jobId },
			} = await axios.post(`/api/v1/convert`, FD);

			router.push(`/jobs/${jobId}`);
		} catch (err) {
			console.error(err);

			setError(err.response ? err.response.data : JSON.stringify(err));
		}
		setLoading(false);
	};

	useEffect(() => {
		getModules();
	}, []);

	useEffect(() => {
		if (currentModule)
			setFormData({
				...formData,
				options: Object.fromEntries(
					currentModule.options.map(({ label }) => {
						return [label, undefined];
					})
				),
				files: undefined,
			});
	}, [currentModule]);

	if (!modules || loading) return <Loading />;

	return (
		<form
			className="column gap-4 border radius box-shadow padding max-mobile-l fill-w"
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

			{formData.module && currentModule && (
				<>
					<p className="fill-w column align-center justify-center">
						<b>{currentModule.description}</b>
					</p>

					<div className="column gap">
						<label htmlFor="files">Files</label>
						<input
							type="file"
							multiple={true}
							name="files"
							id="files"
							onChange={(e) =>
								setFormData({
									...formData,
									files: e.target.files,
								})
							}
							accept={
								currentModule.from instanceof Array
									? currentModule.from.join(",")
									: currentModule.from
							}
						/>
					</div>

					{currentModule.options && (
						<>
							<h3 className="align-self-center">
								Conversion Options
							</h3>
							{currentModule.options.map(
								({ description, label, type, _id }) => {
									const input = (() => {
										switch (type) {
											case "string":
												return (
													<input
														type="string"
														name={label}
														id={label}
														value={
															(formData.options &&
																formData
																	.options[
																	label
																]) ||
															""
														}
														onChange={(e) =>
															setFormData({
																...formData,
																options: {
																	...(formData.options ||
																		{}),
																	[label]:
																		e.target
																			.value,
																},
															})
														}
													/>
												);
											case "number":
												return (
													<input
														type="number"
														name={label}
														id={label}
														value={
															(formData.options &&
																formData
																	.options[
																	label
																]) ||
															""
														}
														onChange={(e) =>
															setFormData({
																...formData,
																options: {
																	...(formData.options ||
																		{}),
																	[label]:
																		+e
																			.target
																			.value,
																},
															})
														}
													/>
												);
											case "boolean":
												break;
										}
									})();

									return (
										<div
											key={_id}
											className="column gap border radius padding"
										>
											<label htmlFor={label}>
												{label}
											</label>
											<p>{description}</p>
											{input}
										</div>
									);
								}
							)}
						</>
					)}

					{formData.files && formData.files.length > 0 && (
						<button type="submit">
							<File /> Convert File
							{formData.files.length !== 1 && "s"}
						</button>
					)}
				</>
			)}
			{error && (
				<div className="border radius color-error padding">{error}</div>
			)}
		</form>
	);
};

export default Form;
