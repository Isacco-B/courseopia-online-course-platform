import LoadingSpinner from "@/components/LoadingSpinner";
import {
  useGetUserQuery,
  useGetUsersQuery,
} from "@/features/users/api/usersApiSlice";
import UserCard from "@/features/users/components/UserCard";
import { useAuth } from "@/hooks/useAuth";
import { useTitle } from "@/hooks/useTitle";

export default function LeaderboardList() {
  useTitle("Classifica | Courseopia");
  const { slug } = useAuth();
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    isSuccess: isSuccessUser,
  } = useGetUserQuery(slug);

  const { currentMaster } = user;

  const { users, isLoadingUsers, isErrorUsers, isSuccessUsers } =
    useGetUsersQuery("usersList", {
      pollingInterval: 300000, // 5 minuti
      selectFromResult: ({ data, isLoading, isError, isSuccess }) => ({
        users: data?.filter(
          (user) => user.currentMaster?.title === currentMaster?.title
        ),
        isLoadingUsers: isLoading,
        isErrorUsers: isError,
        isSuccessUsers: isSuccess,
      }),
    });

  let content;

  if (isLoadingUser || isLoadingUsers) {
    content = (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isErrorUser || isErrorUsers) {
    content = (
      <div>There was a problem with your request. Please try again.</div>
    );
  }

  if (isSuccessUser && isSuccessUsers) {
    const sortedUsers = users
      .slice()
      .sort((a, b) => b.totalPoints - a.totalPoints);
    content = (
      <section>
        <h2 className="text-3xl font-bold">Classifica</h2>
        <p className="mb-12">
          Gli studenti e le studentesse di{" "}
          <span className="text-blue-800">{user?.currentMaster?.title}</span>{" "}
          che hanno ottenuto più punti.
        </p>
        {sortedUsers &&
          sortedUsers.map((user, index) => (
            <UserCard key={user._id} user={user} index={index + 1} />
          ))}
      </section>
    );
  }

  return content;
}
