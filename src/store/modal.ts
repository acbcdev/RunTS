import { create } from "zustand";

type ModalStoreStates = {
  commandK: boolean;
  settings: boolean;
  shortcuts: boolean;
};

type ModalStoreActions = {
  updateModal: (updates: Partial<ModalStoreStates>) => void;
  toggleModal: (modal: keyof ModalStoreStates, value?: boolean) => void;
  setModalValue: (modal: keyof ModalStoreStates, value: boolean) => void;
};

type ModalStore = ModalStoreStates & ModalStoreActions;

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
