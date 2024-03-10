import { ethers } from "ethers";
import { atom } from "recoil";

export const providerAtom = atom({
  key: "provider",
  default: null as ethers.BrowserProvider | null,
});
