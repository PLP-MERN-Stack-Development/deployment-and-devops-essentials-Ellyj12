import { api } from "@/lib/axios";

export const swapApi = {
  createSwap: async (data: { ownerItemID: string; initiatorItemID: string | null }) => {
    const res = await api.post("/swaps/create", data);
    return res.data;
  },
  acceptSwap: async (swapId: string) => {
    const res = await api.post(`/swaps/${swapId}/accept`);
    return res.data;
  },
  declineSwap: async (swapId: string) => {
    const res = await api.post(`/swaps/${swapId}/decline`);
    return res.data;
  },
  cancelSwap: async (swapId: string) => {
    const res = await api.post(`/swaps/${swapId}/cancel`);
    return res.data;
  },
  completeSwap: async (swapId: string, code: string) => {
    const res = await api.post(`/swaps/${swapId}/complete`, { code });
    return res.data;
  },
};
