import { useTitle } from "@/hooks/useTitle";
import { useGetCoursesQuery } from "../api/courseApiSlice";
import { Button } from "@/components/ui/button";
import CourseCard from "./CourseCard";
import CourseSkeletonCard from "@/components/Skeleton/CourseSkeletonCard";
import { useEffect, useState } from "react";
import FormInput from "@/components/FormInput";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function CourseList() {
  useTitle("Corsi | Courseopia");

  const {isAdmin} = useAuth()

  const {
    data: courseData,
    isLoading,
    isError,
  } = useGetCoursesQuery("coursesList", {
    pollingInterval: 300000, // 5 minuti
  });

  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [courseCategories, setCourseCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const filterCourses = () => {
      let filtered = courseData;
      if (selectedCategory !== "Tutti") {
        filtered = filtered.filter(
          (course) => course.category.title === selectedCategory
        );
      }
      if (searchTerm) {
        filtered = filtered.filter((course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredCourses(filtered);
    };
    if (courseData) {
      filterCourses();
    }
  }, [courseData, selectedCategory, searchTerm]);

  useEffect(() => {
  if (courseData) {
    const uniqueCategories = [
      ...new Set(courseData.map((course) => course.category.title)),
    ];
    setCourseCategories(uniqueCategories);
  }
  }, [courseData]);

  return (
    <>
      <div>
        <div className="flex flex-row justify-between">
          <h2 className="text-3xl font-bold mb-12">Corsi</h2>
          {isAdmin && (
            <Link
              to="/dash/crea-corso"
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
          {courseCategories?.map((category) => (
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
            label="Cerca un corso"
            type="text"
            value={searchTerm}
            placeholder="Cerca una corso"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mt-8">
          {isLoading ? (
            <div className="flex flex-wrap justify-center items-center gap-3">
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <CourseSkeletonCard key={index} />
                ))}
            </div>
          ) : filteredCourses?.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <p>Non ci sono corsi corrispondenti alla ricerca.</p>
          )}
          {isError && <div>Errore durante il caricamento dei corsi.</div>}
        </div>
      </div>
    </>
  );
}
