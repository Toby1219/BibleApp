import { create } from "zustand";

export type Bookmarks = {
    ref: string, 
    snippet: string,
    created_at:string
}[]

export type SearchHistory = {
    phrase: string,
    book:string,
    created_at: string,
    
}[]

export type VERSE_OF_DAY = {
    book: string,
    text: string
}


interface CurrentUser{
  username: string,
  email: string,
  created_at: string,
}


type GlobalVar = {
    user: CurrentUser | null;
    setUserData: (user: CurrentUser | null) => void;
}

export const useGlobalVar = create<GlobalVar>((set) => ({
    user: null,
    setUserData: (user) => set({ user }),
}));