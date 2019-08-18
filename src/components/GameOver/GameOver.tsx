import React, { useContext, useEffect } from "react";
import { ctx } from "../../App";
import { Modal } from "antd";

const { confirm } = Modal;

export default function GameOver() {
	const {
		state: { game, players },
		actions: { resetGame, startGame },
		dispatch
	} = useContext(ctx);

	function showConfirm() {
		console.log("show confirm");
		confirm({
			title: "You win or lose",
			content: "Show ssomething",
			okText: "Try Again",
			cancelText: "Not Yet",
			onOk: () => {
				dispatch(resetGame());
				dispatch(startGame());
			}
		});
	}

	useEffect(() => {
		console.log("effect");
		if (game.over) showConfirm();
	}, [game, players]);

	return <div>Hello Over</div>;
}
