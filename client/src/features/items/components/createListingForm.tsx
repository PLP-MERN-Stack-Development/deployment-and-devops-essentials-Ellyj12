import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateItem } from "../hooks/useCreateItem";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import type { Category } from "../api/category.types";

export function CreateListingForm() {
  const { categories } = useCategories();
  const { createItem, loading, error } = useCreateItem();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"Trade" | "Free">("Trade");
  const [condition, setCondition] = useState<
    "New" | "Used" | "Like New" | "Damaged"
  >("New");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [desiredItem, setDesiredItem] = useState("");
  const [desiredCategory, setDesiredCategory] = useState("");
  const [durationInDays, setDurationInDays] = useState<number>(14);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]); // release memory
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("type", type);
    formData.append("condition", condition);
    formData.append("durationInDays", durationInDays.toString());
    formData.append("desiredItem", desiredItem);
    formData.append("desiredCategory", desiredCategory);

    images.forEach((file) => formData.append("images", file));

    try {
      await createItem(formData);
      navigate("/items");
    } catch (err) {
      console.error("Failed to create item", err);
    }
  };

  return (
    <form
      className="w-full max-w-7xl mx-auto p-6 border rounded-md space-y-6 shadow-lg bg-white"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold text-center">Create Listing</h1>

      {/* Name */}
      <div>
        <label className="block font-medium">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium">Category</label>
        <select
          className="border-2 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((c: Category) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div>
        <label className="block font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "Trade" | "Free")}
          className="w-full border rounded px-2 py-1"
        >
          <option value="Trade">Trade</option>
          <option value="Free">Free</option>
        </select>
      </div>

      
      <div>
        <label className="block font-medium">Condition</label>
        <select
          value={condition}
          onChange={(e) =>
            setCondition(e.target.value as "New" | "Used" | "Like New" | "Damaged")
          }
          className="w-full border rounded px-2 py-1"
        >
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Used">Used</option>
          <option value="Damaged">Damaged</option>
        </select>
      </div>

      {/* Duration */}
      <div>
        <label className="block font-medium">Duration (days)</label>
        <Input
          type="number"
          value={durationInDays}
          onChange={(e) => setDurationInDays(Number(e.target.value))}
          min={1}
          required
        />
      </div>

      {/* Desired Item */}
      <div>
        <label className="block font-medium">Desired Item</label>
        <Input value={desiredItem} onChange={(e) => setDesiredItem(e.target.value)} />
      </div>

      {/* Desired Category */}
      <div>
        <label className="block font-medium">Desired Category</label>
        <select
          className="border-2 w-full"
          value={desiredCategory}
          onChange={(e) => setDesiredCategory(e.target.value)}
        >
          <option value="">Select desired category</option>
          {categories.map((c: Category) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Images */}
      <div>
        <label className="block font-medium">Images</label>
        <input type="file" multiple onChange={handleFileChange} disabled={loading} />
        <div className="flex flex-wrap mt-2 gap-2">
          {imagePreviews.map((url, index) => (
            <div key={index} className="relative w-24 h-24 group">
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                aria-label="Remove image"
                className="absolute top-1 right-1 z-10 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
              >
                ×
              </button>
              <img src={url} alt={`preview-${index}`} className="w-full h-full object-cover rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
        {loading ? "Creating..." : "Create Listing"}
      </Button>

      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
}
