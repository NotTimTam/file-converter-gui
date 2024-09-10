import "flow.scss";
import "flow.scss/reset.scss";
import "./main.scss";

import { Jost } from "next/font/google";
import SideMenu from "@/components/SideMenu";

const jost = Jost({
	weight: "variable",
	variable: "--font-jost",
	subsets: ["latin"],
});

export const metadata = {
	title: {
		template: "%s | File Conversion GUI",
		default: "Home | File Conversion GUI",
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
					<p>Hello, world! I'm open-source!</p>
				</footer>
			</body>
		</html>
	);
}
