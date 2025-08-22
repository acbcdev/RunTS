import { useLayoutEffect, useState } from "react";

export const useResizePanelSizes = (
	id: string,
	pixels: { width: number; height: number },
) => {
	const [panelSizes, setPanelSizes] = useState({
		width: 0,
		height: 0,
	});

	useLayoutEffect(() => {
		const panelGroup = document.querySelector<HTMLElement>(
			`[data-panel-group-id="${id}"]`,
		);
		const resizeHandles = document.querySelectorAll<HTMLElement>(
			`[data-panel-resize-handle-id="resize-handle-${id}"]`,
		);

		if (!panelGroup) {
			console.error(`Panel group with id ${id} not found`);
			return;
		}

		const observer = new ResizeObserver(() => {
			let height = panelGroup.offsetHeight;
			let width = panelGroup.offsetWidth;

			for (const resizeHandle of resizeHandles) {
				height -= resizeHandle.offsetHeight;
				width -= resizeHandle.offsetWidth;
			}

			setPanelSizes(() => ({
				width: (pixels.width / width) * 100,
				height: (pixels.height / height) * 100,
			}));
		});

		observer.observe(panelGroup);
		for (const resizeHandle of resizeHandles) {
			observer.observe(resizeHandle);
		}

		return () => {
			observer.unobserve(panelGroup);

			for (const resizeHandle of resizeHandles) {
				observer.unobserve(resizeHandle);
			}
			observer.disconnect();
		};
	}, [id, pixels]);
	return panelSizes;
};
