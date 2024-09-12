"use client";

import Loading from "@/components/Loading";
import axios from "axios";
import { File } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import mime from "mime-types";

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
		formData.from &&
		formData.to &&
		modules &&
		modules.find(
			({ from, to }) =>
				from.includes(formData.from) && to.includes(formData.to)
		);

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
			FD.append("module", currentModule.label);
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

			setLoading(false);
		}
	};

	useEffect(() => {
		getModules();
	}, []);

	useEffect(() => {
		if (currentModule)
			setFormData({
				...formData,
				options: Object.fromEntries(
					currentModule.options.map(
						({ label, default: defaultValue }) => {
							return [label, defaultValue];
						}
					)
				),
				files: undefined,
			});
	}, [currentModule]);

	useEffect(() => {
		setFormData({
			...formData,
			to: currentModule ? formData.to : undefined,
		});
	}, [formData.from]);

	if (!modules || loading)
		return (
			<div className="fill-h fill-w column align-center justify-center gap-2 grow">
				<Loading />
				{loading && modules && (
					<p className="border padding radius emphasis">
						Large requests may take several minutes to process...
						You will be redirected to the conversion job once it is
						instantiated. Site may be temporarily {'"'}unresponsive
						{'"'} while your request is processed.
					</p>
				)}
			</div>
		);

	const fromOptions = [...new Set(modules.map(({ from }) => from).flat())];

	return (
		<form
			className="column gap-4 border radius box-shadow padding max-mobile-l fill-w"
			onSubmit={handleSubmit}
		>
			<div className="row gap wrap align-center">
				<select
					className="grow"
					name="from"
					id="from"
					value={formData.from || ""}
					onChange={(e) =>
						setFormData({ ...formData, from: e.target.value })
					}
				>
					<option value="" disabled>
						Convert from...
					</option>

					{fromOptions.map((mimetype, index) => (
						<option value={mimetype} key={index}>
							{"."}
							{mime.extension(mimetype)}
						</option>
					))}
				</select>

				{formData.from && (
					<select
						className="grow"
						name="to"
						id="to"
						value={formData.to || ""}
						onChange={(e) =>
							setFormData({ ...formData, to: e.target.value })
						}
					>
						<option value="" disabled>
							Convert to...
						</option>

						{[
							...new Set(
								modules
									.filter(
										({ from }) =>
											from.includes(formData.from) // Handles strings and arrays.
									)
									.map(({ to }) => to)
							),
						].map((mimetype, index) => (
							<option value={mimetype} key={index}>
								{"."}
								{mime.extension(mimetype)}
							</option>
						))}
					</select>
				)}
			</div>

			{formData.from && formData.to && currentModule && (
				<>
					<p className="fill-w column align-center justify-center">
						<b>
							{currentModule.label} &mdash;{" "}
							{currentModule.description}
						</b>
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
								({
									description,
									label,
									type,
									_id,
									required,
								}) => {
									const input = (() => {
										switch (type) {
											case "string":
												return (
													<input
														type="string"
														name={label}
														id={label}
														required={required}
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
														required={required}
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
												return (
													<input
														type="checkbox"
														name={label}
														id={label}
														value={
															(formData.options &&
																formData
																	.options[
																	label
																]) ||
															false
														}
														onChange={(e) =>
															setFormData({
																...formData,
																options: {
																	...(formData.options ||
																		{}),
																	[label]: e
																		.target
																		.checked
																		? true
																		: false,
																},
															})
														}
													/>
												);
										}
									})();

									const labelElement = (
										<label
											htmlFor={label}
											required={
												required && type !== "boolean"
											}
										>
											{label}
										</label>
									);

									return (
										<div
											key={_id}
											className="column gap border radius padding"
										>
											{type === "boolean" ? (
												<>
													<span className="row gap align-center">
														{input}
														{labelElement}
													</span>{" "}
													<p>{description}</p>
												</>
											) : (
												<>
													{labelElement}
													<p>{description}</p>
													{input}
												</>
											)}
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
