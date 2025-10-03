import { create } from "zustand";
import type { ModalStore, ModalStoreStates } from "./types";

const DEFAULT_STATES = {
	commandK: false,
	settings: false,
	shortcuts: false,
} satisfies ModalStoreStates;

export const useModalStore = create<ModalStore>((set) => ({
	...DEFAULT_STATES,
	updateModal: (updates) => set((state) => ({ ...state, ...updates })),
	toggleModal: (modal, value) =>
		set((state) => ({ ...state, [modal]: value ? value : !state[modal] })),
	setModalValue: (modal, value) =>
		set((state) => ({ ...state, [modal]: value })),
}));
