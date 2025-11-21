import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import ItemsPage from "@/features/items/pages/ItemsPage";
import { itemsApi } from "@/features/items/api/getItems";

vi.mock("@/features/items/api/getItems", () => ({
  itemsApi: {
    getItems: vi.fn(),
    getItem: vi.fn(),
    getMyItems: vi.fn(),
    createItem: vi.fn(),
  },
}));

const renderItemsPage = (initialEntries = ["/items"]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/items" element={<ItemsPage />} />
      </Routes>
    </MemoryRouter>
  );

const baseItem = () => ({
  _id: "item-1",
  name: "Vintage Camera",
  description: "A classic 35mm film camera",
  category: { _id: "cat-1", name: "Photography" },
  type: "Trade",
  owner: { _id: "owner-1", name: "Alex", username: "alex" },
  createdAt: new Date().toISOString(),
  condition: "Excellent",
  images: [],
  isAvailable: true,
});

type MockItem = ReturnType<typeof baseItem>;

const buildItem = (overrides: Partial<MockItem> = {}): MockItem => ({
  ...baseItem(),
  ...overrides,
});

describe("ItemsPage functional flow", () => {
  const getItemsMock = vi.mocked(itemsApi.getItems);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders items and loads additional pages when pagination changes", async () => {
    getItemsMock
      .mockResolvedValueOnce({
        items: [baseItem()],
        totalPages: 2,
        totalItems: 12,
        page: 1,
      })
      .mockResolvedValueOnce({
        items: [buildItem({ _id: "item-2", name: "Road Bike" })],
        totalPages: 2,
        totalItems: 12,
        page: 2,
      });

    const user = userEvent.setup();
    renderItemsPage();

    expect(await screen.findByText("Vintage Camera")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(getItemsMock).toHaveBeenCalledTimes(2);
      expect(getItemsMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2, limit: 10 })
      );
    });

    expect(await screen.findByText("Road Bike")).toBeInTheDocument();
  });

  it("surfaces API errors to the user", async () => {
    getItemsMock.mockRejectedValueOnce(new Error("Network down"));

    renderItemsPage();

    expect(
      await screen.findByText("Failed to fetch items")
    ).toBeInTheDocument();
  });

  it("respects existing search parameters when fetching items", async () => {
    getItemsMock.mockResolvedValueOnce({
      items: [baseItem()],
      totalPages: 1,
      totalItems: 1,
      page: 1,
    });

    renderItemsPage(["/items?search=camera&type=Free"]);

    await waitFor(() => {
      expect(getItemsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          search: "camera",
          type: "Free",
          page: 1,
          limit: 10,
        })
      );
    });
  });
});
