import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function VideoModal() {
  return (
    <dialog id="video_modal" className="modal">
      <div className="modal-box w-11/12 max-w-4xl relative">
        <form method="dialog">
          <button className="btn btn-sm btn-circle absolute right-2 top-2 z-10">
            <FiX className="w-5 h-5" />
          </button>
        </form>
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/cqWBjQyynQU"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </dialog>
  );
}