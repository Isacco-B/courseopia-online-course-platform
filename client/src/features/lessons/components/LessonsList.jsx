import { useGetLessonsQuery } from "../api/lessonApiSlice";
import { Button } from "@/components/ui/button";
import LessonCard from "./LessonCard";
import { useTitle } from "@/hooks/useTitle";
import { useEffect, useState } from "react";
import FormInput from "@/components/FormInput";
import LessonSkeletonCard from "@/components/Skeleton/LessonSkeletonCard";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function LessonsList() {
  useTitle("Lezioni | Courseopia");

  const { isAdmin } = useAuth();

  const {
    data: lessonData,
    isLoading,
    isError,
  } = useGetLessonsQuery("lessonsList", {
    pollingInterval: 300000, // 5 minute
  });

  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [lessonCategories, setLessonCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLessons, setFilteredLessons] = useState([]);

  useEffect(() => {
    const filterLessons = () => {
      let filtered = lessonData;
      if (selectedCategory !== "Tutti") {
        filtered = filtered.filter(
          (lesson) => lesson.category.title === selectedCategory
        );
      }
      if (searchTerm) {
        filtered = filtered.filter((lesson) =>
          lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredLessons(filtered);
    };
    if (lessonData) {
      filterLessons();
    }
  }, [lessonData, selectedCategory, searchTerm]);

  useEffect(() => {
    if (lessonData) {
      const uniqueCategories = [
        ...new Set(lessonData.map((lesson) => lesson.category.title)),
      ];
      setLessonCategories(uniqueCategories);
    }
  }, [lessonData]);

  return (
    <>
      <div>
        <div className="flex flex-row justify-between">
          <h2 className="text-3xl font-bold mb-12">Lezioni</h2>
          {isAdmin && (
            <Link
              to="/dash/crea-lezione"
              className="bg-primary rounded-full p-2 w-10 h-10 items-center hover:scale-110 hover:cursor-pointer"
            >
              <Plus className="w-full h-full text-white" />
            </Link>
          )}
        </div>

        <div className="flex gap-2 mb-8 justify-center items-center overflow-x-auto py-2">
          <Button
            variant={`${selectedCategory === "Tutti" ? "outline" : "default"}`}
            onClick={() => setSelectedCategory("Tutti")}
          >
            Tutti
          </Button>
          {lessonCategories?.map((category) => (
            <Button
              key={category}
              variant={`${
                selectedCategory === category ? "outline" : "default"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div>
          <FormInput
            label="Cerca una lezione"
            type="text"
            value={searchTerm}
            placeholder="Cerca una lezione"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mt-8">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <LessonSkeletonCard key={index} />
                ))}
            </div>
          ) : filteredLessons?.length > 0 ? (
            filteredLessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} />
            ))
          ) : (
            <p>Non ci sono lezioni corrispondenti alla ricerca.</p>
          )}
          {isError && <div>Errore durante il caricamento delle lezioni.</div>}
        </div>
      </div>
    </>
  );
}
