import { create } from "zustand";


//todo: Tạo store quản lý state đóng mở updateForm
interface UseStoreSettingsState {
  isOpenUpdateInfoForm: boolean;
  openUpdateInfoForm: () => void;
  closeUpdateInfoForm: () => void;
}

const useStoreSettings = create<UseStoreSettingsState>((set) => ({
  isOpenUpdateInfoForm: false,
  openUpdateInfoForm: () => set({ isOpenUpdateInfoForm: true }),
  closeUpdateInfoForm: () => set({ isOpenUpdateInfoForm: false }),
}));

export default useStoreSettings;
