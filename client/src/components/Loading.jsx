import SkeletonCard from "./SkeletonCard";

export default function Loading() {
  return (
    <main className="container">
      <div className="grid grid-cols-3 gap-8">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <SkeletonCard key={index} />
          ))}
      </div>
    </main>
  );
}
