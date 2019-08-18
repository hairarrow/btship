import React, { useContext, useEffect, HTMLAttributes, FC } from "react";
import { ctx } from "../../App";

const Stats: FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
	const {
		state: { stats },
		actions: { resetGame, startGame },
		dispatch
	} = useContext(ctx);

	return (
		<div {...props}>
			<div>
				<h2>Games Won</h2>
				<p>
					{stats.games.won} of {stats.games.played}
				</p>
			</div>
		</div>
	);
};

export default Stats;
