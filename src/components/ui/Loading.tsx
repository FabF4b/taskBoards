import "../../styles/loading.css";

export default function Loading() {
  return (
    <div className="flex flex-col items-center">
      <div className="spinner"></div>
      <p className="mt-6 text-zinc-500">Synchronisiere Daten...</p>
    </div>
  );
}
