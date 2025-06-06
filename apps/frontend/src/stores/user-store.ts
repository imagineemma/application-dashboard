import type { UserType } from "backend/types";
import { create } from "zustand";

interface UserState {
	user: UserType;
	setUser: (userData: UserType) => void;
	isLoaded: boolean;
	setIsLoaded: (isLoaded: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
	user: {
		email: "",
		geminiKey: "",
		name: "",
		resumeContent1: "",
		resumeContent2: "",
		resumeContent3: "",
		coverLetterPrompt: "",
		coverLetterGoogleDocId: "",
		googleApiCredential: "",
		resumeGoogleDocId: "",
	},
	isLoaded: false,
	setUser: (user) => set({ user }),
	setIsLoaded: (isLoaded) => set({ isLoaded }),
}));
