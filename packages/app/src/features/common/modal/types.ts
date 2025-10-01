export type ModalStoreStates = {
  commandK: boolean;
  settings: boolean;
  shortcuts: boolean;
};

export type ModalStoreActions = {
  updateModal: (updates: Partial<ModalStoreStates>) => void;
  toggleModal: (modal: keyof ModalStoreStates, value?: boolean) => void;
  setModalValue: (modal: keyof ModalStoreStates, value: boolean) => void;
};

export type ModalStore = ModalStoreStates & ModalStoreActions;
