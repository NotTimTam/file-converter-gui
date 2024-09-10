import "flow.scss";
import "flow.scss/reset.scss";
import "./main.scss";

import { Jost } from "next/font/google";
import SideMenu from "@/components/SideMenu";
import Link from "next/link";

const jost = Jost({
	weight: "variable",
	variable: "--font-jost",
	subsets: ["latin"],
});

export const metadata = {
	title: {
		template: "%s | File Converter GUI",
		default: "Home | File Converter GUI",
	},
	description: "A simple GUI interface for conversion of files.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={jost.variable}>
				<header className="border-bottom background-dark box-shadow padding row gap justify-center align-center">
					<h1 className="color-em" style={{ fontSize: "1.5rem" }}>
						FileConverter GUI
					</h1>
				</header>
				<SideMenu />
				<main className="column gap padding">{children}</main>
				<footer className="border-top background-dark box-shadow padding row gap">
					<p>
						<Link
							target="_blank"
							rel="noopener noreferrer"
							href="https://www.github.com/NotTimTam/file-converter-gui"
						>
							Hello, world! I'm open-source!
						</Link>{" "}
						&mdash; Use the{" "}
						<Link
							target="_blank"
							rel="noopener noreferrer"
							href="https://www.github.com/NotTimTam/file-converter"
						>
							API
						</Link>{" "}
						in your projects!
					</p>
				</footer>
			</body>
		</html>
	);
}
