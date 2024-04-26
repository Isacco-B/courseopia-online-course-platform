/* eslint-disable react/prop-types */
import { UserCog } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AvatarDisplay from "@/components/AvatarDisplay";
import { socialLinks } from "@/constants";
import { useStaticFile } from "@/hooks/useStaticFile";
import { Link, useParams } from "react-router-dom";
import { useGetUserQuery } from "@/features/users/api/usersApiSlice";
import { useAuth } from "@/hooks/useAuth";
import { useTitle } from "@/hooks/useTitle";

export default function ProfileDetails() {
  useTitle("Profilo | Courseopia");

  const { slug } = useParams();
  const { id } = useAuth();
  const { data: user, isLoading, isError } = useGetUserQuery(slug);
  const imageUrl = useStaticFile(user?.profile?.profilePicture);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <div>Impossibile caricare il profilo.</div>;
  }

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 relative">
        <div className="absolute top-4 right-4 flex gap-2">
          {socialLinks.map((link) => {
            if (user?.profile[link.name]) {
              return (
                <Link
                  key={link.id}
                  className={link.style}
                  to={user?.profile[link.name]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </Link>
              );
            }
          })}
        </div>
        <div className="flex flex-col gap-2 mt-8 p-4 lg:flex-row">
          <div className="flex flex-col items-center gap-2 lg:shrink-0 lg:w-64 my-4">
            <AvatarDisplay
              src={imageUrl}
              alt="avatar"
              fallbackText={user?.firstName?.slice(0, 2).toUpperCase() || "CO"}
              size={36}
            />
            <p className="text-sm font-semibold truncate">{user?.email}</p>
            {user?._id === id && (
              <div className="flex gap-2 items-center text-primary hover:text-primary/80 cursor-pointer">
                <UserCog size={18} />

                <Link className="text-sm" to={`/dash/modifica-profilo/${slug}`}>
                  Modifica Profilo
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold truncate">
              {user?.firstName + " " + user?.lastName}
            </h3>
            <div className="mt-2">
              <p className="text-xs">Attualmente sto studiando:</p>
              {user?.currentMaster ? (
                <p className="font-bold text-primary text-lg">
                  {user?.currentMaster?.title}
                </p>
              ) : user?._id === id ? (
                <Link
                  className="font-bold text-primary text-lg hover:underline"
                  to={"/dash/master"}
                >
                  Seleziona un Master
                </Link>
              ) : (
                <p className="font-bold text-primary text-lg">
                  Nessun Master Selezionato
                </p>
              )}
            </div>
            <p className="text-sm">
              <span className="font-bold text-lg pr-2">
                {user?.lessonsCompleted.length || 0}
              </span>{" "}
              Lezioni completate
            </p>
            <p className="text-sm">
              <span className="font-bold text-lg pr-2">
                {user?.coursesCompleted.length || 0}
              </span>{" "}
              Corsi completati
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: user?.profile && user?.profile.description,
              }}
              className="quill-content"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
