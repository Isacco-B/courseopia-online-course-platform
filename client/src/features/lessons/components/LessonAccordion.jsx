/* eslint-disable react/prop-types */
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast";
import { useChangeCompletedLessonsMutation } from "@/features/users/api/usersApiSlice";
import useTimeConverter from "@/hooks/useTimeConverter";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function LessonAccordion({ lesson, user }) {
  const {timeConverter} = useTimeConverter();
  const [changeCompletedLessons] = useChangeCompletedLessonsMutation();

  const handleCompleted = async () => {
    try {
      await changeCompletedLessons({
        userId: user._id,
        lessonId: lesson._id,
      }).unwrap();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          error?.data?.message ||
          "There was a problem with your request. Please try again.",
      });
    }
  };
  return (
    <AccordionItem
      value={lesson?._id}
      className="border shadow-md rounded-md px-2 my-3"
      key={lesson?._id}
    >
      <div className="relative">
        <AccordionTrigger>
          <p className="fontl-normal">
            {lesson?.title}{" "}
            <span className="text-sm text-muted-foreground">
              ({timeConverter(lesson?.duration)})
            </span>
          </p>
        </AccordionTrigger>
        <div className="flex items-center  hover:cursor-pointer absolute top-0 right-2 h-full">
          <p className="text-xs text-muted-foreground hidden md:block">
            Segna come Completato
          </p>
          <Check
            className={cn(
              "ml-2 bg-muted p-1 rounded-full text-gray-700",
              user?.lessonsCompleted.includes(lesson?._id) &&
                "bg-primary text-primary-foreground"
            )}
            size={24}
            onClick={handleCompleted}
          />
        </div>
      </div>
      <AccordionContent className="border-t quill-content ql-editor">
        <div
          dangerouslySetInnerHTML={{
            __html: lesson && lesson.content,
          }}
        ></div>
      </AccordionContent>
    </AccordionItem>
  );
}
