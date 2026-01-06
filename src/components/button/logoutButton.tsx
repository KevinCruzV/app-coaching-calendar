"use client";
export default function LogoutButton() {
  return (
    <button
      type="submit"
      className="text-white hover:bg-white cursor-pointer hover:text-black box-border border focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base px-6 py-2 focus:outline-none"
    >
      Logout
    </button>
  );
}
