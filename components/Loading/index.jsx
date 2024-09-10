const { LoaderCircle } = require("lucide-react");

import styles from "./index.module.scss";

const Loading = () => {
	return (
		<div className="fill-w fill-h column align-center justify-center">
			<LoaderCircle className={styles.loading} />
		</div>
	);
};

export default Loading;
