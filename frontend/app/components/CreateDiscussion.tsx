"use client";
import { useState } from "react";
const CreateDiscussion = () => {
  const handleSubmit = () => {
    const newReview = {};

    console.log(newReview);
  };
  const openModal = () => {
    const modal = document.getElementById(
      "my_modal_4"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };
  const closeModal = () => {
    const modal = document.getElementById(
      "my_modal_4"
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const groupedTags = {
    "Popular Tags": ["Hot takes", "Hidden gems", "Controversial"],
    Genres: ["Action", "Puzzle", "Strategy", "Story"],
    Themes: ["Sci-fi", "Fantasy", "Horror"],
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const clearTags = () => {
    setTags([]);
  };

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      {/* <button className="btn" onClick={openModal}>
        open modal
      </button> */}
      <input
        className="input"
        type="text"
        placeholder="What's on your mind?"
        onClick={openModal}
      />
      <dialog id="my_modal_4" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend font-bold text-lg">
                What's on your mind?
              </legend>

              <label className="label">Post Title</label>
              <input type="text" className="input" />

              <textarea
                className="textarea"
                placeholder="What's on your mind?"
              />

              {/* Tag Input */}
              <div className="join mb-4 mt-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag(tagInput))
                  }
                  placeholder="Create a custom tag"
                  className="input input-sm group join-item"
                />
                <button
                  className="btn btn-sm join-item"
                  type="button"
                  onClick={() => addTag(tagInput)}
                >
                  Add
                </button>
              </div>
              {/* Grouped Tag Buttons */}

              {Object.entries(groupedTags).map(([group, tagsInGroup]) => (
                <div key={group} className="mb-3">
                  <h4 className="text-sm font-semibold text-secondary mb-1">
                    {group}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tagsInGroup.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`badge badge-outline  ${
                          tags.includes(tag)
                            ? "badge-accent"
                            : "hover:bg-base-300 hover:cursor-pointer"
                        }`}
                        onClick={() => addTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Display selected tags */}
              {tags.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge badge-outline badge-lg flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          className="text-error font-bold cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={clearTags}
                    type="button"
                    className="btn btn-ghost btn-sm mt-2"
                  >
                    clear
                  </button>
                </div>
              )}
            </fieldset>
            <div className="modal-action flex justify-between w-full">
              <button type="submit" className="btn btn-success">
                Post
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="btn btn-error"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default CreateDiscussion;
