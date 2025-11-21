import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import ItemDetailsPage from "@/features/items/pages/ItemDetailsPage";
import { itemsApi } from "@/features/items/api/getItems";
import { swapApi } from "@/features/swaps/api/swap.api";
import { useAuthStore } from "@/features/auth/store/authStore";

vi.mock("@/features/items/api/getItems", () => ({
  itemsApi: {
    getItems: vi.fn(),
    getItem: vi.fn(),
    getMyItems: vi.fn(),
    createItem: vi.fn(),
  },
}));

vi.mock("@/features/swaps/api/swap.api", () => ({
  swapApi: {
    createSwap: vi.fn(),
  },
}));

vi.mock("@/features/auth/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@/features/items/components/ItemImageGallery", () => ({
  ItemImageGallery: ({ item }: { item: { name: string } }) => (
    <div data-testid="image-gallery">{item.name}</div>
  ),
}));

vi.mock("@/features/items/components/SwapRequestDialog", () => ({
  SwapRequestDialog: ({
    isOpen,
    item,
    onSubmit,
    onClose,
  }: {
    isOpen: boolean;
    item: { name: string };
    onSubmit: () => void;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="swap-dialog">
        <p>{item.name}</p>
        <button onClick={onSubmit}>Confirm Request</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null,
}));

const mockUserState = {
  user: {
    _id: "user-1",
    name: "Taylor",
    username: "taylor",
    email: "taylor@test.com",
    token: "token",
  },
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
};

describe("ItemDetailsPage functional flow", () => {
  const getItemMock = vi.mocked(itemsApi.getItem);
  const getMyItemsMock = vi.mocked(itemsApi.getMyItems);
  const createSwapMock = vi.mocked(swapApi.createSwap);
  const useAuthStoreMock = useAuthStore as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStoreMock.mockImplementation((selector?: (state: typeof mockUserState) => unknown) =>
      selector ? selector(mockUserState) : mockUserState
    );
  });

  it("allows requesting a free item without providing an initiator item", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);

    getItemMock.mockResolvedValueOnce({
      _id: "item-123",
      name: "Community Bookshelf",
      description: "A set of books available for the community",
      category: { _id: "cat-1", name: "Books" },
      type: "Free",
      owner: { _id: "owner-42", name: "Sam", username: "sam" },
      createdAt: new Date().toISOString(),
      condition: "Good",
      images: [],
      isAvailable: true,
    });

    getMyItemsMock.mockResolvedValueOnce([]);
    createSwapMock.mockResolvedValueOnce({ success: true });

    const router = createMemoryRouter(
      [
        { path: "/items/:id", element: <ItemDetailsPage /> },
        { path: "/dashboard", element: <div>Dashboard</div> },
      ],
      { initialEntries: ["/items/item-123"] }
    );

    const user = userEvent.setup();
    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Community Bookshelf")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /request swap/i }));

    await waitFor(() => expect(getMyItemsMock).toHaveBeenCalled());

    await user.click(screen.getByText("Confirm Request"));

    await waitFor(() => {
      expect(createSwapMock).toHaveBeenCalledWith({
        ownerItemID: "item-123",
        initiatorItemID: null,
      });
      expect(router.state.location.pathname).toBe("/dashboard");
      expect(alertSpy).toHaveBeenCalledWith("Request sent successfully!");
    });

    alertSpy.mockRestore();
  });
});
