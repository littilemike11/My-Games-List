"use client";

const DeleteAccount = async () => {
  const confirmed = confirm(
    "This will permanently delete your account. This cannot be undone."
  );

  if (!confirmed) return;

  const res = await fetch("/api/account/delete/", {
    method: "POST",
  });

  if (res.ok) {
    window.location.href = "/";
  } else {
    alert("Failed to delete account.");
  }
};

export default DeleteAccount;
