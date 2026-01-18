"use client";

export default function Error({ error, reset }) {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4 text-red-600">
        Ein Fehler ist aufgetreten
      </h1>

      <p className="text-gray-700 mb-6">
        {error?.message || "Unbekannter Fehler."}
      </p>

      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Erneut versuchen
      </button>
    </div>
  );
}