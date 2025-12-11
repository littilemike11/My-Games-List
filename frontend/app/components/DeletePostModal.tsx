import { taggableContent } from "../types/models";
const DeletePostModal: React.FC<{
  postType: taggableContent;
  postID: number;
  ownerID: string;
  isOpen: boolean;
  onClose: () => void;
  deletePost: (
    postType: taggableContent,
    postID: number,
    ownerID: string
  ) => Promise<void>;
  // ownerName: string;
}> = ({ postType, postID, ownerID, isOpen, deletePost, onClose }) => {
  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog
        id="delete_post_modal"
        className={`modal modal-bottom sm:modal-middle ${
          isOpen && "modal-open"
        }`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete this Post</h3>
          <p className="py-4">Are you sure you want to delete?</p>
          <div className="modal-action justify-between">
            <button
              onClick={async () => deletePost(postType, postID, ownerID)}
              className="btn btn-error"
            >
              Delete
            </button>
            {/* if there is a button in form, it will close the modal */}
            <button onClick={onClose} className="btn">
              Close
            </button>
          </div>
        </div>
      </dialog>
      {/* <dialog
        id="delete_post_modal"
        className={`modal modal-bottom sm:modal-middle ${
          isOpen ? "modal-open" : ""
        }`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Delete this post?</h3>

          

          <div className="modal-action">
            <form method="dialog">
              <button onClick={onClose} className="btn">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog> */}
    </>
  );
};
export default DeletePostModal;
