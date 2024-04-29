/* eslint-disable react/prop-types */
import DialogComponent from "@/components/DialogComponent";
import ToolTip from "@/components/ToolTip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import UpdateMaster from "./UpdateMaster";
import { Pen, Trash2 } from "lucide-react";
import DeleteMaster from "./DeleteMaster";
import MasterDetail from "./MasterDetail";
import { useSetCurrentMasterMutation } from "@/features/users/api/usersApiSlice";
import { useToast } from "@/components/ui/use-toast";

export default function MasterCard({ master }) {
  const [setCurrentMaster, { isLoading }] = useSetCurrentMasterMutation();
  const [courseProjects, setCourseProjects] = useState(0);
  const [totalProjectDuration, setTotalProjectDuration] = useState(0);
  const [totalTheoryDuration, setTotalTheoryDuration] = useState(0);
  const { isAdmin, id } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let total = 0;
    let theoryDuration = 0;
    let projectDuration = 0;
    master?.courses?.forEach((course) => {
      theoryDuration += course.theoryDuration;
      if (course.project) {
        total += 1;
        projectDuration += course.projectDuration;
      }
    });
    setTotalTheoryDuration(theoryDuration);
    setTotalProjectDuration(projectDuration);
    setCourseProjects(total);
  }, [master?.courses]);

  const handleSetCurrentMaster = async () => {
    try {
      const userId = id;
      const masterId = master?._id;
      await setCurrentMaster({ userId, masterId }).unwrap();
      navigate("/dash");
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
    <article>
      <div className="rounded-lg border-l-[16px] border border-l-orange-500 bg-card text-card-foreground shadow-sm p-4 max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 xl:flex-row">
          <div className="flex flex-col items-start gap-4 md:flex-row flex-none">
            <h2 className="text-xl font-semibold leading-[26px] w-40 break-words">
              {master?.title}
            </h2>
            <div className="flex gap-3">
              <div className="border-[2px] border-black dark:border-gray-500 rounded-sm py-1 px-2 font-semibold text-sm w-28">
                <span className="font-bold text-lg">
                  {master.courses?.length}
                </span>{" "}
                corsi
              </div>
              {courseProjects > 0 && (
                <div className="border-[2px] border-black dark:border-gray-500 rounded-sm py-1 px-2 font-semibold text-sm w-28">
                  <span className="font-bold text-lg">{courseProjects}</span>{" "}
                  progetti
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row grow">
            <p className="text-sm md:w-4/5 text-gray-800 dark:text-muted-foreground line-clamp-3">
              {master.description}
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4 items-center">
            {isAdmin && (
              <>
                <ToolTip
                  content="Modifica corso"
                  trigger={
                    <div>
                      <DialogComponent
                        content={<UpdateMaster master={master} />}
                        title={`Modifica master | ${master.slug}`}
                      >
                        <Pen className="w-5 h-5 cursor-pointer hover:scale-110" />
                      </DialogComponent>
                    </div>
                  }
                />
                <ToolTip
                  content="Elimina corso"
                  trigger={
                    <div>
                      <DialogComponent
                        content={<DeleteMaster masterId={master._id} />}
                        title={`Elimina master | ${master.slug}`}
                        description={
                          "Sei sicuro di voler eliminare questa master?"
                        }
                      >
                        <Trash2 className="w-5 h-5 cursor-pointer hover:scale-110" />
                      </DialogComponent>
                    </div>
                  }
                />
              </>
            )}
          </div>
          <div className="text-end">
            <Button
              variant="default"
              className="font-semibold w-24 mr-3"
              onClick={handleSetCurrentMaster}
              disabled={isLoading}
            >
              Inizia
            </Button>
            <DialogComponent
              content={
                <MasterDetail
                  master={master}
                  handleSetCurrentMaster={handleSetCurrentMaster}
                  isLoading={isLoading}
                  courseProjects={courseProjects}
                  totalProjectDuration={totalProjectDuration}
                  totalTheoryDuration={totalTheoryDuration}
                />
              }
            >
              <Button variant="outline" className="font-semibold">
                Scopri di più
              </Button>
            </DialogComponent>
          </div>
        </div>
      </div>
    </article>
  );
}
